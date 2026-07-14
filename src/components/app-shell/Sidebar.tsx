import {
  BookOpenCheck,
  Clock3,
  Compass,
  LayoutGrid,
  Route,
  Settings2,
  SunMedium,
  Target,
} from 'lucide-react'
import { Logo } from '../Logo'
import { isPathView, useMasaratStore, type PrimaryView } from '../../store/use-masarat-store'

const navItems: Array<{ id: PrimaryView; label: string; hint: string; icon: typeof LayoutGrid }> = [
  { id: 'today', label: 'اليوم', hint: 'مركز التركيز', icon: SunMedium },
  { id: 'life', label: 'حياتي', hint: 'كل المجالات', icon: Compass },
  { id: 'goals', label: 'الأهداف', hint: 'ما تريد تحقيقه', icon: Target },
  { id: 'paths', label: 'المسارات', hint: 'المشاريع والقرارات', icon: Route },
  { id: 'global-timeline', label: 'الخط الزمني', hint: 'ما حدث وتغيّر', icon: Clock3 },
  { id: 'reviews', label: 'المراجعات', hint: 'تعلّم وعدّل', icon: BookOpenCheck },
  { id: 'settings', label: 'الإعدادات', hint: 'الخصوصية والنسخ', icon: Settings2 },
]

export function Sidebar() {
  const { view, setView } = useMasaratStore()
  const activePrimary = isPathView(view) ? 'paths' : view

  return (
    <aside className="sidebar">
      <div className="sidebar__brand"><Logo /></div>
      <nav className="sidebar__nav" aria-label="التنقل الرئيسي">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`nav-item ${activePrimary === item.id ? 'nav-item--active' : ''}`}
              aria-label={item.label}
              onClick={() => setView(item.id)}
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
