import { describe, expect, it } from 'vitest'
import { sampleProject } from '../data/sample-project'
import { calculateProgress, collectPathNodeIds, diffProjects, mergeProjectUpdate } from './project-utils'

describe('project utilities', () => {
  it('calculates progress while excluding cancelled tasks', () => {
    const project = structuredClone(sampleProject)
    project.tasks[0].status = 'completed'
    project.tasks[1].status = 'cancelled'
    expect(calculateProgress(project)).toBe(17)
  })

  it('collects ancestors and descendants for a selected option', () => {
    const ids = collectPathNodeIds(sampleProject, 'option-delay')
    expect(ids).toContain('current-state')
    expect(ids).toContain('transport-decision')
    expect(ids).toContain('scenario-wait')
    expect(ids).not.toContain('option-trial')
  })

  it('preserves local task progress during an imported update', () => {
    const current = structuredClone(sampleProject)
    current.tasks[0].status = 'completed'
    current.tasks[0].actualCost = 120
    current.tasks[0].notes = 'تمت المهمة'
    const incoming = structuredClone(sampleProject)
    incoming.tasks[0].title = 'تأكيد السعر والضمان كتابةً'
    incoming.tasks[0].status = 'pending'
    const merged = mergeProjectUpdate(current, incoming)
    expect(merged.tasks[0]).toMatchObject({
      title: 'تأكيد السعر والضمان كتابةً',
      status: 'completed',
      actualCost: 120,
      notes: 'تمت المهمة',
    })
    expect(merged.project.currentVersion).toBe(2)
    expect(merged.versions).toHaveLength(1)
  })

  it('reports structural differences before importing an update', () => {
    const incoming = structuredClone(sampleProject)
    incoming.nodes = incoming.nodes.filter((node) => node.id !== 'option-mixed')
    incoming.tasks.push({ id: 'new-task', title: 'مهمة جديدة', status: 'pending', priority: 'medium' })
    const diff = diffProjects(sampleProject, incoming)
    expect(diff.removedNodes.map((node) => node.id)).toContain('option-mixed')
    expect(diff.addedTasks.map((task) => task.id)).toContain('new-task')
  })
})
