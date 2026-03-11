"use client";

import { TourPage } from "@/contexts/TourContext";

export interface TourStep {
    page: TourPage;
    target?: string;
    title: string;
    content: string;
    position?: "top" | "bottom" | "left" | "right" | "center";
    interactive?: boolean;
    showClickIndicator?: boolean;
    actionHint?: string;
}

export function getTourSteps(role: "client" | "developer"): TourStep[] {
    const isClient = role === "client";

    return [
        // ═══════════════════════════════════════
        //  DASHBOARD — 5 steps
        // ═══════════════════════════════════════
        {
            page: "dashboard",
            title: "Commitly에 오신 것을 환영합니다",
            content: `<p>프로젝트의 모든 것을 <strong>한 눈에 파악</strong>할 수 있는 대시보드입니다.</p>
                <p>지금부터 커밋리의 핵심 페이지를 <strong>직접 이동하면서</strong> 하나하나 안내해 드리겠습니다.</p>
                <div class="tour-callout-box">
                    <strong>Commitly란?</strong><br/>
                    IT 외주 프로젝트에서 발주사와 개발사 사이의 <strong>신뢰를 보장</strong>하는 플랫폼입니다.<br/>
                    모든 합의, 변경, 결제가 <strong>투명하게 기록</strong>되어 분쟁을 예방합니다.
                </div>`,
            position: "center",
        },
        {
            page: "dashboard",
            target: "#tour-nav-home",
            title: "사이드바 내비게이션",
            content: `<p>좌측 사이드바는 프로젝트의 <strong>모든 메뉴</strong>에 접근하는 네비게이션입니다.</p>
                <ul>
                    <li><strong>내 프로젝트</strong> — 대시보드, 기능 현황, 피드, 일정</li>
                    <li><strong>서류/보고서</strong> — AI 리포트, 산출물, 승인 기록</li>
                    <li><strong>기타</strong> — 결제, 설정</li>
                </ul>
                <p>각 메뉴를 클릭하면 해당 페이지로 바로 이동합니다.</p>`,
            position: "right",
        },
        {
            page: "dashboard",
            target: "#tour-nav-home",
            title: "대시보드 — 핵심 지표 한눈에",
            content: isClient
                ? `<p>대시보드에서 확인 가능한 <strong>핵심 지표</strong>:</p>
                    <ul>
                        <li><strong>전체 진행도</strong> — 프로젝트 완성까지 몇 % 왔는지</li>
                        <li><strong>예산 현황</strong> — 에스크로에 보관 중인 금액</li>
                        <li><strong>AI 주간 보고서</strong> — 이번 주 개발 요약 (자동 생성)</li>
                        <li><strong>승인 대기</strong> — 내가 확인해야 할 항목 수</li>
                    </ul>
                    <p>프로젝트가 본격 시작되면 이곳에 <strong>실시간 데이터</strong>가 채워집니다.</p>`
                : `<p>개발사 대시보드에서 확인 가능한 <strong>KPI</strong>:</p>
                    <ul>
                        <li><strong>Total Progress</strong> — 전체 기능 완료율</li>
                        <li><strong>Features Done</strong> — 완료/전체 기능 수</li>
                        <li><strong>Pending Client</strong> — 클라이언트 승인 대기 건수</li>
                        <li><strong>AI Risk Score</strong> — 지연 가능성 분석 점수</li>
                        <li><strong>Sprint Burndown</strong> — 주간 작업량 추이 차트</li>
                    </ul>`,
            position: "right",
        },
        {
            page: "dashboard",
            target: ".commitly-card, [class*='rounded-[2rem]']",
            title: isClient ? "프로젝트 시작 안내" : "첫 번째 할 일",
            content: isClient
                ? `<p>새 프로젝트가 만들어지면 이 화면이 보입니다.</p>
                    <ul>
                        <li><strong>문서 보관함</strong> — 내가 올린 기획서/계약서 확인</li>
                        <li><strong>마일스톤 대기</strong> — 개발사가 첫 작업 목표를 세팅하면 본격 시작</li>
                    </ul>
                    <p>개발사가 칸반 보드에 기능을 등록하면 대시보드가 <strong>자동으로 활성화</strong>됩니다.</p>`
                : `<p>새 프로젝트에 합류하면 두 가지를 먼저 해야 합니다:</p>
                    <ul>
                        <li><strong>1. 요구사항 분석</strong> — 클라이언트가 올린 기획서 검토</li>
                        <li><strong>2. 칸반 보드 세팅</strong> — 첫 번째 기능 목록 작성</li>
                    </ul>
                    <p>기능을 등록하면 클라이언트에게 <strong>자동 알림</strong>이 전송됩니다.</p>`,
            position: "bottom",
        },
        {
            page: "dashboard",
            target: "#tour-nav-features",
            title: "기능 현황 페이지로 이동",
            content: `<p>이제 기능 보드를 살펴보겠습니다. 이 메뉴를 <strong>직접 클릭</strong>해주세요.</p>`,
            position: "right",
            interactive: true,
            showClickIndicator: true,
            actionHint: "이 메뉴를 직접 클릭해주세요",
        },

        // ═══════════════════════════════════════
        //  FEATURES — 6 steps
        // ═══════════════════════════════════════
        {
            page: "features",
            title: isClient ? "기능 작업 현황 페이지" : "칸반 보드 페이지",
            content: isClient
                ? `<p>개발 중인 <strong>모든 기능의 현재 상태</strong>를 실시간으로 확인하는 페이지입니다.</p>
                    <p>이 페이지의 핵심 구성 요소:</p>
                    <ul>
                        <li><strong>Scope Change 요청</strong> — 기능 추가/변경 요청 버튼</li>
                        <li><strong>전체 현황 요약</strong> — 만드는 중 / 확인 필요 / 완성됨</li>
                        <li><strong>검수 대기 목록</strong> — 내가 확인해야 할 기능들</li>
                        <li><strong>개발 진행 중 목록</strong> — 현재 작업 중인 기능들</li>
                        <li><strong>완료 목록</strong> — 이미 끝난 기능들</li>
                    </ul>`
                : `<p>합의된 작업 범위를 <strong>8단계 라이프사이클</strong>로 추적하는 칸반 보드입니다.</p>
                    <p class="tour-flow-text">백로그 → 범위 정의 → 디자인 → 개발 → 검수 → QA → 완료</p>
                    <p>카드를 드래그해서 상태를 변경할 수 있고, 상태 변경 시 클라이언트에게 <strong>자동 알림</strong>이 전송됩니다.</p>`,
            position: "center",
        },
        {
            page: "features",
            target: "[class*='bg-gradient-to-r'][class*='border-primary'], [class*='Scope Change']",
            title: "과업 변경 요청 (Scope Change)",
            content: isClient
                ? `<p>프로젝트 진행 중 <strong>새 기능 추가나 변경</strong>이 필요할 때 사용합니다.</p>
                    <div class="tour-callout-box">
                        <strong>왜 Scope Change가 중요한가요?</strong><br/>
                        합의된 범위 바깥의 요청은 추가 비용과 일정 변경을 유발합니다.<br/>
                        Commitly는 이 과정을 <strong>투명하게 기록</strong>하여 나중에 분쟁을 방지합니다.
                    </div>
                    <p>요청하면 개발팀이 <strong>소요 시간 + 추가 비용</strong>을 산정하여 회신합니다.</p>`
                : `<p>클라이언트의 <strong>과업 변경 요청(Scope Change)</strong>을 관리합니다.</p>
                    <p>요청이 들어오면 영향을 분석하고, 비용/일정 변경 내역을 클라이언트에게 공식 전달합니다.</p>`,
            position: "bottom",
        },
        {
            page: "features",
            target: "[class*='rounded-[2.5rem]']",
            title: "전체 현황 요약 보드",
            content: isClient
                ? `<p>프로젝트에 등록된 <strong>전체 기능 수</strong>와 상태별 분류를 한 눈에 보여줍니다.</p>
                    <ul>
                        <li><strong>만드는 중</strong> — 개발팀이 현재 작업 중인 기능 수</li>
                        <li><strong>확인 필요</strong> — 내가 확인/승인해야 하는 기능 수</li>
                        <li><strong>완성됨</strong> — 개발이 끝나 서버에 반영된 기능 수</li>
                    </ul>
                    <p>'확인 필요' 수가 올라가면 <strong>알림</strong>을 받게 됩니다.</p>`
                : `<p>등록된 기능의 <strong>상태별 통계</strong>가 표시됩니다.</p>
                    <p>칸반 보드에서 카드를 이동하면 이 숫자가 자동 업데이트됩니다.</p>`,
            position: "bottom",
        },
        {
            page: "features",
            target: ".commitly-card:first-of-type, [class*='rounded-3xl']:first-of-type",
            title: isClient ? "기능 상태 뱃지 안내" : "기능 카드 구조",
            content: isClient
                ? `<p>각 기능에 붙은 <strong>색상 뱃지</strong>의 의미:</p>
                    <ul>
                        <li><span class="tour-badge green">개발 완료</span> — 개발이 끝나 확인 가능한 기능</li>
                        <li><span class="tour-badge yellow">검수 대기</span> — 나의 승인이 필요한 기능</li>
                        <li><span class="tour-badge blue">개발 중</span> — 현재 만들고 있는 기능</li>
                        <li><span class="tour-badge gray">기능 초안</span> — 아직 개발 전인 기능</li>
                    </ul>
                    <p>'검수 대기' 기능에는 <strong>'괜찮아요' / '수정해주세요'</strong> 버튼이 나타납니다.</p>
                    <p>한번 '괜찮아요'를 누르면 <strong>공식 승인 기록</strong>으로 남습니다.</p>`
                : `<p>각 기능 카드에는 다음 정보가 포함됩니다:</p>
                    <ul>
                        <li><strong>상태 뱃지</strong> — 8단계 중 현재 위치</li>
                        <li><strong>진행률 바</strong> — % 단위 완료율</li>
                        <li><strong>UAT 지침</strong> — 클라이언트 테스트 가이드</li>
                    </ul>`,
            position: "bottom",
        },
        {
            page: "features",
            target: "[class*='bg-warning/5'], [class*='검수']",
            title: isClient ? "검수 및 승인 프로세스" : "클라이언트 승인 대기",
            content: isClient
                ? `<p><strong>검수 대기</strong> 상태인 기능이 있으면 이 섹션에 표시됩니다.</p>
                    <p>각 기능마다 두 가지 버튼이 있어요:</p>
                    <ul>
                        <li><strong>괜찮아요</strong> — 기능을 승인합니다. 에스크로 결제가 진행됩니다.</li>
                        <li><strong>수정해주세요</strong> — 수정 사항을 전달합니다. 개발팀에 즉시 알림.</li>
                    </ul>
                    <p>승인 후에는 <strong>취소가 불가</strong>하므로 신중히 확인해주세요.</p>
                    <p>각 기능 카드에는 개발팀이 작성한 <strong>테스트 행동 지침(UAT)</strong>도 포함되어 있어 쉽게 확인할 수 있습니다.</p>`
                : `<p>클라이언트의 승인을 기다리는 기능이 이 섹션에 표시됩니다.</p>
                    <p>자동 확인 시간이 지나면 자동 승인될 수 있습니다.</p>`,
            position: "bottom",
        },
        {
            page: "features",
            target: "#tour-nav-feed",
            title: "피드 페이지로 이동",
            content: `<p>개발팀과의 <strong>소통 채널</strong>인 피드를 살펴봅니다. 이 메뉴를 <strong>직접 클릭</strong>해주세요.</p>`,
            position: "right",
            interactive: true,
            showClickIndicator: true,
            actionHint: "이 메뉴를 직접 클릭해주세요",
        },

        // ═══════════════════════════════════════
        //  FEED — 6 steps
        // ═══════════════════════════════════════
        {
            page: "feed",
            title: isClient ? "새소식 피드 페이지" : "업무 피드 페이지",
            content: isClient
                ? `<p>개발팀이 공유하는 <strong>모든 소식과 알림</strong>이 타임라인으로 정리됩니다.</p>
                    <p>이 페이지에서 할 수 있는 것들:</p>
                    <ul>
                        <li><strong>일정 변경 확인</strong> — 개발 일정이 바뀌면 여기서 승인</li>
                        <li><strong>결과물 승인</strong> — 완성된 기능 확인 및 피드백</li>
                        <li><strong>질문 응답</strong> — 개발팀의 문의에 답변</li>
                        <li><strong>의사결정</strong> — 여러 선택지 중 하나를 선택</li>
                    </ul>`
                : `<p>클라이언트와의 <strong>공식 소통 채널</strong>입니다.</p>
                    <ul>
                        <li>태그를 선택하여 게시하면 <strong>자동으로 분류</strong></li>
                        <li>결재 요청 시 클라이언트에게 <strong>즉시 알림</strong> 전달</li>
                        <li>모든 대화가 <strong>공식 기록</strong>으로 남아 분쟁 예방</li>
                    </ul>`,
            position: "center",
        },
        {
            page: "feed",
            target: ".commitly-card:first-of-type, [class*='border-l-4']:first-of-type",
            title: isClient ? "확인이 필요한 알림" : "피드 작성 영역",
            content: isClient
                ? `<p>개발팀에서 <strong>일정 변경, 승인 요청</strong> 등을 올리면 여기 표시됩니다.</p>
                    <div class="tour-callout-box">
                        <strong>자동 확인 기능</strong><br/>
                        특정 시간 내에 응답하지 않으면 <strong>자동 승인</strong>됩니다.<br/>
                        자동 확인 시간은 설정 페이지에서 변경할 수 있습니다 (24/48/72시간).
                    </div>`
                : `<p>이곳에서 클라이언트에게 공유할 내용을 작성합니다.</p>
                    <p>반드시 <strong>태그(말머리)</strong>를 선택해야 게시됩니다:</p>
                    <ul>
                        <li><strong>결정 필요</strong> — 클라이언트 승인/선택 요청</li>
                        <li><strong>결과 보고</strong> — 주요 기능 완성 알림</li>
                        <li><strong>단순 질문</strong> — 기획 의도/자료 요청</li>
                        <li><strong>회의록</strong> — 구두 협의 내용 공식 기록</li>
                    </ul>
                    <p>작성된 내용은 <strong>법적/계약적 증빙</strong>으로 영구 보존됩니다.</p>`,
            position: "bottom",
        },
        {
            page: "feed",
            target: "[class*='border-l-warning'], [class*='일정']",
            title: "일정 변경 승인 카드",
            content: isClient
                ? `<p>개발팀이 일정을 변경하면 이런 카드가 나타납니다.</p>
                    <ul>
                        <li><strong>기존 일자</strong>와 <strong>변경 일자</strong>가 비교 표시</li>
                        <li><strong>변경 사유</strong>가 상세히 기재됨</li>
                        <li><strong>자동 확인 타이머</strong>가 표시됨 (남은 시간)</li>
                    </ul>
                    <p>'괜찮아요' 또는 '수정해주세요'로 응답할 수 있습니다.</p>`
                : `<p>일정 변경 요청 카드입니다. 클라이언트에게 자동 알림이 전송되며, 미응답 시 <strong>자동 확인</strong>됩니다.</p>`,
            position: "bottom",
        },
        {
            page: "feed",
            target: "button:has(.lucide-thumbs-up), [class*='approval'], [class*='bg-success']:has(.lucide)",
            title: "'괜찮아요' / '수정해주세요' 버튼",
            content: isClient
                ? `<p>모든 확인 요청에는 두 가지 응답 버튼이 있습니다:</p>
                    <ul>
                        <li><strong>괜찮아요 (초록)</strong> — 개발 결과물/일정 변경을 승인</li>
                        <li><strong>수정해주세요 (빨강)</strong> — 수정 사항을 전달</li>
                    </ul>
                    <p>한번 승인하면 <strong>공식 합의 기록</strong>으로 법적 효력을 가지므로 신중히 판단해주세요.</p>
                    <p>승인한 내역은 '내가 확인한 내역' 페이지에서 언제든 다시 확인할 수 있습니다.</p>`
                : `<p>클라이언트의 승인/거절 상태가 실시간 반영됩니다.</p>`,
            position: "bottom",
        },
        {
            page: "feed",
            target: "[class*='space-y-4']:last-of-type .commitly-card, [class*='지난 소식']",
            title: "피드 댓글 및 대화 기능",
            content: isClient
                ? `<p>각 피드 게시물에 <strong>댓글</strong>을 달 수 있습니다.</p>
                    <ul>
                        <li>추가 질문이나 의견을 자유롭게 입력</li>
                        <li>댓글도 <strong>공식 기록</strong>으로 보존됩니다</li>
                        <li>개발팀에게 실시간 알림 전송</li>
                    </ul>
                    <p>구두로 합의한 내용도 반드시 피드에 남겨두면 나중에 증거가 됩니다.</p>`
                : `<p>클라이언트와의 대화를 공식 기록으로 남깁니다.</p>
                    <p>모든 댓글과 대화가 타임라인으로 저장되어 분쟁 시 증빙됩니다.</p>`,
            position: "bottom",
        },
        {
            page: "feed",
            target: "#tour-nav-timeline",
            title: "프로젝트 일정으로 이동",
            content: `<p>전체 프로젝트 <strong>일정 타임라인</strong>을 살펴봅니다. 이 메뉴를 <strong>직접 클릭</strong>해주세요.</p>`,
            position: "right",
            interactive: true,
            showClickIndicator: true,
            actionHint: "이 메뉴를 직접 클릭해주세요",
        },

        // ═══════════════════════════════════════
        //  TIMELINE — 5 steps
        // ═══════════════════════════════════════
        {
            page: "timeline",
            title: "프로젝트 일정표 페이지",
            content: isClient
                ? `<p><strong>지하철 노선도</strong>처럼 직관적인 프로젝트 일정입니다.</p>
                    <p>이 페이지 구성:</p>
                    <ul>
                        <li><strong>마일스톤 (상단)</strong> — 프로젝트의 큰 이정표들</li>
                        <li><strong>간트 차트 (하단)</strong> — 기능별 세부 일정 바</li>
                        <li><strong>캘린더 연동</strong> — Google Calendar와 실시간 동기화</li>
                        <li><strong>일정 변경 요청</strong> — 일정 변경 사유 전달</li>
                    </ul>`
                : `<p>기능 카드의 일정으로 <strong>자동 생성</strong>되는 타임라인입니다.</p>
                    <p>마일스톤과 간트 차트로 진행 상황을 시각화합니다.</p>`,
            position: "center",
        },
        {
            page: "timeline",
            target: "[class*='rounded-[2.5rem]']:first-of-type, [class*='subway'], [class*='milestone']",
            title: "마일스톤 — 핵심 이정표",
            content: isClient
                ? `<p>프로젝트의 <strong>큰 단계별 진행 상황</strong>을 보여줍니다.</p>
                    <ul>
                        <li><span class="tour-badge green">완료됨</span> — 이미 지나온 단계</li>
                        <li><span class="tour-badge blue">진행 중</span> — 현재 작업 중인 단계</li>
                        <li><span class="tour-badge gray">예정</span> — 아직 시작 전인 단계</li>
                    </ul>
                    <p>각 마일스톤을 <strong>클릭</strong>하면 세부 내역과 포함된 기능 목록을 확인할 수 있습니다.</p>`
                : `<p>마일스톤은 프로젝트의 <strong>핵심 이정표</strong>입니다. 클릭 시 상세 페이지로 이동합니다.</p>`,
            position: "bottom",
        },
        {
            page: "timeline",
            target: "[class*='gantt'], [class*='grid-cols']:last-of-type",
            title: "간트 차트 — 기능별 세부 일정",
            content: isClient
                ? `<p>각 기능이 <strong>언제 시작해서 언제 끝나는지</strong> 시각적으로 보여줍니다.</p>
                    <ul>
                        <li>바의 <strong>길이</strong> — 예상 소요 기간</li>
                        <li>바의 <strong>색상</strong> — 현재 상태 (개발 중/완료/지연)</li>
                        <li>바를 <strong>클릭</strong>하면 해당 기능 상세 페이지로 이동</li>
                    </ul>
                    <p>일정이 겹치거나 지연되면 한 눈에 파악할 수 있습니다.</p>`
                : `<p>칸반 보드에 등록된 기능들이 <strong>자동으로 간트 차트에 반영</strong>됩니다.</p>`,
            position: "bottom",
        },
        {
            page: "timeline",
            target: "button:has(.lucide-calendar-days), [class*='캘린더']",
            title: "외부 캘린더 연동",
            content: `<p>프로젝트 일정을 <strong>Google Calendar</strong>와 실시간 동기화할 수 있습니다.</p>
                <ul>
                    <li>마일스톤과 기능별 일정이 캘린더에 자동 등록</li>
                    <li>일정 변경 시 캘린더에도 자동 반영</li>
                    <li>Apple Calendar 연동도 곧 지원 예정</li>
                </ul>`,
            position: "bottom",
        },
        {
            page: "timeline",
            target: "#tour-nav-latest",
            title: "AI 리포트로 이동",
            content: `<p>AI가 자동 작성하는 <strong>주간 보고서</strong>를 확인합니다. 이 메뉴를 <strong>직접 클릭</strong>해주세요.</p>`,
            position: "right",
            interactive: true,
            showClickIndicator: true,
            actionHint: "이 메뉴를 직접 클릭해주세요",
        },

        // ═══════════════════════════════════════
        //  REPORTS — 4 steps
        // ═══════════════════════════════════════
        {
            page: "reports",
            title: "AI 주간 리포트 페이지",
            content: isClient
                ? `<p>매주 AI가 개발팀의 GitHub 활동을 분석하여 <strong>쉬운 말로 된 보고서</strong>를 자동 생성합니다.</p>
                    <div class="tour-callout-box">
                        <strong>AI 보고서의 장점</strong><br/>
                        개발팀이 따로 보고서를 쓰지 않아도 됩니다.<br/>
                        코드 변경 기록을 분석해서 <strong>비전공자도 이해할 수 있는 한국어</strong>로 자동 변환됩니다.
                    </div>`
                : `<p>Git 커밋/PR 기록을 AI가 분석하여 <strong>클라이언트 전용 주간 보고서</strong>를 자동 생성합니다.</p>
                    <ul>
                        <li>커밋만 하면 보고서가 자동 생성</li>
                        <li>클라이언트가 <strong>비전문 용어</strong>로 이해 가능</li>
                        <li>PDF 다운로드 및 팀원 공유 지원</li>
                    </ul>`,
            position: "center",
        },
        {
            page: "reports",
            target: "[class*='rounded-[2.5rem]']:first-of-type, header",
            title: "프로젝트 날씨 지표",
            content: isClient
                ? `<p>리포트 상단의 <strong>프로젝트 날씨</strong>로 상황을 한 줄 요약합니다.</p>
                    <ul>
                        <li><strong>맑음</strong> — 일정대로 잘 진행 중, 걱정 없음</li>
                        <li><strong>구름</strong> — 약간의 주의가 필요한 사항 있음</li>
                        <li><strong>비</strong> — 일정 지연 위험, 대표님 확인 필요</li>
                    </ul>
                    <p>아래에 이번 주 <strong>주요 성과, 이슈, 다음 주 목표</strong>가 상세히 정리되어 있습니다.</p>
                    <p>보고서의 각 항목을 클릭하면 관련 기능/피드로 바로 이동할 수 있습니다.</p>`
                : `<p>날씨 퍼센트에 따라 자동 결정되며, 클라이언트가 10초 안에 이번 주 상황을 파악할 수 있습니다.</p>`,
            position: "bottom",
        },
        {
            page: "reports",
            target: "[class*='완료된'], [class*='이번 주'], [class*='commitly-card']:nth-of-type(2)",
            title: "리포트 세부 항목",
            content: isClient
                ? `<p>리포트에는 다음 내용이 포함됩니다:</p>
                    <ul>
                        <li><strong>이번 주 완료 항목</strong> — 구체적으로 뭐가 만들어졌는지</li>
                        <li><strong>진행 중인 작업</strong> — 현재 개발 중인 기능들</li>
                        <li><strong>주의 사항</strong> — 지연이나 확인이 필요한 것</li>
                        <li><strong>다음 주 계획</strong> — 향후 작업 예정 사항</li>
                    </ul>
                    <p>매주 금요일에 자동 생성되며, 이메일로도 받아볼 수 있습니다 (설정에서 변경).</p>`
                : `<p>AI가 커밋 메시지를 분석하여 보고서 항목을 자동 분류합니다.</p>`,
            position: "bottom",
        },
        {
            page: "reports",
            target: "#tour-nav-documents",
            title: "산출물 보관함으로 이동",
            content: `<p>공식 문서와 산출물을 보관하는 곳입니다. 이 메뉴를 <strong>직접 클릭</strong>해주세요.</p>`,
            position: "right",
            interactive: true,
            showClickIndicator: true,
            actionHint: "이 메뉴를 직접 클릭해주세요",
        },

        // ═══════════════════════════════════════
        //  DOCUMENTS — 5 steps
        // ═══════════════════════════════════════
        {
            page: "documents",
            title: "산출물 보관함 페이지",
            content: isClient
                ? `<p>계약서, 기획서, 디자인 파일 등 프로젝트의 <strong>모든 공식 문서</strong>가 안전하게 보관됩니다.</p>
                    <div class="tour-callout-box">
                        <strong>왜 중요한가요?</strong><br/>
                        이곳의 문서들은 <strong>위변조가 불가능</strong>합니다.<br/>
                        분쟁 발생 시 법적 증거 자료로 사용할 수 있습니다.
                    </div>`
                : `<p>프로젝트의 모든 산출물을 업로드하고 관리하는 <strong>전자 서류 금고</strong>입니다.</p>
                    <ul>
                        <li>업로드 즉시 클라이언트에게 자동 공유</li>
                        <li>위변조 불가능한 안전 보관</li>
                    </ul>`,
            position: "center",
        },
        {
            page: "documents",
            target: "[class*='col-span-1']:first-of-type, [class*='폴더']",
            title: "폴더 카테고리 사이드바",
            content: `<p>좌측에서 <strong>폴더별로 문서를 분류</strong>하여 조회할 수 있습니다.</p>
                <ul>
                    <li>폴더를 클릭하면 해당 카테고리의 문서만 표시</li>
                    <li>각 폴더 옆에 문서 숫자 표시</li>
                </ul>`,
            position: "right",
        },
        {
            page: "documents",
            target: "table, [class*='rounded-xl border']:has(table)",
            title: "문서 목록 및 법적 효력 뱃지",
            content: isClient
                ? `<p>파일 목록에서 <strong>법적 효력 발생 중</strong> 뱃지에 주목해주세요.</p>
                    <ul>
                        <li><span class="tour-badge" style="background:rgba(239,68,68,0.1);color:#dc2626;">법적 효력 발생 중</span> — 양측 합의 완료, 법적 증빙 가능</li>
                        <li><span class="tour-badge yellow">상호 합의 완료</span> — 합의되었으나 최종 확정 전</li>
                    </ul>
                    <p>파일명을 클릭하면 <strong>상세 내용과 변경 이력</strong>을 확인할 수 있습니다.</p>
                    <p>우측의 다운로드 버튼으로 원본 파일을 받을 수 있습니다.</p>`
                : `<p>업로드된 파일에는 <strong>법적 효력 상태</strong>가 자동 부여됩니다.</p>
                    <p>우측 상단의 <strong>문서 업로드</strong> 버튼으로 새 파일을 등록합니다.</p>`,
            position: "bottom",
        },
        {
            page: "documents",
            target: "input[type='text'], [class*='검색']",
            title: "문서 검색 기능",
            content: `<p>우측 상단의 <strong>검색창</strong>으로 파일명을 검색하여 빠르게 문서를 찾을 수 있습니다.</p>
                <p>입력하는 즉시 실시간으로 결과가 필터링됩니다.</p>`,
            position: "bottom",
        },
        {
            page: "documents",
            target: "#tour-nav-billing",
            title: "결제 페이지로 이동",
            content: `<p>에스크로 기반 <strong>안전 결제 시스템</strong>을 살펴봅니다. 이 메뉴를 <strong>직접 클릭</strong>해주세요.</p>`,
            position: "right",
            interactive: true,
            showClickIndicator: true,
            actionHint: "이 메뉴를 직접 클릭해주세요",
        },

        // ═══════════════════════════════════════
        //  BILLING — 5 steps
        // ═══════════════════════════════════════
        {
            page: "billing",
            title: "결제 및 예산 현황 페이지",
            content: isClient
                ? `<p><strong>에스크로(안전 보호)</strong> 기반으로 투명하게 예산이 관리됩니다.</p>
                    <div class="tour-callout-box">
                        <strong>에스크로(Escrow)란?</strong><br/>
                        내가 결제한 돈이 <strong>중간 계좌</strong>에 안전하게 보관됩니다.<br/>
                        기능 완성 → 내가 '괜찮아요' 클릭 → 그제서야 개발사에 지급<br/>
                        <strong>승인 전까지 나의 돈은 100% 보호받습니다.</strong>
                    </div>`
                : `<p>클라이언트의 결제 현황을 확인합니다. 에스크로 기반이므로 마일스톤 완료 후 클라이언트 승인 시 대금이 지급됩니다.</p>`,
            position: "center",
        },
        {
            page: "billing",
            target: "[class*='backdrop-blur-xl']:has([class*='rounded-full']), [class*='rounded-3xl']:first-of-type",
            title: "에스크로 예산 트래커",
            content: isClient
                ? `<p>상단의 <strong>프로그레스 바</strong>가 예산 소진 현황을 시각적으로 보여줍니다.</p>
                    <ul>
                        <li><strong>초록색 영역</strong> — 내가 승인하여 개발사에 지급된 금액</li>
                        <li><strong>흰색 마커</strong> — 내가 입금한 금액 기준선</li>
                        <li><strong>빈 영역</strong> — 아직 에스크로에 보관 중인 금액</li>
                    </ul>
                    <p>우측에는 <strong>총 계약 예산, 창출된 가치, 안전 보호 중인 예치금</strong> 세 가지 금액이 표시됩니다.</p>`
                : `<p>에스크로 예산 트래커는 전체 프로젝트 예산의 흐름을 시각화합니다.</p>`,
            position: "bottom",
        },
        {
            page: "billing",
            target: "[class*='결제 스케줄'], [class*='space-y-6']:has([class*='rounded-full'])",
            title: "결제 스케줄 (마일스톤 분할)",
            content: isClient
                ? `<p>전체 예산이 <strong>마일스톤별로 분할</strong>되어 있습니다.</p>
                    <ul>
                        <li><span class="tour-badge green">결제완료</span> — 이미 에스크로에 입금 완료</li>
                        <li><span class="tour-badge yellow">결제대기</span> — 클릭하면 결제 진행 가능</li>
                        <li><span class="tour-badge gray">예정됨</span> — 아직 시기가 되지 않음</li>
                    </ul>
                    <p>'결제대기' 항목을 클릭하면 우측에 <strong>안전 결제 폼</strong>이 나타납니다.</p>
                    <p>각 마일스톤에는 <strong>금액, 기한, 완료 조건</strong>이 명시되어 있습니다.</p>`
                : `<p>마일스톤별 결제 스케줄이 스텝퍼 형태로 표시됩니다.</p>`,
            position: "bottom",
        },
        {
            page: "billing",
            target: "[class*='border-primary/30'], [class*='에스크로 안전 결제'], [class*='border-dashed']",
            title: "안전 결제 프로세스",
            content: isClient
                ? `<p>결제대기 항목을 클릭하면 <strong>안전 결제 폼</strong>이 열립니다.</p>
                    <ul>
                        <li>카드 번호, 유효기간, CVC를 입력</li>
                        <li><strong>256-bit AES 암호화</strong>로 보안 처리</li>
                        <li>결제된 대금은 에스크로 계좌에 보관</li>
                        <li>마일스톤 완료 승인 전까지 개발사에 <strong>지급되지 않음</strong></li>
                    </ul>`
                : `<p>클라이언트가 결제하면 에스크로 계좌에 보관됩니다. 마일스톤 승인 시 대금이 정산됩니다.</p>`,
            position: "bottom",
        },
        {
            page: "billing",
            target: "#tour-nav-settings",
            title: "설정 페이지로 이동",
            content: `<p>마지막으로 <strong>프로젝트 설정</strong>을 살펴봅니다. 이 메뉴를 <strong>직접 클릭</strong>해주세요.</p>`,
            position: "right",
            interactive: true,
            showClickIndicator: true,
            actionHint: "이 메뉴를 직접 클릭해주세요",
        },

        // ═══════════════════════════════════════
        //  SETTINGS — 5 steps
        // ═══════════════════════════════════════
        {
            page: "settings",
            title: isClient ? "검수 및 알림 설정 페이지" : "프로젝트 설정 페이지",
            content: isClient
                ? `<p>이 페이지에서 <strong>알림, 검수 기준, 자동 확인 시간</strong>을 설정합니다.</p>
                    <p>설정 가능한 항목:</p>
                    <ul>
                        <li><strong>알림 센터</strong> — 이메일/SMS 알림 ON/OFF</li>
                        <li><strong>확인 방식 설정</strong> — 자동 승인 시간 조절(24/48/72시간)</li>
                        <li><strong>수정 요청 알림 강도</strong> — 긴급/보통/낮음</li>
                        <li><strong>결과물 품질 수준</strong> — AI 검토 기준 (높음/보통/간단히)</li>
                    </ul>`
                : `<p>GitHub 연동, 알림 설정, 보안 옵션을 관리합니다.</p>
                    <ul>
                        <li><strong>알림 센터</strong> — 확인 요청/주간 요약 알림</li>
                        <li><strong>GitHub 연동</strong> — 레포지토리 및 PAT 관리</li>
                    </ul>`,
            position: "center",
        },
        {
            page: "settings",
            target: ".commitly-card:first-of-type, [class*='알림 센터']",
            title: "알림 센터 — 수신 설정",
            content: `<p><strong>아코디언</strong>을 클릭하면 세부 설정이 열립니다.</p>
                <ul>
                    <li><strong>중요한 확인 요청</strong> — 승인이 필요할 때 알림</li>
                    <li><strong>주간 요약</strong> — 매주 금요일 AI 리포트 알림</li>
                </ul>
                <p>각 항목의 토글을 ON/OFF 하여 수신 여부를 제어합니다.</p>`,
            position: "bottom",
        },
        {
            page: "settings",
            target: "#toggle-critical",
            title: "알림 토글 직접 체험",
            content: `<p>토글 버튼을 직접 <strong>ON/OFF</strong> 해보세요.</p>
                <p>변경하면 실시간으로 알림 수신 여부가 바뀝니다.</p>`,
            position: "left",
            interactive: true,
            showClickIndicator: true,
            actionHint: "토글을 직접 클릭해서 변경해보세요",
        },
        {
            page: "settings",
            target: isClient
                ? "[class*='border-l-emerald'], [class*='확인 방식']"
                : "[class*='border-l-primary']:has([class*='github'], [class*='Github'])",
            title: isClient ? "자동 확인 시간 설정" : "GitHub 연동 관리",
            content: isClient
                ? `<p>개발팀의 결과물을 <strong>자동으로 승인</strong>하는 시간을 설정합니다.</p>
                    <ul>
                        <li><strong>24시간</strong> — 하루 안에 미확인 시 자동 승인</li>
                        <li><strong>48시간</strong> — 이틀</li>
                        <li><strong>72시간</strong> — 사흘</li>
                        <li><strong>수동 확인만</strong> — 자동 승인 비활성화</li>
                    </ul>
                    <p>아래에서 <strong>수정 요청 알림 강도</strong>와 <strong>AI 검토 품질 수준</strong>도 설정할 수 있습니다.</p>`
                : `<p>GitHub 레포지토리를 연동하면 커밋/PR 기록이 <strong>자동으로 분석</strong>됩니다.</p>
                    <ul>
                        <li><strong>Repository URL</strong> — 대상 저장소 입력</li>
                        <li><strong>PAT(Personal Access Token)</strong> — 접근 권한 토큰</li>
                        <li><strong>재연동</strong> 버튼 — 최신 기록 동기화</li>
                    </ul>
                    <p>연동 상태는 상단의 <strong>Connected</strong> 뱃지로 확인할 수 있습니다.</p>`,
            position: "bottom",
        },

        // ═══════════════════════════════════════
        //  FINAL
        // ═══════════════════════════════════════
        {
            page: "settings",
            target: "#tour-nav-logs",
            title: isClient ? "내가 확인한 내역" : "승인 기록 관리",
            content: isClient
                ? `<p>사이드바의 <strong>'내가 확인한 내역'</strong> 메뉴에서는 내가 승인/거절한 모든 이력을 확인할 수 있습니다.</p>
                    <ul>
                        <li>날짜별 승인/거절 기록 타임라인</li>
                        <li>분쟁 발생 시 가장 중요한 참고 자료</li>
                        <li>각 기록을 클릭하면 원본 피드로 이동</li>
                    </ul>`
                : `<p><strong>승인 기록 관리</strong> 페이지에서 클라이언트의 모든 승인/거절 이력을 추적합니다.</p>`,
            position: "right",
        },
        {
            page: "settings",
            title: "투어가 끝났습니다!",
            content: `<p>축하합니다! <strong>Commitly의 모든 핵심 기능</strong>을 성공적으로 둘러보았습니다.</p>
                <div class="tour-summary-grid">
                    <div class="tour-summary-chip">대시보드</div>
                    <div class="tour-summary-chip">기능 보드</div>
                    <div class="tour-summary-chip">스마트 피드</div>
                    <div class="tour-summary-chip">프로젝트 일정</div>
                    <div class="tour-summary-chip">AI 리포트</div>
                    <div class="tour-summary-chip">산출물 보관함</div>
                    <div class="tour-summary-chip">결제 현황</div>
                    <div class="tour-summary-chip">설정</div>
                </div>
                <p>궁금한 점이 있으시면 언제든 대시보드의 <strong>도움말</strong> 버튼을 눌러 다시 투어를 시작할 수 있습니다.</p>
                <p>프로젝트의 성공적인 완수를 기원합니다!</p>`,
            position: "center",
        },
    ];
}
