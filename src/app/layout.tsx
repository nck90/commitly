import type { Metadata } from "next";
import { ClientProviders } from "@/components/ClientProviders";
import "./globals.css";

export const metadata: Metadata = {
    title: "Commitly Trust Layer",
    description: "외주 플랫폼 신뢰 레이어",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className="antialiased min-h-screen">
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}
