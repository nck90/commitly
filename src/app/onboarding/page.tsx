"use client";

import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Code2, ArrowRight, Sparkles } from "lucide-react";

export default function OnboardingPage() {
    const { setRole } = useAuth();
    const [selectedRole, setSelectedRole] = useState<UserRole>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleConfirm = () => {
        if (!selectedRole) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setRole(selectedRole); // Redirects to /
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden p-6 md:p-12">
            {/* Dynamic Background based on hovered/selected role */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none transition-colors duration-1000 ease-out"
                style={{
                    backgroundColor: selectedRole === 'client' ? 'hsl(var(--primary) / 0.02)' : selectedRole === 'developer' ? 'hsl(var(--review) / 0.02)' : 'transparent'
                }}>
                <motion.div
                    animate={{
                        opacity: selectedRole === 'client' ? 1 : 0.3,
                        scale: selectedRole === 'client' ? 1.2 : 1,
                        x: selectedRole === 'client' ? '-10%' : '0%'
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[140px]"
                />
                <motion.div
                    animate={{
                        opacity: selectedRole === 'developer' ? 1 : 0.3,
                        scale: selectedRole === 'developer' ? 1.2 : 1,
                        x: selectedRole === 'developer' ? '10%' : '0%'
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-review/10 blur-[140px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, scale: isTransitioning ? 0.95 : 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-5xl relative z-10 flex flex-col items-center"
            >
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm font-semibold mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-warning" /> 역할 선택 완료 후 메인 대시보드로 이동합니다
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">어떤 모드로 접속하시겠습니까?</h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Commitly는 발주사와 개발사가 동일한 프로젝트를 다른 관점에서 볼 수 있도록 맞춤형 UX를 제공합니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    {/* Client Role Card */}
                    <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedRole("client")}
                        className={`cursor-pointer p-8 md:p-10 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden group ${selectedRole === 'client'
                                ? 'bg-background/80 border-primary shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] shadow-primary/20 backdrop-blur-xl'
                                : 'bg-card border-border/50 hover:border-primary/50'
                            }`}
                    >
                        <div className={`absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-opacity duration-500 ${selectedRole === 'client' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />

                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-colors duration-500 ${selectedRole === 'client' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                            }`}>
                            <Building2 className="w-10 h-10" />
                        </div>

                        <h2 className="text-3xl font-bold mb-4">발주사 (Client)</h2>
                        <ul className="space-y-3 text-muted-foreground font-medium mb-8">
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary" />프로젝트 전체 진척도 및 리스크 요약 뷰</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary" />기능별 명세 직관적 확인 및 승인 권한</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary" />개발사 피드백 및 이슈 히스토리 추적</li>
                        </ul>
                        <div className="flex items-center text-primary font-bold opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            선택하기 <ArrowRight className="w-5 h-5 ml-2" />
                        </div>
                    </motion.div>

                    {/* Developer Role Card */}
                    <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedRole("developer")}
                        className={`cursor-pointer p-8 md:p-10 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden group ${selectedRole === 'developer'
                                ? 'bg-background/80 border-review shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] shadow-review/20 backdrop-blur-xl'
                                : 'bg-card border-border/50 hover:border-review/50'
                            }`}
                    >
                        <div className={`absolute top-0 right-0 w-64 h-64 bg-review/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-opacity duration-500 ${selectedRole === 'developer' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />

                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-colors duration-500 ${selectedRole === 'developer' ? 'bg-review text-review-foreground shadow-lg shadow-review/30' : 'bg-muted text-muted-foreground group-hover:bg-review/10 group-hover:text-review'
                            }`}>
                            <Code2 className="w-10 h-10" />
                        </div>

                        <h2 className="text-3xl font-bold mb-4">개발사 (Developer)</h2>
                        <ul className="space-y-3 text-muted-foreground font-medium mb-8">
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-review" />실무 중심의 칸반 및 태스크 상세 뷰</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-review" />문서 업로드 및 주간 / 월간 리포트 작성 기능</li>
                            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-review" />이슈 대응 및 클라이언트 질의 스레드 관리</li>
                        </ul>
                        <div className="flex items-center text-review font-bold opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            선택하기 <ArrowRight className="w-5 h-5 ml-2" />
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: selectedRole ? 1 : 0, y: selectedRole ? 0 : 20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-16 w-full max-w-sm"
                >
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedRole || isTransitioning}
                        className={`w-full py-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${selectedRole === 'client' ? 'bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90' :
                                selectedRole === 'developer' ? 'bg-review text-review-foreground shadow-review/20 hover:bg-review/90' :
                                    'bg-muted text-muted-foreground opacity-50 cursor-not-allowed hidden'
                            }`}
                    >
                        {isTransitioning ? (
                            <div className="w-6 h-6 border-3 border-background/30 border-t-background rounded-full animate-spin" />
                        ) : (
                            <>
                                {selectedRole === 'client' ? '발주사' : '개발사'} 모드로 시작하기 <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
