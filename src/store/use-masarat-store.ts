import { create } from 'zustand'
import { sampleProject } from '../data/sample-project'
import { defaultGoals, defaultLifeAreas } from '../data/life-foundation'
import { db } from '../lib/db'
import { collectPathNodeIds, makeSnapshot, mergeProjectUpdate } from '../lib/project-utils'
import type { Language } from '../lib/i18n'
import type {
  ChangeEvent,
  Goal,
  LifeArea,
  LifePack,
  MasaratBackup,
  MasaratProject,
  Metric,
  MetricEntry,
  PlanVersion,
  ProjectMeta,
  RealityEvent,
  Review,
  Task,
} from '../types/masarat'

export type PrimaryView = 'today' | 'life' | 'goals' | 'paths' | 'global-timeline' | 'reviews' | 'settings'
export type PathView = 'path-overview' | 'canvas' | 'plan' | 'timeline' | 'versions'
export type AppView = PrimaryView | PathView

export const pathViews: PathView[] = ['path-overview', 'canvas', 'plan', 'timeline', 'versions']
export const isPathView = (view: AppView): view is PathView => pathViews.includes(view as PathView)

interface MasaratState {
  projects: MasaratProject[]
  lifeAreas: LifeArea[]
  goals: Goal[]
  metrics: Metric[]
  metricEntries: MetricEntry[]
  reviews: Review[]
  language: Language
  activeProjectId?: string
  activeAreaId?: string
  selectedNodeId?: string
  view: AppView
  isReady: boolean
  initialize: () => Promise<void>
  setView: (view: AppView) => void
  setLanguage: (language: Language) => void
  setActiveProject: (projectId: string) => void
  setActiveArea: (areaId?: string) => void
  setSelectedNode: (nodeId?: string) => void
  importProject: (project: MasaratProject, mode?: 'new' | 'update') => Promise<void>
  importLifePack: (pack: LifePack) => Promise<void>
  restoreBackup: (backup: MasaratBackup) => Promise<void>
  deleteProject: (projectId: string) => Promise<void>
  saveLifeArea: (area: LifeArea) => Promise<void>
  archiveLifeArea: (areaId: string) => Promise<void>
  saveGoal: (goal: Goal) => Promise<void>
  archiveGoal: (goalId: string) => Promise<void>
  saveReview: (review: Review) => Promise<void>
  deleteReview: (reviewId: string) => Promise<void>
  updateProjectMeta: (projectId: string, patch: Partial<ProjectMeta>) => Promise<void>
  choosePath: (optionNodeId: string) => Promise<void>
  updateTask: (taskId: string, patch: Partial<Task>) => Promise<void>
  updateProjectTask: (projectId: string, taskId: string, patch: Partial<Task>) => Promise<void>
  addRealityEvent: (event: RealityEvent) => Promise<void>
  recordChange: (change: ChangeEvent) => Promise<void>
  restoreVersion: (version: PlanVersion) => Promise<void>
}

async function persist(project: MasaratProject) {
  await db.projects.put(structuredClone(project))
}

