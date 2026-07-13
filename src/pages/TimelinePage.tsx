import { Banknote, Calendar, CircleDot, FilePenLine, Flag, Plus, RefreshCcw } from 'lucide-react'
import type { MasaratProject } from '../types/masarat'

type TimelineItem = {
  id: string
  date: string
  title: string
  description?: string
  kind: 'created' | 'change' | 'expense' | 'result' | 'note'
  cost?: number
}

const kindConfig = {
  created: { label: 'بداية', icon: Flag },
  change: { label: 'تغيير', icon: RefreshCcw },
  expense: { label: 'مصروف', icon: Banknote },
  result: { label: 'نتيجة', icon: CircleDot },
  note: { label: 'ملاحظة', icon: FilePenLine },
}

export function TimelinePage({ project, onAddEvent }: { project: MasaratProject; onAddEvent: () => void }) {
  const unsortedItems: TimelineItem[] = [
    { id: 'created', date: project.project.createdAt, title: 'بدأ هذا المسار', description: project.project.description, kind: 'created' },
    ...project.changes.map((change): TimelineItem => ({ id: change.id, date: change.date, title: change.title, description: change.description, kind: 'change' })),
    ...project.realityEvents.map((event): TimelineItem => ({ id: event.id, date: event.date, title: event.title, description: event.description, kind: event.type === 'observation' ? 'note' : event.type, cost: event.cost })),
  ]
  const items = unsortedItems.sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="page page--timeline">
      <div className="page-heading page-heading--action"><div><span className="eyebrow">الواقع قبل الذاكرة</span><h2>سجل القرار</h2><p>ما فكرت فيه، ما تغيّر، وما حدث فعلًا — في مكان واحد.</p></div><button className="button button--primary" onClick={onAddEvent}><Plus size={17} /> تسجيل حدث</button></div>
      <div className="timeline-layout">
        <section className="timeline-panel">
          <div className="timeline-line" />
          {items.map((item) => {
            const config = kindConfig[item.kind]
            const Icon = config.icon
            return (
              <article className="timeline-item" key={item.id}>
                <div className={`timeline-item__icon timeline-item__icon--${item.kind}`}><Icon size={17} /></div>
                <div className="timeline-item__card">
                  <div className="timeline-item__meta"><span>{config.label}</span><time><Calendar size={13} />{new Date(item.date).toLocaleDateString('ar-MA', { day: 'numeric', month: 'long', year: 'numeric' })}</time></div>
                  <h3>{item.title}</h3>
                  {item.description && <p>{item.description}</p>}
                  {item.cost !== undefined && <strong className="timeline-cost">{item.cost.toLocaleString('ar-MA')} د.م.</strong>}
                </div>
              </article>
            )
          })}
        </section>
        <aside className="timeline-summary">
          <span className="eyebrow">ملخص الرحلة</span><h3>{items.length} محطات محفوظة</h3>
          <div className="summary-numbers"><div><strong>{project.changes.length}</strong><small>تغييرات</small></div><div><strong>{project.realityEvents.length}</strong><small>أحداث فعلية</small></div><div><strong>{project.versions.length + 1}</strong><small>إصدارات</small></div></div>
          <p>كلما سجلت الواقع بدقة، صار تحديث الخطة لاحقًا أكثر عقلانية وأقل اعتمادًا على الذاكرة.</p>
        </aside>
      </div>
    </div>
  )
}
