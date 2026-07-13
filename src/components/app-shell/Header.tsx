import { Download, FileUp, Plus, Sparkles } from 'lucide-react'
import { calculateProgress, downloadProject } from '../../lib/project-utils'
import type { MasaratProject } from '../../types/masarat'

interface HeaderProps {
  project?: MasaratProject
  onImport: () => void
  onChange: () => void
}

export function Header({ project, onImport, onChange }: HeaderProps) {
  const progress = project ? calculateProgress(project) : 0
  return (
    <header className="topbar">
      <div className="topbar__context">
        {project ? (
          <>
            <div className="progress-orb" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}>
              <span>{progress}%</span>
            </div>
            <div>
              <span className="eyebrow">المشروع النشط</span>
              <h1>{project.project.title}</h1>
            </div>
          </>
        ) : (
          <div>
            <span className="eyebrow">مساحة قراراتك</span>
            <h1>كل المسارات</h1>
          </div>
        )}
      </div>
      <div className="topbar__actions">
        {project && (
          <>
            <button className="button button--ghost hide-mobile" onClick={() => downloadProject(project)} title="تصدير نسخة احتياطية">
              <Download size={17} />
              تصدير
            </button>
            <button className="button button--accent" onClick={onChange}>
              <Sparkles size={17} />
              تغيّر شيء
            </button>
          </>
        )}
        <button className="icon-button" onClick={onImport} title="استيراد ملف Masarat">
          {project ? <FileUp size={19} /> : <Plus size={20} />}
        </button>
      </div>
    </header>
  )
}
