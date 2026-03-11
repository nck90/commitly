import prisma from "@/lib/prisma";
import BillingClient from "./BillingClient";
import { notFound } from "next/navigation";
import { Lock, Wallet } from "lucide-react";


export default async function BillingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const project = await prisma.project.findUnique({
        where: { id },
        include: { features: true }
    });

    if (!project) notFound();

    if (project.features.length === 0) {
        return (
            <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-600 text-xs font-bold flex items-center gap-2 border border-orange-500/20 backdrop-blur-md">
                                <Wallet className="w-3.5 h-3.5" /> 결제 및 예산 관리
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground/90">프로젝트 예산 현황</h1>
                        <p className="text-muted-foreground mt-2 text-lg">에스크로(안전 결제) 기반으로 투명하게 비용이 관리됩니다.</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto py-16 px-4 flex flex-col items-center justify-center text-center bg-background/50 backdrop-blur-sm border border-border/50 rounded-[2.5rem] shadow-sm min-h-[40vh]">
                    <div className="w-24 h-24 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-orange-500/20 animate-pulse" />
                        <Lock className="w-12 h-12 relative z-10" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">아직 결제 단계가 아닙니다</h2>
                    <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
                        파트너 개발사가 프로젝트의 초기 기획과 요구사항을 분석 중입니다. 첫 번째 마일스톤이 확정되면, 스케줄에 따른 안전 결제 시스템(에스크로)이 활성화됩니다.
                    </p>
                </div>
            </div>
        );
    }

    return <BillingClient />;
}