export const useMasaratStore = create<MasaratState>((set, get) => ({
  projects: [],
  lifeAreas: [],
  goals: [],
  metrics: [],
  metricEntries: [],
  reviews: [],
  language: typeof window !== 'undefined' && window.localStorage.getItem('masarat-language') === 'en' ? 'en' : 'ar',
  view: 'today',
  isReady: false,

  initialize: async () => {
    let lifeAreas = await db.lifeAreas.orderBy('order').toArray()
    if (!lifeAreas.length) {
      await db.lifeAreas.bulkPut(defaultLifeAreas)
      lifeAreas = defaultLifeAreas
    }
    let goals = await db.goals.toArray()
    if (!goals.length) {
      await db.goals.bulkPut(defaultGoals)
      goals = defaultGoals
    }
    let projects = await db.projects.toArray()
    if (!projects.length) {
      await persist(sampleProject)
      projects = [sampleProject]
    }
    const [metrics, metricEntries, reviews] = await Promise.all([
      db.metrics.toArray(),
      db.metricEntries.toArray(),
      db.reviews.orderBy('startDate').reverse().toArray(),
    ])
    projects.sort((a, b) => b.project.updatedAt.localeCompare(a.project.updatedAt))
    set({ projects, lifeAreas, goals, metrics, metricEntries, reviews, activeProjectId: projects[0]?.project.id, isReady: true })
  },

  setView: (view) => set({ view }),
  setLanguage: (language) => {
    window.localStorage.setItem('masarat-language', language)
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    set({ language })
  },
  setActiveProject: (activeProjectId) => set({ activeProjectId, selectedNodeId: undefined }),
  setActiveArea: (activeAreaId) => set({ activeAreaId }),
  setSelectedNode: (selectedNodeId) => set({ selectedNodeId }),

  importProject: async (incoming, mode = 'new') => {
    const current = get().projects.find((item) => item.project.id === incoming.project.id)
    const project = mode === 'update' && current ? mergeProjectUpdate(current, incoming) : incoming
    await persist(project)
    set((state) => ({
      projects: [project, ...state.projects.filter((item) => item.project.id !== project.project.id)],
      activeProjectId: project.project.id,
      view: 'canvas',
      selectedNodeId: undefined,
    }))
  },

  importLifePack: async (pack) => {
    const currentProjects = new Map(get().projects.map((item) => [item.project.id, item]))
    const projects = pack.projects.map((incoming) => {
      const current = currentProjects.get(incoming.project.id)
      return current ? mergeProjectUpdate(current, incoming) : incoming
    })
    await db.transaction('rw', [db.projects, db.lifeAreas, db.goals, db.metrics, db.metricEntries, db.reviews], async () => {
      if (pack.areas.length) await db.lifeAreas.bulkPut(structuredClone(pack.areas))
      if (pack.goals.length) await db.goals.bulkPut(structuredClone(pack.goals))
      if (projects.length) await db.projects.bulkPut(structuredClone(projects))
      if (pack.metrics.length) await db.metrics.bulkPut(structuredClone(pack.metrics))
      if (pack.metricEntries?.length) await db.metricEntries.bulkPut(structuredClone(pack.metricEntries))
      if (pack.reviews?.length) await db.reviews.bulkPut(structuredClone(pack.reviews))
    })
    const [allProjects, lifeAreas, goals, metrics, metricEntries, reviews] = await Promise.all([
      db.projects.toArray(), db.lifeAreas.orderBy('order').toArray(), db.goals.toArray(), db.metrics.toArray(), db.metricEntries.toArray(), db.reviews.orderBy('startDate').reverse().toArray(),
    ])
    set({ projects: allProjects, lifeAreas, goals, metrics, metricEntries, reviews, activeProjectId: projects[0]?.project.id ?? get().activeProjectId, view: 'life' })
  },

  restoreBackup: async (backup) => {
    const data = structuredClone(backup.data)
    await db.transaction('rw', [db.projects, db.lifeAreas, db.goals, db.metrics, db.metricEntries, db.reviews], async () => {
      await Promise.all([db.projects.clear(), db.lifeAreas.clear(), db.goals.clear(), db.metrics.clear(), db.metricEntries.clear(), db.reviews.clear()])
      if (data.projects.length) await db.projects.bulkPut(data.projects)
      if (data.lifeAreas.length) await db.lifeAreas.bulkPut(data.lifeAreas)
      if (data.goals.length) await db.goals.bulkPut(data.goals)
      if (data.metrics.length) await db.metrics.bulkPut(data.metrics)
      if (data.metricEntries.length) await db.metricEntries.bulkPut(data.metricEntries)
      if (data.reviews.length) await db.reviews.bulkPut(data.reviews)
    })
    set({ ...data, activeProjectId: data.projects[0]?.project.id, selectedNodeId: undefined, view: 'today' })
  },

  deleteProject: async (projectId) => {
    await db.projects.delete(projectId)
    set((state) => {
      const projects = state.projects.filter((item) => item.project.id !== projectId)
      return { projects, activeProjectId: projects[0]?.project.id, view: 'paths' }
    })
  },

  saveLifeArea: async (area) => {
    await db.lifeAreas.put(structuredClone(area))
    set((state) => ({ lifeAreas: [...state.lifeAreas.filter((item) => item.id !== area.id), area].sort((a, b) => a.order - b.order) }))
  },

  archiveLifeArea: async (areaId) => {
    const area = get().lifeAreas.find((item) => item.id === areaId)
    if (!area || area.id === 'area-uncategorized') return
    const archived = { ...area, archived: true, updatedAt: new Date().toISOString() }
    await db.lifeAreas.put(archived)
    set((state) => ({ lifeAreas: state.lifeAreas.map((item) => item.id === areaId ? archived : item) }))
  },

  saveGoal: async (goal) => {
    await db.goals.put(structuredClone(goal))
    set((state) => ({ goals: [...state.goals.filter((item) => item.id !== goal.id), goal] }))
  },

  archiveGoal: async (goalId) => {
    const goal = get().goals.find((item) => item.id === goalId)
    if (!goal) return
    const archived = { ...goal, status: 'paused' as const, updatedAt: new Date().toISOString() }
    await db.goals.put(archived)
    set((state) => ({ goals: state.goals.map((item) => item.id === goalId ? archived : item) }))
  },

  saveReview: async (review) => {
    await db.reviews.put(structuredClone(review))
    set((state) => ({ reviews: [review, ...state.reviews.filter((item) => item.id !== review.id)].sort((a, b) => b.startDate.localeCompare(a.startDate)) }))
  },

  deleteReview: async (reviewId) => {
    await db.reviews.delete(reviewId)
    set((state) => ({ reviews: state.reviews.filter((item) => item.id !== reviewId) }))
  },

  updateProjectMeta: async (projectId, patch) => {
    const current = get().projects.find((item) => item.project.id === projectId)
    if (!current) return
    const project = { ...current, project: { ...current.project, ...patch, id: current.project.id, updatedAt: new Date().toISOString() } }
    await persist(project)
    set((state) => ({ projects: state.projects.map((item) => item.project.id === projectId ? project : item) }))
  },

  choosePath: async (optionNodeId) => {
    const current = get().projects.find((item) => item.project.id === get().activeProjectId)
    if (!current) return
    const nodeIds = collectPathNodeIds(current, optionNodeId)
    const now = new Date().toISOString()
    const project: MasaratProject = {
      ...current,
      project: { ...current.project, updatedAt: now, status: 'active' },
      nodes: current.nodes.map((node) => ({
        ...node,
        status: node.type === 'option' ? (node.id === optionNodeId ? 'selected' : 'open') : node.status,
      })),
      selectedPath: { optionNodeId, nodeIds, selectedAt: now },
    }
    await persist(project)
    set((state) => ({ projects: state.projects.map((item) => item.project.id === project.project.id ? project : item) }))
  },

  updateTask: async (taskId, patch) => {
    const projectId = get().activeProjectId
    if (!projectId) return
    await get().updateProjectTask(projectId, taskId, patch)
  },

  updateProjectTask: async (projectId, taskId, patch) => {
    const current = get().projects.find((item) => item.project.id === projectId)
    if (!current) return
    const now = new Date().toISOString()
    const project: MasaratProject = {
      ...current,
      project: { ...current.project, updatedAt: now },
      tasks: current.tasks.map((task) => task.id === taskId ? {
        ...task,
        ...patch,
        completedAt: patch.status === 'completed' ? now : patch.status ? undefined : task.completedAt,
      } : task),
    }
    await persist(project)
    set((state) => ({ projects: state.projects.map((item) => item.project.id === project.project.id ? project : item) }))
  },

  addRealityEvent: async (event) => {
    const current = get().projects.find((item) => item.project.id === get().activeProjectId)
    if (!current) return
    const project: MasaratProject = {
      ...current,
      project: { ...current.project, updatedAt: new Date().toISOString() },
      realityEvents: [event, ...current.realityEvents],
    }
    await persist(project)
    set((state) => ({ projects: state.projects.map((item) => item.project.id === project.project.id ? project : item) }))
  },

  recordChange: async (change) => {
    const current = get().projects.find((item) => item.project.id === get().activeProjectId)
    if (!current) return
    const nextVersion = current.project.currentVersion + 1
    const version: PlanVersion = {
      id: `version-${current.project.currentVersion}-${Date.now()}`,
      number: current.project.currentVersion,
      createdAt: change.date,
      reason: `قبل التغيير: ${change.title}`,
      snapshot: makeSnapshot(current),
    }
    const project: MasaratProject = {
      ...current,
      project: { ...current.project, updatedAt: change.date, currentVersion: nextVersion },
      changes: [change, ...current.changes],
      versions: [...current.versions, version],
    }
    await persist(project)
    set((state) => ({ projects: state.projects.map((item) => item.project.id === project.project.id ? project : item) }))
  },

  restoreVersion: async (version) => {
    const current = get().projects.find((item) => item.project.id === get().activeProjectId)
    if (!current) return
    const now = new Date().toISOString()
    const backup: PlanVersion = {
      id: `version-backup-${Date.now()}`,
      number: current.project.currentVersion,
      createdAt: now,
      reason: `قبل الرجوع إلى النسخة ${version.number}`,
      snapshot: makeSnapshot(current),
    }
    const snapshot = structuredClone(version.snapshot)
    const project: MasaratProject = {
      ...current,
      project: {
        ...current.project,
        goal: snapshot.goal,
        updatedAt: now,
        currentVersion: current.project.currentVersion + 1,
      },
      constraints: snapshot.constraints,
      nodes: snapshot.nodes,
      connections: snapshot.connections,
      tasks: snapshot.tasks,
      assumptions: snapshot.assumptions,
      checkpoints: snapshot.checkpoints,
      versions: [...current.versions, backup],
    }
    await persist(project)
    set((state) => ({ projects: state.projects.map((item) => item.project.id === project.project.id ? project : item) }))
  },
}))
