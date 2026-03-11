"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Sparkles, FolderOpen, FileText, CheckCircle2, ArrowRight, ArrowLeft, Upload, X, UserPlus, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { createProjectWithScope } from "@/app/actions/project";
import { toast } from "sonner";

export default function NewProjectWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [contractText, setContractText] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [partnerEmail, setPartnerEmail] = useState("");
    const [budgetRange, setBudgetRange] = useState("");
    const [timeline, setTimeline] = useState("");

    const handleNext = () => setStep(s => Math.min(5, s + 1));
    const handlePrev = () => setStep(s => Math.max(1, s - 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step !== 5) return handleNext();

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("document", contractText);

            files.forEach((file) => {
                formData.append("files", file);
            });
            if (partnerEmail) {
                formData.append("partnerEmail", partnerEmail);
            }

            // Call Server Action
            const projectId = await createProjectWithScope(formData);
            toast.success("프로젝트와 합의 범위가 생성되었습니다!");
            router.push(`/projects/${projectId}`);
        } catch (err: any) {
            toast.error("오류가 발생했습니다: " + err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-12 px-6">
            <div className="w-full max-w-3xl mb-8 flex justify-center">
                <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                    <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
            </div>

            <div className="w-full max-w-3xl">
                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border/50 rounded-full -z-10" />
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-300"
                        style={{ width: `${((step - 1) / 4) * 100}%` }}
                    />

                    {[
                        { num: 1, label: "기본 정보", icon: FolderOpen },
                        { num: 2, label: "목표 설정", icon: Target },
                        { num: 3, label: "문서 업로드", icon: FileText },
                        { num: 4, label: "파트너 초대", icon: UserPlus },
                        { num: 5, label: "생성 완료", icon: CheckCircle2 }
                    ].map((s) => (
                        <div key={s.num} className="flex flex-col items-center gap-2 bg-background px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${step >= s.num ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-accent text-muted-foreground border border-border'
                                }`}>
                                <s.icon className="w-4 h-4" />
                            </div>
                            <span className={`text-xs font-semibold ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <form onSubmit={handleSubmit} className="commitly-card p-8 min-h-[400px] flex flex-col relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">프리랜서 / 에이전시 프로젝트 생성</h2>
                                    <p className="text-muted-foreground text-sm">새롭게 진행할 프로젝트의 기초 정보를 입력해 주세요.</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[13px] font-semibold mb-2 block">프로젝트 이름 <span className="text-destructive">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="commitly-input"
                                            placeholder="예) Commitly iOS 앱 개발"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[13px] font-semibold mb-2 block">한 줄 요약</label>
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="commitly-input"
                                            placeholder="프로젝트의 목적을 간략하게 적어주세요."
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 space-y-6"
                            >
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">목표 및 예산 (선택)</h2>
                                    <p className="text-muted-foreground text-sm">성공적인 완수를 위해 대략적인 기대치를 설정해주세요.</p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[13px] font-semibold mb-2 block">예상되는 전체 예산 범위</label>
                                        <select
                                            value={budgetRange}
                                            onChange={(e) => setBudgetRange(e.target.value)}
                                            className="commitly-input w-full"
                                        >
                                            <option value="">예산 범위 선택...</option>
                                            <option value="1000-3000">1,000만원 ~ 3,000만원</option>
                                            <option value="3000-5000">3,000만원 ~ 5,000만원</option>
                                            <option value="5000-10000">5,000만원 ~ 1억원</option>
                                            <option value="10000+">1억원 이상</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[13px] font-semibold mb-2 block">원하는 개발 기간</label>
                                        <select
                                            value={timeline}
                                            onChange={(e) => setTimeline(e.target.value)}
                                            className="commitly-input w-full"
                                        >
                                            <option value="">예상 소요 시간 선택...</option>
                                            <option value="1-2">1~2개월</option>
                                            <option value="3-4">3~4개월</option>
                                            <option value="5-6">5~6개월</option>
                                            <option value="6+">6개월 이상</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 space-y-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">계약서 및 요구사항 업로드</h2>
                                        <p className="text-muted-foreground text-sm">클라이언트와 합의된 문서나 요구사항을 붙여넣으시면, AI가 자동으로 작업 범위를 분할합니다.</p>
                                    </div>
                                    <div className="bg-primary/10 text-primary p-2 rounded-xl">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="mt-4 space-y-4">
                                    <div 
                                        className="w-full border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center bg-background/30 cursor-pointer group relative overflow-hidden"
                                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                                setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
                                            }
                                        }}
                                        onClick={() => document.getElementById("file-upload")?.click()}
                                    >
                                        <input 
                                            id="file-upload" 
                                            type="file" 
                                            multiple 
                                            className="hidden" 
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                                                }
                                            }}
                                        />
                                        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
                                        <p className="text-sm font-semibold text-foreground">파일을 이 곳에 끌어다 놓거나 클릭하여 업로드</p>
                                        <p className="text-xs text-muted-foreground mt-2">PDF, 워드, 이미지 등 (한 번에 여러 개 가능)</p>
                                    </div>

                                    {files.length > 0 && (
                                        <div className="space-y-2">
                                            {files.map((file, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                                                    <span className="text-sm font-medium text-foreground truncate max-w-[80%]">{file.name}</span>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                                                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="relative flex py-4 items-center">
                                        <div className="flex-grow border-t border-border"></div>
                                        <span className="flex-shrink-0 mx-4 text-xs text-muted-foreground uppercase font-semibold text-center">또는 직접 텍스트 입력</span>
                                        <div className="flex-grow border-t border-border"></div>
                                    </div>

                                    <textarea
                                        value={contractText}
                                        onChange={(e) => setContractText(e.target.value)}
                                        className="w-full h-32 commitly-input p-4 resize-none"
                                        placeholder="이곳에 간단한 메모나 추가 설명, 기획서 텍스트 등을 직접 붙여넣으셔도 됩니다."
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 space-y-6"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">파트너 개발사 초대 (선택)</h2>
                                        <p className="text-muted-foreground text-sm">함께 작업할 개발사의 이메일을 입력하여 프로젝트에 바로 초대하세요.</p>
                                    </div>
                                    <div className="bg-primary/10 text-primary p-2 rounded-xl">
                                        <UserPlus className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="mt-8 space-y-4">
                                    <div>
                                        <label className="text-[13px] font-semibold mb-2 block">개발사 이메일</label>
                                        <input
                                            type="email"
                                            value={partnerEmail}
                                            onChange={(e) => setPartnerEmail(e.target.value)}
                                            className="commitly-input"
                                            placeholder="developer@agency.com"
                                        />
                                        <p className="text-xs text-muted-foreground mt-2">입력하지 않고 나중에 대시보드에서 초대할 수도 있습니다.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex-1 space-y-6 flex flex-col items-center justify-center text-center py-10"
                            >
                                <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle2 className="h-8 w-8 text-success" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">모든 준비가 끝났습니다!</h2>
                                <p className="text-muted-foreground text-sm max-w-sm">
                                    생성하기 버튼을 누르면 프로젝트가 세팅되고 초대장이 발송됩니다.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="pt-6 mt-auto border-t border-border flex justify-between items-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={step === 1 ? () => router.push('/') : handlePrev}
                            disabled={loading}
                            className="gap-2 rounded-xl"
                        >
                            {step === 1 ? '취소' : <><ArrowLeft className="w-4 h-4" /> 이전 단계</>}
                        </Button>

                        <Button
                            type="submit"
                            disabled={loading || (step === 1 && !name.trim())}
                            className="gap-2 rounded-xl shadow-md px-6"
                        >
                            {loading ? '처리 중...' : step === 5 ? '프로젝트 생성 시작' : '다음 단계'}
                            {!loading && step !== 5 && <ArrowRight className="w-4 h-4" />}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
