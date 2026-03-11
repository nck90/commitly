"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Layers, MessageSquare, LayoutDashboard, Clock } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function GlobalCommandPalette({ projectId }: { projectId: string }) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const menuItems = [
        { title: "대시보드로 이동", icon: LayoutDashboard, path: `/projects/${projectId}` },
        { title: "기능 진행상황 (칸반)", icon: Layers, path: `/projects/${projectId}/features` },
        { title: "새소식 및 피드", icon: MessageSquare, path: `/projects/${projectId}/feed` },
        { title: "타임라인 보기", icon: Clock, path: `/projects/${projectId}/timeline` },
        { title: "계약 및 문서 보관함", icon: FileText, path: `/projects/${projectId}/documents` },
    ];

    const filteredItems = menuItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (path: string) => {
        setOpen(false);
        router.push(path);
    };

    return (
        <>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 text-muted-foreground text-[13px] cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => setOpen(true)}>
                <Search className="h-3.5 w-3.5" />
                <span>검색 (메뉴 및 기능)...</span>
                <kbd className="ml-4 text-[10px] font-mono bg-card px-1.5 py-0.5 rounded-md border border-border/80 text-foreground">⌘K</kbd>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-xl p-0 overflow-hidden bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl gap-0">
                    <div className="flex items-center px-4 py-3 border-b border-border/50">
                        <Search className="h-5 w-5 text-muted-foreground shrink-0 mr-3" />
                        <input
                            type="text"
                            placeholder="메뉴로 빠른 이동..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground font-medium text-lg"
                            autoFocus
                        />
                        <kbd className="hidden sm:block text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded-md border border-border/50 text-muted-foreground">ESC</kbd>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto p-2">
                        {filteredItems.length === 0 ? (
                            <div className="p-8 text-center text-sm text-muted-foreground">
                                검색 결과가 없습니다.
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mb-1">
                                    빠른 이동 제안
                                </div>
                                {filteredItems.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSelect(item.path)}
                                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 hover:text-primary text-foreground transition-all text-sm group"
                                    >
                                        <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/20 transition-colors">
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <span className="font-semibold">{item.title}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
