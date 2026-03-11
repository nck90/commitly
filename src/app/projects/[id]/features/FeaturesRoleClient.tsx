"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { KanbanBoard } from "./KanbanClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Layers, Code2, ShieldCheck, CheckCircle2, Clock, AlertTriangle, ChevronRight, Eye, Calendar, Map, CheckCircle, Sparkles, Activity, PlusCircle, PenTool, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Feature {
    id: string;
    name: string;
    description: string | null;
    status: string;
    priority: string;
    progressPercentage: number;
    sortOrder: number;
    projectId: string;
    [key: string]: any;
}

export function FeaturesRoleView({ features, projectId }: { features: Feature[]; projectId: string }) {
    const { role } = useAuth();

    if (role === "developer") {
        return (
            <div className="max-w-[1400px] mx-auto py-8 px-4">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-600 text-xs font-bold flex items-center gap-1.5 border border-purple-500/20">
                                <Code2 className="w-3 h-3" /> Developer View
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold mb-3 flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-inner"><Layers className="w-6 h-6" /></div>
                            Kanban Board (8단계 프로세스)
                        </h1>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                            합의된 작업 범위를 매우 구체적인 8단계 라이프사이클로 나누어 진척도를 실시간으로 추적합니다.
                        </p>
                    </div>
                </div>
                <KanbanBoard initialFeatures={features} projectId={projectId} />
            </div>
        );
    }

    // CLIENT VIEW — Read-only list with approve/dispute buttons
    return <ClientFeaturesView features={features} projectId={projectId} />;
}

