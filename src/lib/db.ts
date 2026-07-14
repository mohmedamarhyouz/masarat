import Dexie, { type Table } from 'dexie'
import type { Goal, LifeArea, MasaratProject, Metric, MetricEntry, Review } from '../types/masarat'

export class MasaratDatabase extends Dexie {
  projects!: Table<MasaratProject, string>
  lifeAreas!: Table<LifeArea, string>
  goals!: Table<Goal, string>
  metrics!: Table<Metric, string>
  metricEntries!: Table<MetricEntry, string>
  reviews!: Table<Review, string>

  constructor(name = 'masarat-local') {
    super(name)
    this.version(1).stores({ projects: 'project.id, project.updatedAt, project.status' })
    this.version(2).stores({
      projects: 'project.id, project.updatedAt, project.status, project.areaId, project.goalId, project.projectType',
      lifeAreas: 'id, order, status',
      goals: 'id, areaId, status, targetDate',
      metrics: 'id, areaId',
      metricEntries: 'id, metricId, date',
      reviews: 'id, type, startDate',
    }).upgrade(async (transaction) => {
      await transaction.table<MasaratProject, string>('projects').toCollection().modify((project) => {
        project.project.areaId ??= 'area-uncategorized'
        project.project.projectType ??= 'decision'
      })
    })
  }
}

export const db = new MasaratDatabase()
