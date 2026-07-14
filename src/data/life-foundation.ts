import type { Goal, LifeArea } from '../types/masarat'

const createdAt = '2026-07-13T20:00:00.000Z'

export const defaultLifeAreas: LifeArea[] = [
  { id: 'area-money', name: 'المال', icon: 'wallet', color: '#58ddb7', status: 'attention', order: 1, createdAt, updatedAt: createdAt },
  { id: 'area-study', name: 'الدراسة', icon: 'graduation-cap', color: '#64adff', status: 'stable', order: 2, createdAt, updatedAt: createdAt },
  { id: 'area-career', name: 'المسار المهني', icon: 'briefcase', color: '#9a83ff', status: 'stable', order: 3, createdAt, updatedAt: createdAt },
  { id: 'area-health', name: 'الصحة', icon: 'heart-pulse', color: '#ef7081', status: 'attention', order: 4, createdAt, updatedAt: createdAt },
  { id: 'area-transport', name: 'التنقل', icon: 'route', color: '#f2b957', status: 'attention', order: 5, createdAt, updatedAt: createdAt },
  { id: 'area-family', name: 'العائلة', icon: 'users', color: '#4dc8e8', status: 'stable', order: 6, createdAt, updatedAt: createdAt },
  { id: 'area-growth', name: 'التطور الشخصي', icon: 'sparkles', color: '#b47cff', status: 'stable', order: 7, createdAt, updatedAt: createdAt },
  { id: 'area-uncategorized', name: 'غير مصنف', icon: 'inbox', color: '#8290a8', status: 'stable', order: 99, createdAt, updatedAt: createdAt },
]

export const defaultGoals: Goal[] = [
  {
    id: 'goal-reliable-transport',
    areaId: 'area-transport',
    title: 'تنقل آمن ومستقر خلال سنة الدراسة',
    description: 'تقليل وقت التنقل دون استنزاف الميزانية أو التضحية بالسلامة.',
    status: 'active',
    progress: 10,
    createdAt,
    updatedAt: createdAt,
  },
]
