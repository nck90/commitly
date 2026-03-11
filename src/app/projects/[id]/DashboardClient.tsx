"use client";

import { useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useTour } from "@/contexts/TourContext";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
    Download, FileText, CheckCircle2, Clock, AlertTriangle, MessageSquare,
    Target, Layers, Scale, Activity, RefreshCw, FileCheck, ArrowRight,
    Code2, GitCommit, GitPullRequest, Flame, TrendingUp, Zap, BarChart3,
    ListChecks, Send, Eye, ShieldCheck, CalendarCheck, Users, Star,
    Wallet, TrendingDown, Sparkles, Cpu, PieChart, MonitorPlay, Languages, Lock,
    PlusCircle, PlayCircle, HelpCircle, MousePointerClick, UserPlus, Mail, Bell
} from "lucide-react";

interface DashboardProject {
    id: string;
    name: string;
    description: string;
    healthScore: number;
    agencyId?: string | null;
    scopeDocs?: {
        id: string;
        title: string;
        contentUrl: string | null;
        createdAt: Date;
    }[];
    pendingInvite?: { email: string, name: string | null } | null;
}

interface DashboardStats {
    totalFeatures: number;
    completedFeatures: number;
    inProgressFeatures: number;
    progress: number;
    pendingDecisions: number;
    riskScore: number;
    recentUpdates: number;
    latestAiSummary: string;
    activities: any[];
}



// ─────────────── MAIN ROLE VIEW ───────────────
export function DashboardRoleView({ project, stats }: { project: DashboardProject; stats: DashboardStats }) {
    const { role } = useAuth();
    const isNewProject = stats.progress === 0 && stats.recentUpdates === 0;

    if (role === "developer") {
        if (isNewProject) return <EmptyDeveloperDashboard project={project} />;
        return <DeveloperDashboard project={project} stats={stats} />;
    }

    if (isNewProject) return <EmptyClientDashboard project={project} />;
    return <ClientDashboard project={project} stats={stats} />;
}

