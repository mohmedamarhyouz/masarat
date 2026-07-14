import { motion } from 'framer-motion'
import { ArrowLeft, CalendarClock, CheckCircle2, FileUp, FolderPlus, GitBranch, ListChecks, MoreHorizontal, Play, Route, ShieldCheck, Sparkles } from 'lucide-react'
import { calculateProgress } from '../lib/project-utils'
import { useMasaratStore } from '../store/use-masarat-store'

const projectStatus = {
  exploring: 'قيد الدراسة',
  active: 'قيد التنفيذ',
  paused: 'متوقف مؤقتًا',
  completed: 'مكتمل',
}

export function DashboardPage({ onImport }: { onImport: () => void }) {
  const { projects, lifeAreas, setActiveProject, setView, deleteProject } = useMasaratStore()
  const activeCount = projects.filter((item) => item.project.status === 'active').length
  const completedTasks = projects.reduce((count, item) => count + item.tasks.filter((task) => task.status === 'completed').length, 0)
  const upcomingReviews = projects.reduce((count, item) => count + item.checkpoints.filter((point) => point.status === 'upcoming').length, 0)
  const primaryProject = projects.find((item) => item.project.status === 'active') ?? projects[0]
  const primaryNextTask = primaryProject?.tasks.find((task) => task.status === 'in_progress') ?? primaryProject?.tasks.find((task) => task.status === 'pending')

  const openProject = (id: string) => {
    setActiveProject(id)
    setView('canvas')
  }

  const continueProject = () => {
    if (!primaryProject) return
    setActiveProject(primaryProject.project.id)
    setView('plan')
  }

  return (
    <div className="page page--dashboard">
      <motion.section className="welcome-strip welcome-strip--modern" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
        <div className="welcome-strip__glow welcome-strip__glow--one" />
        <div className="welcome-strip__glow welcome-strip__glow--two" />
        <div className="welcome-strip__content">
          <span className="hero-badge"><Sparkles size={14} /> خطتك أصبحت مرئية</span>
          <h2>حوّل الاحتمالات إلى خطوات واضحة.</h2>
          <p>شاهد الصورة كاملة، اختر مسارك، ثم ركّز على خطوة واحدة قابلة للتنفيذ.</p>
          <div className="welcome-actions">
            {primaryProject && <button className="button button--primary button--large" onClick={continueProject}><Play size={18} fill="currentColor" /> تابع الخطوة التالية</button>}
            <button className="button button--glass button--large" onClick={onImport}><FileUp size={18} /> استيراد مشروع</button>
          </div>
        </div>
        {primaryProject && (
          <motion.button className="hero-next-card" onClick={continueProject} whileHover={{ y: -5, rotate: -.4 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
            <span className="hero-next-card__label"><span className="live-dot" /> الخطوة التالية</span>
            <strong>{primaryNextTask?.title ?? 'راجع النتيجة الفعلية للخطة'}</strong>
            <small>{primaryProject.project.title}</small>
            <span className="hero-next-card__action">فتح التنفيذ <ArrowLeft size={15} /></span>
          </motion.button>
        )}
      </motion.section>

      <motion.section className="decision-flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .18 }}>
        <div><span><FileUp size={17} /></span><p><strong>1. استورد</strong><small>ملف خطتك</small></p></div>
        <i />
        <div><span><Route size={17} /></span><p><strong>2. اختر</strong><small>المسار الأنسب</small></p></div>
        <i />
        <div><span><CheckCircle2 size={17} /></span><p><strong>3. نفّذ</strong><small>خطوة واحدة الآن</small></p></div>
      </motion.section>

      <motion.section className="metrics-grid" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: .08 } } }}>
        {[
          { label: 'خطط نشطة', value: activeCount, hint: 'تحتاج متابعة', icon: GitBranch, tone: 'blue' },
          { label: 'مهام مكتملة', value: completedTasks, hint: 'عبر كل الخطط', icon: ListChecks, tone: 'green' },
          { label: 'مراجعات قادمة', value: upcomingReviews, hint: 'نقاط قرار', icon: CalendarClock, tone: 'purple' },
        ].map((metric) => {
          const Icon = metric.icon
          return <motion.article className="metric-card" key={metric.label} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} whileHover={{ y: -3 }}><span className={`metric-card__icon metric-card__icon--${metric.tone}`}><Icon size={21} /></span><div><small>{metric.label}</small><strong>{metric.value}</strong></div><span className="metric-card__hint">{metric.hint}</span></motion.article>
        })}
      </motion.section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">مساراتك</span><h3>المشاريع والقرارات</h3></div><span className="section-count">{projects.length} مشروع</span></div>
        <div className="projects-grid">
          {projects.map((item) => {
            const progress = calculateProgress(item)
            const area = lifeAreas.find((candidate) => candidate.id === item.project.areaId)
            const nextTask = item.tasks.find((task) => task.status === 'in_progress') ?? item.tasks.find((task) => task.status === 'pending')
            return (
              <motion.article className="project-card" key={item.project.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }}>
                <div className="project-card__top">
                  <span className={`status-pill status-pill--${item.project.status}`}><i />{projectStatus[item.project.status]}</span>
                  <div className="project-menu">
                    <button className="icon-button icon-button--small"><MoreHorizontal size={17} /></button>
                    <button className="project-delete" onClick={() => deleteProject(item.project.id)}>حذف</button>
                  </div>
                </div>
                <button className="project-card__body" onClick={() => openProject(item.project.id)}>
                  <div className="project-card__route"><span /><span /><span /><i><ShieldCheck size={13} /></i></div>
                  {area && <span className="project-area-pill" style={{ '--area-color': area.color } as React.CSSProperties}>{area.name}</span>}
                  <h4>{item.project.title}</h4>
                  <p>{item.project.goal}</p>
                </button>
                <div className="project-card__progress"><div><span>التقدم</span><b>{progress}%</b></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
                <div className="next-step"><small>الخطوة التالية</small><strong>{nextTask?.title ?? 'لا توجد مهام متبقية'}</strong></div>
                <button className="project-card__open" onClick={() => openProject(item.project.id)}>فتح الخريطة <ArrowLeft size={16} /></button>
              </motion.article>
            )
          })}
          <button className="new-project-card" onClick={onImport}><span><FolderPlus size={23} /></span><strong>استيراد مشروع جديد</strong><small>من ملف .masarat أو .json</small></button>
        </div>
      </section>
    </div>
  )
}
