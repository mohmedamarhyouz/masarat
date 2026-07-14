import type { ReactNode } from 'react'
import { Header } from './Header'
import { PathSubnav } from './PathSubnav'
import { Sidebar } from './Sidebar'
import type { MasaratProject } from '../../types/masarat'
import { isPathView, useMasaratStore } from '../../store/use-masarat-store'

interface AppShellProps {
  children: ReactNode
  project?: MasaratProject
  onImport: () => void
  onChange: () => void
}

export function AppShell({ children, project, onImport, onChange }: AppShellProps) {
  const view = useMasaratStore((state) => state.view)
  const insidePath = Boolean(project && isPathView(view))

  return (
    <div className="app-shell">
      <div className="app-ambient app-ambient--one" />
      <div className="app-ambient app-ambient--two" />
      <Sidebar />
      <div className="app-main">
        <Header project={insidePath ? project : undefined} onImport={onImport} onChange={onChange} />
        {insidePath && <PathSubnav />}
        {children}
      </div>
    </div>
  )
}
