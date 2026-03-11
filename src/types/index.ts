export type ProjectType = 'website' | 'app' | 'admin' | 'ecommerce' | 'saas' | 'other';
export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
export type RiskLevel = 'low' | 'medium' | 'high';
export type ConfirmAction = 'confirmed' | 'question' | 'objection';
export type UpdateSource = 'manual' | 'file_upload' | 'integration';
export type DecisionStatus = 'pending' | 'resolved';
export type RiskStatus = 'active' | 'monitoring' | 'resolved';
export type ScopePriority = 'must_have' | 'should_have' | 'nice_to_have';

export interface Project {
  id: string;
  name: string;
  clientCompany: string;
  agencyName: string;
  type: ProjectType;
  startDate: string;
  targetLaunchDate: string;
  status: ProjectStatus;
  summary: string;
  completionPercent: number;
  totalUpdates: number;
  pendingDecisions: number;
  unresolvedIssues: number;
  activeRisks: number;
}

export interface ScopeDocument {
  id: string;
  projectId: string;
  goal: string;
  targetUsers: string;
  requiredFeatures: ScopeItem[];
  optionalFeatures: ScopeItem[];
  excludedFeatures: ScopeItem[];
  budgetRange: string;
  timelineExpectation: string;
  references: string;
  specialNotes: string;
  createdAt: string;
}

export interface ScopeItem {
  id: string;
  title: string;
  description: string;
  priority: ScopePriority;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  date: string;
  source: UpdateSource;
  relatedModule: string;
  rawNote: string;
  author: string;
  authorRole: 'client' | 'agency';
  status: 'new' | 'reviewed' | 'confirmed';
  evidenceCount: number;
}

export interface AISummary {
  id: string;
  updateId: string;
  projectId: string;
  whatChanged: string;
  whyItMatters: string;
  whatIsFinished: string;
  whatIsPending: string;
  whatToDecide: string;
  riskLevel: RiskLevel;
  recommendedAction: string;
  confidenceNote?: string;
  createdAt: string;
}

export interface Confirmation {
  id: string;
  summaryId: string;
  projectId: string;
  userId: string;
  userName: string;
  action: ConfirmAction;
  comment?: string;
  timestamp: string;
  resolved: boolean;
}

export type RiskCategory =
  | 'no_update'
  | 'scope_change'
  | 'unresolved_objections'
  | 'deadline_pressure'
  | 'unanswered_decisions'
  | 'missing_evidence';

export interface Risk {
  id: string;
  projectId: string;
  title: string;
  reason: string;
  severity: RiskLevel;
  category: RiskCategory;
  affectedArea: string;
  suggestedAction: string;
  status: RiskStatus;
  detectedAt: string;
  createdAt: string;
}

export interface DecisionItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  status: DecisionStatus;
  resolvedAt?: string;
  resolvedBy?: string;
}
