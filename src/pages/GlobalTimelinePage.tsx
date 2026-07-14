import { CheckCircle2, CircleDollarSign, Clock3, GitCommitHorizontal, NotebookPen } from 'lucide-react'
import { useMasaratStore } from '../store/use-masarat-store'

type TimelineItem = { id: string; date: string; title: string; projectTitle: string; kind: 'task' | 'reality' | 'change'; detail?: string; cost?: number }

export function GlobalTimelinePage() {
  const { projects, setActiveProject, setView } = useMasaratStore()
  const items: TimelineItem[] = projects.flatMap((project) => [
    ...project.tasks.filter((task) => task.completedAt).map((task) => ({ id: `${project.project.id}-${task.id}`, date: task.completedAt!, title: task.title, projectTitle: project.project.title, kind: 'task' as const, detail: 'مهمة مكتملة' })),
    ...project.realityEvents.map((event) => ({ id: `${project.project.id}-${event.id}`, date: event.date, title: event.title, projectTitle: project.project.title, kind: 'reality' as const, detail: event.description, cost: event.cost })),
    ...project.changes.map((change) => ({ id: `${project.project.id}-${change.id}`, date: change.date, title: change.title, projectTitle: project.project.title, kind: 'change' as const, detail: change.description })),
  ]).sort((a, b) => b.date.localeCompare(a.date))

  const icons = { task: CheckCircle2, reality: NotebookPen, change: GitCommitHorizontal }

  return (
    <div className="page global-timeline-page">
      <section className="page-intro page-intro--simple"><div><span className="eyebrow">ذاكرة لا تفقد السياق</span><h2>ما حدث وتغيّر</h2><p>سجل واحد يجمع التنفيذ والمصاريف والنتائج والتغييرات من جميع المسارات.</p></div><div className="timeline-total"><Clock3 size={18} /><strong>{items.length}</strong><span>حدثًا مسجلًا</span></div></section>
      <section className="global-timeline">
        {items.map((item) => {
          const Icon = icons[item.kind]
          const project = projects.find((candidate) => item.id.startsWith(`${candidate.project.id}-`))
          return (
            <button key={item.id} className={`global-event global-event--${item.kind}`} onClick={() => { if (project) { setActiveProject(project.project.id); setView('timeline') } }}>
              <span className="global-event__icon"><Icon size={18} /></span>
              <div className="global-event__body"><span>{item.projectTitle}</span><strong>{item.title}</strong>{item.detail && <p>{item.detail}</p>}</div>
              <div className="global-event__meta"><time>{new Intl.DateTimeFormat('ar-MA', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(item.date))}</time>{item.cost !== undefined && <b><CircleDollarSign size={13} /> {item.cost.toLocaleString('ar-MA')} د.م.</b>}</div>
            </button>
          )
        })}
        {!items.length && <div className="empty-state"><Clock3 size={32} /><strong>سيبدأ خطك الزمني مع أول خطوة</strong><p>إكمال مهمة أو تسجيل نتيجة أو تغيير سيظهر هنا تلقائيًا.</p></div>}
      </section>
    </div>
  )
}
