"use client";

import { useState, useRef, DragEvent } from "react";
import { FileCheck, Folder, Download, UploadCloud, Search, FileText, Image as ImageIcon, X, Trash2, ShieldCheck, Code2, Lock, CheckCircle, Eye, FolderOpen, Clock, FileSignature } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ScopeDoc {
    id: string;
    title: string;
    textContent: string | null;
    contentUrl: string | null;
    createdAt: Date;
}

// 폴더 카테고리 분류 로직
function categorizeDoc(title: string): string {
    const lower = title.toLowerCase();
    if (lower.includes('계약') || lower.includes('contract') || lower.includes('합의')) return '계약서';
    if (lower.includes('기획') || lower.includes('plan') || lower.includes('설계') || lower.includes('요구사항')) return '기획서';
    if (lower.includes('디자인') || lower.includes('design') || lower.includes('시안') || lower.includes('ui') || lower.includes('ux')) return '디자인 시안';
    if (lower.includes('회의') || lower.includes('meeting') || lower.includes('미팅') || lower.includes('회의록')) return '회의록';
    return '기타 문서';
}

// 버전 추출 (같은 제목 패턴이면 v1, v2...)
function extractVersionInfo(docs: ScopeDoc[]): Map<string, number> {
    const titleCounts = new Map<string, number>();
    const versionMap = new Map<string, number>();
    docs.forEach(doc => {
        const baseTitle = doc.title.replace(/\s*v\d+\s*$/, '').trim();
        const count = (titleCounts.get(baseTitle) || 0) + 1;
        titleCounts.set(baseTitle, count);
        versionMap.set(doc.id, count);
    });
    return versionMap;
}

