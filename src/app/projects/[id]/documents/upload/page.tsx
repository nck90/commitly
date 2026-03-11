"use client";

import { FileCheck, UploadCloud, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DocumentUploadPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await simulateUpload(e.dataTransfer.files[0].name);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await simulateUpload(e.target.files[0].name);
        }
    };

    const simulateUpload = async (filename: string) => {
        setIsUploading(true);
        
        const uploadPromise = async () => {
            const formData = new FormData();
            formData.append('projectId', id);
            formData.append('title', filename);
            formData.append('type', 'spec'); // Default type for now
            
            const res = await fetch('/api/documents', {
                method: 'POST',
                body: formData,
            });
            
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Upload failed');
            }
            return res.json();
        };

        toast.promise(uploadPromise(), {
            loading: `"${filename}" 업로드 중...`,
            success: '업로드 완료! 문서 보관함에 저장되었습니다.',
            error: (err) => `업로드 실패: ${err.message}`,
        });

        try {
            await uploadPromise();
            router.push(`/projects/${id}/documents`);
            router.refresh();
        } catch (error) {
            // Error is handled by toast
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
            <Link
                href={`/projects/${id}/documents`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-12"
            >
                <ArrowLeft className="w-4 h-4" /> 문서 보관함으로 돌아가기
            </Link>

            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4 flex items-center justify-center md:justify-start gap-3">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-inner">
                        <UploadCloud className="w-8 h-8" />
                    </div>
                    새 문서 업로드
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    프로젝트 구성원들과 공유할 문서를 안전하게 업로드하세요. PDF, Word, 이미지 파일을 지원합니다.
                </p>
            </div>

            <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
                <div
                    className={`border-2 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center transition-all ${dragActive ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg' : 'border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/50'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className={`p-6 rounded-full mb-6 transition-all duration-300 ${dragActive ? 'bg-primary/20 text-primary scale-110' : 'bg-muted text-muted-foreground'}`}>
                        <UploadCloud className="w-12 h-12" />
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-foreground">파일을 이 곳에 드롭하세요</h3>
                    <p className="text-base text-muted-foreground mb-8 text-center max-w-md leading-relaxed">
                        또는 하단 버튼을 클릭하여 컴퓨터에서 파일을 선택하세요.<br />최대 50MB까지 업로드 가능합니다.
                    </p>

                    <label className="cursor-pointer">
                        <span className={`px-8 py-4 rounded-xl text-base font-bold flex items-center gap-2 transition-all active:scale-95 ${isUploading ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg'}`}>
                            {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <PlusIcon />}
                            {isUploading ? "업로드 진행 중..." : "컴퓨터에서 파일 선택"}
                        </span>
                        <input type="file" className="hidden" disabled={isUploading} onChange={handleFileSelect} />
                    </label>
                </div>
            </div>
        </div>
    );
}

function PlusIcon() {
    return (
        <svg xmlns="http://www.w3.org/200holen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    )
}
