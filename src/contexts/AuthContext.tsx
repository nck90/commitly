"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";

export type UserRole = "client" | "developer" | null;

interface AuthContextType {
    isAuthenticated: boolean;
    role: UserRole;
    login: () => void;
    logout: () => void;
    setRole: (role: UserRole) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isUpdating, setIsUpdating] = useState(false);

    const isAuthenticated = status === "authenticated";
    const isLoading = status === "loading" || isUpdating;
    const role = (session?.user as any)?.role as UserRole || null;

    const login = () => {
        // Just redirect to NextAuth login page or handle it
        router.push("/login");
    };

    const logout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    const setRole = async (newRole: UserRole) => {
        setIsUpdating(true);
        try {
            const res = await fetch('/api/user/role', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }) 
            });
            
            if (res.ok) {
                await update({ role: newRole });
                router.push("/");
            }
        } finally {
            setIsUpdating(false);
        }
    };

    // Global Route Protection Logic
    useEffect(() => {
        if (isLoading) return;

        const isAuthPage = pathname === "/login" || pathname === "/signup";
        const isOnboardingPage = pathname === "/onboarding";

        if (!isAuthenticated && !isAuthPage) {
            // Not logged in, redirect to login
            router.push("/login");
        } else if (isAuthenticated && !role && !isOnboardingPage) {
            // Logged in but no role, redirect to onboarding (even if they are on /login)
            router.push("/onboarding");
        } else if (isAuthenticated && role && (isAuthPage || isOnboardingPage)) {
            // Logged in and has role, redirect away from auth/onboarding pages to dashboard
            router.push("/");
        }
    }, [isAuthenticated, role, isLoading, pathname, router]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout, setRole, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
