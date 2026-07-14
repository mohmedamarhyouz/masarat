import { ArrowRight, BrainCircuit, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { buildSmartInsights } from '../../lib/smart-insights'
import { useI18n } from '../../lib/i18n'
import { useMasaratStore } from '../../store/use-masarat-store'

export function SmartBrief() {
  const { language, t } = useI18n()
  const { projects, lifeAreas, goals, setView, setActiveProject } = useMasaratStore()
  const insights = buildSmartInsights(projects, lifeAreas, goals)
  const openTasks = projects.flatMap((project) => project.tasks).filter((task) => !['completed', 'cancelled'].includes(task.status)).length
  const criticalAreas = lifeAreas.filter((area) => !area.archived && area.status === 'critical').length
  const c = language === 'ar' ? { scan: 'نطاق الفحص', paths: 'مسارات', open: 'مهام مفتوحة', critical: 'مجالات حرجة', updated: 'يُحدّث تلقائيًا من بياناتك المحلية' } : { scan: 'System scan', paths: 'Paths', open: 'Open tasks', critical: 'Critical areas', updated: 'Updates automatically from your local data' }

  const openInsight = (index: number) => {
    const insight = insights[index]
    if (insight.projectId) setActiveProject(insight.projectId)
    setView(insight.view)
  }

  return (
    <section className="smart-brief">
      <div className="smart-brief__header"><div className="smart-brief__identity"><span><BrainCircuit size={19} /></span><div><strong>{t.smartBrief}</strong><small><Sparkles size={11} /> {t.smartOffline}</small></div></div><span className="smart-live"><i /> LIVE</span></div>
      <div className="smart-insight-list">
        {insights.slice(0, 3).map((insight, index) => {
          const Icon = insight.severity === 'positive' ? CheckCircle2 : ShieldAlert
          return (
            <motion.button key={insight.id} className={`smart-insight smart-insight--${insight.severity}`} onClick={() => openInsight(index)} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .08 }}>
              <span className="smart-insight__icon"><Icon size={17} /></span><span><strong>{insight.title[language]}</strong><small>{insight.description[language]}</small></span><i className="smart-insight__open"><ArrowRight size={15} /></i>
            </motion.button>
          )
        })}
      </div>
      <div className="smart-brief__scan"><div><span>{c.scan}</span><small>{c.updated}</small></div><ul><li><strong>{projects.length}</strong>{c.paths}</li><li><strong>{openTasks}</strong>{c.open}</li><li><strong>{criticalAreas}</strong>{c.critical}</li></ul></div>
    </section>
  )
}
