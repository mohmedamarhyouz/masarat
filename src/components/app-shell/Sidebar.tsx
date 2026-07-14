import { Clock3, GitBranch, LayoutGrid, ListChecks, Milestone } from 'lucide-react'
import { Logo } from '../Logo'
import { useMasaratStore, type AppView } from '../../store/use-masarat-store'

const navItems: Array<{ id: AppView; label: string; hint: string; icon: typeof LayoutGrid }> = [
  { id: 'dashboard', label: 'المشاريع', hint: 'نظرة عامة', icon: LayoutGrid },
  { id: 'canvas', label: 'الخريطة', hint: 'القرارات والفروع', icon: GitBranch },
  { id: 'plan', label: 'التنفيذ', hint: 'خطوتك التالية', icon: ListChecks },
  { id: 'timeline', label: 'سجل الواقع', hint: 'ما حدث فعليًا', icon: Clock3 },
  { id: 'versions', label: 'الإصدارات', hint: 'تاريخ الخطة', icon: Milestone },
]

export function Sidebar() {
  const { view, setView, activeProjectId } = useMasaratStore()

  return (
    <aside className="sidebar">
      <div className="sidebar__brand"><Logo /></div>
      <nav className="sidebar__nav" aria-label="التنقل الرئيسي">
        {navItems.map((item) => {
          const Icon = item.icon
          const disabled = item.id !== 'dashboard' && !activeProjectId
          return (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? 'nav-item--active' : ''}`}
              aria-label={item.label}
              onClick={() => !disabled && setView(item.id)}
              disabled={disabled}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span className="nav-item__copy"><strong>{item.label}</strong><small>{item.hint}</small></span>
            </button>
          )
        })}
      </nav>
      <div className="sidebar__footer">
        <span className="offline-dot" />
        <div><strong>محلي وخاص</strong><small>لا تُرسل بياناتك لأي خادم</small></div>
      </div>
    </aside>
  )
}
