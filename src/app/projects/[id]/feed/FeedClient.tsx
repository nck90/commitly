"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";


export function ApprovalActions({ targetId, projectId, targetType = "update" }: { targetId: string; projectId: string; targetType?: string }) {
    const router = useRouter();
    const [openReject, setOpenReject] = useState(false);
    const [comment, setComment] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleApprove = async () => {
        setIsPending(true);
        try {
            const res = await fetch("/api/activities/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetId, targetType, action: "confirmed" })

            });
            if (!res.ok) throw new Error("Approval failed");
            toast.success("확인 완료! 개발팀에 전달되었습니다.");
            router.push(`/projects/${projectId}/logs`);
            router.refresh();

        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsPending(false);
        }
    };

    const handleReject = async () => {
        if (!comment.trim()) {
            toast.error("의견을 입력해주세요.");
            return;
        }
        setIsPending(true);
        try {
            const res = await fetch("/api/activities/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetId, targetType, action: "objection", comment })

            });
            if (!res.ok) throw new Error("Rejection failed");
            toast.success("의견이 개발팀에 전달되었어요.");
            setOpenReject(false);
            router.push(`/projects/${projectId}/logs`);
            router.refresh();

        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsPending(false);
        }
    };


    return (
        <div className="flex gap-3 mt-6 justify-end relative z-10">
            <button
                disabled={isPending}
                onClick={() => setOpenReject(true)}
                className="px-5 py-2.5 border border-border/60 bg-background/50 hover:bg-muted text-foreground text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
                수정해주세요
            </button>
            <button
                disabled={isPending}
                onClick={handleApprove}
                className="px-5 py-2.5 bg-success text-success-foreground text-sm font-bold rounded-xl hover:bg-success/90 hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 shadow-md disabled:opacity-50"
            >
                <CheckCircle className="w-4.5 h-4.5" /> {isPending ? '처리 중...' : '괜찮아요'}
            </button>


            <Dialog open={openReject} onOpenChange={setOpenReject}>
                <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold pb-1">수정 요청 보내기</DialogTitle>
                        <DialogDescription className="text-sm">
                            개발팀에 전달할 의견이나 수정 사항을 자세히 적어주세요.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full h-28 p-4 border border-border/40 rounded-2xl text-sm bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none shadow-inner"
                            placeholder="예: 이 부분은 원래 계획대로 해주세요. 일정이 너무 묀리면 곤란해요."
                        ></textarea>
                    </div>
                    <DialogFooter className="mt-2">
                        <button className="px-5 py-2.5 border border-border/60 text-foreground text-sm font-bold rounded-xl hover:bg-muted" onClick={() => setOpenReject(false)}>닫기</button>
                        <button disabled={isPending} className="px-5 py-2.5 bg-destructive text-destructive-foreground text-sm font-bold rounded-xl active:scale-95 disabled:opacity-50" onClick={handleReject}>
                            {isPending ? '전송 중...' : '의견 보내기'}
                        </button>
                    </DialogFooter>

                </DialogContent>
            </Dialog>
        </div>
    );
}

export function InteractiveReplyForm({
    projectId,
    targetId,
    targetType
}: {
    projectId: string,
    targetId: string,
    targetType: string
}) {
    const [content, setContent] = useState("");
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsPending(true);
        try {
            const res = await fetch("/api/activities/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetId, targetType, content })
            });
            if (!res.ok) throw new Error("Reply failed");
            toast.success('의견이 등록되었습니다!');
            setContent("");
            window.location.reload();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setIsPending(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full mt-4">
            <input type="hidden" name="targetType" value={targetType} />
            <input type="hidden" name="targetId" value={targetId} />
            <input type="hidden" name="projectId" value={projectId} />
            <input
                type="text"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="의견이나 질문을 자유롭게 남겨주세요..."
                className="text-sm flex-1 h-11 px-4 border border-border/40 rounded-xl bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
            />
            <button
                type="submit"
                disabled={isPending || !content.trim()}
                className="bg-primary text-primary-foreground px-5 rounded-xl text-sm font-extrabold hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
                {isPending ? '등록 중' : '등록'}
            </button>
        </form>
    );
}
