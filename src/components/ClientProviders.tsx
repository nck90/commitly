"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SessionProvider } from "next-auth/react";
import { TourProvider } from "@/contexts/TourContext";
import { TourOverlay } from "@/components/tour/TourOverlay";
import "@/styles/tour.css";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthProvider>
                <TourProvider>
                    <TooltipProvider>
                        <ProtectedRoute>
                            {children}
                            <TourOverlay />
                        </ProtectedRoute>
                        <Toaster />
                        <Sonner />
                    </TooltipProvider>
                </TourProvider>
            </AuthProvider>
        </SessionProvider>
    );
}
