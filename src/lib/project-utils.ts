import type { MasaratProject, ProjectDiff, ProjectSnapshot, TaskStatus } from '../types/masarat'

export const statusLabels: Record<TaskStatus, string> = {
  pending: 'لم تبدأ',
  in_progress: 'قيد التنفيذ',
  completed: 'مكتملة',
  blocked: 'متوقفة',
  cancelled: 'لم تعد ضرورية',
}

export function calculateProgress(project: MasaratProject) {
  const relevant = project.tasks.filter((task) => task.status !== 'cancelled')
  if (!relevant.length) return 0
  return Math.round((relevant.filter((task) => task.status === 'completed').length / relevant.length) * 100)
}

export function makeSnapshot(project: MasaratProject): ProjectSnapshot {
  return {
    goal: project.project.goal,
    constraints: structuredClone(project.constraints),
    nodes: structuredClone(project.nodes),
    connections: structuredClone(project.connections),
    tasks: structuredClone(project.tasks),
    assumptions: structuredClone(project.assumptions),
    checkpoints: structuredClone(project.checkpoints),
  }
}

export function collectPathNodeIds(project: MasaratProject, optionNodeId: string) {
  const selected = new Set<string>([optionNodeId])
  const visitAncestors = (nodeId: string) => {
    project.connections.filter((edge) => edge.target === nodeId).forEach((edge) => {
      if (!selected.has(edge.source)) {
        selected.add(edge.source)
        visitAncestors(edge.source)
      }
    })
  }
  const visitDescendants = (nodeId: string) => {
    project.connections.filter((edge) => edge.source === nodeId).forEach((edge) => {
      if (!selected.has(edge.target)) {
        selected.add(edge.target)
        visitDescendants(edge.target)
      }
    })
  }
  visitAncestors(optionNodeId)
  visitDescendants(optionNodeId)
  return [...selected]
}

export function diffProjects(current: MasaratProject, incoming: MasaratProject): ProjectDiff {
  const currentNodes = new Map(current.nodes.map((node) => [node.id, node]))
  const incomingNodes = new Map(incoming.nodes.map((node) => [node.id, node]))
  const currentTasks = new Map(current.tasks.map((task) => [task.id, task]))
  const incomingTasks = new Map(incoming.tasks.map((task) => [task.id, task]))
  return {
    addedNodes: incoming.nodes.filter((node) => !currentNodes.has(node.id)),
    removedNodes: current.nodes.filter((node) => !incomingNodes.has(node.id)),
    addedTasks: incoming.tasks.filter((task) => !currentTasks.has(task.id)),
    removedTasks: current.tasks.filter((task) => !incomingTasks.has(task.id)),
    changedTasks: incoming.tasks
      .filter((task) => currentTasks.has(task.id) && JSON.stringify(currentTasks.get(task.id)) !== JSON.stringify(task))
      .map((task) => ({ before: currentTasks.get(task.id)!, after: task })),
    goalChanged: current.project.goal !== incoming.project.goal,
  }
}

export function mergeProjectUpdate(current: MasaratProject, incoming: MasaratProject): MasaratProject {
  const currentTasks = new Map(current.tasks.map((task) => [task.id, task]))
  const now = new Date().toISOString()
  const nextVersion = current.project.currentVersion + 1
  return {
    ...structuredClone(incoming),
    project: {
      ...incoming.project,
      id: current.project.id,
      createdAt: current.project.createdAt,
      updatedAt: now,
      currentVersion: nextVersion,
    },
    tasks: incoming.tasks.map((task) => {
      const previous = currentTasks.get(task.id)
      if (!previous) return task
      return {
        ...task,
        status: previous.status,
        actualCost: previous.actualCost,
        notes: previous.notes,
        completedAt: previous.completedAt,
      }
    }),
    realityEvents: current.realityEvents,
    changes: current.changes,
    selectedPath: incoming.selectedPath ?? current.selectedPath,
    versions: [
      ...current.versions,
      {
        id: `version-${nextVersion}-${Date.now()}`,
        number: current.project.currentVersion,
        createdAt: now,
        reason: 'قبل استيراد تحديث خارجي',
        snapshot: makeSnapshot(current),
      },
    ],
  }
}

export function downloadProject(project: MasaratProject, suffix = '') {
  const content = JSON.stringify(project, null, 2)
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${project.project.id}${suffix}.masarat`
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadAIUpdatePackage(project: MasaratProject) {
  const payload = {
    format: 'masarat-ai-update-package',
    instructions: [
      'حدّث currentProject بناءً على أحدث change داخل الملف.',
      'أعد ملف Masarat 1.0 صالحًا فقط، دون هذا الغلاف.',
      'حافظ على كل المعرّفات الحالية للعناصر والمهام التي بقي معناها نفسه.',
      'لا تغيّر حالات المهام المكتملة أو تكاليفها وملاحظاتها.',
      'استخدم تقديرات نوعية للاحتمال والثقة، ولا تخترع نسبًا رقمية.',
    ],
    currentProject: project,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${project.project.id}-ai-update-package.json`
  link.click()
  URL.revokeObjectURL(url)
}

export function nextTaskStatus(current: TaskStatus): TaskStatus {
  if (current === 'pending') return 'in_progress'
  if (current === 'in_progress') return 'completed'
  if (current === 'completed') return 'pending'
  return 'pending'
}