function ClientFeaturesView({ features, projectId }: { features: Feature[]; projectId: string }) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const handleStatusUpdate = async (featureId: string, newStatus: string) => {
        setIsUpdating(featureId);
        try {
            const res = await fetch(`/api/features/${featureId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error("Status update failed");
            toast.success(newStatus === 'done' ? "기능 확인이 완료되었어요! 수고하셨습니다 🎉" : "수정 요청이 접수되었어요. 개발팀이 빠르게 반영할게요!");
            window.location.reload();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsUpdating(null);
        }
    };


    const statusLabels: Record<string, { label: string; color: string; bg: string; border: string }> = {
        'backlog': { label: '기능 초안', color: 'text-muted-foreground', bg: 'bg-muted/50', border: 'border-border/40' },
        'scope_defined': { label: '화면 설계 및 기획', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        'design': { label: 'UI/UX 디자인', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        'in_progress': { label: '개발 진행 중', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
        'review': { label: '✨ 검수 대기', color: 'text-warning text-yellow-600', bg: 'bg-warning/10', border: 'border-warning/30' },
        'testing': { label: '최종 점검 중 (QA)', color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
        'done': { label: '개발 완료 및 반영됨', color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
        'disputed': { label: '수정 요청 반영 중', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' },
    };

    const needsApproval = features.filter(f => f.status === 'review' || f.status === 'testing');
    const completed = features.filter(f => f.status === 'done');
    const inProgress = features.filter(f => !['done', 'review', 'testing'].includes(f.status));

    const [showScopeForm, setShowScopeForm] = useState(false);
    const [scopeTitle, setScopeTitle] = useState("");
    const [scopeContent, setScopeContent] = useState("");
    const [isSubmittingScope, setIsSubmittingScope] = useState(false);

    const handleScopeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scopeTitle.trim() || !scopeContent.trim()) return;
        
        setIsSubmittingScope(true);
        try {
            const res = await fetch("/api/activities/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId,
                    type: "decision",
                    title: `[과업 변경 요청] ${scopeTitle}`,
                    content: scopeContent,
                    clientSummary: "새로운 기능 추가 또는 변경 사항에 대한 일정/비용 조율 요청입니다."
                })
            });
            if (!res.ok) throw new Error("요청 작성 실패");
            
            toast.success("아이디어 제안이 완료되었어요! 개발팀이 검토 후 안내드릴게요.");
            setShowScopeForm(false);
            setScopeTitle("");
            setScopeContent("");
            // Optionally redirect to feed
        } catch (error) {
            console.error(error);
            toast.error("제안 전송에 실패했어요. 다시 시도해주세요.");
        } finally {
            setIsSubmittingScope(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-2 border border-emerald-500/20 backdrop-blur-md">
                            <ShieldCheck className="w-3.5 h-3.5" /> 발주사 전용 뷰
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground/90">기능 작업 현황</h1>
                    <p className="text-muted-foreground mt-2 text-lg">어떤 기능이 언제쯤 완성되는지 투명하게 보여드릴게요.</p>
                </div>
                <Dialog open={showScopeForm} onOpenChange={setShowScopeForm}>
                    <DialogTrigger asChild>
                        <button className="px-6 py-3.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-bold rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2">
                            <PlusCircle className="w-5 h-5" /> 새로운 아이디어 제안하기
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-background border border-border/50 rounded-[2rem] p-0 overflow-hidden shadow-2xl">
                        <div className="bg-gradient-to-br from-primary/10 via-background to-background p-8 border-b border-border/50 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black flex items-center gap-3 mb-2">
                                    <div className="p-2.5 bg-primary/20 text-primary rounded-xl shrink-0">
                                        <PenTool className="w-6 h-6" />
                                    </div>
                                    새로운 아이디어 제안하기
                                </DialogTitle>
                                <DialogDescription className="text-base text-muted-foreground leading-relaxed max-w-lg">
                                    프로젝트를 진행하며 떠오른 새로운 아이디어나, 꼭 필요한 추가 기능이 있으신가요? 편하게 제안해 주세요.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-6 flex items-start gap-3 bg-muted/40 p-4 rounded-2xl border border-border/40 backdrop-blur-sm">
                                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div className="text-sm text-foreground/80 leading-relaxed">
                                    <strong className="text-foreground">안내사항:</strong> 제안해 주신 내용을 바탕으로 개발팀이 필요한 일정과 비용을 산정해 개별 안내를 드립니다. 일정/비용에 대해 양측이 동의한 후에 정식 과업으로 편입됩니다.
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleScopeSubmit} className="p-8 flex flex-col gap-6 bg-background">
                            <div className="space-y-2">
                                <label className="text-sm font-extrabold text-foreground/90">아이디어 제목 <span className="text-destructive">*</span></label>
                                <input 
                                    type="text" 
                                    value={scopeTitle}
                                    onChange={(e) => setScopeTitle(e.target.value)}
                                    placeholder="예: 관리자 페이지에 엑셀 다운로드 버튼 추가"
                                    className="w-full bg-muted/20 border border-border/50 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-extrabold text-foreground/90">어떤 기능이 필요한지 자세히 알려주세요 <span className="text-destructive">*</span></label>
                                <textarea 
                                    value={scopeContent}
                                    onChange={(e) => setScopeContent(e.target.value)}
                                    placeholder="• 기존 설계에서 어떤 점이 변경되는지&#13;&#10;• 이 기능이 비즈니스적으로 왜 필요한지&#13;&#10;• 시각적 예시가 있다면 링크 포함&#13;&#10;&#13;&#10;가능한 상세히 적어주시면 정확하고 빠른 견적 산출이 가능합니다."
                                    className="w-full bg-muted/20 border border-border/50 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[160px] resize-y transition-all placeholder:text-muted-foreground/50 leading-relaxed"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-border/40">
                                <button type="button" onClick={() => setShowScopeForm(false)} className="px-6 py-3 text-sm font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors">
                                    조금 더 고민할게요
                                </button>
                                <button type="submit" disabled={isSubmittingScope} className="px-8 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2">
                                    {isSubmittingScope ? <span className="animate-spin text-lg">⏳</span> : <CheckCircle2 className="w-4 h-4" />}
                                    아이디어 제안하기
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Visual Overview Banner */}
            <div className="bg-background/80 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
                <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-4">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-4"><Map className="w-10 h-10" /></div>
                    <h2 className="text-2xl font-black mb-1">{features.length}개의 주요 모듈</h2>
                    <p className="text-sm text-muted-foreground text-center">우리가 합의한 설계 문서에 기반하여 작성되었습니다.</p>
                </div>
                <div className="w-full md:w-2/3 grid grid-cols-3 gap-4">
                    <div className="bg-muted/30 p-5 rounded-3xl border border-border/40 text-center flex flex-col items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-500 mb-2" />
                        <p className="text-2xl font-black">{inProgress.length}</p>
                        <p className="text-xs font-bold text-muted-foreground mt-1">열심히 만들고 있어요</p>
                    </div>
                    <div className="bg-warning/10 p-5 rounded-3xl border border-warning/20 text-center flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-warning/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                        <AlertTriangle className="w-5 h-5 text-warning mb-2 relative z-10" />
                        <p className="text-2xl font-black text-warning relative z-10">{needsApproval.length}</p>
                        <p className="text-xs font-bold text-warning-foreground mt-1 relative z-10">확인이 필요해요</p>
                    </div>
                    <div className="bg-success/10 p-5 rounded-3xl border border-success/20 text-center flex flex-col items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-success mb-2" />
                        <p className="text-2xl font-black text-success">{completed.length}</p>
                        <p className="text-xs font-bold text-success-foreground mt-1">성공적으로 완수함</p>
                    </div>
                </div>
            </div>

            {/* Needs Approval Section */}
            {needsApproval.length > 0 && (
                <div className="bg-warning/5 border border-warning/20 rounded-3xl p-6 lg:p-8 shadow-sm">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-warning-foreground">
                        <AlertTriangle className="w-6 h-6" /> 고객님, 이 부분 확인해 주시겠어요? ({needsApproval.length})
                    </h2>
                    <div className="space-y-4">
                        {needsApproval.map(f => {
                            const s = statusLabels[f.status] || statusLabels['backlog'];
                            return (
                                <div key={f.id} className={`bg-background/90 p-5 rounded-2xl border ${s.border} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer`} onClick={() => router.push(`/projects/${projectId}/features/${f.id}`)}>
                                    <div className="flex items-start md:items-center gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0"><CheckCircle className="w-6 h-6" /></div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${s.bg} ${s.color}`}>{s.label}</span>
                                                <h3 className="font-bold text-base">{f.name}</h3>
                                            </div>
                                            <p className="text-sm text-foreground/80 line-clamp-1 mb-2">개발팀에서 우선 완성하여, 서버에 적용했습니다.</p>
                                            <div className="bg-warning/10 border border-warning/20 p-2.5 rounded-lg">
                                                <p className="text-[11px] font-bold text-warning-foreground mb-1 font-mono">✅ 클라이언트 테스트 행동 지침 (UAT)</p>
                                                <p className="text-xs text-muted-foreground">"[데모 서버 접속] 후 버튼을 눌러 에러 페이지만 안 뜨는지 가볍게 확인해주세요."</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 md:ml-4 bg-muted/30 p-1.5 rounded-xl border border-border/50">
                                        <button 
                                            disabled={isUpdating === f.id}
                                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(f.id, 'done'); }} 
                                            className="px-5 py-2.5 bg-success text-white text-sm font-bold rounded-lg hover:bg-success/90 transition-colors shadow-sm active:scale-95 disabled:opacity-50"
                                        >
                                            {isUpdating === f.id ? '...' : '괜찮아요'}
                                        </button>
                                        <button 
                                            disabled={isUpdating === f.id}
                                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(f.id, 'disputed'); }} 
                                            className="px-5 py-2.5 bg-background border border-border/60 text-destructive text-sm font-bold rounded-lg hover:bg-destructive/10 transition-colors shadow-sm active:scale-95 disabled:opacity-50"
                                        >
                                            {isUpdating === f.id ? '...' : '조금 더 수정할게요'}
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* In Progress */}
                <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 lg:p-8 shadow-sm">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                        <Activity className="w-6 h-6 text-primary" /> 열심히 만들고 있어요 ({inProgress.length})
                    </h2>
                    <div className="space-y-4">
                        {inProgress.map(f => {
                            const s = statusLabels[f.status] || statusLabels['backlog'];
                            return (
                                <div key={f.id} onClick={() => router.push(`/projects/${projectId}/features/${f.id}`)} className="bg-muted/20 border border-border/40 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:border-primary/30 hover:shadow-md transition-all group">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${s.bg} ${s.color}`}>{s.label}</span>
                                            <p className="font-bold text-sm truncate">{f.name}</p>
                                        </div>
                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${f.progressPercentage}%` }} />
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground w-8 text-right">{f.progressPercentage}%</span>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Completed */}
                <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                        <CheckCircle2 className="w-6 h-6 text-success" /> 성공적으로 완성되었어요! ({completed.length})
                    </h2>
                    {completed.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-60 pb-10">
                            <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                            <p className="text-sm font-bold text-muted-foreground">아직 완성된 기능은 없지만, 개발팀이 최선을 다해 만들고 있어요!</p>
                            <p className="text-xs mt-1 text-muted-foreground">조금만 더 기다려주세요!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {completed.map(f => (
                                <div key={f.id} onClick={() => router.push(`/projects/${projectId}/features/${f.id}`)} className="bg-success/5 border border-success/10 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:border-success/30 hover:bg-success/10 transition-all opacity-80 hover:opacity-100 group">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center shrink-0"><CheckCircle2 className="w-4 h-4" /></div>
                                        <p className="font-bold text-sm truncate">{f.name}</p>
                                    </div>
                                    <Eye className="w-4 h-4 text-success/60 group-hover:text-success shrink-0" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
