import { CheckCircle2, CircleDollarSign, Clock3, GitCommitHorizontal, NotebookPen } from 'lucide-react'
import { useI18n } from '../lib/i18n'
import { useMasaratStore } from '../store/use-masarat-store'

type TimelineItem = { id: string; date: string; title: string; projectTitle: string; kind: 'task' | 'reality' | 'change'; detail?: string; cost?: number }

export function GlobalTimelinePage() {
  const { language, locale } = useI18n()
  const c = language === 'ar' ? { eyebrow: 'ذاكرة لا تفقد السياق', title: 'ما حدث وتغيّر', intro: 'سجل واحد يجمع التنفيذ والمصاريف والنتائج والتغييرات من جميع المسارات.', event: 'حدثًا مسجلًا', completed: 'مهمة مكتملة', empty: 'سيبدأ خطك الزمني مع أول خطوة', emptyText: 'إكمال مهمة أو تسجيل نتيجة أو تغيير سيظهر هنا تلقائيًا.', currency: 'د.م.' } : { eyebrow: 'MEMORY THAT KEEPS CONTEXT', title: 'What happened and changed', intro: 'One chronological record of execution, expenses, outcomes and changes across every path.', event: 'recorded events', completed: 'Completed task', empty: 'Your timeline starts with the first action', emptyText: 'Completing a task, recording an outcome, or logging a change will appear here automatically.', currency: 'MAD' }
  const { projects, setActiveProject, setView } = useMasaratStore()
  const items: TimelineItem[] = projects.flatMap((project) => [
    ...project.tasks.filter((task) => task.completedAt).map((task) => ({ id: `${project.project.id}-${task.id}`, date: task.completedAt!, title: task.title, projectTitle: project.project.title, kind: 'task' as const, detail: c.completed })),
    ...project.realityEvents.map((event) => ({ id: `${project.project.id}-${event.id}`, date: event.date, title: event.title, projectTitle: project.project.title, kind: 'reality' as const, detail: event.description, cost: event.cost })),
    ...project.changes.map((change) => ({ id: `${project.project.id}-${change.id}`, date: change.date, title: change.title, projectTitle: project.project.title, kind: 'change' as const, detail: change.description })),
  ]).sort((a, b) => b.date.localeCompare(a.date))

  const icons = { task: CheckCircle2, reality: NotebookPen, change: GitCommitHorizontal }

  return (
    <div className="page global-timeline-page">
      <section className="page-intro page-intro--simple"><div><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.intro}</p></div><div className="timeline-total"><Clock3 size={18} /><strong>{items.length}</strong><span>{c.event}</span></div></section>
      <section className="global-timeline">
        {items.map((item) => {
          const Icon = icons[item.kind]
          const project = projects.find((candidate) => item.id.startsWith(`${candidate.project.id}-`))
          return (
            <button key={item.id} className={`global-event global-event--${item.kind}`} onClick={() => { if (project) { setActiveProject(project.project.id); setView('timeline') } }}>
              <span className="global-event__icon"><Icon size={18} /></span>
              <div className="global-event__body"><span>{item.projectTitle}</span><strong>{item.title}</strong>{item.detail && <p>{item.detail}</p>}</div>
              <div className="global-event__meta"><time>{new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(item.date))}</time>{item.cost !== undefined && <b><CircleDollarSign size={13} /> {item.cost.toLocaleString(locale)} {c.currency}</b>}</div>
            </button>
          )
        })}
        {!items.length && <div className="empty-state"><Clock3 size={32} /><strong>{c.empty}</strong><p>{c.emptyText}</p></div>}
      </section>
    </div>
  )
}
