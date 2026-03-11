"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, role, isLoading } = useAuth();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-medium animate-pulse">인증 정보를 확인 중입니다...</p>
            </div>
        );
    }

    const isAuthPage = pathname === "/login" || pathname === "/signup";
    const isOnboardingPage = pathname === "/onboarding";

    // Allow rendering login/onboarding if that's where they belong based on context
    if (isAuthPage && !isAuthenticated) return <>{children}</>;
    if (isOnboardingPage && isAuthenticated && !role) return <>{children}</>;

    // For dashboard and other routes, require auth and role
    if (!isAuthenticated || !role) {
        return null; // The redirect is handled inside AuthContext, so we just prevent rendering
    }

    return <>{children}</>;
}
