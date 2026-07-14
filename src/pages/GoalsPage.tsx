import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Archive, ArrowLeft, CalendarDays, Edit3, Flag, Plus, Target } from 'lucide-react'
import { GoalModal } from '../components/modals/GoalModal'
import { useI18n } from '../lib/i18n'
import { useMasaratStore } from '../store/use-masarat-store'
import type { Goal } from '../types/masarat'

export function GoalsPage() {
  const { language, locale } = useI18n()
  const c = language === 'ar' ? { eyebrow: 'الاتجاه قبل الانشغال', title: 'الأهداف والمشاريع', intro: 'اربط كل مشروع بنتيجة تريد الوصول إليها، حتى تبقى المهام مرتبطة بسبب واضح.', newGoal: 'هدف جديد', uncategorized: 'غير مصنف', status: { planned: 'مخطط', active: 'نشط', paused: 'متوقف', completed: 'مكتمل' }, edit: 'تعديل', pause: 'إيقاف', progress: 'التقدم', linked: 'مسارات مرتبطة', noDeadline: 'دون موعد نهائي', open: 'فتح المسار', empty: 'ابدأ بهدف واحد واضح', emptyText: 'ستظهر هنا الأهداف التي تستوردها ضمن Life Pack أو تنشئها يدويًا.' } : { eyebrow: 'DIRECTION BEFORE BUSYNESS', title: 'Goals and projects', intro: 'Connect every project to a desired outcome, so each task keeps a clear reason.', newGoal: 'New goal', uncategorized: 'Uncategorized', status: { planned: 'Planned', active: 'Active', paused: 'Paused', completed: 'Completed' }, edit: 'Edit', pause: 'Pause', progress: 'Progress', linked: 'linked paths', noDeadline: 'No deadline', open: 'Open path', empty: 'Start with one clear goal', emptyText: 'Goals imported in a Life Pack or created manually will appear here.' }
  const { goals, lifeAreas, projects, setActiveProject, setView, saveGoal, archiveGoal } = useMasaratStore()
  const [editing, setEditing] = useState<Goal | 'new'>()

  return (
    <div className="page goals-page">
      <section className="page-intro page-intro--simple"><div><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.intro}</p></div><button className="button button--primary" onClick={() => setEditing('new')}><Plus size={17} /> {c.newGoal}</button></section>
      <div className="goals-list">
        {goals.map((goal, index) => {
          const area = lifeAreas.find((item) => item.id === goal.areaId)
          const relatedProjects = projects.filter((project) => project.project.goalId === goal.id)
          return (
            <motion.article className="goal-card" key={goal.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }}>
              <div className="goal-card__icon" style={{ '--goal-color': area?.color ?? '#5aa7ff' } as React.CSSProperties}><Target size={21} /></div>
              <div className="goal-card__main">
                <div className="goal-card__title"><div><span>{area?.name ?? c.uncategorized}</span><h3>{goal.title}</h3></div><div className="goal-actions"><span className={`status-pill status-pill--${goal.status === 'active' ? 'active' : 'paused'}`}><i />{c.status[goal.status]}</span><button aria-label={`${c.edit} ${goal.title}`} onClick={() => setEditing(goal)}><Edit3 size={14} /></button>{goal.status !== 'paused' && <button aria-label={`${c.pause} ${goal.title}`} onClick={() => archiveGoal(goal.id)}><Archive size={14} /></button>}</div></div>
                {goal.description && <p>{goal.description}</p>}
                <div className="goal-progress"><div><span>{c.progress}</span><b>{goal.progress}%</b></div><div className="progress-track"><span style={{ width: `${goal.progress}%` }} /></div></div>
                <div className="goal-card__footer"><span><Flag size={14} /> {relatedProjects.length} {c.linked}</span><span><CalendarDays size={14} /> {goal.targetDate ? new Intl.DateTimeFormat(locale).format(new Date(goal.targetDate)) : c.noDeadline}</span>{relatedProjects[0] && <button onClick={() => { setActiveProject(relatedProjects[0].project.id); setView('path-overview') }}>{c.open} <ArrowLeft size={14} /></button>}</div>
              </div>
            </motion.article>
          )
        })}
        {!goals.length && <div className="empty-state"><Target size={32} /><strong>{c.empty}</strong><p>{c.emptyText}</p></div>}
      </div>
      <AnimatePresence>{editing && <GoalModal goal={editing === 'new' ? undefined : editing} areas={lifeAreas} onClose={() => setEditing(undefined)} onSave={async (goal) => { await saveGoal(goal); setEditing(undefined) }} />}</AnimatePresence>
    </div>
  )
}