// ═══════════════════════════════════════════════
//  EMPTY DASHBOARDS (NEW PROJECTS)
// ═══════════════════════════════════════════════
function EmptyClientDashboard({ project }: { project: DashboardProject }) {
    const router = useRouter();
    const { startTour, isTourActive } = useTour();


    useEffect(() => {
        // Auto-start tour ONLY for the very first project after signup
        const onboardingDone = localStorage.getItem("commitly_onboarding_done");
        
        if (!isTourActive && !onboardingDone) {
            const timer = setTimeout(() => {
                startTour(project.id, "client");
                // Mark as done immediately when started for the first time
                localStorage.setItem("commitly_onboarding_done", "true");
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isTourActive, project.id, startTour]);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pt-10 pb-20">
            <div className="text-center space-y-4 mb-12">
                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary shadow-inner">
                    <Sparkles className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">프로젝트 생성이 완료되었습니다 🎉</h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    환영합니다! 개발팀이 고객님의 기획안을 꼼꼼히 분석하고 첫 번째 목표를 세우고 있어요. 조금만 기다려주세요!
                </p>
            </div>

            <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-[2rem] p-8 shadow-sm flex flex-col items-center text-center max-w-2xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                    <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold mb-3">개발팀의 첫 번째 마일스톤을 기다리는 중이에요</h2>
                <p className="text-muted-foreground text-sm mb-8">
                    개발팀이 첫 번째 작업 목표를 설정하면 대시보드가 활짝 열릴 거예요. 그동안 내가 올린 기획서와 문서를 다시 한 번 확인해 보시겠어요?
                </p>
                <button onClick={() => router.push(`/projects/${project.id}/documents`)} className="px-8 py-3 bg-muted text-foreground font-bold rounded-2xl hover:bg-muted/80 transition-colors">
                    문서 보관함 가기
                </button>
            </div>
        </div>
    );
}

function EmptyDeveloperDashboard({ project }: { project: DashboardProject }) {
    const router = useRouter();
    const { startTour, isTourActive } = useTour();


    useEffect(() => {
        const onboardingDone = localStorage.getItem("commitly_onboarding_done");

        if (!isTourActive && !onboardingDone) {
            const timer = setTimeout(() => {
                startTour(project.id, "developer");
                localStorage.setItem("commitly_onboarding_done", "true");
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isTourActive, project.id, startTour]);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pt-10 pb-20">
            <div className="text-center space-y-4 mb-12">
                <div className="w-16 h-16 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-purple-600 shadow-inner">
                    <Code2 className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">새로운 프로젝트에 합류했습니다</h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    클라이언트가 귀사를 파트너로 초대했습니다. 이제 요구사항을 검토하고 본격적인 개발 세팅을 시작할 차례입니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-[2rem] p-8 shadow-sm hover:border-emerald-500/30 transition-all flex flex-col h-full">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                        <FileText className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">1. 요구사항 분석</h2>
                    <p className="text-muted-foreground text-sm mb-8 flex-grow">
                        클라이언트가 업로드한 초기 기획서 및 계약서를 확인하고, 개발 방향을 설정하세요.
                    </p>
                    <button onClick={() => router.push(`/projects/${project.id}/documents`)} className="w-full py-3 bg-muted text-foreground font-bold rounded-2xl hover:bg-muted/80 transition-colors">
                        산출물 보관함 가기
                    </button>
                </div>

                <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-[2rem] p-8 shadow-sm hover:border-purple-500/30 transition-all flex flex-col h-full">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                        <Layers className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">2. 1주차 마일스톤 수립</h2>
                    <p className="text-muted-foreground text-sm mb-8 flex-grow">
                        [기능(Kanban)] 탭으로 이동하여 클라이언트가 쉽게 확인할 수 있는 첫 번째 기능 목록을 생성하세요. 
                    </p>
                    <button onClick={() => router.push(`/projects/${project.id}/features`)} className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-colors shadow-sm">
                        기능(Kanban) 세팅하기
                    </button>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════
//  DEVELOPER DASHBOARD
// ═══════════════════════════════════════════════
function DeveloperDashboard({ project, stats }: { project: DashboardProject; stats: DashboardStats }) {
    const router = useRouter();
    const riskScore = stats.riskScore;
    let riskColor = "text-emerald-500";
    let riskBg = "bg-emerald-500/10";
    let riskBorder = "border-emerald-500/20";
    let riskLabel = "안정적 (Healthy)";
    if (riskScore > 30) { riskColor = "text-blue-500"; riskBg = "bg-blue-500/10"; riskBorder = "border-blue-500/20"; riskLabel = "일반적 (Normal)"; }
    if (riskScore > 50) { riskColor = "text-orange-500"; riskBg = "bg-orange-500/10"; riskBorder = "border-orange-500/20"; riskLabel = "주의 (Warning)"; }
    if (riskScore > 80) { riskColor = "text-destructive"; riskBg = "bg-destructive/10"; riskBorder = "border-destructive/20"; riskLabel = "위험 (Critical)"; }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 text-xs font-bold flex items-center gap-2 border border-purple-500/20 backdrop-blur-md">
                            <Code2 className="w-3.5 h-3.5" /> Developer Workspace
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground/90">{project.name}</h1>
                    <p className="text-muted-foreground mt-2 text-lg">{project.description}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-xl text-sm font-bold ${riskBg} ${riskColor} flex items-center gap-2 border ${riskBorder} backdrop-blur-md`}>
                        <Activity className="w-4 h-4" /> {riskLabel}
                    </span>
                    <ExportReportButton />
                </div>
            </div>

            {/* Core KPIs - Glassmorphism UI */}
            <div id="tour-dev-kpis" className="grid grid-cols-2 lg:grid-cols-4 gap-5 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 blur-3xl -z-10 rounded-[3rem]" />

                <div onClick={() => router.push(`/projects/${project.id}/metrics/progress`)} className="bg-background/60 backdrop-blur-xl border border-primary/20 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-primary/40 transition-all cursor-pointer group hover:-translate-y-1">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Total Progress</p>
                    <h3 className="text-4xl font-black text-foreground">{stats.progress}%</h3>
                    <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full transition-all duration-1000" style={{ width: `${stats.progress}%` }} />
                    </div>
                </div>

                <div onClick={() => router.push(`/projects/${project.id}/metrics/features`)} className="bg-background/60 backdrop-blur-xl border border-success/20 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-success/40 transition-all cursor-pointer group hover:-translate-y-1">
                    <p className="text-xs font-bold text-success uppercase tracking-wider mb-2 flex items-center gap-1.5"><ListChecks className="w-3.5 h-3.5" /> Features Done</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-success">{stats.completedFeatures}</h3>
                        <span className="text-lg text-muted-foreground font-semibold">/ {stats.totalFeatures}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 font-medium">진행 중: {stats.inProgressFeatures}개</p>
                </div>

                <div onClick={() => router.push(`/projects/${project.id}/metrics/pending`)} className="bg-background/60 backdrop-blur-xl border border-warning/20 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-warning/40 transition-all cursor-pointer group hover:-translate-y-1">
                    <p className="text-xs font-bold text-warning uppercase tracking-wider mb-2 flex items-center gap-1.5"><Scale className="w-3.5 h-3.5" /> Pending Client</p>
                    <h3 className="text-4xl font-black text-warning">{stats.pendingDecisions}</h3>
                    <p className="text-xs text-muted-foreground mt-3 font-medium">클라이언트 승인 및 피드백 대기</p>
                </div>

                <div onClick={() => router.push(`/projects/${project.id}/metrics/risk`)} className={`bg-background/60 backdrop-blur-xl border ${riskBorder} p-6 rounded-3xl shadow-sm hover:shadow-xl hover:${riskBorder} transition-all cursor-pointer group hover:-translate-y-1`}>
                    <p className={`text-xs font-bold ${riskColor} uppercase tracking-wider mb-2 flex items-center gap-1.5`}><Cpu className="w-3.5 h-3.5" /> AI Risk Score</p>
                    <h3 className={`text-4xl font-black ${riskColor}`}>{riskScore}</h3>
                    <p className="text-xs text-muted-foreground mt-3 font-medium">지연 가능성 분석됨</p>
                </div>
            </div>

            {/* Advanced Engineering Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Burndown Chart Simulation */}
                    <div id="tour-dev-burndown" className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 lg:p-8 shadow-sm">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-6"><TrendingDown className="w-5 h-5 text-blue-500" /> Sprint Burndown (Week 3)</h2>
                        <div className="relative h-48 w-full border-l border-b border-border/50 pt-4 pl-4 flex items-end justify-between">
                            {/* SVG Chart Overlay */}
                            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                {/* Ideal line */}
                                <line x1="10" y1="10" x2="90" y2="90" stroke="currentColor" className="text-muted opacity-40" strokeWidth="1" strokeDasharray="4 4" />
                                {/* Actual line */}
                                <polyline points="10,10 30,25 50,30 70,60 85,80" fill="none" stroke="#3b82f6" strokeWidth="3" className="drop-shadow-md" strokeLinecap="round" strokeLinejoin="round" />
                                {/* Points */}
                                <circle cx="10" cy="10" r="2" fill="#3b82f6" />
                                <circle cx="30" cy="25" r="2" fill="#3b82f6" />
                                <circle cx="50" cy="30" r="2" fill="#3b82f6" />
                                <circle cx="70" cy="60" r="2" fill="#3b82f6" />
                                <circle cx="85" cy="80" r="2" fill="#3b82f6" />
                            </svg>
                            <span className="text-xs text-muted-foreground absolute bottom-[-24px] left-[10%]">Mon</span>
                            <span className="text-xs text-muted-foreground absolute bottom-[-24px] left-[30%]">Tue</span>
                            <span className="text-xs text-muted-foreground absolute bottom-[-24px] left-[50%]">Wed</span>
                            <span className="text-xs text-muted-foreground absolute bottom-[-24px] left-[70%]">Thu</span>
                            <span className="text-xs text-foreground font-bold absolute bottom-[-24px] left-[85%]">Today</span>
                        </div>
                    </div>

                    {/* Developer Commits & PRs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-3xl p-6 flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-600 flex items-center justify-center shrink-0"><GitCommit className="w-7 h-7" /></div>
                            <div>
                                <p className="text-sm font-bold text-muted-foreground mb-1">Weekly Commits</p>
                                <div className="flex items-end gap-3">
                                    <p className="text-3xl font-black text-foreground">142</p>
                                    <span className="text-xs font-bold text-success flex items-center mb-1.5"><TrendingUp className="w-3 h-3 mr-1" />+12%</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-3xl p-6 flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-600 flex items-center justify-center shrink-0"><GitPullRequest className="w-7 h-7" /></div>
                            <div>
                                <p className="text-sm font-bold text-muted-foreground mb-1">Open PRs / Reviews</p>
                                <div className="flex items-end gap-3">
                                    <p className="text-3xl font-black text-foreground">8 <span className="text-lg text-muted-foreground font-medium">/ 3</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Weekly AI Report Card */}
                    <div id="tour-dev-ai-report" className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-sm group hover:border-primary/50 transition-all cursor-pointer" onClick={() => router.push(`/projects/${project.id}/reports/latest`)}>
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-purple-500" /> 주간 AI 분석 요약
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 whitespace-pre-wrap">
                            "{stats.latestAiSummary}"
                        </p>
                        <div className="flex items-center text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 cursor-pointer">
                            전체 리포트 보기 <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>

                    {/* Developer Quick Actions */}
                    <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-primary" /> 필수 액션</h2>
                        <div className="space-y-3">
                            <button onClick={() => router.push(`/projects/${project.id}/feed`)} className="w-full p-4 rounded-2xl bg-muted/40 border border-transparent hover:border-primary/30 hover:bg-primary/5 flex items-center gap-4 transition-all text-left">
                                <Send className="w-5 h-5 text-primary" />
                                <div><p className="text-sm font-bold">진행 상황 공유</p><p className="text-xs text-muted-foreground">새로운 소식 업데이트</p></div>
                            </button>
                            <button onClick={() => router.push(`/projects/${project.id}/documents`)} className="w-full p-4 rounded-2xl bg-muted/40 border border-transparent hover:border-emerald-500/30 hover:bg-emerald-500/5 flex items-center gap-4 transition-all text-left">
                                <FileText className="w-5 h-5 text-emerald-500" />
                                <div><p className="text-sm font-bold">결과물 서류 등록</p><p className="text-xs text-muted-foreground">설계서 및 다큐먼트 업로드</p></div>
                            </button>
                        </div>
                    </div>

                    {/* Developer LIVE Pulse Stream */}
                    <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-bl-full" />
                        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary animate-pulse" /> Live Activity
                            <span className="ml-auto px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold border border-success/20 uppercase tracking-wider flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Syncing</span>
                        </h2>
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:via-border/50 before:to-transparent">
                            {stats.activities.length > 0 ? stats.activities.map((act, idx) => (
                                <div key={act.id} className={`relative pl-8 ${idx > 0 ? 'opacity-70' : ''}`}>
                                    <div className={`absolute left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-background border-2 ${idx === 0 ? 'border-primary ring-4 ring-primary/20' : 'border-primary'}`} />
                                    <p className="text-sm font-bold">{act.title}</p>
                                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                                        {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true, locale: ko })} · Platform
                                    </p>
                                </div>
                            )) : (
                                <p className="text-xs text-muted-foreground text-center py-4">활동 기록이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════
//  CLIENT DASHBOARD — 완전히 개편된 프리미엄 뷰
// ═══════════════════════════════════════════════
function ClientDashboard({ project, stats }: { project: DashboardProject; stats: DashboardStats }) {
    const router = useRouter();
    const [showTechWords, setShowTechWords] = useState(false);
    const [isSigning, setIsSigning] = useState(false);

    const handleMilestoneSignoff = async () => {
        setIsSigning(true);
        try {
            const res = await fetch("/api/activities/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId: project.id,
                    type: "update",
                    title: "[마일스톤 승인]",
                    content: "마일스톤 1: 화면 설계서 초안이 승인되었습니다.",
                    clientSummary: "발주사가 첫 번째 마일스톤(화면 설계)을 서명 및 승인했습니다."
                })
            });
            if (!res.ok) throw new Error("Approval failed");
            toast.success("설계서가 승인되었습니다! 개발팀에 알림이 전송됩니다.");
            window.location.reload();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsSigning(false);
        }
    };

    // Compute next milestone date (mock)
    const nextMilestone = new Date();

    nextMilestone.setDate(nextMilestone.getDate() + 5);
    const daysLeft = 5;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10">
            {/* Header / Playable Demo with QA Overlay Hint */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-2 border border-emerald-500/20 backdrop-blur-md">
                            <ShieldCheck className="w-3.5 h-3.5" /> 고객님을 위한 대시보드
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground/90">{project.name}</h1>
                    <p className="text-muted-foreground mt-2 text-lg">프로젝트가 얼마나 완성되었는지 투명하게 공유해 드릴게요.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <InviteDeveloperButton 
                        projectId={project.id} 
                        hasAgency={!!project.agencyId} 
                        pendingInvite={project.pendingInvite} 
                    />
                    <button onClick={() => { window.open("https://commitly-trust-layer.lovable.app", "_blank"); toast.success("테스트 환경 창이 열렸습니다."); }} className="px-6 py-3 border border-blue-500/30 bg-blue-500/10 text-blue-500 hover:bg-blue-500 text-sm font-bold rounded-2xl hover:text-white transition-all shadow-sm flex items-center gap-2 relative group overflow-hidden">
                        <MonitorPlay className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">지금까지 만들어진 앱 모양 미리보기</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                    </button>
                </div>
            </div>

            {/* Client Visual Banner - Glassmorphism & Micro-animations */}
            <div id="tour-dashboard-progress" className="bg-background/80 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden flex flex-col lg:flex-row gap-10">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10" />

                {/* Main Progress Ring */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center">
                    <div className="relative w-40 h-40 mb-4 group">
                        <svg className="w-40 h-40 transform -rotate-90">
                            <circle cx="80" cy="80" r="68" fill="transparent" className="stroke-muted opacity-30" strokeWidth="16" />
                            <circle cx="80" cy="80" r="68" fill="transparent" stroke="url(#gradient-progress)"
                                strokeWidth="16" strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 68} strokeDashoffset={2 * Math.PI * 68 - (stats.progress / 100) * 2 * Math.PI * 68}
                                className="transition-all duration-1000 ease-out group-hover:scale-[1.02]" />
                            <defs>
                                <linearGradient id="gradient-progress" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-500">{stats.progress}%</span>
                            <span className="text-[11px] font-bold text-muted-foreground mt-1 text-center">전체적인<br />달성률</span>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
                    <div className="bg-muted/30 p-5 rounded-3xl border border-border/40 hover:bg-muted/50 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3"><Layers className="w-5 h-5" /></div>
                        <p className="text-3xl font-black text-foreground mb-1">{stats.completedFeatures} <span className="text-base text-muted-foreground font-medium">/ {stats.totalFeatures}개</span></p>
                        <p className="text-[13px] font-bold text-muted-foreground">성공적으로 완성됨</p>
                    </div>
                    <div className="bg-warning/5 p-5 rounded-3xl border border-warning/20 hover:bg-warning/10 transition-colors cursor-pointer" onClick={() => router.push(`/projects/${project.id}/feed`)}>
                        <div className="w-10 h-10 rounded-xl bg-warning/20 text-warning-foreground flex items-center justify-center mb-3 animate-pulse"><AlertTriangle className="w-5 h-5" /></div>
                        <p className="text-3xl font-black text-warning mb-1">{stats.pendingDecisions}건</p>
                        <p className="text-[13px] font-bold text-muted-foreground">고객님 확인 대기 중</p>
                    </div>
                    <div className="bg-emerald-500/5 p-5 rounded-3xl border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors cursor-pointer" onClick={() => router.push(`/projects/${project.id}/timeline`)}>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center mb-3"><CalendarCheck className="w-5 h-5" /></div>
                        <p className="text-3xl font-black text-emerald-600 mb-1">D-{daysLeft}</p>
                        <p className="text-[13px] font-bold text-muted-foreground">다음 중요 일정 ({nextMilestone.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })})</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Budget & Timeline Status */}
                    {/* Removed Budget & Timeline Status */}
                    <div id="tour-dashboard-timeline" className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 lg:p-8 shadow-sm">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><CalendarCheck className="w-6 h-6 text-primary" /> 일정 현황</h2>
                        <div>
                            <h3 className="text-sm font-bold text-muted-foreground mb-4">주간 진척도 흐름</h3>
                            <div className="h-32 bg-muted/20 border border-border/50 rounded-2xl p-4 flex items-end gap-2 px-6">
                                <div className="flex-1 bg-emerald-500/20 rounded-t-lg relative group"><div className="absolute bottom-0 w-full bg-emerald-500/60 rounded-t-lg transition-all h-[10%]" /></div>
                                <div className="flex-1 bg-emerald-500/20 rounded-t-lg relative group"><div className="absolute bottom-0 w-full bg-emerald-500/60 rounded-t-lg transition-all h-[25%]" /></div>
                                <div className="flex-1 bg-emerald-500/20 rounded-t-lg relative group"><div className="absolute bottom-0 w-full bg-emerald-500/60 rounded-t-lg transition-all h-[40%]" /></div>
                                <div className="flex-1 bg-emerald-500/20 rounded-t-lg relative group"><div className="absolute bottom-0 w-full bg-emerald-500/80 rounded-t-lg transition-all h-[60%]" /></div>
                                <div className="flex-1 bg-emerald-500/20 rounded-t-lg relative group"><div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg transition-all h-[75%] shadow-[0_0_15px_rgba(16,185,129,0.5)]" /></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase mt-2 px-6">
                                <span>1주차</span><span>2주차</span><span>3주차</span><span>4주차</span><span className="text-emerald-500">이번주</span>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Scope & Change Request Board */}
                    <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 lg:p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Layers className="w-6 h-6 text-primary" /> 요구사항 투명 보드</h2>
                            <button onClick={() => router.push(`/projects/${project.id}/feed`)} className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-sm">
                                <PlusCircle className="w-3.5 h-3.5" /> 새 기능 제안하기
                            </button>
                        </div>


                        <div className="space-y-4">
                            {/* Base Contract Item */}
                            <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                                        <Lock className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold flex items-center gap-2">기본 계약 목록 전체 <span className="bg-success/10 text-success text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">포함됨</span></p>
                                        <p className="text-xs text-muted-foreground mt-0.5">최초 계약 시 합의된 모든 기능 (추가 비용 없음)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Change Request Item (Pending Approval) */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                                        <PlusCircle className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                            결제 모단 휴대폰 인증 추가
                                            <span className="bg-warning/20 text-warning-foreground text-[10px] px-1.5 py-0.5 rounded font-bold uppercase border border-warning/30">합의 대기중</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                            개발팀 검토 완료: "본인인증 연동 API 키 발급 및 시스템 추가 연동 작업이 필요합니다."
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto mt-2 md:mt-0 pt-3 border-t border-border/50 md:border-0 md:pt-0 shrink-0">
                                    <button onClick={() => toast.success("수락했습니다.")} className="text-xs font-bold bg-blue-500 text-white px-4 py-2 rounded-lg active:scale-95 shadow-sm hover:bg-blue-600 transition-colors">
                                        수락
                                    </button>
                                    <button onClick={() => toast.success("이의 제기 창이 열립니다.")} className="text-xs font-bold bg-muted text-muted-foreground border border-border px-3 py-2 rounded-lg active:scale-95 shadow-sm hover:bg-muted/80 transition-colors">
                                        이의 있음
                                    </button>
                                    <button onClick={() => toast.success("질문 모달이 열립니다.")} className="text-xs font-bold bg-muted text-muted-foreground border border-border px-3 py-2 rounded-lg active:scale-95 shadow-sm hover:bg-muted/80 transition-colors">
                                        질문
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-warning/5 to-transparent border border-warning/20 rounded-3xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-warning/5 blur-3xl rounded-bl-full -z-10" />
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-warning-foreground"><Lock className="w-6 h-6" /> 이번 주 목표 확인 및 승인</h2>
                            <button onClick={() => router.push(`/projects/${project.id}/feed`)} className="text-sm font-bold text-warning hover:underline">1건 대기중 →</button>
                        </div>

                        {/* Interactive Milestone Sign-off Card */}
                        <div className="bg-background/80 backdrop-blur-md rounded-2xl p-6 border-l-4 border-warning shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all group">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0 mt-1"><FileCheck className="w-6 h-6" /></div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="px-2 py-0.5 rounded bg-warning text-warning-foreground text-[10px] font-bold uppercase tracking-wide">첫 번째 목표</span>
                                        <p className="font-bold text-lg text-foreground">기본적인 화면 설계서 승인하기</p>
                                    </div>
                                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                                        가장 기본이 되는 화면의 뼈대를 잡았어요. 디자인을 한 번 확인해 주실래요? 승인해 주시면 개발팀이 곧바로 화면을 예쁘게 만들기 시작할 거예요. (승인 후 수정 시에는 일정이 조금 밀릴 수 있어요!)
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0 w-full md:w-32">
                                <button disabled={isSigning} onClick={handleMilestoneSignoff} className="w-full px-5 py-3 bg-foreground text-background text-sm font-bold rounded-xl hover:bg-foreground/90 transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50">
                                    {isSigning ? "처리 중..." : "승인하기"}
                                </button>
                                <button onClick={() => router.push(`/projects/${project.id}/feed`)} className="w-full px-5 py-2 text-muted-foreground text-[13px] font-bold rounded-xl hover:bg-muted transition-colors">
                                    조금만 더 수정할게요
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Removed Video Briefing as per request */}
                    <div id="tour-dashboard-ai-report" className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-sm group hover:border-purple-500/30 transition-all cursor-pointer" onClick={() => router.push(`/projects/${project.id}/reports/latest`)}>
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><Star className="w-5 h-5 text-purple-500" /> 주간 요약 (AI작성)</h2>
                        <div className="space-y-4">
                            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap italic">
                                "{stats.latestAiSummary}"
                            </p>
                        </div>
                    </div>

                    {/* === 예산 소진율 게이지 제거됨 === */}

                    {/* === 팀 활동 히트맵 === */}
                    <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><Activity className="w-5 h-5 text-emerald-500" /> 이번 달 활동 히트맵</h2>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 28 }).map((_, i) => {
                                const levels = [0, 1, 2, 3, 2, 3, 1, 2, 3, 3, 2, 1, 0, 1, 3, 3, 2, 3, 3, 2, 1, 3, 2, 3, 3, 2, 0, 0];
                                const level = levels[i] || 0;
                                const colors = ['bg-muted/30', 'bg-emerald-500/20', 'bg-emerald-500/40', 'bg-emerald-500/70'];
                                return (
                                    <div key={i} className={`aspect-square rounded-sm ${colors[level]} border border-border/20 transition-colors hover:ring-2 hover:ring-emerald-500/30 cursor-default`} title={`Day ${i + 1}: ${['no', 'low', 'medium', 'high'][level]} activity`} />
                                );
                            })}
                        </div>
                        <div className="flex items-center justify-between mt-3 text-[9px] text-muted-foreground font-bold">
                            <span>적음</span>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-sm bg-muted/30 border border-border/20" />
                                <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-border/20" />
                                <div className="w-3 h-3 rounded-sm bg-emerald-500/40 border border-border/20" />
                                <div className="w-3 h-3 rounded-sm bg-emerald-500/70 border border-border/20" />
                            </div>
                            <span>많음</span>
                        </div>
                    </div>

                    {/* === AI 프로젝트 건강도 === */}
                    <div className="bg-gradient-to-br from-emerald-500/5 to-blue-500/5 border border-emerald-500/20 rounded-3xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><Star className="w-5 h-5 text-emerald-500" /> AI 프로젝트 건강도</h2>
                        <div className="flex items-center justify-center mb-4">
                            <div className="text-center">
                                <span className="text-5xl font-black text-emerald-500">92</span>
                                <span className="text-lg font-bold text-muted-foreground ml-1">/100</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">진행률 준수</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width: '95%'}} /></div>
                                    <span className="font-bold text-emerald-500">95</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">소통 품질</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{width: '90%'}} /></div>
                                    <span className="font-bold text-purple-500">90</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">리스크 대응</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-orange-500 rounded-full" style={{width: '95%'}} /></div>
                                    <span className="font-bold text-orange-500">95</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] text-center text-emerald-600 mt-4 font-bold">✨ 매우 건강한 프로젝트예요!</p>
                    </div>

                    {/* Agreed Assets Vault */}
                    <div id="tour-dashboard-vault" className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Lock className="w-5 h-5 text-amber-500" /> 최종 산출물 및 에셋
                            </h2>
                            <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 px-2.5 py-1 rounded-full border border-amber-500/20">보호됨</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                            계약 및 회의를 통해 상호 확정된 기획서와 설계도 등이 안전하게 영구 보관됩니다. (위변조 불가능)
                        </p>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                            {project.scopeDocs && project.scopeDocs.length > 0 ? (
                                project.scopeDocs.filter(doc => doc.contentUrl).map(doc => (
                                    <a key={doc.id} href={doc.contentUrl!} download target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between p-3 bg-muted/40 hover:bg-muted/80 border border-border/40 rounded-xl transition-all group">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                                                <Layers className="w-4 h-4" />
                                            </div>
                                            <div className="text-left min-w-0">
                                                <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">{doc.title}</p>
                                                <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                                                    {new Date(doc.createdAt).toLocaleDateString('ko-KR')} 등록
                                                </p>
                                            </div>
                                        </div>
                                        <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 m-1" />
                                    </a>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground text-center py-4 bg-muted/20 rounded-xl border border-dashed border-border/50">
                                    업로드된 자료가 없습니다.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Quick Shortcuts */}
                    <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-500" /> 바로 가기</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => router.push(`/projects/${project.id}/features`)} className="p-4 rounded-2xl bg-muted/40 border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all text-left">
                                <Layers className="w-6 h-6 text-primary mb-3" />
                                <p className="text-sm font-bold">결과물 확인하기</p>
                            </button>
                            <button onClick={() => router.push(`/projects/${project.id}/documents`)} className="p-4 rounded-2xl bg-muted/40 border border-transparent hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-left">
                                <FileText className="w-6 h-6 text-blue-500 mb-3" />
                                <p className="text-sm font-bold">받은 서류함 가기</p>
                            </button>
                            <button onClick={() => router.push(`/projects/${project.id}/feed`)} className="p-4 rounded-2xl bg-muted/40 border border-transparent hover:border-orange-500/30 hover:bg-orange-500/5 transition-all text-left">
                                <Bell className="w-6 h-6 text-orange-500 mb-3" />
                                <p className="text-sm font-bold">새소식 확인하기</p>
                            </button>
                            <button onClick={() => router.push(`/projects/${project.id}/logs`)} className="p-4 rounded-2xl bg-muted/40 border border-transparent hover:border-purple-500/30 hover:bg-purple-500/5 transition-all text-left">
                                <MessageSquare className="w-6 h-6 text-purple-500 mb-3" />
                                <p className="text-sm font-bold">히스토리 보기</p>
                            </button>
                        </div>
                    </div>

                    {/* Daily Work Summary (Standup) */}
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-3xl p-6 shadow-sm mb-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full blur-2xl -z-10" />
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                                <Sparkles className="w-5 h-5" /> 오늘의 일일 작업 브리핑
                            </h2>
                            <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-600 px-2 py-0.5 rounded border border-indigo-500/20">A.I 요약됨</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                            오늘 개발팀(3명)이 8시간 동안 집중하여 <strong className="text-indigo-600 dark:text-indigo-400">결제 화면의 사용자 인터페이스 뼈대</strong>를 완성하고,
                            <strong className="text-indigo-600 dark:text-indigo-400">장바구니 담기 로직</strong>의 70%를 구현했습니다.
                            이는 현재 전체 프로젝트 여정 중 <strong>가장 중요한 보안 모듈을 튼튼하게 다지는 과정</strong>입니다.
                        </p>
                        <div className="flex items-center gap-4 mt-4 text-[11px] text-muted-foreground font-mono">
                            <div className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> 24 Commits</div>
                            <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> 2 PRs Merged</div>
                        </div>
                    </div>

                    {/* Client LIVE Pulse Stream */}
                    <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-sm overflow-hidden relative">
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-tr-full -z-10" />

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-500 animate-pulse" /> 개발팀은 지금 무엇을 하고 있을까요? 
                                <div className="w-2 h-2 rounded-full bg-success animate-ping ml-1" />
                            </h2>
                            <button
                                onClick={() => setShowTechWords(!showTechWords)}
                                className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 ${showTechWords ? 'bg-muted text-muted-foreground border border-border/80 hover:bg-muted/80' : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'}`}
                            >
                                <Languages className="w-4 h-4" />
                                {showTechWords ? "개발자의 언어로 보기" : "간결한 요약 모드 (ON)"}
                            </button>
                        </div>

                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-blue-500/50 before:via-border/50 before:to-transparent">
                            {stats.activities.length > 0 ? stats.activities.map((act, idx) => (
                                <div key={act.id} className={`relative pl-8 ${idx > 0 ? 'opacity-90' : ''}`}>
                                    <div className={`absolute left-1.5 top-1.5 w-2.5 h-2.5 rounded-full bg-background border-2 ${idx === 0 ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-primary'}`} />
                                    {showTechWords ? (
                                        <>
                                            <p className="text-sm font-bold font-mono">{act.title}</p>
                                            <p className="text-xs text-muted-foreground mt-1 font-mono">{act.content.substring(0, 60)}...</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[15px] font-bold text-foreground">{act.clientSummary || act.title}</p>
                                            <p className="text-sm text-foreground/80 mt-1 leading-relaxed">{act.clientSummary ? act.title : act.content.substring(0, 100)}</p>
                                        </>
                                    )}
                                    <p className="text-[10px] text-muted-foreground font-mono mt-2 w-max bg-muted/50 px-2 py-0.5 rounded">
                                        {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true, locale: ko })}
                                    </p>
                                </div>
                            )) : (
                                <p className="text-xs text-muted-foreground text-center py-4">활동 기록이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SOS / Emergency Meeting Floating Action Button */}
            <button
                onClick={() => window.open("https://calendly.com", "_blank")}
                className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3.5 bg-background border border-border shadow-2xl rounded-full hover:border-blue-500/40 hover:bg-muted/50 transition-all hover:-translate-y-1 active:scale-95 group"
            >
                <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </div>
                <div className="text-left pr-2">
                    <p className="text-sm font-bold text-foreground leading-none mb-1">매니저 긴급 호출</p>
                    <p className="text-[10px] text-muted-foreground leading-none mt-1">혹시 진행이 조금 답답하신가요?</p>
                </div>
            </button>
        </div>
    );
}

// ─────────────── SHARED COMPONENTS ───────────────
export function ExportReportButton() {
    const [open, setOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        const promise = new Promise((resolve) => setTimeout(resolve, 2000));
        toast.promise(promise, {
            loading: 'PDF 보고서 생성 및 다운로드 준비 중...',
            success: '생성 완료! 보고서가 디바이스에 저장되었습니다.',
            error: '보고서 생성에 실패했습니다.',
        });
        await promise;
        setIsExporting(false);
        setOpen(false);
    };

    return (
        <>
            <button onClick={() => setOpen(true)} className="px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary text-sm font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all shadow-sm active:scale-95 backdrop-blur-md">
                Export 리포트
            </button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold pb-1 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" /> 보고서 내보내기
                        </DialogTitle>
                        <DialogDescription className="text-sm">현재 프로젝트 건강도와 진행률을 기반으로 PDF 보고서를 렌더링합니다.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <button className="px-5 py-2.5 border border-border/60 text-foreground text-sm font-bold rounded-xl hover:bg-muted" onClick={() => setOpen(false)} disabled={isExporting}>취소</button>
                        <button className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl active:scale-95 flex items-center gap-2 disabled:opacity-50" onClick={handleExport} disabled={isExporting}>
                            {isExporting ? <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" /> : <><Download className="w-4 h-4" /> 렌더링 시작</>}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Legacy exports kept for any remaining references
export function InteractiveCard({ children, className, projectId, modalType = "progress" }: { children: ReactNode; className?: string; projectId: string; modalType?: string; }) {
    const router = useRouter();
    return (<div onClick={() => router.push(`/projects/${projectId}/metrics/${modalType}`)} className={`${className} cursor-pointer`}>{children}</div>);
}

export function InteractiveRiskGauge({ children, className, projectId }: { children: ReactNode; className?: string; projectId: string; }) {
    const router = useRouter();
    return (<div onClick={() => router.push(`/projects/${projectId}/metrics/risk`)} className={`${className} cursor-pointer`}>{children}</div>);
}

export function DetailedReportCard({ children, projectId }: { children: ReactNode, projectId: string }) {
    const router = useRouter();
    return (<div onClick={() => router.push(`/projects/${projectId}/reports/latest`)} className="cursor-pointer w-full h-full">{children}</div>);
}

export function InviteDeveloperButton({ projectId, hasAgency, pendingInvite }: { projectId: string, hasAgency?: boolean, pendingInvite?: {email: string, name: string | null} | null }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [disconnectLoading, setDisconnectLoading] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`/api/projects/${projectId}/invite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            
            if (!res.ok) {
                toast.error(data.error || "초대에 실패했습니다.");
                return;
            }

            toast.success("개발사에게 파트너 연동 초대장이 발송되었습니다!");
            setOpen(false);
            setEmail("");
            window.location.reload();
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm("정말 현재 연결된 파트너 개발사를 해제하시겠습니까? (이 작업으로 인해 프로젝트 설정이 변경될 수 있습니다.)")) return;
        
        setDisconnectLoading(true);
        try {
            const res = await fetch(`/api/projects/${projectId}/disconnect`, { method: "POST" });
            const data = await res.json();
            
            if (!res.ok) {
                toast.error(data.error || "해제에 실패했습니다.");
                return;
            }
            
            toast.success("파트너 개발사와의 연결이 안전하게 해제되었습니다.");
            window.location.reload();
        } finally {
            setDisconnectLoading(false);
        }
    }

    if (hasAgency) {
        return (
            <div className="flex items-center gap-2">
                <div className="px-5 py-3 flex-1 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-sm font-bold rounded-2xl shadow-sm flex items-center gap-2 cursor-pointer hover:bg-emerald-500/20 transition-all" onClick={() => setOpen(true)}>
                    <CheckCircle2 className="w-5 h-5" /> 파트너 연결 작동중
                </div>
                
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-md bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-extrabold pb-1 flex items-center gap-2 text-emerald-500">
                                 <CheckCircle2 className="w-5 h-5" /> 이미 연동된 파트너가 있습니다
                            </DialogTitle>
                            <DialogDescription className="text-sm">현재 이 프로젝트는 개발사 파트너와 성공적으로 양방향 연동되어 소통 중입니다. 다른 파트너와 작업하려면 먼저 기존 연결을 해제해야 합니다.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button type="button" className="px-5 py-2.5 border border-border/60 text-foreground text-sm font-bold rounded-xl hover:bg-muted" onClick={() => setOpen(false)}>닫기</button>
                            <button type="button" disabled={disconnectLoading} onClick={handleDisconnect} className="px-5 py-2.5 bg-destructive/10 text-destructive border border-destructive/20 text-sm font-bold rounded-xl hover:bg-destructive hover:text-white transition-all flex items-center justify-center gap-2">
                                {disconnectLoading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : "파트너 권한 해제하기"}
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    if (pendingInvite) {
        return (
            <div className="flex items-center gap-2 max-w-[280px]">
                <div className="px-4 py-3 min-w-0 border border-amber-500/30 bg-amber-500/10 text-amber-600 text-sm font-bold rounded-2xl shadow-sm flex items-center gap-2">
                    <Clock className="w-5 h-5 flex-shrink-0 animate-pulse" /> 
                    <span className="truncate" title={`${pendingInvite.email} 연결 대기중`}>[수락 대기] {pendingInvite.name || pendingInvite.email}</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className="px-5 py-3 border border-primary/30 bg-primary/10 text-primary hover:bg-primary text-sm font-bold rounded-2xl hover:text-primary-foreground transition-all shadow-sm flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> 개발사 초대하기
            </button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold pb-1 flex items-center gap-2">
                             <UserPlus className="w-5 h-5 text-primary" /> 파트너 개발사 초대
                        </DialogTitle>
                        <DialogDescription className="text-sm">함께 작업할 개발사의 이메일을 입력하세요. Commitly에 가입된 개발사 계정이어야 합니다.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleInvite} className="space-y-4">
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="developer@agency.com"
                                className="w-full pl-12 pr-4 py-3 bg-background border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all"
                            />
                        </div>
                        <DialogFooter className="mt-6">
                            <button type="button" className="px-5 py-2.5 border border-border/60 text-foreground text-sm font-bold rounded-xl hover:bg-muted" onClick={() => setOpen(false)} disabled={isLoading}>취소</button>
                            <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl active:scale-95 flex items-center justify-center gap-2 min-w-[100px]">
                                {isLoading ? <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" /> : "초대 및 연결"}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
