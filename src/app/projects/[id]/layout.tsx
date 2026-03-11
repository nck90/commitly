"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
    LayoutDashboard, Target, RefreshCw, FileCheck, Scale, AlertTriangle,
    FolderKanban, Settings, Menu, Shield, LogOut, X, Search,
    ChevronRight, Layers, Code2, User, Clock, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { GlobalCommandPalette } from './GlobalCommandPalette';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from 'next-auth/react';
import { useTour } from '@/contexts/TourContext';
import { PlayCircle } from 'lucide-react';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const params = useParams();
    const projectId = params.id as string;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { role: authRole, logout } = useAuth();
    const { startTour } = useTour();
    const { data: session } = useSession();

    // Map auth roles to sidebar display
    const role = authRole === 'developer' ? 'agency' : 'client';
    const displayName = session?.user?.name || (authRole === 'developer' ? '개발사 관리자' : '발주사 담당자');
    const initials = displayName.charAt(0).toUpperCase();
    const email = session?.user?.email || (authRole === 'developer' ? 'dev@company.com' : 'client@company.com');

    const navSections = [
        {
            agencyLabel: '프로젝트',
            clientLabel: '내 프로젝트',
            items: [
                { path: `/projects/${projectId}`, agencyLabel: '대시보드', clientLabel: '내 프로젝트 홈', icon: LayoutDashboard },
                { path: `/projects/${projectId}/features`, agencyLabel: '기능 개발 현황', clientLabel: '진행 상황', icon: Layers },
                { path: `/projects/${projectId}/feed`, agencyLabel: '업무 피드', clientLabel: '새소식 · 알림', icon: MessageSquare },
                { path: `/projects/${projectId}/timeline`, agencyLabel: '개발 일정', clientLabel: '프로젝트 일정', icon: Clock },
            ],
        },
        {
            agencyLabel: '산출물 관리',
            clientLabel: '서류 · 보고서',
            items: [
                { path: `/projects/${projectId}/reports/latest`, agencyLabel: '공식 주간 보고서', clientLabel: '주간 리포트 (AI)', icon: FileCheck },
                { path: `/projects/${projectId}/documents`, agencyLabel: '산출물 보관함', clientLabel: '최종 산출물 확인', icon: FolderKanban },
                { path: `/projects/${projectId}/logs`, agencyLabel: '승인 기록 관리', clientLabel: '내가 확인한 내역', icon: Shield },
            ],
        },
        {
            agencyLabel: '운영',
            clientLabel: '기타',
            items: [
                { path: `/projects/${projectId}/billing`, agencyLabel: '요금 및 결제', clientLabel: '결제 · 요금', icon: Target },
                { path: `/projects/${projectId}/settings`, agencyLabel: '프로젝트 설정', clientLabel: '알림 · 설정', icon: Settings },
                { path: '/', agencyLabel: '워크스페이스로', clientLabel: '메인으로 돌아가기', icon: FolderKanban },
            ],
        },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Mobile overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar — dark */}
            <aside className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-sidebar transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex h-16 items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
                            <Shield className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-[16px] font-bold text-sidebar-accent-foreground tracking-tight">Commitly</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-muted">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="px-4 mb-2">
                    <div className={`flex items-center justify-between w-full gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold ${role === 'agency' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-success/10 text-success border border-success/20'
                        }`}>
                        <div className="flex items-center gap-1.5">
                            {role === 'agency' ? <Code2 className="h-3 w-3" /> : <User className="h-3 w-3" />}
                            {role === 'agency' ? '개발자 모드 활성화됨' : '클라이언트 모드 활성화됨'}
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    {navSections.map(section => (
                        <div key={section.agencyLabel} className="mb-6">
                            <p className="text-[10px] font-semibold text-sidebar-muted uppercase tracking-[0.12em] px-3 mb-2">
                                {role === 'client' ? section.clientLabel : section.agencyLabel}
                            </p>
                            <ul className="space-y-0.5">
                                {section.items.map(item => {
                                    const isActive = pathname === item.path;
                                    return (
                                <li key={item.path}>
                                            <Link href={item.path} onClick={() => setSidebarOpen(false)}
                                                id={`tour-nav-${item.path.split('/').pop() === projectId ? 'home' : item.path.split('/').pop()}`}
                                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150 group ${isActive
                                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                                    : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                                                    }`}>
                                                <item.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary' : 'opacity-50 group-hover:opacity-80'}`} />
                                                <span className="flex-1">{role === 'client' ? item.clientLabel : item.agencyLabel}</span>
                                                {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-40" />}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                    
                    {/* Manual Tour Trigger */}
                    <div className="mt-4 px-3">
                        <button 
                            onClick={() => startTour(projectId, authRole === 'developer' ? 'developer' : 'client')}
                            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-bold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all group shadow-sm"
                        >
                            <PlayCircle className="h-4 w-4 shrink-0" />
                            <span>온보딩 가이드 다시보기</span>
                        </button>
                    </div>
                </nav>

                <div className="border-t border-sidebar-border p-4">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-primary text-primary-foreground text-[12px] font-bold shadow-sm">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-sidebar-accent-foreground truncate">{displayName}</p>
                            <p className="text-[11px] text-sidebar-muted truncate">{email}</p>
                        </div>
                        <button onClick={() => { logout(); toast.success('로그아웃 되었습니다.'); }} className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-muted hover:text-sidebar-accent-foreground transition-colors" title="로그아웃">
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center gap-4 border-b border-border/60 bg-card/70 backdrop-blur-md px-6 lg:px-10 shrink-0">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-secondary text-muted-foreground">
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="flex-1" />
                    <GlobalCommandPalette projectId={projectId} />
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
