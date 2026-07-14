export const NODE_TYPES = [
  'situation',
  'goal',
  'decision',
  'option',
  'task',
  'scenario',
  'risk',
  'checkpoint',
  'change',
  'outcome',
  'lesson',
] as const

export type NodeType = (typeof NODE_TYPES)[number]
export type ProjectStatus = 'exploring' | 'active' | 'paused' | 'completed'
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled'
export type Priority = 'low' | 'medium' | 'high'
export type QualitativeLevel = 'low' | 'medium' | 'high' | 'unknown'
export type ProjectType = 'decision' | 'project' | 'experiment'

export interface LifeArea {
  id: string
  name: string
  icon: string
  color: string
  status: 'stable' | 'attention' | 'critical'
  order: number
  createdAt: string
  updatedAt: string
  archived?: boolean
}

export interface Goal {
  id: string
  areaId: string
  title: string
  description?: string
  status: 'planned' | 'active' | 'paused' | 'completed'
  targetDate?: string
  progress: number
  createdAt: string
  updatedAt: string
}

export interface Metric {
  id: string
  areaId: string
  name: string
  unit: string
  target?: number
}

export interface MetricEntry {
  id: string
  metricId: string
  date: string
  value: number
  note?: string
}

export interface Review {
  id: string
  type: 'weekly' | 'monthly' | 'yearly'
  startDate: string
  summary: string
  wins: string[]
  problems: string[]
  nextFocus: string[]
  createdAt?: string
  updatedAt?: string
}

export interface ProjectMeta {
  id: string
  title: string
  description: string
  goal: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
  currentVersion: number
  areaId?: string
  goalId?: string
  projectType?: ProjectType
}

export interface Constraint {
  id: string
  title: string
  description?: string
  category: 'financial' | 'time' | 'safety' | 'personal' | 'technical' | 'other'
}

export interface Impact {
  financial: QualitativeLevel
  time: QualitativeLevel
  emotional: QualitativeLevel
}

export interface MasaratNode {
  id: string
  type: NodeType
  title: string
  description?: string
  stage: number
  probability?: QualitativeLevel
  confidence?: QualitativeLevel
  impact?: Impact
  bestCase?: string
  worstCase?: string
  mitigation?: string
  earlySignals?: string[]
  status?: 'open' | 'selected' | 'dismissed' | 'occurred'
}

export interface Connection {
  id: string
  source: string
  target: string
  label?: string
  condition?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  dueDate?: string
  relatedNodeId?: string
  estimatedCost?: number
  actualCost?: number
  notes?: string
  completedAt?: string
}

export interface Assumption {
  id: string
  title: string
  status: 'unverified' | 'verified' | 'invalid'
  verificationTaskId?: string
}

export interface Checkpoint {
  id: string
  title: string
  date: string
  criteria: string[]
  status: 'upcoming' | 'completed' | 'missed'
}

export interface RealityEvent {
  id: string
  date: string
  type: 'observation' | 'expense' | 'result' | 'note'
  title: string
  description?: string
  cost?: number
  relatedNodeId?: string
}

export interface ChangeEvent {
  id: string
  date: string
  category: 'budget' | 'time' | 'goal' | 'housing' | 'work-study' | 'new-info' | 'unexpected' | 'opinion'
  title: string
  description: string
  affectedNodeIds: string[]
}

export interface ProjectSnapshot {
  goal: string
  constraints: Constraint[]
  nodes: MasaratNode[]
  connections: Connection[]
  tasks: Task[]
  assumptions: Assumption[]
  checkpoints: Checkpoint[]
}

export interface PlanVersion {
  id: string
  number: number
  createdAt: string
  reason: string
  snapshot: ProjectSnapshot
}

export interface SelectedPath {
  optionNodeId: string
  nodeIds: string[]
  selectedAt: string
}

export interface MasaratProject {
  format: 'masarat'
  schemaVersion: '1.0'
  project: ProjectMeta
  constraints: Constraint[]
  nodes: MasaratNode[]
  connections: Connection[]
  tasks: Task[]
  assumptions: Assumption[]
  checkpoints: Checkpoint[]
  realityEvents: RealityEvent[]
  changes: ChangeEvent[]
  versions: PlanVersion[]
  selectedPath?: SelectedPath
}

export interface ProjectDiff {
  addedNodes: MasaratNode[]
  removedNodes: MasaratNode[]
  addedTasks: Task[]
  removedTasks: Task[]
  changedTasks: Array<{ before: Task; after: Task }>
  goalChanged: boolean
}

export interface LifePack {
  format: 'masarat'
  schemaVersion: '2.0'
  packageType: 'life-pack'
  title?: string
  exportedAt?: string
  areas: LifeArea[]
  goals: Goal[]
  projects: MasaratProject[]
  metrics: Metric[]
  metricEntries?: MetricEntry[]
  reviews?: Review[]
}

export interface MasaratBackup {
  format: 'masarat-backup'
  schemaVersion: '1.0'
  exportedAt: string
  data: {
    projects: MasaratProject[]
    lifeAreas: LifeArea[]
    goals: Goal[]
    metrics: Metric[]
    metricEntries: MetricEntry[]
    reviews: Review[]
  }
}

export interface LifePackDiff {
  newAreas: number
  updatedAreas: number
  newGoals: number
  updatedGoals: number
  newProjects: number
  updatedProjects: number
  newMetrics: number
  updatedMetrics: number
}
