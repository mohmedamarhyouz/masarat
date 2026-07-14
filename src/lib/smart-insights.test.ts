import { describe, expect, it } from 'vitest'
import { sampleProject } from '../data/sample-project'
import { defaultGoals, defaultLifeAreas } from '../data/life-foundation'
import { buildSmartInsights } from './smart-insights'

describe('offline smart insights', () => {
  it('returns a balanced state when no attention rule is triggered', () => {
    const project = structuredClone(sampleProject)
    project.project.status = 'completed'
    project.tasks = project.tasks.map((task) => ({ ...task, status: 'completed', dueDate: undefined }))
    project.checkpoints = project.checkpoints.map((checkpoint) => ({ ...checkpoint, status: 'completed' }))
    const areas = defaultLifeAreas.map((area) => ({ ...area, status: 'stable' as const }))
    const goals = defaultGoals.map((goal) => ({ ...goal, status: 'completed' as const, progress: 100, targetDate: undefined }))

    expect(buildSmartInsights([project], areas, goals, new Date('2026-07-14')).map((item) => item.id)).toEqual(['balanced'])
  })

  it('detects overdue, blocked, over-budget, and checkpoint signals', () => {
    const project = structuredClone(sampleProject)
    project.tasks = project.tasks.map((task) => ({ ...task, estimatedCost: 0, actualCost: 0 }))
    project.realityEvents = project.realityEvents.map((event) => ({ ...event, cost: 0 }))
    project.tasks[0] = { ...project.tasks[0], status: 'blocked', dueDate: '2026-01-01', estimatedCost: 10, actualCost: 50 }
    project.checkpoints[0] = { ...project.checkpoints[0], status: 'missed', date: '2026-01-02' }

    const ids = buildSmartInsights([project], defaultLifeAreas, defaultGoals, new Date('2026-07-14')).map((item) => item.id)
    expect(ids).toEqual(expect.arrayContaining(['overdue', 'blocked', 'checkpoints', 'budget']))
  })
})
