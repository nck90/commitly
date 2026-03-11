"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Tour pages in order
export const TOUR_PAGES = [
    "dashboard",
    "features",
    "feed",
    "timeline",
    "reports",
    "documents",
    "billing",
    "settings",
    "complete",
] as const;

export type TourPage = (typeof TOUR_PAGES)[number];

interface TourContextType {
    isTourActive: boolean;
    currentTourPage: TourPage | null;
    projectId: string | null;
    startTour: (projectId: string, role: "client" | "developer") => void;
    advanceToPage: (page: TourPage) => void;
    endTour: () => void;
    tourRole: "client" | "developer";
}

const TourContext = createContext<TourContextType>({
    isTourActive: false,
    currentTourPage: null,
    projectId: null,
    startTour: () => {},
    advanceToPage: () => {},
    endTour: () => {},
    tourRole: "client",
});

export function useTour() {
    return useContext(TourContext);
}

export function TourProvider({ children }: { children: ReactNode }) {
    const [isTourActive, setIsTourActive] = useState(false);
    const [currentTourPage, setCurrentTourPage] = useState<TourPage | null>(null);
    const [projectId, setProjectId] = useState<string | null>(null);
    const [tourRole, setTourRole] = useState<"client" | "developer">("client");
    const router = useRouter();

    // Auto-restore tour state from localStorage on mount
    useEffect(() => {
        const saved = restoreTourState();
        if (saved && saved.page !== "complete") {
            setProjectId(saved.projectId);
            setTourRole(saved.role);
            setIsTourActive(true);
            setCurrentTourPage(saved.page);
        }
    }, []);

    const startTour = useCallback((pid: string, role: "client" | "developer") => {
        setProjectId(pid);
        setTourRole(role);
        setIsTourActive(true);
        setCurrentTourPage("dashboard");
        localStorage.setItem("commitly_tour", JSON.stringify({ projectId: pid, role, page: "dashboard" }));
    }, []);

    const advanceToPage = useCallback((page: TourPage) => {
        if (!projectId) return;
        setCurrentTourPage(page);
        localStorage.setItem("commitly_tour", JSON.stringify({ projectId, role: tourRole, page }));

        // Navigate to the target page
        const pageRoutes: Record<TourPage, string> = {
            dashboard: `/projects/${projectId}`,
            features: `/projects/${projectId}/features`,
            feed: `/projects/${projectId}/feed`,
            timeline: `/projects/${projectId}/timeline`,
            reports: `/projects/${projectId}/reports/latest`,
            documents: `/projects/${projectId}/documents`,
            billing: `/projects/${projectId}/billing`,
            settings: `/projects/${projectId}/settings`,
            complete: `/projects/${projectId}`,
        };

        router.push(pageRoutes[page]);
    }, [projectId, tourRole, router]);

    const endTour = useCallback(() => {
        setIsTourActive(false);
        setCurrentTourPage(null);
        localStorage.removeItem("commitly_tour");
    }, []);

    return (
        <TourContext.Provider value={{ isTourActive, currentTourPage, projectId, startTour, advanceToPage, endTour, tourRole }}>
            {children}
        </TourContext.Provider>
    );
}

// Restore tour state from localStorage
export function restoreTourState(): { projectId: string; role: "client" | "developer"; page: TourPage } | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem("commitly_tour");
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}
