import { AlertTriangle, ArrowLeft, CheckCircle2, GitBranch, ListChecks, Radio, ShieldCheck, Target } from 'lucide-react'
import { calculateProgress } from '../lib/project-utils'
import { useMasaratStore } from '../store/use-masarat-store'
import type { MasaratProject } from '../types/masarat'

export function PathOverviewPage({ project }: { project: MasaratProject }) {
  const { lifeAreas, goals, setView, updateProjectMeta } = useMasaratStore()
  const progress = calculateProgress(project)
  const area = lifeAreas.find((item) => item.id === project.project.areaId)
  const goal = goals.find((item) => item.id === project.project.goalId)
  const nextTask = project.tasks.find((task) => task.status === 'in_progress') ?? project.tasks.find((task) => task.status === 'pending')
  const risks = project.nodes.filter((node) => node.type === 'risk')
  const completedTasks = project.tasks.filter((task) => task.status === 'completed').length

  return (
    <div className="page path-overview-page">
      <section className="path-overview-hero">
        <div><span className="hero-badge"><GitBranch size={14} /> {area?.name ?? 'مسار قرار'}</span><h2>{project.project.title}</h2><p>{project.project.description}</p></div>
        <div className="path-score" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}><span><strong>{progress}%</strong><small>تقدم المسار</small></span></div>
      </section>
      <div className="path-summary-grid">
        <article><span className="summary-icon summary-icon--blue"><Target size={19} /></span><small>الهدف</small><strong>{goal?.title ?? project.project.goal}</strong></article>
        <article><span className="summary-icon summary-icon--green"><CheckCircle2 size={19} /></span><small>التنفيذ</small><strong>{completedTasks} من {project.tasks.length} مهام مكتملة</strong></article>
        <article><span className="summary-icon summary-icon--red"><AlertTriangle size={19} /></span><small>المخاطر</small><strong>{risks.length} مخاطر موثقة</strong></article>
        <article><span className="summary-icon summary-icon--violet"><Radio size={19} /></span><small>الواقع</small><strong>{project.realityEvents.length} أحداث فعلية</strong></article>
      </div>
      <div className="path-overview-layout">
        <section className="next-action-card"><span className="eyebrow">الخطوة التالية</span><h3>{nextTask?.title ?? 'حان وقت مراجعة النتيجة'}</h3><p>{nextTask?.description ?? 'لا توجد مهام مفتوحة. سجّل ما حدث فعليًا واستخلص الدرس.'}</p><div>{nextTask && <button className="button button--primary" onClick={() => setView('plan')}><ListChecks size={17} /> فتح التنفيذ</button>}<button className="button button--ghost" onClick={() => setView('canvas')}><GitBranch size={17} /> رؤية الخريطة</button></div></section>
        <aside className="decision-context"><h3><ShieldCheck size={18} /> سياق القرار</h3><div className="path-link-fields"><label><small>مجال الحياة</small><select value={project.project.areaId ?? 'area-uncategorized'} onChange={(event) => updateProjectMeta(project.project.id, { areaId: event.target.value, goalId: undefined })}>{lifeAreas.filter((item) => !item.archived).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label><small>الهدف المرتبط</small><select value={project.project.goalId ?? ''} onChange={(event) => updateProjectMeta(project.project.id, { goalId: event.target.value || undefined })}><option value="">دون هدف</option>{goals.filter((item) => item.areaId === (project.project.areaId ?? 'area-uncategorized')).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label></div><div><small>لماذا هذا المسار؟</small><p>{project.project.goal}</p></div><div><small>القيود الأساسية</small><ul>{project.constraints.slice(0, 4).map((constraint) => <li key={constraint.id}>{constraint.title}</li>)}</ul></div><button className="text-action" onClick={() => setView('canvas')}>استكشف الفروع والسيناريوهات <ArrowLeft size={14} /></button></aside>
      </div>
    </div>
  )
}
