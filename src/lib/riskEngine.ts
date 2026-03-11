import { Risk, RiskCategory, RiskLevel } from '@/types';
import prisma from './prisma';

interface RiskRule {
  id: string;
  category: RiskCategory;
  detect: (data: RiskEngineData) => RiskDetection | null;
}

interface RiskEngineData {
  project: any;
  updates: any[];
  confirmations: any[];
  decisions: any[];
}


interface RiskDetection {
  title: string;
  reason: string;
  severity: RiskLevel;
  affectedArea: string;
  suggestedAction: string;
}

const TODAY = new Date('2026-03-08');

function daysBetween(dateStr: string, ref: Date): number {
  return Math.floor((ref.getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function daysUntil(dateStr: string, ref: Date): number {
  return Math.floor((new Date(dateStr).getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
}

const rules: RiskRule[] = [
  // 1. No updates for a long period
  {
    id: 'no-update',
    category: 'no_update',
    detect: (data) => {
      const updates = data.updates;
      if (updates.length === 0) return null;
      const latest = updates.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
      const gap = daysBetween(latest.createdAt.toISOString(), TODAY);
      if (gap < 5) return null;
      const severity: RiskLevel = gap >= 14 ? 'high' : gap >= 7 ? 'medium' : 'low';
      return {
        title: `${gap}일간 업데이트 없음`,
        reason: `마지막 업데이트("${latest.title}")가 ${gap}일 전입니다. 장기간 업데이트가 없으면 개발 진행 상황을 파악하기 어렵고, 문제가 숨겨질 수 있습니다.`,
        severity,
        affectedArea: '프로젝트 전체',
        suggestedAction: '개발사에 현재 진행 상황을 요청하세요. 주 1회 이상 정기 업데이트를 합의하는 것을 권장합니다.',
      };
    },
  },
  // 2. Repeated scope changes
  {
    id: 'scope-change',
    category: 'scope_change',
    detect: (data) => {
      const scopeChanges = data.updates.filter(
        (u) => (u.title.includes('변경') || u.content.includes('변경'))
      );
      if (scopeChanges.length < 1) return null;
      const severity: RiskLevel = scopeChanges.length >= 3 ? 'high' : scopeChanges.length >= 2 ? 'medium' : 'low';
      return {
        title: `스코프 변경 ${scopeChanges.length}건 감지`,
        reason: `프로젝트에서 ${scopeChanges.length}건의 스코프 변경이 발생했습니다. 반복적인 변경은 일정 지연과 추가 비용의 주요 원인입니다.`,
        severity,
        affectedArea: '기능 정의',
        suggestedAction: '추가 변경을 최소화하고, 변경 시 일정·비용 영향을 반드시 사전 확인하세요.',
      };
    },
  },
  // 3. Unresolved objections accumulating
  {
    id: 'unresolved-objections',
    category: 'unresolved_objections',
    detect: (data) => {
      const unresolved = data.confirmations.filter(
        (c) => !c.resolved && (c.action === 'objection' || c.action === 'question')
      );
      if (unresolved.length < 2) return null;
      const objections = unresolved.filter((c) => c.action === 'objection').length;
      const questions = unresolved.filter((c) => c.action === 'question').length;
      const severity: RiskLevel = objections >= 2 ? 'high' : unresolved.length >= 3 ? 'high' : 'medium';
      return {
        title: `미해결 이의·질문 ${unresolved.length}건 누적`,
        reason: `이의 ${objections}건, 질문 ${questions}건이 해결되지 않았습니다. 미해결 사항이 쌓이면 신뢰가 약화되고 프로젝트 방향에 혼란이 생깁니다.`,
        severity,
        affectedArea: '의사결정·소통',
        suggestedAction: '가장 오래된 미해결 건부터 우선 처리하세요. 개발사와의 정기 미팅을 통해 한꺼번에 정리하는 것을 권장합니다.',
      };
    },
  },
  // 4. Launch date near but many pending items
  {
    id: 'deadline-pressure',
    category: 'deadline_pressure',
    detect: (data) => {
      const project = data.project;
      if (!project || !project.endDate) return null;
      const remaining = daysUntil(project.endDate.toISOString(), TODAY);
      if (remaining < 0 || remaining > 60) return null;
      
      // Calculate completion using features status count as a proxy
      const totalFeatures = project.features?.length || 0;
      if (totalFeatures === 0) return null;
      const completedFeatures = project.features.filter((f: any) => f.status === 'done').length;
      const completionPercent = (completedFeatures / totalFeatures) * 100;
      
      const incompletePct = 100 - completionPercent;
      if (incompletePct < 20) return null;
      const severity: RiskLevel = remaining <= 14 && incompletePct > 30 ? 'high' : remaining <= 30 && incompletePct > 40 ? 'high' : 'medium';
      return {
        title: `출시일까지 ${remaining}일, 잔여 작업 ${Math.round(incompletePct)}%`,
        reason: `목표 출시일(${project.endDate.toLocaleDateString()})까지 ${remaining}일 남았지만, 아직 전체의 약 ${Math.round(incompletePct)}%가 미완료 상태입니다.`,
        severity,
        affectedArea: '일정·전체 진행',
        suggestedAction: '필수 기능과 선택 기능을 재분류하고, 핵심 기능 위주로 출시 범위를 조정하세요.',
      };
    },
  },
  // 5. Too many unanswered decisions
  {
    id: 'unanswered-decisions',
    category: 'unanswered_decisions',
    detect: (data) => {
      const pending = data.decisions.filter((d) => d.status === 'pending');
      if (pending.length < 3) return null;
      const oldest = pending.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
      const waitDays = daysBetween(oldest.createdAt.toISOString(), TODAY);
      const severity: RiskLevel = pending.length >= 5 ? 'high' : pending.length >= 3 ? 'medium' : 'low';
      return {
        title: `결정 대기 ${pending.length}건 (최대 ${waitDays}일 경과)`,
        reason: `${pending.length}건의 결정이 대기 중이며, 가장 오래된 건은 ${waitDays}일째 미결 상태입니다. 의사결정 지연은 개발 중단의 직접적 원인이 됩니다.`,
        severity,
        affectedArea: '의사결정',
        suggestedAction: '이번 주 내로 모든 대기 건에 대해 결정을 내려주세요. 판단이 어려운 건은 개발사와 상의 후 결정하세요.',
      };
    },
  },
];


export async function detectRisks(projectId: string): Promise<Risk[]> {
  const [project, updates, confirmations, decisions] = await Promise.all([
    prisma.project.findUnique({
      where: { id: projectId },
      include: { features: true }
    }),
    prisma.update.findMany({ where: { projectId } }),
    prisma.confirmation.findMany({ where: { update: { projectId } } }),
    prisma.decision.findMany({ where: { projectId } }),
  ]);

  if (!project) return [];

  const data: RiskEngineData = { project, updates, confirmations, decisions };
  const detected: Risk[] = [];

  for (const rule of rules) {
    const result = rule.detect(data);
    if (result) {
      detected.push({
        id: `auto-${rule.id}-${projectId}`,
        projectId,
        category: rule.category,
        ...result,
        status: 'active',
        detectedAt: TODAY.toISOString().split('T')[0],
        createdAt: TODAY.toISOString().split('T')[0],
      } as Risk);
    }
  }
  return detected;
}

export async function detectAllRisks(): Promise<Risk[]> {
  const allProjects = await prisma.project.findMany({ select: { id: true } });
  const allRisks = await Promise.all(allProjects.map(p => detectRisks(p.id)));
  return allRisks.flat();
}


export const riskCategoryLabels: Record<RiskCategory, string> = {
  no_update: '업데이트 중단',
  scope_change: '스코프 변경',
  unresolved_objections: '미해결 이의',
  deadline_pressure: '일정 압박',
  unanswered_decisions: '결정 지연',
  missing_evidence: '근거 부족',
};

export const riskCategoryIcons: Record<RiskCategory, string> = {
  no_update: '⏸️',
  scope_change: '🔄',
  unresolved_objections: '⚠️',
  deadline_pressure: '⏰',
  unanswered_decisions: '❓',
  missing_evidence: '📎',
};
