import prisma from "@/lib/prisma";
import { ArrowLeft, Target, Layers, Scale, Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MetricsDetailPage({ params }: { params: Promise<{ id: string, type: string }> }) {
    const { id, type } = await params;

    if (!['progress', 'features', 'pending', 'risk'].includes(type)) {
        notFound();
    }

    const project = await prisma.project.findUnique({
        where: { id }
    });

    if (!project) notFound();

    const getMetricsData = () => {
        switch (type) {
            case 'progress':
                return {
                    title: "전체 개발 진행률 세부 정보",
                    icon: <Target className="w-8 h-8 text-primary" />,
                    bg: "bg-primary/5",
                    color: "text-primary",
                    items: [
                        { title: "시장 통합 인증 모듈", status: "완료", date: "어제", percentage: 100 },
                        { title: "프론트엔드 라우팅 설계", status: "완료", date: "2일 전", percentage: 100 },
                        { title: "결제 게이트웨이 연동", status: "진행중", date: "오늘", percentage: 60 },
                        { title: "마이페이지 대시보드", status: "시작 전", date: "예정", percentage: 20 }
                    ]
                };
            case 'features':
                return {
                    title: "이번 주 완료된 기능 목록",
                    icon: <Layers className="w-8 h-8 text-success" />,
                    bg: "bg-success/5",
                    color: "text-success",
                    items: [
                        { title: "소셜 로그인 (Kakao/Naver)", status: "QA 완료", date: "3/10", percentage: 100 },
                        { title: "포인트 적립 스케줄러", status: "배포됨", date: "3/08", percentage: 100 },
                        { title: "이메일 템플릿 세팅", status: "완료", date: "3/05", percentage: 100 }
                    ]
                };
            case 'pending':
                return {
                    title: "클라이언트 결정 대기 안건",
                    icon: <Scale className="w-8 h-8 text-warning" />,
                    bg: "bg-warning/5",
                    color: "text-warning",
                    items: [
                        { title: "디자인 테마 최종 승인", status: "결정 대기", date: "2시간 전", percentage: 0 },
                        { title: "결제 모듈 이용약관", status: "내부 검토", date: "어제", percentage: 0 }
                    ]
                };
            case 'risk':
                return {
                    title: "감지된 위험 요소",
                    icon: <ShieldAlert className="w-8 h-8 text-destructive" />,
                    bg: "bg-destructive/5",
                    color: "text-destructive",
                    items: [
                        { title: "결제 게이트웨이 연동 지연 우려", status: "위험", date: "최근 감지", percentage: 0 },
                        { title: "미응답 피드백 누적", status: "경고", date: "48시간 경과", percentage: 0 }
                    ]
                };
            default: return null;
        }
    }

    const data = getMetricsData();
    if (!data) return null;

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
            <Link
                href={`/projects/${id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
                <ArrowLeft className="w-4 h-4" /> 대시보드로 돌아가기
            </Link>

            <header className="mb-12 flex items-center gap-6">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-inner border border-white/10 ${data.bg}`}>
                    {data.icon}
                </div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                        {data.title}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        해당 지표의 세부 항목과 진행 상황을 확인할 수 있습니다.
                    </p>
                </div>
            </header>

            <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-8 border-b border-border/50 bg-muted/20">
                    <h2 className="text-xl font-bold">세부 항목 리스트</h2>
                </div>

                <div className="divide-y divide-border/30">
                    {data.items.map((item, i) => (
                        <div key={i} className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-muted/10 transition-colors">
                            <div className="flex items-center gap-4 flex-1">
                                <div className={`p-3 rounded-2xl flex items-center justify-center shrink-0 ${item.percentage === 100 ? 'bg-success/10 text-success' :
                                    item.percentage > 0 ? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'
                                    }`}>
                                    {item.percentage === 100 ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                                </div>
                                <div className="flex-1 w-full">
                                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                    <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                                        <span className={`px-2 py-0.5 rounded-md border text-xs uppercase tracking-wider ${item.percentage === 100 ? 'bg-success/5 border-success/20 text-success' :
                                            item.percentage > 0 ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-warning/5 border-warning/20 text-warning'
                                            }`}>
                                            {item.status}
                                        </span>
                                        <span>•</span>
                                        <span className="font-mono">{item.date}</span>
                                    </div>
                                </div>
                            </div>

                            {type === 'progress' && (
                                <div className="w-full sm:w-64 shrink-0 flex items-center gap-4">
                                    <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className={`h-full rounded-full ${item.percentage === 100 ? 'bg-success' : 'bg-primary'}`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                    <span className="font-bold font-mono text-sm min-w-12 text-right">{item.percentage}%</span>
                                </div>
                            )}

                            {(type === 'pending' || type === 'risk') && (
                                <Link href={`/projects/${id}/feed`} className="shrink-0 px-5 py-2.5 bg-background border border-border/50 shadow-sm rounded-xl text-sm font-bold hover:bg-muted active:scale-95 transition-all">
                                    {type === 'pending' ? '검토하러 가기' : '피드백 응답하기'}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
