import { motion } from 'framer-motion'
import { ArrowLeft, CalendarClock, CheckCircle2, FileUp, FolderPlus, GitBranch, ListChecks, MoreHorizontal, Play, Route, ShieldCheck, Sparkles } from 'lucide-react'
import { calculateProgress } from '../lib/project-utils'
import { useI18n } from '../lib/i18n'
import { useMasaratStore } from '../store/use-masarat-store'

export function DashboardPage({ onImport }: { onImport: () => void }) {
  const { language } = useI18n()
  const c = language === 'ar' ? {
    badge: 'خطتك أصبحت مرئية', hero: 'حوّل الاحتمالات إلى خطوات واضحة.', intro: 'شاهد الصورة كاملة، اختر مسارك، ثم ركّز على خطوة واحدة قابلة للتنفيذ.', continue: 'تابع الخطوة التالية', import: 'استيراد مشروع', next: 'الخطوة التالية', review: 'راجع النتيجة الفعلية للخطة', openExecution: 'فتح التنفيذ', importStep: 'استورد', importHint: 'ملف خطتك', choose: 'اختر', chooseHint: 'المسار الأنسب', execute: 'نفّذ', executeHint: 'خطوة واحدة الآن', activePlans: 'خطط نشطة', needFollow: 'تحتاج متابعة', completedTasks: 'مهام مكتملة', across: 'عبر كل الخطط', upcoming: 'مراجعات قادمة', decisions: 'نقاط قرار', yourPaths: 'مساراتك', heading: 'المشاريع والقرارات', project: 'مشروع', delete: 'حذف', progress: 'التقدم', noTasks: 'لا توجد مهام متبقية', openMap: 'فتح الخريطة', importNew: 'استيراد مشروع جديد', formats: 'من ملف .masarat أو .json', statuses: { exploring: 'قيد الدراسة', active: 'قيد التنفيذ', paused: 'متوقف مؤقتًا', completed: 'مكتمل' },
  } : {
    badge: 'YOUR PLAN IS NOW VISIBLE', hero: 'Turn possibilities into clear actions.', intro: 'See the whole picture, choose a path, then focus on one executable next action.', continue: 'Continue next action', import: 'Import project', next: 'Next action', review: 'Review the real outcome of this plan', openExecution: 'Open execution', importStep: 'Import', importHint: 'your plan file', choose: 'Choose', chooseHint: 'the right path', execute: 'Execute', executeHint: 'one action now', activePlans: 'Active paths', needFollow: 'need attention', completedTasks: 'Completed tasks', across: 'across all paths', upcoming: 'Upcoming reviews', decisions: 'decision points', yourPaths: 'YOUR PATHS', heading: 'Projects and decisions', project: 'projects', delete: 'Delete', progress: 'Progress', noTasks: 'No tasks remaining', openMap: 'Open map', importNew: 'Import a new project', formats: 'From .masarat or .json', statuses: { exploring: 'Exploring', active: 'In progress', paused: 'Paused', completed: 'Completed' },
  }
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
          <span className="hero-badge"><Sparkles size={14} /> {c.badge}</span>
          <h2>{c.hero}</h2>
          <p>{c.intro}</p>
          <div className="welcome-actions">
            {primaryProject && <button className="button button--primary button--large" onClick={continueProject}><Play size={18} fill="currentColor" /> {c.continue}</button>}
            <button className="button button--glass button--large" onClick={onImport}><FileUp size={18} /> {c.import}</button>
          </div>
        </div>
        {primaryProject && (
          <motion.button className="hero-next-card" onClick={continueProject} whileHover={{ y: -5, rotate: -.4 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
            <span className="hero-next-card__label"><span className="live-dot" /> {c.next}</span>
            <strong>{primaryNextTask?.title ?? c.review}</strong>
            <small>{primaryProject.project.title}</small>
            <span className="hero-next-card__action">{c.openExecution} <ArrowLeft size={15} /></span>
          </motion.button>
        )}
      </motion.section>

      <motion.section className="decision-flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .18 }}>
        <div><span><FileUp size={17} /></span><p><strong>1. {c.importStep}</strong><small>{c.importHint}</small></p></div>
        <i />
        <div><span><Route size={17} /></span><p><strong>2. {c.choose}</strong><small>{c.chooseHint}</small></p></div>
        <i />
        <div><span><CheckCircle2 size={17} /></span><p><strong>3. {c.execute}</strong><small>{c.executeHint}</small></p></div>
      </motion.section>

      <motion.section className="metrics-grid" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: .08 } } }}>
        {[
          { label: c.activePlans, value: activeCount, hint: c.needFollow, icon: GitBranch, tone: 'blue' },
          { label: c.completedTasks, value: completedTasks, hint: c.across, icon: ListChecks, tone: 'green' },
          { label: c.upcoming, value: upcomingReviews, hint: c.decisions, icon: CalendarClock, tone: 'purple' },
        ].map((metric) => {
          const Icon = metric.icon
          return <motion.article className="metric-card" key={metric.label} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }} whileHover={{ y: -3 }}><span className={`metric-card__icon metric-card__icon--${metric.tone}`}><Icon size={21} /></span><div><small>{metric.label}</small><strong>{metric.value}</strong></div><span className="metric-card__hint">{metric.hint}</span></motion.article>
        })}
      </motion.section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">{c.yourPaths}</span><h3>{c.heading}</h3></div><span className="section-count">{projects.length} {c.project}</span></div>
        <div className="projects-grid">
          {projects.map((item) => {
            const progress = calculateProgress(item)
            const area = lifeAreas.find((candidate) => candidate.id === item.project.areaId)
            const nextTask = item.tasks.find((task) => task.status === 'in_progress') ?? item.tasks.find((task) => task.status === 'pending')
            return (
              <motion.article className="project-card" key={item.project.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }}>
                <div className="project-card__top">
                  <span className={`status-pill status-pill--${item.project.status}`}><i />{c.statuses[item.project.status]}</span>
                  <div className="project-menu">
                    <button className="icon-button icon-button--small"><MoreHorizontal size={17} /></button>
                    <button className="project-delete" onClick={() => deleteProject(item.project.id)}>{c.delete}</button>
                  </div>
                </div>
                <button className="project-card__body" onClick={() => openProject(item.project.id)}>
                  <div className="project-card__route"><span /><span /><span /><i><ShieldCheck size={13} /></i></div>
                  {area && <span className="project-area-pill" style={{ '--area-color': area.color } as React.CSSProperties}>{area.name}</span>}
                  <h4>{item.project.title}</h4>
                  <p>{item.project.goal}</p>
                </button>
                <div className="project-card__progress"><div><span>{c.progress}</span><b>{progress}%</b></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
                <div className="next-step"><small>{c.next}</small><strong>{nextTask?.title ?? c.noTasks}</strong></div>
                <button className="project-card__open" onClick={() => openProject(item.project.id)}>{c.openMap} <ArrowLeft size={16} /></button>
              </motion.article>
            )
          })}
          <button className="new-project-card" onClick={onImport}><span><FolderPlus size={23} /></span><strong>{c.importNew}</strong><small>{c.formats}</small></button>
        </div>
      </section>
    </div>
  )
}
