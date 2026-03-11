import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // 1. Wipe out existing data to avoid unique constraints conflicts during testing
    await prisma.reply.deleteMany()
    await prisma.confirmation.deleteMany()
    await prisma.decisionOption.deleteMany()
    await prisma.update.deleteMany()
    await prisma.decision.deleteMany()
    await prisma.risk.deleteMany()
    await prisma.feature.deleteMany()
    await prisma.project.deleteMany()
    await prisma.workspace.deleteMany()
    await prisma.user.deleteMany()

    // 2. Create Users

    const agencyUser = await prisma.user.create({
        data: {
            id: 'agency-user-1',
            email: 'agency@demo.com',
            name: '김에이전시',
            role: 'developer',
        }
    })

    const clientUser = await prisma.user.create({
        data: {
            id: 'client-user-1',
            email: 's2460@e-mirim.hs.kr',
            name: '데모 클라이언트',
            role: 'client',
        }
    })

    // 3. Create Workspace & Project
    const workspace = await prisma.workspace.create({
        data: {
            name: '로켓에이전시 메인 워크스페이스',
            description: '로켓 디자인랩 스튜디오의 작업 공간입니다.',
            members: {
                create: [
                    { userId: agencyUser.id, role: 'admin' },
                    { userId: clientUser.id, role: 'member' }
                ]
            },
            projects: {
                create: {
                    name: 'Commitly Trust Layer 런칭 데모 (Demo)',
                    description: '외부 고객 미팅, 컨퍼런스 발표 시 사용할 완벽하게 채워진 프레젠테이션용 영구 데모 프로젝트입니다.',
                    status: 'active',
                    agencyId: agencyUser.id,
                    clientId: clientUser.id,
                    healthScore: 88,
                }
            }
        },
        include: { projects: true }
    })
    const project = workspace.projects[0];

    // 4. Create Features
    // A robust, realistic mix of done, in-progress, and not-started features
    await prisma.feature.createMany({
        data: [
            { projectId: project.id, name: '사용자 및 권한 DB 설계 (Prisma/SQLite)', description: '기본적인 사용자 테이블 생성 및 권한 분리', clientDescription: '회원들이 로그인하고 각자의 권한에 맞는 화면을 볼 수 있도록 자료를 보관하는 기초 공사입니다.', status: 'done', progressPercentage: 100, sortOrder: 0 },
            { projectId: project.id, name: '온보딩 플로우 모션그래픽 UI', description: 'Framer Motion을 사용한 역할 선택 페이지 애니메이션', clientDescription: '처음 접속할 때 발주사/개발사를 선택하는 다이나믹한 애니메이션 화면입니다.', status: 'done', progressPercentage: 100, sortOrder: 1 },
            { projectId: project.id, name: '클라이언트 대시보드 리팩토링 (Glassmorphism)', description: '전체 UI 컴포넌트 TailwindCSS 기반 정돈', clientDescription: '비전공자 통계 현황(원형 그래프 등)을 보여주는 메인 화면 디자인 작업입니다.', status: 'done', progressPercentage: 100, sortOrder: 2 },
            { projectId: project.id, name: '파일 업로드(Drag&Drop) 연동', description: 'public/uploads 로컬 저장 및 ScopeDoc 매핑', clientDescription: '계약서나 요구사항 파일을 첨부하고 관리할 수 있는 기능입니다.', status: 'done', progressPercentage: 100, sortOrder: 3 },
            { projectId: project.id, name: '통합 피드(Smart Communication) 실시간 연동', description: 'Update, Decision 모델 Server Component 연결', clientDescription: '채팅방처럼 개발팀과 소통하고 의사결정 기록을 남기는 게시판을 만들고 있습니다.', status: 'in_progress', progressPercentage: 80, sortOrder: 4, decisionNeededFlag: true },
            { projectId: project.id, name: '데모 전용 더미데이터 Seed 로직 분리', description: '안정적인 프레젠테이션을 위한 seed.ts 고도화', clientDescription: '새로운 시스템을 시연할 때 사용할 풍부한 샘플 데이터 모음집을 구축 중입니다.', status: 'in_progress', progressPercentage: 50, sortOrder: 5 },
            { projectId: project.id, name: '카카오톡 비즈니스 알림톡 발송 모듈 연동', description: '결정 필요/수락 시 Alimtalk API 쏴주기', clientDescription: '중요한 결정이나 개발 완료 시 회장님의 스마트폰 카카오톡으로 바로 알림이 가도록 연결하는 작업입니다.', status: 'not_started', progressPercentage: 0, sortOrder: 6 },
            { projectId: project.id, name: '최종 결제 및 에스크로 가상 미터기', description: 'Feature 완료도 기반 예산 소진 차트 구현', clientDescription: '실제 돈이 어떻게 쓰이고 얼마나 남았는지 직관적으로 보여주는 택시 미터기 느낌의 금전 현황판입니다.', status: 'not_started', progressPercentage: 0, sortOrder: 7 },
        ]
    })

    // Create Scope Docs (Agreed Assets Vault)
    await prisma.scopeDoc.createMany({
        data: [
            { projectId: project.id, type: 'contract', title: 'Commitly MVP 최초 요구사항 정의서.pdf', contentUrl: '/uploads/demo1.pdf', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) },
            { projectId: project.id, type: 'design', title: '데모 시연용 Figma 화면 설계도 v2', contentUrl: '/uploads/demo2.png', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) },
            { projectId: project.id, type: 'spec', title: '데이터베이스 스키마 구조 문서(ERD)', contentUrl: '/uploads/demo3.png', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) }
        ]
    })

    // 5. Create Feed Items (Updates, Decisions, Risks)

    // Update 1
    const update1 = await prisma.update.create({
        data: {
            projectId: project.id,
            title: '스프린트 1주차 주간보고',
            content: '이번 주에 사이드바 UI 통합 구성을 100% 완료했습니다. 현재 피드 UI 작업을 시작했습니다.',
            clientSummary: '사이드바 디자인이 적용 완료되었고, 피드 페이지를 만들고 있습니다.',
            status: 'pending',
            authorId: agencyUser.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        }
    })

    await prisma.confirmation.create({
        data: {
            updateId: update1.id,
            userId: clientUser.id,
            action: 'question',
            comment: '너무 잘 나왔네요! 피드에 댓글 기능도 같이 들어가는 거 맞죠?',
            replies: {
                create: [
                    { content: '네 클라이언트님, 댓글 기능(스레드) 포함됩니다!', authorId: agencyUser.id }
                ]
            }
        }
    })

    // Update 2
    await prisma.update.create({
        data: {
            projectId: project.id,
            title: '기초 디자인 시안 3종 전달',
            content: 'Figma 링크를 통해 확인 부탁드립니다. 어두운 배경의 다크모드 기반입니다.',
            status: 'checked',
            authorId: agencyUser.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
            confirmations: {
                create: {
                    userId: clientUser.id,
                    action: 'confirmed',
                    comment: '다크모드 시안 확정합니다. 바로 개발 진행해주세요.'
                }
            }
        }
    })

    // Decision
    const decision1 = await prisma.decision.create({
        data: {
            projectId: project.id,
            title: '데이터베이스 스택 최종 결정',
            description: '로컬에서 돌아가기를 원하셔서, PostgreSQL 서버 대신 SQLite를 임베드하는 방식(Prisma)으로 할지 논의가 필요합니다.',
            clientContext: '이전 미팅 때 서버비 없이 완전 로컬에서 돌고 싶다 하셨습니다.',
            status: 'pending',
            authorId: agencyUser.id,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
            options: {
                create: [
                    { label: 'SQLite 변경 (무료, 로컬 전용)' },
                    { label: 'Supabase 유지 (서버 비용, 클라우드 동기화)' }
                ]
            }
        }
    })

    await prisma.reply.create({
        data: {
            decisionId: decision1.id,
            content: '제가 로컬 전용으로 해달라고 했으니 SQLite로 하는게 맞을 것 같아요.',
            authorId: clientUser.id
        }
    })

    // Risk
    await prisma.risk.create({
        data: {
            projectId: project.id,
            title: '카카오톡 연동 승인 심사 딜레이 (외부 요인)',
            description: '카카오 비즈니스 채널 승인 심사가 평소보다 길어지고 있습니다. 이번 주 내 처리가 안 될 경우, 런칭 때 이메일 알림으로 우선 대체할 수도 있습니다.',
            severity: 'medium',
            status: 'active',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            replies: {
                create: [
                    { content: '큰 문제는 아니네요. 필요하면 이메일로 1차 오픈하는 방안 플랜 B로 준비해 주세요.', authorId: clientUser.id }
                ]
            }
        }
    })

    console.log('Dummy data seeded successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