export default function DocumentsClient({ scopeDocs, projectId }: { scopeDocs: ScopeDoc[], projectId: string }) {
    const [selectedFolder, setSelectedFolder] = useState<string>("전체 문서");
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const router = useRouter();
    const { role } = useAuth();
    const isDeveloper = role === 'developer';
    const fileInputRef = useRef<HTMLInputElement>(null);

    const versionMap = extractVersionInfo(scopeDocs);

    // Map scopeDocs to files format with folder categories
    const files = scopeDocs.map(doc => ({
        id: doc.id,
        name: doc.title,
        type: doc.contentUrl?.endsWith('.pdf') ? 'pdf' : doc.contentUrl?.endsWith('.png') || doc.contentUrl?.endsWith('.jpg') ? 'img' : 'doc',
        date: new Date(doc.createdAt).toLocaleDateString('ko-KR'),
        size: 'N/A',
        folder: categorizeDoc(doc.title),
        legalStatus: '법적 효력 발생 중',
        url: doc.contentUrl,
        textContent: doc.textContent,
        version: versionMap.get(doc.id) || 1,
    }));
    
    // Build folder list dynamically
    const folderCategories = ['전체 문서', '계약서', '기획서', '디자인 시안', '회의록', '기타 문서'];
    const folders = folderCategories.map(name => ({
        name,
        count: name === '전체 문서' ? files.length : files.filter(f => f.folder === name).length,
    })).filter(f => f.name === '전체 문서' || f.count > 0);

    const filteredFiles = files.filter(file => {
        const matchesFolder = selectedFolder === "전체 문서" || file.folder === selectedFolder;
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFolder && matchesSearch;
    });

    const selectedPreview = files.find(f => f.id === previewDoc);

    // Drag and Drop handlers
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    const handleDragLeave = () => setIsDragOver(false);
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!isDeveloper) {
            toast.error("문서 업로드는 개발팀만 가능해요.");
            return;
        }
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            toast.success(`${droppedFiles.length}개 파일이 업로드 대기 중이에요!`, {
                description: "업로드 페이지로 이동할게요.",
            });
            setTimeout(() => router.push(`/projects/${projectId}/documents/upload`), 1000);
        }
    };

    const folderIcons: Record<string, string> = {
        '전체 문서': '📁',
        '계약서': '📝',
        '기획서': '📋',
        '디자인 시안': '🎨',
        '회의록': '🗓️',
        '기타 문서': '📄',
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border ${isDeveloper ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>
                            {isDeveloper ? <><Code2 className="w-3 h-3" /> Developer</> : <><ShieldCheck className="w-3 h-3" /> Client</>}
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold flex items-center gap-3 mb-2 tracking-tight">
                        <Lock className="w-8 h-8 text-primary" />
                        공식 문서 보관함
                    </h1>
                    <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-3">
                        <ShieldCheck className="w-4 h-4 text-success" />
                        {isDeveloper ? '프로젝트 관련 모든 문서를 안전하게 관리해요.' : '계약서 및 확정된 산출물이 안전하게 보관돼요.'}
                    </p>
                </div>

                {isDeveloper && (
                    <button
                        onClick={() => router.push(`/projects/${projectId}/documents/upload`)}
                        className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm active:scale-95"
                    >
                        <UploadCloud className="w-5 h-5" /> 문서 업로드
                    </button>
                )}
            </div>

            {/* Drag & Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`transition-all ${isDragOver ? 'ring-2 ring-primary ring-offset-4 rounded-3xl' : ''}`}
            >
                {isDragOver && (
                    <div className="fixed inset-0 bg-primary/5 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none animate-in fade-in">
                        <div className="bg-background border-2 border-dashed border-primary rounded-3xl p-16 text-center shadow-2xl">
                            <UploadCloud className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
                            <p className="text-xl font-bold text-primary">파일을 여기에 놓아주세요!</p>
                            <p className="text-sm text-muted-foreground mt-2">업로드 페이지로 자동 이동해요.</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Folders Sidebar */}
                    <div className="md:col-span-1 space-y-2">
                        <h3 className="text-sm font-bold text-muted-foreground mb-4 px-2">폴더 카테고리</h3>
                        {folders.map(f => (
                            <div
                                key={f.name}
                                onClick={() => setSelectedFolder(f.name)}
                                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group ${selectedFolder === f.name ? 'bg-primary/10 border border-primary/20 shadow-sm' : 'hover:bg-muted/50 border border-transparent'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{folderIcons[f.name] || '📄'}</span>
                                    <span className={`text-sm ${selectedFolder === f.name ? 'font-bold text-primary' : 'font-medium'}`}>{f.name}</span>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${selectedFolder === f.name ? 'bg-primary/20 text-primary font-bold' : 'bg-muted text-muted-foreground'}`}>{f.count}</span>
                            </div>
                        ))}
                    </div>

                    {/* File List + Preview */}
                    <div className={`${previewDoc ? 'md:col-span-2' : 'md:col-span-3'}`}>
                        <div className="commitly-card p-6 min-h-[500px]">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    {selectedFolder} <span className="text-muted-foreground text-sm font-medium">({filteredFiles.length})</span>
                                </h2>
                                <div className="relative w-full sm:w-64">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="문서 검색..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-muted/50 border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                {filteredFiles.map((file) => (
                                    <div
                                        key={file.id}
                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group hover:shadow-sm ${previewDoc === file.id ? 'bg-primary/5 border-primary/20' : 'bg-background border-border/40 hover:bg-muted/30'}`}
                                        onClick={() => setPreviewDoc(previewDoc === file.id ? null : file.id)}
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center shadow-sm shrink-0">
                                                {file.type === 'pdf' && <FileText className="w-5 h-5 text-red-500" />}
                                                {file.type === 'doc' && <FileText className="w-5 h-5 text-blue-500" />}
                                                {file.type === 'img' && <ImageIcon className="w-5 h-5 text-emerald-500" />}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-sm truncate">{file.name}</p>
                                                    {file.version > 1 && (
                                                        <span className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-md shrink-0">v{file.version}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <Clock className="w-2.5 h-2.5" /> {file.date}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{file.folder}</span>
                                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20">
                                                        <Lock className="w-2 h-2" /> 보호됨
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0 ml-3">
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (!file.url) {
                                                        toast.error('파일 경로가 유효하지 않아요.');
                                                        return;
                                                    }
                                                    setIsDownloading(file.id);
                                                    await new Promise(resolve => setTimeout(resolve, 1500));
                                                    window.open(file.url, '_blank');
                                                    setIsDownloading(null);
                                                    toast.success('다운로드가 시작되었어요!');
                                                }}
                                                disabled={isDownloading === file.id}
                                                className={`p-2 bg-background border border-border/50 shadow-sm rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 ${isDownloading === file.id ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'}`}
                                            >
                                                <Download className={`w-4 h-4 ${isDownloading === file.id ? 'animate-bounce' : ''}`} />
                                            </button>
                                            {isDeveloper && (
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        setIsDeleting(file.id);
                                                        try {
                                                            const res = await fetch(`/api/documents/${file.id}`, { method: 'DELETE' });
                                                            if (!res.ok) throw new Error('Delete failed');
                                                            toast.success(`"${file.name}" 문서가 삭제되었어요.`);
                                                            router.refresh();
                                                        } catch {
                                                            toast.error('삭제에 실패했어요. 다시 시도해주세요.');
                                                        } finally {
                                                            setIsDeleting(null);
                                                        }
                                                    }}
                                                    disabled={isDeleting === file.id}
                                                    className={`p-2 bg-background border border-border/50 shadow-sm rounded-lg text-destructive hover:bg-destructive hover:text-white transition-all active:scale-95 ${isDeleting === file.id ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'}`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {filteredFiles.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                        <FolderOpen className="w-12 h-12 opacity-20 mb-4" />
                                        <p className="font-bold text-sm">이 폴더에는 아직 문서가 없어요</p>
                                        <p className="text-xs mt-1">문서가 업로드되면 자동으로 카테고리별로 분류돼요.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preview Side Panel */}
                    {previewDoc && selectedPreview && (
                        <div className="md:col-span-1 animate-in slide-in-from-right-8">
                            <div className="commitly-card p-5 sticky top-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-sm flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-primary" /> 미리보기
                                    </h3>
                                    <button onClick={() => setPreviewDoc(null)} className="p-1 hover:bg-muted rounded-lg transition-colors">
                                        <X className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-muted/30 rounded-xl p-4 border border-border/40">
                                        <p className="font-bold text-sm mb-1">{selectedPreview.name}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                            <span>{selectedPreview.date}</span>
                                            <span>·</span>
                                            <span>{selectedPreview.folder}</span>
                                            {selectedPreview.version > 1 && (
                                                <>
                                                    <span>·</span>
                                                    <span className="text-primary font-bold">v{selectedPreview.version}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {selectedPreview.textContent ? (
                                        <div className="bg-background rounded-xl p-4 border border-border/40 max-h-[300px] overflow-y-auto">
                                            <p className="text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap">{selectedPreview.textContent}</p>
                                        </div>
                                    ) : selectedPreview.url ? (
                                        <div className="bg-muted/20 rounded-xl border border-border/40 overflow-hidden">
                                            {selectedPreview.type === 'img' ? (
                                                <img src={selectedPreview.url} alt={selectedPreview.name} className="w-full h-auto rounded-xl" />
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                                                    <p className="text-xs text-muted-foreground">미리보기가 지원되지 않는 형식이에요.</p>
                                                    <button
                                                        onClick={() => window.open(selectedPreview.url!, '_blank')}
                                                        className="mt-3 px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-all"
                                                    >
                                                        새 탭에서 열기
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground">
                                            <p className="text-xs">미리볼 수 있는 내용이 없어요.</p>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 text-[10px] text-success font-bold bg-success/5 p-2.5 rounded-lg border border-success/20">
                                        <ShieldCheck className="w-3 h-3" /> 법적 효력이 보호되고 있어요
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
