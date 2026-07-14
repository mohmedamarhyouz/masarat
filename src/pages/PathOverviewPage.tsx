import { AlertTriangle, ArrowLeft, CheckCircle2, GitBranch, ListChecks, Radio, ShieldCheck, Target } from 'lucide-react'
import { calculateProgress } from '../lib/project-utils'
import { useI18n } from '../lib/i18n'
import { useMasaratStore } from '../store/use-masarat-store'
import type { MasaratProject } from '../types/masarat'

export function PathOverviewPage({ project }: { project: MasaratProject }) {
  const { language } = useI18n()
  const c = language === 'ar' ? { decision: 'مسار قرار', progress: 'تقدم المسار', goal: 'الهدف', execution: 'التنفيذ', of: 'من', completed: 'مهام مكتملة', risks: 'المخاطر', documented: 'مخاطر موثقة', reality: 'الواقع', events: 'أحداث فعلية', next: 'الخطوة التالية', review: 'حان وقت مراجعة النتيجة', reviewText: 'لا توجد مهام مفتوحة. سجّل ما حدث فعليًا واستخلص الدرس.', openExecution: 'فتح التنفيذ', map: 'رؤية الخريطة', context: 'سياق القرار', area: 'مجال الحياة', linkedGoal: 'الهدف المرتبط', noGoal: 'دون هدف', why: 'لماذا هذا المسار؟', constraints: 'القيود الأساسية', explore: 'استكشف الفروع والسيناريوهات' } : { decision: 'Decision path', progress: 'Path progress', goal: 'Goal', execution: 'Execution', of: 'of', completed: 'tasks completed', risks: 'Risks', documented: 'documented risks', reality: 'Reality', events: 'real events', next: 'NEXT ACTION', review: 'It is time to review the outcome', reviewText: 'There are no open tasks. Record what really happened and preserve the lesson.', openExecution: 'Open execution', map: 'View map', context: 'Decision context', area: 'Life area', linkedGoal: 'Linked goal', noGoal: 'No goal', why: 'Why this path?', constraints: 'Key constraints', explore: 'Explore branches and scenarios' }
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
        <div><span className="hero-badge"><GitBranch size={14} /> {area?.name ?? c.decision}</span><h2>{project.project.title}</h2><p>{project.project.description}</p></div>
        <div className="path-score" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}><span><strong>{progress}%</strong><small>{c.progress}</small></span></div>
      </section>
      <div className="path-summary-grid">
        <article><span className="summary-icon summary-icon--blue"><Target size={19} /></span><small>{c.goal}</small><strong>{goal?.title ?? project.project.goal}</strong></article>
        <article><span className="summary-icon summary-icon--green"><CheckCircle2 size={19} /></span><small>{c.execution}</small><strong>{completedTasks} {c.of} {project.tasks.length} {c.completed}</strong></article>
        <article><span className="summary-icon summary-icon--red"><AlertTriangle size={19} /></span><small>{c.risks}</small><strong>{risks.length} {c.documented}</strong></article>
        <article><span className="summary-icon summary-icon--violet"><Radio size={19} /></span><small>{c.reality}</small><strong>{project.realityEvents.length} {c.events}</strong></article>
      </div>
      <div className="path-overview-layout">
        <section className="next-action-card"><span className="eyebrow">{c.next}</span><h3>{nextTask?.title ?? c.review}</h3><p>{nextTask?.description ?? c.reviewText}</p><div>{nextTask && <button className="button button--primary" onClick={() => setView('plan')}><ListChecks size={17} /> {c.openExecution}</button>}<button className="button button--ghost" onClick={() => setView('canvas')}><GitBranch size={17} /> {c.map}</button></div></section>
        <aside className="decision-context"><h3><ShieldCheck size={18} /> {c.context}</h3><div className="path-link-fields"><label><small>{c.area}</small><select value={project.project.areaId ?? 'area-uncategorized'} onChange={(event) => updateProjectMeta(project.project.id, { areaId: event.target.value, goalId: undefined })}>{lifeAreas.filter((item) => !item.archived).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label><small>{c.linkedGoal}</small><select value={project.project.goalId ?? ''} onChange={(event) => updateProjectMeta(project.project.id, { goalId: event.target.value || undefined })}><option value="">{c.noGoal}</option>{goals.filter((item) => item.areaId === (project.project.areaId ?? 'area-uncategorized')).map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label></div><div><small>{c.why}</small><p>{project.project.goal}</p></div><div><small>{c.constraints}</small><ul>{project.constraints.slice(0, 4).map((constraint) => <li key={constraint.id}>{constraint.title}</li>)}</ul></div><button className="text-action" onClick={() => setView('canvas')}>{c.explore} <ArrowLeft size={14} /></button></aside>
      </div>
    </div>
  )
}
