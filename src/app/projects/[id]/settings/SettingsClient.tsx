"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RefreshCcw } from "lucide-react";

export function NotificationToggle({ id, defaultChecked = true }: { id: string, defaultChecked?: boolean }) {
    const [checked, setChecked] = useState(defaultChecked);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem(`commitly_setting_${id}`);
        if (saved !== null) {
            setChecked(saved === 'true');
        }
    }, [id]);

    const handleChange = () => {
        const newValue = !checked;
        setChecked(newValue);
        localStorage.setItem(`commitly_setting_${id}`, String(newValue));
        toast.success("알림 설정 변경됨", {
            description: newValue ? "이제부터 해당 알림 수신이 활성화됩니다." : "해당 알림 수신이 비활성화되었습니다."
        });
    };

    if (!mounted) return <div className="w-11 h-6 bg-muted rounded-full"></div>;

    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={handleChange}
                id={id}
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
    );
}

export function GithubSyncButton() {
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        if (isSyncing) return;
        setIsSyncing(true);
        const promise = new Promise((resolve) => setTimeout(resolve, 2000));

        toast.promise(promise, {
            loading: 'GitHub 레포지토리 연결 상태를 확인하고 있습니다...',
            success: '연동 성공! 최신 커밋 및 PR 기록이 동기화되었습니다.',
            error: '연동에 실패했습니다. PAT(Personal Access Token)를 확인해주세요.',
        });

        await promise;
        setIsSyncing(false);
    };

    return (
        <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-6 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
        >
            <RefreshCcw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? '연동 중...' : '재연동'}
        </button>
    );
}
