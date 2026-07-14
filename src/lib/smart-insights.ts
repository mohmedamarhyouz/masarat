import type { Goal, LifeArea, MasaratProject } from '../types/masarat'
import type { AppView } from '../store/use-masarat-store'

export interface SmartInsight {
  id: string
  severity: 'critical' | 'warning' | 'positive'
  title: { ar: string; en: string }
  description: { ar: string; en: string }
  view: AppView
  projectId?: string
}

export function buildSmartInsights(projects: MasaratProject[], areas: LifeArea[], goals: Goal[], now = new Date()): SmartInsight[] {
  const insights: SmartInsight[] = []
  const openTasks = projects.flatMap((project) => project.tasks.map((task) => ({ task, project }))).filter(({ task }) => !['completed', 'cancelled'].includes(task.status))
  const overdue = openTasks.filter(({ task }) => task.dueDate && new Date(task.dueDate) < now)
  const blocked = openTasks.filter(({ task }) => task.status === 'blocked')
  const overdueCheckpoints = projects.flatMap((project) => project.checkpoints.map((checkpoint) => ({ checkpoint, project }))).filter(({ checkpoint }) => checkpoint.status === 'missed' || (checkpoint.status === 'upcoming' && new Date(checkpoint.date) < now))
  const overBudget = projects.filter((project) => {
    const estimated = project.tasks.reduce((sum, task) => sum + (task.estimatedCost ?? 0), 0)
    const actual = project.tasks.reduce((sum, task) => sum + (task.actualCost ?? 0), 0) + project.realityEvents.reduce((sum, event) => sum + (event.cost ?? 0), 0)
    return estimated > 0 && actual > estimated
  })
  const stalled = projects.filter((project) => project.project.status === 'active' && !project.tasks.some((task) => ['pending', 'in_progress'].includes(task.status)))
  const lateGoals = goals.filter((goal) => goal.status === 'active' && goal.targetDate && new Date(goal.targetDate) < now && goal.progress < 100)
  const criticalAreas = areas.filter((area) => !area.archived && area.status === 'critical')

  if (overdue.length) insights.push({ id: 'overdue', severity: 'critical', title: { ar: `${overdue.length} مهام متأخرة`, en: `${overdue.length} overdue tasks` }, description: { ar: 'المواعيد تجاوزت تاريخها وتحتاج إعادة ترتيب أو تنفيذًا مباشرًا.', en: 'Their deadlines have passed. Reschedule them or act now.' }, view: 'today', projectId: overdue[0].project.project.id })
  if (blocked.length) insights.push({ id: 'blocked', severity: 'warning', title: { ar: `${blocked.length} مهام متوقفة`, en: `${blocked.length} blocked tasks` }, description: { ar: 'حدد سبب التوقف أو أضف خطوة صغيرة لإزالة العائق.', en: 'Identify the blocker or create one small action to remove it.' }, view: 'today', projectId: blocked[0].project.project.id })
  if (overdueCheckpoints.length) insights.push({ id: 'checkpoints', severity: 'critical', title: { ar: 'مراجعة قرار متأخرة', en: 'Decision review overdue' }, description: { ar: 'توجد نقطة مراجعة تجاوزت موعدها؛ قارن المتوقع بما حدث.', en: 'A checkpoint has passed. Compare the expected outcome with reality.' }, view: 'timeline', projectId: overdueCheckpoints[0].project.project.id })
  if (overBudget.length) insights.push({ id: 'budget', severity: 'warning', title: { ar: 'تكلفة فعلية أعلى من المتوقع', en: 'Actual cost exceeds estimate' }, description: { ar: 'راجع المصروفات المسجلة قبل الالتزام بخطوة مالية جديدة.', en: 'Review recorded spending before making another financial commitment.' }, view: 'path-overview', projectId: overBudget[0].project.id })
  if (stalled.length) insights.push({ id: 'stalled', severity: 'warning', title: { ar: 'مسار نشط بلا خطوة تالية', en: 'Active path has no next action' }, description: { ar: 'المسار قد يتوقف بصمت. أضف مهمة أو سجّل النتيجة النهائية.', en: 'The path may silently stall. Add a task or record its final outcome.' }, view: 'path-overview', projectId: stalled[0].project.id })
  if (lateGoals.length) insights.push({ id: 'late-goal', severity: 'warning', title: { ar: 'هدف تجاوز موعده', en: 'Goal passed its target date' }, description: { ar: 'حدّث الموعد أو التقدم أو أوقف الهدف بقرار واعٍ.', en: 'Update its date or progress, or consciously pause it.' }, view: 'goals' })
  if (criticalAreas.length) insights.push({ id: 'critical-area', severity: 'critical', title: { ar: `${criticalAreas[0].name} يحتاج تدخّلًا`, en: `${criticalAreas[0].name} needs intervention` }, description: { ar: 'حوّل حالة المجال الحرجة إلى هدف أو مسار واضح.', en: 'Turn this critical area into a clear goal or path.' }, view: 'life' })
  if (!insights.length) insights.push({ id: 'balanced', severity: 'positive', title: { ar: 'الوضع متوازن حاليًا', en: 'Your system is balanced' }, description: { ar: 'لا توجد إشارات حرجة. استمر في الخطوة التالية وسجّل الواقع.', en: 'No critical signals. Continue the next action and record reality.' }, view: 'today' })
  return insights
}
