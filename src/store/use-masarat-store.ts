import { create } from 'zustand'
import { sampleProject } from '../data/sample-project'
import { db } from '../lib/db'
import { collectPathNodeIds, makeSnapshot, mergeProjectUpdate } from '../lib/project-utils'
import type {
  ChangeEvent,
  MasaratProject,
  PlanVersion,
  RealityEvent,
  Task,
} from '../types/masarat'

export type AppView = 'dashboard' | 'canvas' | 'plan' | 'timeline' | 'versions'

interface MasaratState {
  projects: MasaratProject[]
  activeProjectId?: string
  selectedNodeId?: string
  view: AppView
  isReady: boolean
  initialize: () => Promise<void>
  setView: (view: AppView) => void
  setActiveProject: (projectId: string) => void
  setSelectedNode: (nodeId?: string) => void
  importProject: (project: MasaratProject, mode?: 'new' | 'update') => Promise<void>
  deleteProject: (projectId: string) => Promise<void>
  choosePath: (optionNodeId: string) => Promise<void>
  updateTask: (taskId: string, patch: Partial<Task>) => Promise<void>
  addRealityEvent: (event: RealityEvent) => Promise<void>
  recordChange: (change: ChangeEvent) => Promise<void>
  restoreVersion: (version: PlanVersion) => Promise<void>
}

async function persist(project: MasaratProject) {
  await db.projects.put(structuredClone(project))
}

export const useMasaratStore = create<MasaratState>((set, get) => ({
  projects: [],
  view: 'dashboard',
  isReady: false,

  initialize: async () => {
    let projects = await db.projects.toArray()
    if (!projects.length) {
      await persist(sampleProject)
      projects = [sampleProject]
    }
    projects.sort((a, b) => b.project.updatedAt.localeCompare(a.project.updatedAt))
    set({ projects, activeProjectId: projects[0]?.project.id, isReady: true })
  },

  setView: (view) => set({ view }),
  setActiveProject: (activeProjectId) => set({ activeProjectId, selectedNodeId: undefined }),
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

  deleteProject: async (projectId) => {
    await db.projects.delete(projectId)
    set((state) => {
      const projects = state.projects.filter((item) => item.project.id !== projectId)
      return { projects, activeProjectId: projects[0]?.project.id, view: 'dashboard' }
    })
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
    const current = get().projects.find((item) => item.project.id === get().activeProjectId)
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
