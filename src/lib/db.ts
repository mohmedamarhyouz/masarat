import Dexie, { type Table } from 'dexie'
import type { MasaratProject } from '../types/masarat'

class MasaratDatabase extends Dexie {
  projects!: Table<MasaratProject, string>

  constructor() {
    super('masarat-local')
    this.version(1).stores({ projects: 'project.id, project.updatedAt, project.status' })
  }
}

export const db = new MasaratDatabase()
