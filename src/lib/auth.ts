import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "dummy",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email) {
                    throw new Error("Missing credentials");
                }
                
                let user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    // Default findUnique returns all scalar fields unless specified or excluded.
                    // But maybe user type strictly defined elsewhere. Let's just cast or fetch raw if needed, or select explicitly.
                });

                if (!user || !(user as any).password) {
                    throw new Error("가입되지 않은 이메일이거나 비밀번호가 틀렸습니다.");
                }

                const isValid = await bcrypt.compare(credentials.password, (user as any).password);
                
                if (!isValid) {
                    throw new Error("가입되지 않은 이메일이거나 비밀번호가 틀렸습니다.");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
        newUser: "/onboarding",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Handle initial sign in
            if (user) {
                if (user.email) {
                    // Sync OAuth / Credentials user with Prisma by Email
                    let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
                    if (!dbUser) {
                        dbUser = await prisma.user.create({
                            data: {
                                email: user.email,
                                name: user.name || user.email.split('@')[0],
                            }
                        });
                    }
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                } else {
                    token.id = user.id;
                    token.role = (user as any).role;
                }
            }
            if (trigger === "update" && session?.role) {
                token.role = session.role;
                // Update Prisma DB role as well to persist
                if (token.id) {
                    await prisma.user.update({
                        where: { id: token.id as string },
                        data: { role: session.role }
                    }).catch(console.error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "super-secret-key",
};
