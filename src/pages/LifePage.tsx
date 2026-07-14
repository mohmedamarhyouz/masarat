import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Archive, ArrowLeft, Briefcase, Edit3, GraduationCap, HeartPulse, Inbox, Plus, Route, Sparkles, Users, Wallet } from 'lucide-react'
import { LifeAreaModal } from '../components/modals/LifeAreaModal'
import { LifeOrbit3D } from '../components/visuals/LifeOrbit3D'
import { HealthSegments } from '../components/visuals/LifeCharts'
import { localizedAreaName, useI18n } from '../lib/i18n'
import { useMasaratStore } from '../store/use-masarat-store'
import type { LifeArea } from '../types/masarat'

const areaIcons = { wallet: Wallet, 'graduation-cap': GraduationCap, briefcase: Briefcase, 'heart-pulse': HeartPulse, route: Route, users: Users, sparkles: Sparkles, inbox: Inbox }
export function LifePage() {
  const { language, t } = useI18n()
  const { lifeAreas, goals, projects, activeAreaId, setActiveArea, setActiveProject, setView, saveLifeArea, archiveLifeArea } = useMasaratStore()
  const [editing, setEditing] = useState<LifeArea | 'new'>()
  const [showArchived, setShowArchived] = useState(false)
  const visibleAreas = lifeAreas.filter((area) => showArchived || !area.archived)
  const selectedArea = visibleAreas.find((area) => area.id === activeAreaId) ?? visibleAreas[0]
  const selectedGoals = goals.filter((goal) => goal.areaId === selectedArea?.id)
  const selectedProjects = projects.filter((project) => project.project.areaId === selectedArea?.id)
  const health = { stable: visibleAreas.filter((area) => area.status === 'stable').length, attention: visibleAreas.filter((area) => area.status === 'attention').length, critical: visibleAreas.filter((area) => area.status === 'critical').length }
  const statusLabels = { stable: t.stable, attention: t.attention, critical: t.critical }

  return (
    <div className="page life-page">
      <section className="life-system-hero">
        <div className="life-system-hero__copy"><span className="hero-badge"><Sparkles size={14} /> {t.connectedPicture}</span><h2>{t.heroLife}</h2><p>{t.heroLifeText}</p><div className="intro-actions"><button className="button button--primary" onClick={() => setEditing('new')}><Plus size={17} /> {t.newArea}</button>{lifeAreas.some((area) => area.archived) && <button className="button button--ghost" onClick={() => setShowArchived((value) => !value)}><Archive size={16} /> {showArchived ? t.hideArchived : t.showArchived}</button>}</div><HealthSegments {...health} /></div>
        <LifeOrbit3D areas={visibleAreas} selectedId={selectedArea?.id} onSelect={setActiveArea} />
      </section>
      {selectedArea && <motion.section key={selectedArea.id} className="selected-area-panel" style={{ '--area': selectedArea.color } as React.CSSProperties} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><div className="selected-area-panel__identity"><span style={{ background: selectedArea.color }} /><div><small>{t.lifeOrbit}</small><h3>{localizedAreaName(selectedArea, language)}</h3></div><b className={`area-status area-status--${selectedArea.status}`}><i />{statusLabels[selectedArea.status]}</b></div><div className="selected-area-panel__stats"><span><strong>{selectedGoals.length}</strong>{t.areaGoals}</span><span><strong>{selectedProjects.length}</strong>{t.areaPaths}</span><span><strong>{selectedProjects.flatMap((project) => project.tasks).filter((task) => task.status === 'completed').length}</strong>{t.completed}</span></div></motion.section>}
      <div className="life-grid">
        {visibleAreas.map((area, index) => {
          const Icon = areaIcons[area.icon as keyof typeof areaIcons] ?? Inbox
          const areaGoals = goals.filter((goal) => goal.areaId === area.id)
          const areaProjects = projects.filter((project) => project.project.areaId === area.id)
          const nextTask = areaProjects.flatMap((project) => project.tasks.map((task) => ({ task, project }))).find(({ task }) => ['in_progress', 'pending'].includes(task.status))
          return (
            <motion.article className="life-area-card" key={area.id} style={{ '--area': area.color } as React.CSSProperties} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }} whileHover={{ y: -4 }}>
              <div className="life-area-card__top"><span className="life-area-icon"><Icon size={21} /></span><div className="area-card-actions"><span className={`area-status area-status--${area.status}`}><i /> {area.archived ? t.archived : statusLabels[area.status]}</span><button aria-label={`${t.edit} ${area.name}`} onClick={() => setEditing(area)}><Edit3 size={14} /></button>{area.id !== 'area-uncategorized' && !area.archived && <button aria-label={`${t.archive} ${area.name}`} onClick={() => archiveLifeArea(area.id)}><Archive size={14} /></button>}</div></div>
              <h3>{localizedAreaName(area, language)}</h3>
              <div className="area-stats"><span><strong>{areaGoals.length}</strong> {t.areaGoals}</span><span><strong>{areaProjects.length}</strong> {t.areaPaths}</span></div>
              <div className="area-next"><small>{t.nextStep}</small><strong>{nextTask?.task.title ?? t.noOpenStep}</strong></div>
              <button disabled={!nextTask} onClick={() => { if (nextTask) { setActiveProject(nextTask.project.project.id); setView('path-overview') } }}>{t.openArea} <ArrowLeft size={15} /></button>
            </motion.article>
          )
        })}
      </div>
      <AnimatePresence>{editing && <LifeAreaModal area={editing === 'new' ? undefined : editing} nextOrder={Math.max(0, ...lifeAreas.map((area) => area.order)) + 1} onClose={() => setEditing(undefined)} onSave={async (area) => { await saveLifeArea(area); setEditing(undefined) }} />}</AnimatePresence>
    </div>
  )
}
