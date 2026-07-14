import { BookOpenCheck, Clock3, Compass, LayoutGrid, Route, Settings2, SunMedium, Target } from 'lucide-react'
import { Logo } from '../Logo'
import { useI18n } from '../../lib/i18n'
import { isPathView, useMasaratStore, type PrimaryView } from '../../store/use-masarat-store'

const icons: Record<PrimaryView, typeof LayoutGrid> = { today: SunMedium, life: Compass, goals: Target, paths: Route, 'global-timeline': Clock3, reviews: BookOpenCheck, settings: Settings2 }

export function Sidebar() {
  const { view, setView } = useMasaratStore()
  const { t } = useI18n()
  const activePrimary = isPathView(view) ? 'paths' : view
  const labels: Record<PrimaryView, { label: string; hint: string }> = {
    today: { label: t.today, hint: t.todayHint }, life: { label: t.life, hint: t.lifeHint }, goals: { label: t.goals, hint: t.goalsHint }, paths: { label: t.paths, hint: t.pathsHint }, 'global-timeline': { label: t.timeline, hint: t.timelineHint }, reviews: { label: t.reviews, hint: t.reviewsHint }, settings: { label: t.settings, hint: t.settingsHint },
  }
  const groups: Array<{ label: string; items: PrimaryView[] }> = [
    { label: t.navControl, items: ['today', 'life'] },
    { label: t.navPlan, items: ['goals', 'paths'] },
    { label: t.navReflect, items: ['global-timeline', 'reviews', 'settings'] },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar__brand"><Logo /></div>
      <nav className="sidebar__nav" aria-label={t.navControl}>
        {groups.map((group) => <div className="nav-group" key={group.label}><span className="nav-group__label">{group.label}</span>{group.items.map((id) => { const Icon = icons[id]; const item = labels[id]; return <button key={id} className={`nav-item ${activePrimary === id ? 'nav-item--active' : ''}`} aria-label={item.label} onClick={() => setView(id)}><Icon size={19} strokeWidth={1.8} /><span className="nav-item__copy"><strong>{item.label}</strong><small>{item.hint}</small></span>{activePrimary === id && <i className="nav-item__active-dot" />}</button> })}</div>)}
      </nav>
      <div className="sidebar__footer"><span className="offline-dot" /><div><strong>{t.localPrivate}</strong><small>{t.localPrivateHint}</small></div></div>
    </aside>
  )
}
