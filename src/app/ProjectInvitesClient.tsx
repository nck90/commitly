"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, MailOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectInvite {
    id: string;
    projectId: string;
    project: {
        name: string;
        client: {
            name: string | null;
            email: string;
        } | null;
    };
    createdAt: Date;
}

export function ProjectInvitesClient({ invites }: { invites: ProjectInvite[] }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const router = useRouter();

    if (invites.length === 0) return null;

    const handleRespond = async (inviteId: string, action: "accept" | "reject") => {
        setLoadingId(inviteId);
        try {
            const res = await fetch(`/api/invites/${inviteId}/respond`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            const data = await res.json();
            
            if (!res.ok) {
                toast.error(data.error || "처리 중 오류가 발생했습니다.");
                return;
            }

            if (action === "accept") {
                toast.success("프로젝트 초대를 수락했습니다!");
                router.refresh(); // Refresh to show the new project in the list
            } else {
                toast.success("프로젝트 초대를 거절했습니다.");
                router.refresh();
            }
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
                <MailOpen className="w-5 h-5 text-primary" /> 받은 프로젝트 초대
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invites.map((invite) => (
                    <div key={invite.id} className="bg-card border border-primary/20 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div>
                            <div className="text-xs font-bold text-primary mb-1">
                                {invite.project.client?.name || invite.project.client?.email || "클라이언트"}님의 초대
                            </div>
                            <h3 className="text-lg font-bold text-foreground">{invite.project.name}</h3>
                            <div className="text-xs text-muted-foreground mt-1">
                                {new Date(invite.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button 
                                disabled={loadingId === invite.id}
                                onClick={() => handleRespond(invite.id, "reject")}
                                className="flex-1 sm:flex-none px-4 py-2 bg-muted/50 hover:bg-muted text-foreground text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                            >
                                거절
                            </button>
                            <button 
                                disabled={loadingId === invite.id}
                                onClick={() => handleRespond(invite.id, "accept")}
                                className="flex-1 sm:flex-none px-4 py-2 gradient-primary text-primary-foreground text-sm font-bold rounded-xl transition-all hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loadingId === invite.id ? (
                                    <div className="w-4 h-4 border-2 border-background/30 border-t-background bg-transparent rounded-full animate-spin" />
                                ) : (
                                    <><CheckCircle2 className="w-4 h-4" /> 수락</>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
