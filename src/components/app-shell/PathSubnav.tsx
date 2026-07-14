import { ArrowRight, GitBranch, History, LayoutDashboard, ListChecks, Radio } from 'lucide-react'
import { useMasaratStore, type PathView } from '../../store/use-masarat-store'

const items: Array<{ id: PathView; label: string; icon: typeof GitBranch }> = [
  { id: 'path-overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'canvas', label: 'الخريطة', icon: GitBranch },
  { id: 'plan', label: 'التنفيذ', icon: ListChecks },
  { id: 'timeline', label: 'الواقع', icon: Radio },
  { id: 'versions', label: 'الإصدارات', icon: History },
]

export function PathSubnav() {
  const { view, setView } = useMasaratStore()

  return (
    <nav className="path-subnav" aria-label="التنقل داخل المسار">
      <button className="path-subnav__back" onClick={() => setView('paths')}>
        <ArrowRight size={15} /> كل المسارات
      </button>
      <div className="path-subnav__items">
        {items.map((item) => {
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
