import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  CalendarCheck2,
  Check,
  CircleDollarSign,
  Clock3,
  FileText,
  Flag,
  Play,
  Plus,
  Sparkles,
} from 'lucide-react'
import { useMasaratStore } from '../store/use-masarat-store'
import type { MasaratProject, Priority, Task } from '../types/masarat'

type TodayTask = { task: Task; project: MasaratProject }

const priorityWeight: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

function taskWeight(item: TodayTask) {
  if (item.task.status === 'in_progress') return -10
  if (item.task.status === 'blocked') return 10
  return priorityWeight[item.task.priority]
}

function formatDate(date?: string) {
  if (!date) return 'دون موعد'
  return new Intl.DateTimeFormat('ar-MA', { day: 'numeric', month: 'short' }).format(new Date(date))
}

interface TodayPageProps {
  onQuickEvent: () => void
  onQuickChange: () => void
}

export function TodayPage({ onQuickEvent, onQuickChange }: TodayPageProps) {
  const { projects, activeProjectId, setActiveProject, setView, updateProjectTask } = useMasaratStore()
  const openTasks = projects
    .flatMap((project) => project.tasks
      .filter((task) => task.status !== 'completed' && task.status !== 'cancelled')
      .map((task) => ({ task, project })))
    .sort((a, b) => taskWeight(a) - taskWeight(b) || (a.task.dueDate ?? '9999').localeCompare(b.task.dueDate ?? '9999'))
  const focusTasks = openTasks.slice(0, 3)
  const today = new Date()
  const checkpoints = projects
    .flatMap((project) => project.checkpoints
      .filter((checkpoint) => checkpoint.status !== 'completed')
      .map((checkpoint) => ({ checkpoint, project })))
    .sort((a, b) => a.checkpoint.date.localeCompare(b.checkpoint.date))
  const overdueCheckpoints = checkpoints.filter(({ checkpoint }) => new Date(checkpoint.date) < today || checkpoint.status === 'missed')
  const resumeProject = projects.find((item) => item.project.id === activeProjectId) ?? projects[0]
  const projectsWithoutNextAction = projects.filter((project) =>
    project.project.status === 'active' && !project.tasks.some((task) => ['pending', 'in_progress'].includes(task.status)),
  )

  const openProject = (projectId: string, destination: 'path-overview' | 'plan' | 'timeline' = 'path-overview') => {
    setActiveProject(projectId)
    setView(destination)
  }

  return (
    <div className="page today-page">
      <motion.section className="today-hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="today-hero__copy">
          <span className="hero-badge"><Sparkles size={14} /> خطوة واضحة، لا قائمة لا تنتهي</span>
          <h2>ركّز على ما يحرّك حياتك اليوم.</h2>
          <p>{new Intl.DateTimeFormat('ar-MA', { weekday: 'long', day: 'numeric', month: 'long' }).format(today)} · اخترنا لك أهم ثلاث خطوات من كل مساراتك.</p>
        </div>
        {resumeProject && (
          <button className="resume-card" onClick={() => openProject(resumeProject.project.id, 'plan')}>
            <span><Play size={16} fill="currentColor" /> متابعة من حيث توقفت</span>
            <strong>{resumeProject.project.title}</strong>
            <small>فتح التنفيذ <ArrowLeft size={14} /></small>
          </button>
        )}
      </motion.section>

      <section className="quick-capture" aria-label="إضافة سريعة">
        <span><Plus size={16} /> إضافة سريعة</span>
        <button onClick={onQuickEvent}><FileText size={16} /> ملاحظة أو نتيجة</button>
        <button onClick={onQuickEvent}><CircleDollarSign size={16} /> مصروف</button>
        <button onClick={onQuickChange}><AlertTriangle size={16} /> تغيّر شيء</button>
      </section>

      <div className="today-layout">
        <section className="focus-panel">
          <div className="panel-heading">
            <div><span className="eyebrow">الأهم الآن</span><h3>تركيز اليوم</h3></div>
            <span className="section-count">{focusTasks.length} من 3 خطوات</span>
          </div>
          <div className="focus-list">
            {focusTasks.map(({ task, project }, index) => (
              <motion.article
                className={`focus-task focus-task--${task.priority}`}
                key={`${project.project.id}-${task.id}`}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * .08 }}
              >
                <button
                  className="focus-task__check"
                  aria-label={`إكمال ${task.title}`}
                  onClick={() => updateProjectTask(project.project.id, task.id, { status: 'completed' })}
                ><Check size={17} /></button>
                <button className="focus-task__body" onClick={() => openProject(project.project.id, 'plan')}>
                  <span className="focus-task__index">0{index + 1}</span>
                  <div><strong>{task.title}</strong><small>{project.project.title}</small></div>
                </button>
                <div className="focus-task__meta"><Clock3 size={13} /> {formatDate(task.dueDate)}</div>
              </motion.article>
            ))}
            {!focusTasks.length && (
              <div className="empty-state empty-state--compact"><CalendarCheck2 size={27} /><strong>كل شيء واضح لليوم</strong><p>لا توجد مهام مفتوحة في مساراتك الحالية.</p></div>
            )}
          </div>
          {openTasks.length > focusTasks.length && <button className="text-action" onClick={() => resumeProject && openProject(resumeProject.project.id, 'plan')}>عرض بقية المهام ({openTasks.length - focusTasks.length}) <ArrowLeft size={14} /></button>}
        </section>

        <aside className="today-rail">
          <article className="today-card">
            <div className="today-card__heading"><span><Flag size={16} /> نقاط المراجعة</span><b>{checkpoints.length}</b></div>
            {overdueCheckpoints.length > 0 && <div className="attention-note"><AlertTriangle size={15} /> {overdueCheckpoints.length} مراجعة متأخرة تحتاج قرارًا</div>}
            <div className="checkpoint-mini-list">
              {checkpoints.slice(0, 3).map(({ checkpoint, project }) => (
                <button key={`${project.project.id}-${checkpoint.id}`} onClick={() => openProject(project.project.id, 'timeline')}>
                  <span className={new Date(checkpoint.date) < today ? 'late' : ''} />
                  <div><strong>{checkpoint.title}</strong><small>{formatDate(checkpoint.date)} · {project.project.title}</small></div>
                </button>
              ))}
              {!checkpoints.length && <p className="muted-copy">لا توجد مراجعات قادمة.</p>}
            </div>
          </article>

          <article className="today-card today-card--signal">
            <div className="today-card__heading"><span><AlertTriangle size={16} /> إشارات الانتباه</span><b>{projectsWithoutNextAction.length + overdueCheckpoints.length}</b></div>
            <p>{projectsWithoutNextAction.length ? 'هناك مسار نشط بلا خطوة تالية. راجعه حتى لا يتوقف بصمت.' : 'كل المسارات النشطة لديها خطوة تالية واضحة.'}</p>
            {projectsWithoutNextAction[0] && <button className="text-action" onClick={() => openProject(projectsWithoutNextAction[0].project.id)}>راجع المسار <ArrowLeft size={14} /></button>}
          </article>
        </aside>
      </div>
    </div>
  )
}
