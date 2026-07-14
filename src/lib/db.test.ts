import Dexie from 'dexie'
import { afterEach, describe, expect, it } from 'vitest'
import { sampleProject } from '../data/sample-project'
import type { MasaratProject } from '../types/masarat'
import { MasaratDatabase } from './db'

const databaseName = 'masarat-migration-test'

describe('Life OS database migration', () => {
  afterEach(async () => {
    await Dexie.delete(databaseName)
  })

  it('keeps an existing project and adds safe Life OS defaults', async () => {
    await Dexie.delete(databaseName)
    const legacy = new Dexie(databaseName)
    legacy.version(1).stores({ projects: 'project.id, project.updatedAt, project.status' })
    await legacy.open()
    const legacyProject = structuredClone(sampleProject) as MasaratProject
    delete legacyProject.project.areaId
    delete legacyProject.project.goalId
    delete legacyProject.project.projectType
    await legacy.table('projects').put(legacyProject)
    legacy.close()

    const upgraded = new MasaratDatabase(databaseName)
    await upgraded.open()
    const project = await upgraded.projects.get(legacyProject.project.id)

    expect(project?.project.areaId).toBe('area-uncategorized')
    expect(project?.project.projectType).toBe('decision')
    expect(project?.tasks).toEqual(legacyProject.tasks)
    upgraded.close()
  })
})
