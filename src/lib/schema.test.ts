import { describe, expect, it } from 'vitest'
import { sampleProject } from '../data/sample-project'
import { defaultGoals, defaultLifeAreas } from '../data/life-foundation'
import { lifePackSchema, masaratBackupSchema, masaratProjectSchema } from './schema'
import { createBackup } from './life-data'

describe('Masarat 1.0 schema', () => {
  it('accepts the bundled G3 Pro project', () => {
    expect(masaratProjectSchema.safeParse(sampleProject).success).toBe(true)
  })

  it('rejects duplicate node identifiers', () => {
    const project = structuredClone(sampleProject)
    project.nodes[1].id = project.nodes[0].id
    const result = masaratProjectSchema.safeParse(project)
    expect(result.success).toBe(false)
  })

  it('rejects connections to missing nodes', () => {
    const project = structuredClone(sampleProject)
    project.connections[0].target = 'missing-node'
    const result = masaratProjectSchema.safeParse(project)
    expect(result.success).toBe(false)
  })

  it('accepts a complete Life Pack 2.0', () => {
    const pack = {
      format: 'masarat',
      schemaVersion: '2.0',
      packageType: 'life-pack',
      areas: defaultLifeAreas,
      goals: defaultGoals,
      projects: [sampleProject],
      metrics: [],
      metricEntries: [],
      reviews: [],
    }
    expect(lifePackSchema.safeParse(pack).success).toBe(true)
  })

  it('rejects a Life Pack goal linked to a missing area', () => {
    const result = lifePackSchema.safeParse({ format: 'masarat', schemaVersion: '2.0', packageType: 'life-pack', areas: [], goals: defaultGoals, projects: [], metrics: [] })
    expect(result.success).toBe(false)
  })

  it('accepts a full local backup', () => {
    const backup = createBackup({ projects: [sampleProject], lifeAreas: defaultLifeAreas, goals: defaultGoals, metrics: [], metricEntries: [], reviews: [] })
    expect(masaratBackupSchema.safeParse(backup).success).toBe(true)
  })
})
