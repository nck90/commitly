"use client";

import { useState } from "react";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                toast.error("로그인 실패: 이메일 또는 비밀번호를 확인해주세요.");
            } else {
                toast.success("로그인 성공");
                router.refresh(); // AuthContext will handle redirect
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/onboarding" });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px]"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
                    className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-review/10 blur-[100px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md relative z-10 px-6"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
                        className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20 mb-6"
                    >
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3">Welcome to <span className="text-primary">Commitly</span></h1>
                    <p className="text-muted-foreground text-lg">외주 프로젝트의 새로운 신뢰 기준</p>
                </div>

                <div className="glass-card p-8 sm:p-10 !rounded-[2rem] border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-2xl bg-white/40 dark:bg-black/40">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-foreground">이메일 계정</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-background/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/40 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-foreground">비밀번호</label>
                                <a href="#" className="text-xs font-semibold text-primary hover:text-primary-glow transition-colors">비밀번호 찾기</a>
                            </div>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 bg-background/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/40 font-medium tracking-widest"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 mt-6 bg-foreground text-background font-bold text-lg rounded-2xl flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-xl shadow-foreground/10 relative overflow-hidden group"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-background/30 border-t-background rounded-full animate-spin" />
                            ) : (
                                <>
                                    로그인 전문가 접속하기
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border/50"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground font-semibold">또는</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full py-4 bg-white dark:bg-zinc-900 border border-border/80 text-foreground font-bold text-base rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-sm relative overflow-hidden group"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                                <path d="M1 1h22v22H1z" fill="none" />
                            </svg>
                            Google 계정으로 계속하기
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
                        아직 계정이 없으신가요? <a href="/signup" className="text-foreground border-b border-foreground pb-0.5 hover:text-primary hover:border-primary transition-colors">회원가입</a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
