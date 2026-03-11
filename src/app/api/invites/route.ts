import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user || user.role !== "developer") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const invites = await prisma.projectInvite.findMany({
            where: {
                agencyId: userId,
                status: "PENDING"
            },
            include: {
                project: {
                    include: {
                        client: {
                            select: { name: true, email: true }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(invites);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
