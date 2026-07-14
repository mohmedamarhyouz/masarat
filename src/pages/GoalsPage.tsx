import { motion } from 'framer-motion'
import { ArrowLeft, CalendarDays, Flag, Plus, Target } from 'lucide-react'
import { useMasaratStore } from '../store/use-masarat-store'

const goalStatus = { planned: 'مخطط', active: 'نشط', paused: 'متوقف', completed: 'مكتمل' }

export function GoalsPage() {
  const { goals, lifeAreas, projects, setActiveProject, setView } = useMasaratStore()

  return (
    <div className="page goals-page">
      <section className="page-intro page-intro--simple"><div><span className="eyebrow">الاتجاه قبل الانشغال</span><h2>الأهداف والمشاريع</h2><p>اربط كل مشروع بنتيجة تريد الوصول إليها، حتى تبقى المهام مرتبطة بسبب واضح.</p></div><button className="button button--primary" disabled title="إضافة الأهداف اليدوية في المرحلة التالية"><Plus size={17} /> هدف جديد</button></section>
      <div className="goals-list">
        {goals.map((goal, index) => {
          const area = lifeAreas.find((item) => item.id === goal.areaId)
          const relatedProjects = projects.filter((project) => project.project.goalId === goal.id)
          return (
            <motion.article className="goal-card" key={goal.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }}>
              <div className="goal-card__icon" style={{ '--goal-color': area?.color ?? '#5aa7ff' } as React.CSSProperties}><Target size={21} /></div>
              <div className="goal-card__main">
                <div className="goal-card__title"><div><span>{area?.name ?? 'غير مصنف'}</span><h3>{goal.title}</h3></div><span className={`status-pill status-pill--${goal.status === 'active' ? 'active' : 'paused'}`}><i />{goalStatus[goal.status]}</span></div>
                {goal.description && <p>{goal.description}</p>}
                <div className="goal-progress"><div><span>التقدم</span><b>{goal.progress}%</b></div><div className="progress-track"><span style={{ width: `${goal.progress}%` }} /></div></div>
                <div className="goal-card__footer"><span><Flag size={14} /> {relatedProjects.length} مسارات مرتبطة</span><span><CalendarDays size={14} /> {goal.targetDate ? new Intl.DateTimeFormat('ar-MA').format(new Date(goal.targetDate)) : 'دون موعد نهائي'}</span>{relatedProjects[0] && <button onClick={() => { setActiveProject(relatedProjects[0].project.id); setView('path-overview') }}>فتح المسار <ArrowLeft size={14} /></button>}</div>
              </div>
            </motion.article>
          )
        })}
        {!goals.length && <div className="empty-state"><Target size={32} /><strong>ابدأ بهدف واحد واضح</strong><p>ستظهر هنا الأهداف التي تستوردها ضمن Life Pack أو تنشئها يدويًا.</p></div>}
      </div>
    </div>
  )
}
