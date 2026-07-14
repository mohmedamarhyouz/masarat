import type { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import type { MasaratProject } from '../../types/masarat'

interface AppShellProps {
  children: ReactNode
  project?: MasaratProject
  onImport: () => void
  onChange: () => void
}

export function AppShell({ children, project, onImport, onChange }: AppShellProps) {
  return (
    <div className="app-shell">
      <div className="app-ambient app-ambient--one" />
      <div className="app-ambient app-ambient--two" />
      <Sidebar />
      <div className="app-main">
        <Header project={project} onImport={onImport} onChange={onChange} />
        {children}
      </div>
    </div>
  )
}
