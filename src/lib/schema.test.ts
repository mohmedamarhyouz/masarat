import { describe, expect, it } from 'vitest'
import { sampleProject } from '../data/sample-project'
import { masaratProjectSchema } from './schema'

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
})
