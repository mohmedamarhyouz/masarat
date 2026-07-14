import type {
  Goal,
  LifeArea,
  LifePack,
  LifePackDiff,
  MasaratBackup,
  MasaratProject,
  Metric,
  MetricEntry,
  Review,
} from '../types/masarat'

export interface LifeDataState {
  projects: MasaratProject[]
  lifeAreas: LifeArea[]
  goals: Goal[]
  metrics: Metric[]
  metricEntries: MetricEntry[]
  reviews: Review[]
}

export function createBackup(data: LifeDataState): MasaratBackup {
  return {
    format: 'masarat-backup',
    schemaVersion: '1.0',
    exportedAt: new Date().toISOString(),
    data: structuredClone(data),
  }
}

export function downloadJsonFile(payload: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function downloadBackup(data: LifeDataState) {
  const date = new Date().toISOString().slice(0, 10)
  downloadJsonFile(createBackup(data), `masarat-backup-${date}.json`)
}

function countDiff<T extends { id: string }>(current: T[], incoming: T[]) {
  const ids = new Set(current.map((item) => item.id))
  return {
    added: incoming.filter((item) => !ids.has(item.id)).length,
    updated: incoming.filter((item) => ids.has(item.id)).length,
  }
}

export function diffLifePack(current: LifeDataState, incoming: LifePack): LifePackDiff {
  const areas = countDiff(current.lifeAreas, incoming.areas)
  const goals = countDiff(current.goals, incoming.goals)
  const projects = countDiff(
    current.projects.map((item) => ({ id: item.project.id })),
    incoming.projects.map((item) => ({ id: item.project.id })),
  )
  const metrics = countDiff(current.metrics, incoming.metrics)
  return {
    newAreas: areas.added,
    updatedAreas: areas.updated,
    newGoals: goals.added,
    updatedGoals: goals.updated,
    newProjects: projects.added,
    updatedProjects: projects.updated,
    newMetrics: metrics.added,
    updatedMetrics: metrics.updated,
  }
}

export function linesToList(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean)
}

export function listToLines(items: string[]) {
  return items.join('\n')
}
