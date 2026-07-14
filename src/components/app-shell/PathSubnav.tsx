import { ArrowRight, GitBranch, History, LayoutDashboard, ListChecks, Radio } from 'lucide-react'
import { useMasaratStore, type PathView } from '../../store/use-masarat-store'
import { useI18n } from '../../lib/i18n'

const items: Array<{ id: PathView; label: string; icon: typeof GitBranch }> = [
  { id: 'path-overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'canvas', label: 'الخريطة', icon: GitBranch },
  { id: 'plan', label: 'التنفيذ', icon: ListChecks },
  { id: 'timeline', label: 'الواقع', icon: Radio },
  { id: 'versions', label: 'الإصدارات', icon: History },
]

export function PathSubnav() {
  const { view, setView } = useMasaratStore()
  const { language } = useI18n()
  const translated = language === 'ar' ? items : [
    { id: 'path-overview' as PathView, label: 'Overview', icon: LayoutDashboard }, { id: 'canvas' as PathView, label: 'Map', icon: GitBranch }, { id: 'plan' as PathView, label: 'Execution', icon: ListChecks }, { id: 'timeline' as PathView, label: 'Reality', icon: Radio }, { id: 'versions' as PathView, label: 'Versions', icon: History },
  ]

  return (
    <nav className="path-subnav" aria-label="التنقل داخل المسار">
      <button className="path-subnav__back" onClick={() => setView('paths')}>
        <ArrowRight size={15} /> {language === 'ar' ? 'كل المسارات' : 'All paths'}
      </button>
      <div className="path-subnav__items">
        {translated.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={view === item.id ? 'active' : ''}
              onClick={() => setView(item.id)}
            >
              <Icon size={15} /> {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
