import { describe, expect, it } from 'vitest'
import { defaultGoals, defaultLifeAreas } from '../data/life-foundation'
import { sampleProject } from '../data/sample-project'
import type { LifePack } from '../types/masarat'
import { createBackup, diffLifePack, linesToList } from './life-data'

const state = { projects: [sampleProject], lifeAreas: defaultLifeAreas, goals: defaultGoals, metrics: [], metricEntries: [], reviews: [] }

describe('Life OS data packages', () => {
  it('creates a complete portable backup', () => {
    const backup = createBackup(state)
    expect(backup.format).toBe('masarat-backup')
    expect(backup.data.projects).toHaveLength(1)
    expect(backup.data.lifeAreas).toHaveLength(defaultLifeAreas.length)
  })

  it('previews new and updated Life Pack entities by stable id', () => {
    const pack: LifePack = { format: 'masarat', schemaVersion: '2.0', packageType: 'life-pack', areas: [...defaultLifeAreas, { ...defaultLifeAreas[0], id: 'area-new' }], goals: defaultGoals, projects: [sampleProject], metrics: [] }
    const diff = diffLifePack(state, pack)
    expect(diff.newAreas).toBe(1)
    expect(diff.updatedAreas).toBe(defaultLifeAreas.length)
    expect(diff.updatedProjects).toBe(1)
  })

  it('normalizes multiline review fields', () => {
    expect(linesToList(' first \n\n second ')).toEqual(['first', 'second'])
  })
})
