import { ArrowLeft, CheckCircle2, Clock, AlignLeft, CalendarDays } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MilestoneDetailPage({ params }: { params: Promise<{ id: string, milestoneId: string }> }) {
    const { id, milestoneId } = await params;

    // 더미 마일스톤 데이터 (TimelinePage와 동일)
    const milestones = [
        { id: 1, title: "프로젝트 킥오프", date: "3월 1일", completed: true },
        { id: 2, title: "기획안 확정", date: "3월 10일", completed: true },
        { id: 3, title: "디자인 1차 시안", date: "3월 25일", completed: false },
        { id: 4, title: "개발 착수", date: "4월 1일", completed: false },
        { id: 5, title: "알파 테스트", date: "4월 20일", completed: false },
        { id: 6, title: "최종 런칭", date: "5월 15일", completed: false },
    ];

    const milestone = milestones.find(m => m.id.toString() === milestoneId);

    if (!milestone) notFound();

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
            <Link
                href={`/projects/${id}/timeline`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-12"
            >
                <ArrowLeft className="w-4 h-4" /> 타임라인으로 돌아가기
            </Link>

            <header className="mb-12 text-center md:text-left">
                <div className={`inline-flex items-center justify-center p-4 rounded-3xl mb-6 shadow-sm ${milestone.completed ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                    {milestone.completed ? <CheckCircle2 className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
                </div>

                <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-3">
                            {milestone.title}
                        </h1>
                        <p className="text-lg text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                            <CalendarDays className="w-5 h-5" />
                            예정일: <span className="font-bold text-foreground">{milestone.date}</span>
                            <span className="mx-2 text-border">|</span>
                            <span className={`font-bold ${milestone.completed ? 'text-success' : 'text-primary'}`}>
                                {milestone.completed ? '완료됨' : '진행 예정'}
                            </span>
                        </p>
                    </div>
                </div>
            </header>

            <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
                <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${milestone.completed ? 'bg-success' : 'bg-primary'}`} />

                <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                    <AlignLeft className="w-6 h-6 text-primary" /> 마일스톤 상세 히스토리
                </h2>

                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-border/50 before:to-transparent">
                    {/* History Item 1 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-[3px] border-primary bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-5 rounded-2xl border border-border/50 bg-background shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-base">{milestone.title} 관련 회의 진행</h3>
                                <time className="font-serif text-sm text-primary font-bold">{milestone.date}</time>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {milestone.completed
                                    ? "이 마일스톤과 관련된 모든 초기 요구사항 정리가 완료되었으며, 다음 단계로 넘어가기 위한 모든 승인이 컨펌되었습니다."
                                    : "이 마일스톤에 도달하기 위한 세부 계획안을 리뷰하고 담당자를 지정하는 데일리 스크럼을 진행했습니다."}
                            </p>
                        </div>
                    </div>

                    {/* History Item 2 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full border-[3px] bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110 ${milestone.completed ? 'border-success' : 'border-border'}`}>
                            {milestone.completed && <div className="w-2 h-2 rounded-full bg-success" />}
                        </div>
                        <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-5 rounded-2xl border bg-background shadow-sm hover:shadow-md transition-shadow ${milestone.completed ? 'border-success/30' : 'border-border/50 opacity-60'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-base">진척 점검 및 반영</h3>
                                <time className="font-serif text-sm text-muted-foreground">{milestone.completed ? '완료' : '예정'}</time>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                관련 기능들의 테스트 결과를 취합하고, 잔여 버그 수정 목록을 우선순위화 합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
