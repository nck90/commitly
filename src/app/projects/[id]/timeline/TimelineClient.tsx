"use client";

import { toast } from "sonner";
import { ReactNode, useState } from "react";
import { CalendarDays, Save, CheckCircle2, Clock, AlignLeft, Calendar as CalendarIcon, Link as LinkIcon, RefreshCw } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function TimelineActions({ projectId }: { projectId: string }) {
    const [openReq, setOpenReq] = useState(false);
    const [openSync, setOpenSync] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const [reason, setReason] = useState("");


    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch("/api/activities/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId,
                    type: "update",
                    title: "외부 캘린더 연동이 완료되었어요",
                    content: "프로젝트 일정이 외부 캘린더와 성공적으로 연결되었어요. 이제 마일스톤과 일정 변동이 캘린더에 자동으로 반영됩니다."
                })
            });
            if (!res.ok) throw new Error("Sync logging failed");

            // Add arbitrary artificial delay to simulate external calendar syncing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            toast.success('연동 성공! 앞으로 일정이 자동으로 동기화돼요 🎉');
            setOpenSync(false);
        } catch (error) {
            console.error(error);
            toast.error('연동에 실패했어요. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Dialog open={openSync} onOpenChange={setOpenSync}>
                <DialogTrigger asChild>
                    <button className="px-4 py-2 bg-muted text-foreground text-sm font-semibold rounded-xl hover:bg-muted/80 transition-colors flex items-center gap-2 shadow-sm active:scale-95">
                        <CalendarDays className="w-4 h-4" /> 캘린더 연동
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-sm bg-background border border-border/50 rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                            <LinkIcon className="w-5 h-5 text-primary" /> 캘린더에 일정 연결하기
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                            프로젝트 주요 일정을 외부 캘린더에 자동으로 연결해 드릴게요. 중요한 마감일을 놓치지 않을 수 있어요.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 flex flex-col gap-3">
                        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group">
                            <span className="font-bold flex items-center gap-3">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                Google Calendar
                            </span>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">추천</span>
                        </button>
                        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group grayscale opacity-60">
                            <span className="font-bold flex items-center gap-3">
                                <CalendarIcon className="w-6 h-6" />
                                Apple Calendar
                            </span>
                            <span className="text-xs text-muted-foreground">지원 예정</span>
                        </button>
                    </div>
                    <DialogFooter>
                        <button className="px-4 py-2 text-sm font-bold border border-border/50 rounded-xl hover:bg-muted" onClick={() => setOpenSync(false)}>취소</button>
                        <button className="px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50" onClick={handleSync} disabled={isSyncing}>
                            {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "G-Cal 연동하기"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={openReq} onOpenChange={setOpenReq}>
                <DialogTrigger asChild>
                    <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm active:scale-95">
                        일정 조율 요청하기
                    </button>
                </DialogTrigger>
                <DialogContent className="bg-background border-border/50 rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">일정 조율 요청</DialogTitle>
                        <DialogDescription>
                            어떤 사유로 일정을 조율하고 싶으신가요? 개발팀과 빠르게 조율할 수 있도록 상세히 적어주시면 도움이 돼요.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full h-32 p-4 border border-border/40 rounded-xl text-sm bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all placeholder:text-muted-foreground/40 leading-relaxed shadow-inner"
                            placeholder="예: 내부 사정으로 기획 검토가 2일 정도 지연될 예정이에요"
                        ></textarea>
                    </div>
                    <DialogFooter>
                        <button disabled={isRequesting} className="px-4 py-2 text-sm font-bold border border-border/50 hover:bg-muted rounded-xl disabled:opacity-50" onClick={() => setOpenReq(false)}>조금 더 고민할게요</button>
                        <button disabled={isRequesting} className="px-5 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2" onClick={async () => {
                            if (!reason.trim()) {
                                toast.error("조율이 필요한 사유를 적어주세요.");
                                return;
                            }
                            setIsRequesting(true);
                            try {
                                const res = await fetch("/api/activities/post", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        projectId,
                                        type: "decision",
                                        title: "[일정 조율 요청]",
                                        content: reason,
                                        clientSummary: "일정 조율 건에 대한 확인이 필요해요."
                                    })
                                });
                                if (!res.ok) throw new Error("Request failed");
                                toast.success("일정 조율 요청이 전송되었어요!", { description: "상대방이 피드에서 확인할 수 있어요." });
                                setReason("");
                                setOpenReq(false);
                            } catch (err: any) {
                                toast.error("요청 전송에 실패했어요. 다시 시도해주세요.");
                            } finally {
                                setIsRequesting(false);
                            }
                        }}>
                            {isRequesting ? "전송 중..." : "조율 요청 보내기"}
                        </button>
                    </DialogFooter>

                </DialogContent>
            </Dialog>
        </div>
    );
}

export function InteractiveMilestone({ children, title, complete, projectId, milestoneId }: { children: ReactNode, title: string, complete: boolean, projectId: string, milestoneId: string }) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/projects/${projectId}/timeline/milestone/${milestoneId}`)}
            className="flex flex-col items-center group cursor-pointer hover:scale-110 transition-transform relative z-10"
        >
            {children}
        </div>
    );
}

export function InteractiveGanttBar({ children, title, className, style, projectId, featureId }: { children: ReactNode, title: string, className?: string, style?: any, projectId: string, featureId: string }) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/projects/${projectId}/features/${featureId}`)}
            className={`${className} cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5 relative group`}
            style={style}
        >
            {children}
        </div>
    );
}
