import { useMemo, useState } from 'react'
import { AlertCircle, CalendarCheck2, Check, CheckCircle2, ChevronDown, Circle, CircleDot, Coins, Gauge, ListFilter, Play, ShieldQuestion } from 'lucide-react'
import { calculateProgress, nextTaskStatus, statusLabels } from '../lib/project-utils'
import { useMasaratStore } from '../store/use-masarat-store'
import type { MasaratProject, TaskStatus } from '../types/masarat'

const statusIcon = {
  pending: Circle,
  in_progress: Play,
  completed: Check,
  blocked: AlertCircle,
  cancelled: CircleDot,
}

export function PlanPage({ project }: { project: MasaratProject }) {
  const { updateTask } = useMasaratStore()
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all')
  const [expanded, setExpanded] = useState<string>()
  const progress = calculateProgress(project)
  const tasks = useMemo(() => filter === 'all' ? project.tasks : project.tasks.filter((task) => task.status === filter), [filter, project.tasks])
  const nextTask = project.tasks.find((task) => task.status === 'in_progress') ?? project.tasks.find((task) => task.status === 'pending')
  const totalActual = project.tasks.reduce((sum, task) => sum + (task.actualCost ?? 0), 0)
  const totalEstimated = project.tasks.reduce((sum, task) => sum + (task.estimatedCost ?? 0), 0)

  return (
    <div className="page page--plan">
      <section className="execution-hero">
        <div className="execution-hero__copy"><span className="eyebrow">الآن، خطوة واحدة فقط</span><h2>{nextTask?.title ?? 'أنجزت كل المهام الحالية'}</h2><p>{nextTask?.description ?? 'يمكنك تسجيل النتيجة الفعلية أو مراجعة الخطة.'}</p></div>
        {nextTask && <button className="button button--primary" onClick={() => updateTask(nextTask.id, { status: nextTaskStatus(nextTask.status) })}><Play size={17} /> {nextTask.status === 'in_progress' ? 'وضع علامة مكتملة' : 'ابدأ الآن'}</button>}
        <div className="hero-progress"><div className="hero-progress__ring" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}><span>{progress}%</span></div><small>تقدم الخطة</small></div>
      </section>

      <section className="execution-stats">
        <div><span className="stat-icon stat-icon--blue"><Gauge size={19} /></span><p><small>قيد التنفيذ</small><strong>{project.tasks.filter((task) => task.status === 'in_progress').length}</strong></p></div>
        <div><span className="stat-icon stat-icon--green"><CheckCircle2 size={19} /></span><p><small>مكتملة</small><strong>{project.tasks.filter((task) => task.status === 'completed').length}</strong></p></div>
        <div><span className="stat-icon stat-icon--amber"><Coins size={19} /></span><p><small>الكلفة الفعلية</small><strong>{totalActual.toLocaleString('ar-MA')} د.م.</strong></p><em>من {totalEstimated.toLocaleString('ar-MA')}</em></div>
      </section>

      <div className="plan-layout">
        <section className="tasks-panel">
          <div className="panel-heading"><div><span className="eyebrow">قائمة التنفيذ</span><h3>المهام</h3></div><div className="task-filter"><ListFilter size={15} /><select value={filter} onChange={(event) => setFilter(event.target.value as TaskStatus | 'all')}><option value="all">كل المهام</option><option value="pending">لم تبدأ</option><option value="in_progress">قيد التنفيذ</option><option value="completed">مكتملة</option><option value="blocked">متوقفة</option></select></div></div>
          <div className="task-list">
            {tasks.map((task) => {
              const Icon = statusIcon[task.status]
              const isExpanded = expanded === task.id
              return (
                <article className={`task-row task-row--${task.status}`} key={task.id}>
                  <button className="task-status-button" onClick={() => updateTask(task.id, { status: nextTaskStatus(task.status) })} title="تغيير حالة المهمة"><Icon size={17} /></button>
                  <button className="task-row__main" onClick={() => setExpanded(isExpanded ? undefined : task.id)}>
                    <span className={`priority-dot priority-dot--${task.priority}`} />
                    <div><strong>{task.title}</strong><small>{statusLabels[task.status]}{task.dueDate ? ` · ${new Date(task.dueDate).toLocaleDateString('ar-MA')}` : ''}</small></div>
                    <ChevronDown size={17} className={isExpanded ? 'rotate' : ''} />
                  </button>
                  {isExpanded && (
                    <div className="task-row__details">
                      {task.description && <p>{task.description}</p>}
                      <div className="task-fields">
                        <label>الكلفة الفعلية<input type="number" min="0" defaultValue={task.actualCost ?? ''} placeholder="0 د.م." onBlur={(event) => updateTask(task.id, { actualCost: event.target.value ? Number(event.target.value) : undefined })} /></label>
                        <label>الحالة<select value={task.status} onChange={(event) => updateTask(task.id, { status: event.target.value as TaskStatus })}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                      </div>
                      <label className="notes-field">ملاحظاتك<textarea defaultValue={task.notes ?? ''} placeholder="ماذا حدث؟ ماذا تحتاج؟" onBlur={(event) => updateTask(task.id, { notes: event.target.value })} rows={2} /></label>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        <aside className="plan-sidebar">
          <section className="side-card"><div className="side-card__heading"><ShieldQuestion size={18} /><div><span className="eyebrow">تحقق منها</span><h3>الافتراضات</h3></div></div><div className="assumptions-list">{project.assumptions.map((item) => <div key={item.id}><span className={`assumption-state assumption-state--${item.status}`} /> <p>{item.title}<small>{item.status === 'verified' ? 'تم التحقق' : item.status === 'invalid' ? 'غير صحيح' : 'غير مؤكد بعد'}</small></p></div>)}</div></section>
          <section className="side-card"><div className="side-card__heading"><CalendarCheck2 size={18} /><div><span className="eyebrow">لا تتجاوزها</span><h3>نقاط المراجعة</h3></div></div><div className="checkpoints-list">{project.checkpoints.map((point) => <article key={point.id}><time>{new Date(point.date).toLocaleDateString('ar-MA', { day: 'numeric', month: 'short' })}</time><div><strong>{point.title}</strong><small>{point.criteria.length} معايير للقرار</small></div></article>)}</div></section>
        </aside>
      </div>
    </div>
  )
}
