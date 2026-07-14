import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, CalendarCheck2, Check, CircleDollarSign, Clock3, FileText, Flag, Play, Plus, Sparkles } from 'lucide-react'
import { SmartBrief } from '../components/smart/SmartBrief'
import { LifeOrbit3D } from '../components/visuals/LifeOrbit3D'
import { ActivityBars, HealthSegments, ProgressDonut, type ActivityPoint } from '../components/visuals/LifeCharts'
import { useI18n } from '../lib/i18n'
import { useMasaratStore } from '../store/use-masarat-store'
import type { MasaratProject, Priority, Task } from '../types/masarat'

type TodayTask = { task: Task; project: MasaratProject }
const priorityWeight: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
function taskWeight(item: TodayTask) { if (item.task.status === 'in_progress') return -10; if (item.task.status === 'blocked') return 10; return priorityWeight[item.task.priority] }

interface TodayPageProps { onQuickEvent: () => void; onQuickChange: () => void }

export function TodayPage({ onQuickEvent, onQuickChange }: TodayPageProps) {
  const { language, locale, t } = useI18n()
  const { projects, lifeAreas, activeProjectId, setActiveProject, setActiveArea, setView, updateProjectTask } = useMasaratStore()
  const [today] = useState(() => new Date())
  const openTasks = projects.flatMap((project) => project.tasks.filter((task) => !['completed', 'cancelled'].includes(task.status)).map((task) => ({ task, project }))).sort((a, b) => taskWeight(a) - taskWeight(b) || (a.task.dueDate ?? '9999').localeCompare(b.task.dueDate ?? '9999'))
  const focusTasks = openTasks.slice(0, 3)
  const checkpoints = projects.flatMap((project) => project.checkpoints.filter((checkpoint) => checkpoint.status !== 'completed').map((checkpoint) => ({ checkpoint, project }))).sort((a, b) => a.checkpoint.date.localeCompare(b.checkpoint.date))
  const overdueCheckpoints = checkpoints.filter(({ checkpoint }) => new Date(checkpoint.date) < today || checkpoint.status === 'missed')
  const resumeProject = projects.find((item) => item.project.id === activeProjectId) ?? projects[0]
  const relevantTasks = projects.flatMap((project) => project.tasks).filter((task) => task.status !== 'cancelled')
  const completion = relevantTasks.length ? Math.round(relevantTasks.filter((task) => task.status === 'completed').length / relevantTasks.length * 100) : 0
  const areaHealth = { stable: lifeAreas.filter((area) => !area.archived && area.status === 'stable').length, attention: lifeAreas.filter((area) => !area.archived && area.status === 'attention').length, critical: lifeAreas.filter((area) => !area.archived && area.status === 'critical').length }
  const activity: ActivityPoint[] = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(today); date.setDate(today.getDate() - (6 - offset)); const key = date.toISOString().slice(0, 10)
    return { label: new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(date), tasks: projects.flatMap((project) => project.tasks).filter((task) => task.completedAt?.slice(0, 10) === key).length, events: projects.flatMap((project) => project.realityEvents).filter((event) => event.date.slice(0, 10) === key).length }
  })
  const formatDate = (date?: string) => date ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(new Date(date)) : t.noDeadline
  const openProject = (projectId: string, destination: 'path-overview' | 'plan' | 'timeline' = 'path-overview') => { setActiveProject(projectId); setView(destination) }

  return (
    <div className="page command-page">
      <motion.section className="command-hero" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
        <div className="command-hero__copy"><span className="hero-badge"><Sparkles size={14} /> {t.clearStep}</span><h2>{t.heroToday}</h2><p>{t.heroTodayText}</p><div className="command-hero__date">{new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(today)}</div>{resumeProject && <button className="command-resume" onClick={() => openProject(resumeProject.project.id, 'plan')}><span><Play size={16} fill="currentColor" /> {t.resume}</span><strong>{resumeProject.project.title}</strong><small>{t.openExecution} <ArrowLeft size={14} /></small></button>}</div>
        <LifeOrbit3D areas={lifeAreas} compact onSelect={(areaId) => { setActiveArea(areaId); setView('life') }} />
      </motion.section>

      <section className="command-bar" aria-label={t.quickAdd}><span><Plus size={16} /> {t.quickAdd}</span><button onClick={onQuickEvent}><FileText size={16} /> {t.noteResult}</button><button onClick={onQuickEvent}><CircleDollarSign size={16} /> {t.expense}</button><button onClick={onQuickChange}><AlertTriangle size={16} /> {t.changed}</button></section>

      <div className="command-primary-grid">
        <section className="focus-panel focus-panel--command"><div className="panel-heading"><div><span className="eyebrow">{t.importantNow}</span><h3>{t.todayFocus}</h3></div><span className="section-count">{focusTasks.length} {t.stepsOfThree}</span></div><div className="focus-list">{focusTasks.map(({ task, project }, index) => <motion.article className={`focus-task focus-task--${task.priority}`} key={`${project.project.id}-${task.id}`} initial={{ opacity: 0, x: language === 'ar' ? 18 : -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .08 }}><button className="focus-task__check" aria-label={`${t.complete} ${task.title}`} onClick={() => updateProjectTask(project.project.id, task.id, { status: 'completed' })}><Check size={17} /></button><button className="focus-task__body" onClick={() => openProject(project.project.id, 'plan')}><span className="focus-task__index">0{index + 1}</span><div><strong>{task.title}</strong><small>{project.project.title}</small></div></button><div className="focus-task__meta"><Clock3 size={13} /> {formatDate(task.dueDate)}</div></motion.article>)}{!focusTasks.length && <div className="empty-state empty-state--compact"><CalendarCheck2 size={27} /><strong>{t.allClear}</strong><p>{t.noOpenTasks}</p></div>}</div>{openTasks.length > focusTasks.length && <button className="text-action" onClick={() => resumeProject && openProject(resumeProject.project.id, 'plan')}>{t.showMore} ({openTasks.length - focusTasks.length}) <ArrowLeft size={14} /></button>}</section>
        <SmartBrief />
      </div>

      <section className="analytics-grid">
        <article className="analytics-card analytics-card--donut"><div className="analytics-card__head"><span>{t.progress}</span><b>{relevantTasks.filter((task) => task.status === 'completed').length}/{relevantTasks.length} {t.completed}</b></div><ProgressDonut value={completion} /></article>
        <article className="analytics-card analytics-card--activity"><ActivityBars data={activity} /></article>
        <article className="analytics-card analytics-card--health"><HealthSegments {...areaHealth} /><div className="checkpoint-compact"><div><span><Flag size={15} /> {t.checkpoints}</span><b>{checkpoints.length}</b></div>{overdueCheckpoints.length > 0 ? <button onClick={() => openProject(overdueCheckpoints[0].project.project.id, 'timeline')}><AlertTriangle size={14} /> {overdueCheckpoints.length} {t.overdueReview}</button> : <p>{t.noReviews}</p>}</div></article>
      </section>
    </div>
  )
}
