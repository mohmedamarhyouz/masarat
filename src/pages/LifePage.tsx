import { motion } from 'framer-motion'
import { ArrowLeft, Briefcase, GraduationCap, HeartPulse, Inbox, Route, Sparkles, Users, Wallet } from 'lucide-react'
import { useMasaratStore } from '../store/use-masarat-store'

const areaIcons = { wallet: Wallet, 'graduation-cap': GraduationCap, briefcase: Briefcase, 'heart-pulse': HeartPulse, route: Route, users: Users, sparkles: Sparkles, inbox: Inbox }
const statusLabels = { stable: 'مستقر', attention: 'يحتاج انتباه', critical: 'حرج' }

export function LifePage() {
  const { lifeAreas, goals, projects, setActiveProject, setView } = useMasaratStore()

  return (
    <div className="page life-page">
      <section className="page-intro">
        <div><span className="hero-badge"><Sparkles size={14} /> صورة واحدة مترابطة</span><h2>حياتك ليست قائمة عشوائية.</h2><p>كل مجال يجمع أهدافه وقراراته ومشاريعه، ويخبرك أين تحتاج إلى الانتباه.</p></div>
        <div className="life-balance"><strong>{lifeAreas.filter((area) => area.status === 'stable').length}/{lifeAreas.length}</strong><span>مجالات مستقرة</span></div>
      </section>
      <div className="life-grid">
        {lifeAreas.map((area, index) => {
          const Icon = areaIcons[area.icon as keyof typeof areaIcons] ?? Inbox
          const areaGoals = goals.filter((goal) => goal.areaId === area.id)
          const areaProjects = projects.filter((project) => project.project.areaId === area.id)
          const nextTask = areaProjects.flatMap((project) => project.tasks.map((task) => ({ task, project }))).find(({ task }) => ['in_progress', 'pending'].includes(task.status))
          return (
            <motion.article className="life-area-card" key={area.id} style={{ '--area': area.color } as React.CSSProperties} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }} whileHover={{ y: -4 }}>
              <div className="life-area-card__top"><span className="life-area-icon"><Icon size={21} /></span><span className={`area-status area-status--${area.status}`}><i /> {statusLabels[area.status]}</span></div>
              <h3>{area.name}</h3>
              <div className="area-stats"><span><strong>{areaGoals.length}</strong> أهداف</span><span><strong>{areaProjects.length}</strong> مسارات</span></div>
              <div className="area-next"><small>الخطوة التالية</small><strong>{nextTask?.task.title ?? 'لا توجد خطوة مفتوحة'}</strong></div>
              <button disabled={!nextTask} onClick={() => { if (nextTask) { setActiveProject(nextTask.project.project.id); setView('path-overview') } }}>فتح المجال <ArrowLeft size={15} /></button>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
