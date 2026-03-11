"use client";

import { useState } from "react";
import { Layers, Clock, CheckCircle2, AlertCircle, FileEdit, Code2, TestTube2, MessageSquareWarning, RefreshCcw, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateFeatureStatus } from "@/app/actions/project";

const columns = [
    { id: 'not_started', label: '시작 전', icon: Clock, bg: 'bg-muted/30', text: 'text-muted-foreground' },
    { id: 'planning', label: '화면 설계 중', icon: FileEdit, bg: 'bg-purple-500/5', text: 'text-purple-500' },
    { id: 'in_progress', label: '개발 작업 중', icon: Code2, bg: 'bg-blue-500/5', text: 'text-blue-500' },
    { id: 'internal_test', label: '자체 테스트 중', icon: TestTube2, bg: 'bg-indigo-500/5', text: 'text-indigo-500' },
    { id: 'client_review', label: '고객님 확인 필요', icon: MessageSquareWarning, bg: 'bg-yellow-500/5', text: 'text-yellow-600' },
    { id: 'needs_fix', label: '수정 조치 중', icon: RefreshCcw, bg: 'bg-orange-500/5', text: 'text-orange-500' },
    { id: 'done', label: '완성됨', icon: CheckCircle2, bg: 'bg-success/5', text: 'text-success' },
    { id: 'blocked', label: '진행 보류', icon: AlertCircle, bg: 'bg-destructive/5', text: 'text-destructive' },
];

export function KanbanBoard({ initialFeatures, projectId }: { initialFeatures: any[], projectId: string }) {
    const [features, setFeatures] = useState(initialFeatures);
    const [draggedFeatureId, setDraggedFeatureId] = useState<string | null>(null);
    const router = useRouter();

    const handleDragStart = (e: React.DragEvent, featureId: string) => {
        setDraggedFeatureId(featureId);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
            const el = document.getElementById(`feature-${featureId}`);
            if (el) el.style.opacity = '0.5';
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent, featureId: string) => {
        setDraggedFeatureId(null);
        const el = document.getElementById(`feature-${featureId}`);
        if (el) el.style.opacity = '1';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
        e.preventDefault();
        if (!draggedFeatureId) return;

        const draggedFeature = features.find(f => f.id === draggedFeatureId);
        if (draggedFeature && draggedFeature.status !== targetStatus) {
            
            // Optimistic Update
            const newProgress = targetStatus === 'done' ? 100 : draggedFeature.progressPercentage;
            setFeatures(prev => prev.map(f =>
                f.id === draggedFeatureId ? { ...f, status: targetStatus, progressPercentage: newProgress } : f
            ));

            const colLabel = columns.find(c => c.id === targetStatus)?.label;
            
            // Server Mutation
            try {
                await updateFeatureStatus(draggedFeatureId, targetStatus, newProgress);
                toast.success(`상황 업데이트 완료! : ${colLabel}`, {
                    description: `해당 기능의 단계가 순조롭게 이동되었어요.`
                });
                router.refresh();
            } catch (error) {
                console.error("Failed to update feature status:", error);
                toast.error("저장 실패", { description: "네트워크 문제로 상태를 변경하지 못했어요. 다시 시도해주세요." });
                // Revert optimistic update gracefully
                setFeatures(prev => prev.map(f =>
                    f.id === draggedFeatureId ? { ...f, status: draggedFeature.status, progressPercentage: draggedFeature.progressPercentage } : f
                ));
            }
        }
        setDraggedFeatureId(null);
    };

    const openFeatureModal = (feature: any) => {
        router.push(`/projects/${projectId}/features/${feature.id}`);
    };

    return (
        <>
            <div className="flex gap-5 overflow-x-auto pb-8 snap-x relative h-[750px] scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                {columns.map((col) => {
                    const columnFeatures = features.filter(f =>
                        col.id === 'not_started' ? (!f.status || f.status === 'not_started') : f.status === col.id
                    );

                    return (
                        <div
                            key={col.id}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, col.id)}
                            className={`flex-none w-[300px] rounded-3xl ${col.bg} border border-border/40 flex flex-col snap-start overflow-hidden shadow-sm backdrop-blur-sm relative transition-colors ${draggedFeatureId ? 'border-primary/30 bg-primary/5' : ''}`}
                        >
                            <div className="p-4 border-b border-border/30 flex items-center justify-between bg-background/50 backdrop-blur-md sticky top-0 z-10">
                                <h2 className={`font-bold text-sm flex items-center gap-2 ${col.text}`}>
                                    <col.icon className="w-4 h-4" /> {col.label}
                                </h2>
                                <span className={`text-xs font-black px-2.5 py-1 rounded-full shadow-sm ${columnFeatures.length > 0 ? 'bg-background text-foreground border border-border/50' : 'bg-transparent text-muted-foreground'}`}>
                                    {columnFeatures.length}
                                </span>
                            </div>

                            <div className="p-3.5 flex flex-col gap-3.5 flex-1 overflow-y-auto scrollbar-none">
                                {columnFeatures.map((feature, i) => (
                                    <div
                                        key={feature.id}
                                        id={`feature-${feature.id}`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, feature.id)}
                                        onDragEnd={(e) => handleDragEnd(e, feature.id)}
                                        onClick={() => openFeatureModal(feature)}
                                        className="bg-card/80 backdrop-blur-sm p-4.5 rounded-2xl border border-border/60 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group cursor-grab active:cursor-grabbing relative overflow-hidden"
                                        style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${feature.priority === 'high' ? 'bg-destructive/70' :
                                            feature.status === 'done' ? 'bg-success/70' : 'bg-transparent'
                                            }`} />

                                        <div className="flex justify-between items-start mb-3 pl-1">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${feature.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                                                feature.priority === 'low' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
                                                }`}>
                                                {feature.priority === 'high' ? 'High' : feature.priority === 'low' ? 'Low' : 'Med'}
                                            </span>
                                            {feature.decisionNeededFlag && (
                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full animate-pulse">
                                                    <AlertCircle className="w-3 h-3" /> 논의필요
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-bold text-sm mb-2 pl-1 group-hover:text-primary transition-colors leading-snug">{feature.name}</h3>
                                        <p className="text-[11px] text-muted-foreground mb-4 pl-1 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                                            {feature.description || feature.clientDescription || '설명이 없습니다.'}
                                        </p>

                                        <div className="mt-auto flex flex-col gap-2 bg-muted/30 p-2.5 rounded-xl border border-border/40">
                                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground items-center">
                                                <span className="flex items-center gap-1.5"><Layers className="w-3 h-3 opacity-50" />진척도</span>
                                                <span className={col.id === 'done' ? 'text-success' : 'text-primary'}>{feature.progressPercentage}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-background shadow-inner rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${col.id === 'done' ? 'bg-success' : 'gradient-primary'}`}
                                                    style={{ width: `${feature.progressPercentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {columnFeatures.length === 0 && (
                                    <div className="text-center py-8 text-xs text-muted-foreground/50 font-medium">
                                        드래그하여 추가해보세요
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

        </>
    );
}
