import { ArrowLeft, CalendarClock, FileUp, FolderPlus, GitBranch, ListChecks, MoreHorizontal } from 'lucide-react'
import { calculateProgress } from '../lib/project-utils'
import { useMasaratStore } from '../store/use-masarat-store'

const projectStatus = {
  exploring: 'قيد الدراسة',
  active: 'قيد التنفيذ',
  paused: 'متوقف مؤقتًا',
  completed: 'مكتمل',
}

export function DashboardPage({ onImport }: { onImport: () => void }) {
  const { projects, setActiveProject, setView, deleteProject } = useMasaratStore()
  const activeCount = projects.filter((item) => item.project.status === 'active').length
  const completedTasks = projects.reduce((count, item) => count + item.tasks.filter((task) => task.status === 'completed').length, 0)
  const upcomingReviews = projects.reduce((count, item) => count + item.checkpoints.filter((point) => point.status === 'upcoming').length, 0)

  const openProject = (id: string) => {
    setActiveProject(id)
    setView('canvas')
  }

  return (
    <div className="page page--dashboard">
      <section className="welcome-strip">
        <div>
          <span className="eyebrow">مساحتك المحلية لاتخاذ القرار</span>
          <h2>حوّل الاحتمالات إلى خطوات واضحة.</h2>
          <p>الخطة لا تحتاج أن تكون مثالية؛ يكفي أن تعرف أين أنت، وما الخطوة التالية، ومتى تعيد التقييم.</p>
        </div>
        <button className="button button--primary" onClick={onImport}><FileUp size={18} /> استيراد ملف Masarat</button>
      </section>

      <section className="metrics-grid">
        <article className="metric-card"><span className="metric-card__icon metric-card__icon--blue"><GitBranch size={20} /></span><div><small>خطط نشطة</small><strong>{activeCount}</strong></div><span className="metric-card__hint">تحتاج متابعة</span></article>
        <article className="metric-card"><span className="metric-card__icon metric-card__icon--green"><ListChecks size={20} /></span><div><small>مهام مكتملة</small><strong>{completedTasks}</strong></div><span className="metric-card__hint">عبر كل الخطط</span></article>
        <article className="metric-card"><span className="metric-card__icon metric-card__icon--purple"><CalendarClock size={20} /></span><div><small>مراجعات قادمة</small><strong>{upcomingReviews}</strong></div><span className="metric-card__hint">نقاط قرار</span></article>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">مساراتك</span><h3>المشاريع والقرارات</h3></div><span className="section-count">{projects.length} مشروع</span></div>
        <div className="projects-grid">
          {projects.map((item) => {
            const progress = calculateProgress(item)
            const nextTask = item.tasks.find((task) => task.status === 'in_progress') ?? item.tasks.find((task) => task.status === 'pending')
            return (
              <article className="project-card" key={item.project.id}>
                <div className="project-card__top">
                  <span className={`status-pill status-pill--${item.project.status}`}><i />{projectStatus[item.project.status]}</span>
                  <div className="project-menu">
                    <button className="icon-button icon-button--small"><MoreHorizontal size={17} /></button>
                    <button className="project-delete" onClick={() => deleteProject(item.project.id)}>حذف</button>
                  </div>
                </div>
                <button className="project-card__body" onClick={() => openProject(item.project.id)}>
                  <div className="project-card__route"><span /><span /><span /></div>
                  <h4>{item.project.title}</h4>
                  <p>{item.project.goal}</p>
                </button>
                <div className="project-card__progress"><div><span>التقدم</span><b>{progress}%</b></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
                <div className="next-step"><small>الخطوة التالية</small><strong>{nextTask?.title ?? 'لا توجد مهام متبقية'}</strong></div>
                <button className="project-card__open" onClick={() => openProject(item.project.id)}>فتح الخريطة <ArrowLeft size={16} /></button>
              </article>
            )
          })}
          <button className="new-project-card" onClick={onImport}><span><FolderPlus size={23} /></span><strong>استيراد مشروع جديد</strong><small>من ملف .masarat أو .json</small></button>
        </div>
      </section>
    </div>
  )
}
