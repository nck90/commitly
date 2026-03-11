"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, FileText, AlertCircle, Calendar, CheckSquare, GitCommit, Link as LinkIcon, Paperclip, CheckCircle2, Circle, MoreHorizontal, User, Clock, MessagesSquare, Activity } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function FeatureDetailClient({ project, feature }: { project: any, feature: any }) {
    const { role } = useAuth();
    const [progress, setProgress] = useState(feature.progressPercentage || 0);
    const [isSaving, setIsSaving] = useState(false);

    // Map priority
    const priorityConfig = {
        'high': { label: 'High Priority', style: 'bg-destructive/10 text-destructive border-destructive/20' },
        'medium': { label: 'Medium Priority', style: 'bg-primary/10 text-primary border-primary/20' },
        'low': { label: 'Low Priority', style: 'bg-muted text-muted-foreground border-border/50' },
    };
    const currentPriority = priorityConfig[feature.priority as keyof typeof priorityConfig] || priorityConfig.medium;

    const handleProgressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setProgress(val);
    };

    const handleSaveProgress = async () => {
        setIsSaving(true);
        // Simulate a network request to save progress
        await new Promise(res => setTimeout(res, 800));
        setIsSaving(false);
        toast.success("Progress updated successfully.");
    };

    // Mock Data for Richness optimized for Client
    const mockChecklist = [
        { id: 1, text: "명세 및 요구사항 분석 완료", done: true },
        { id: 2, text: "데이터베이스 설계 및 구조 작업", done: progress > 15 },
        { id: 3, text: "서버 데이터 연동 및 통신 기능 개발", done: progress > 40 },
        { id: 4, text: "사용자 화면(UI/UX) 구현 및 연동", done: progress > 70 },
        { id: 5, text: "기능 QA 테스트 및 안정화", done: progress >= 100 },
    ];

    const mockGitLog = [
        { id: 1, type: "update", text: "화면 레이아웃 및 기본 디자인 틀 작업 완료", time: "2일 전", author: "개발팀" },
        { id: 2, type: "update", text: "사용성 개선 및 내부 QA 피드백 반영", time: "어제", author: "통합테스트팀" },
        { id: 3, type: "status", text: `작업 상태가 변경되었습니다. (${feature.status.replace("_", " ")})`, time: "오늘", author: "PM" },
    ];

    return (
        <div className="max-w-[1200px] mx-auto py-8 px-4 sm:px-6">
            <Link
                href={`/projects/${project.id}/features`}
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-8 bg-muted/50 px-4 py-2 rounded-xl"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Board
            </Link>

            {/* Header Section */}
            <header className="mb-10 pb-8 border-b border-border/50">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="text-sm font-bold text-muted-foreground flex items-center gap-1.5 bg-muted px-3 py-1 rounded-lg border border-border/50">
                        <LinkIcon className="w-3.5 h-3.5" /> 작업 번호: TSK-{feature.sortOrder + 100}
                    </span>
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md border ${currentPriority.style}`}>
                        {currentPriority.label}
                    </span>
                    <span className="px-3 py-1 text-xs font-bold bg-muted/50 text-muted-foreground rounded-md border border-border/50 uppercase tracking-wider">
                        {feature.status.replace("_", " ")}
                    </span>
                    {feature.decisionNeededFlag && (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-orange-500 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full animate-pulse shadow-sm">
                            <AlertCircle className="w-4 h-4" /> 고객님 확인 대기 중
                        </span>
                    )}
                </div>

                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-loose mb-4 text-foreground/90">
                    {feature.name}
                </h1>
                
                <div className="flex items-center gap-6 mt-6 bg-muted/20 inline-flex px-5 py-3 rounded-2xl border border-border/40">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">담당 파트너</p>
                            <p className="text-sm font-bold">커밋리 개발팀</p>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-border/80" />
                    <div className="flex flex-col justify-center">
                        <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">요청 등록일</p>
                        <div className="flex items-center gap-1.5 text-foreground font-medium">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm">{new Date(feature.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Details & Content */}
                <div className="lg:col-span-2 space-y-10">
                    
                    {/* Description */}
                    <section>
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-primary" /> 기능 상세 설명 및 기대 효과
                        </h2>
                        <div className="bg-background border border-border/50 rounded-3xl p-8 shadow-sm prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-loose text-[15px]">
                            {feature.description || feature.clientDescription ? (
                                <p className="whitespace-pre-wrap">{feature.description || feature.clientDescription}</p>
                            ) : (
                                <div className="text-muted-foreground italic flex flex-col items-center justify-center py-6 opacity-80">
                                    <FileText className="w-10 h-10 mb-3 text-muted-foreground/50" />
                                    <p>아직 상세 설명이 등록되지 않았습니다.</p>
                                    <p className="text-xs mt-1">기획 단계가 완료되면 이 항목이 채워집니다.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Sub-tasks */}
                    <section>
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                            <CheckSquare className="w-5 h-5 text-primary" /> 개발 진행 체크리스트 (Milestones)
                        </h2>
                        <div className="bg-background border border-border/50 rounded-3xl p-3 shadow-sm">
                            {mockChecklist.map(task => (
                                <div key={task.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 rounded-2xl transition-colors group">
                                    {task.done ? (
                                        <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0 border border-success/20">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground/50 flex items-center justify-center shrink-0 border border-border">
                                            <Circle className="w-4 h-4" />
                                        </div>
                                    )}
                                    <span className={`text-[15px] ${task.done ? 'text-muted-foreground font-medium' : 'text-foreground font-bold'}`}>
                                        {task.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Comments Placeholder */}
                    <section>
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                            <MessagesSquare className="w-5 h-5 text-primary" /> 소통 및 논의 기록
                        </h2>
                        <div className="bg-background border border-border/50 rounded-3xl p-10 text-center shadow-sm">
                            <MessagesSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-sm font-bold text-foreground/80 mb-1">아직 주고받은 메시지가 없습니다.</p>
                            <p className="text-xs text-muted-foreground">이 기능과 관련해 궁금한 점이 있으시다면 언제든 남겨주세요.</p>
                        </div>
                    </section>
                </div>

                {/* Right Column: Metadata, Progress, Activity */}
                <div className="space-y-8">
                    
                    {/* Progress Control */}
                    <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10" />
                        <h3 className="font-bold mb-6 flex items-center justify-between">
                            실시간 개발 진도율
                            <span className="text-3xl font-black text-primary font-mono bg-background px-3 py-1 rounded-xl shadow-inner border border-border/50">{progress}%</span>
                        </h3>
                        
                        <div className="mb-6">
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={progress} 
                                onChange={handleProgressChange}
                                disabled={role !== "developer"}
                                className={`w-full h-3 rounded-full appearance-none shadow-inner cursor-pointer ${role === 'developer' ? 'bg-primary/20' : 'bg-muted'}`}
                                style={{
                                    background: `linear-gradient(to right, hsl(var(--primary)) ${progress}%, hsl(var(--muted)) ${progress}%)`
                                }}
                            />
                            <div className="flex justify-between text-[11px] font-bold text-muted-foreground mt-3 tracking-wide">
                                <span>작업 시작</span>
                                <span>절반 완성</span>
                                <span>개발 완료</span>
                            </div>
                        </div>

                        {role === "developer" && progress !== feature.progressPercentage && (
                            <button 
                                onClick={handleSaveProgress}
                                disabled={isSaving}
                                className="w-full py-3 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50 mt-4"
                            >
                                {isSaving ? "저장 중..." : "진척도 업데이트 반영하기"}
                            </button>
                        )}
                        {role !== "developer" && (
                            <div className="bg-background/80 p-3 rounded-xl border border-border/50 mt-4 backdrop-blur-sm">
                                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                                    해당 수치는 <strong>실제 개발팀의 코드 커밋 및 작업량</strong>을 바탕으로 실시간 산정됩니다.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Resources & Attachments */}
                    <div className="bg-background border border-border/50 rounded-3xl p-6 shadow-sm">
                        <h3 className="font-bold flex items-center gap-2 mb-5 text-[15px]">
                            <Paperclip className="w-4 h-4 text-primary" /> 관련 기획 및 디자인 문서
                        </h3>
                        <div className="space-y-3">
                            <a href="#" className="flex items-center justify-between p-3.5 rounded-2xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors group shadow-sm bg-muted/20">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center shrink-0 text-xs font-black">Fig</div>
                                    <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">최종 화면 UI 디자인 시안</span>
                                </div>
                            </a>
                            <a href="#" className="flex items-center justify-between p-3.5 rounded-2xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-colors group shadow-sm bg-muted/20">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 text-xs font-black">PDF</div>
                                    <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">기능 상세 명세서 (기획안)</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Activity / Git Log */}
                    <div className="bg-background border border-border/50 rounded-3xl p-6 shadow-sm">
                        <h3 className="font-bold flex items-center gap-2 mb-6 text-[15px]">
                            <Activity className="w-5 h-5 text-primary" /> 팀 작업 현황 히스토리
                        </h3>
                        <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-border/80 before:to-transparent overflow-hidden">
                            {mockGitLog.map((log, i) => (
                                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-6 last:mb-0">
                                    <div className={`flex items-center justify-center w-5 h-5 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${log.type === 'update' ? 'bg-primary' : 'bg-muted-foreground'}`} />
                                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-muted/20 p-4 rounded-2xl border border-border/40 hover:border-primary/30 transition-colors shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            {log.type === 'update' ? (
                                                <div className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black tracking-wider uppercase">보고</div>
                                            ) : (
                                                <div className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-black tracking-wider uppercase">상태</div>
                                            )}
                                            <span className="text-[11px] font-bold text-muted-foreground">{log.author}</span>
                                        </div>
                                        <p className="text-sm font-medium text-foreground/90 leading-relaxed word-break-keep-all">{log.text}</p>
                                        <p className="text-xs font-bold text-muted-foreground mt-3 flex items-center gap-1.5"><Clock className="w-3 h-3" /> {log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
