import { Download, FileUp, Languages, Plus, Sparkles, Zap } from 'lucide-react'
import { calculateProgress, downloadProject } from '../../lib/project-utils'
import type { MasaratProject } from '../../types/masarat'
import { useMasaratStore, type PrimaryView } from '../../store/use-masarat-store'
import { useI18n } from '../../lib/i18n'

const pageTitles: Record<PrimaryView, { eyebrow: string; title: string }> = {
  today: { eyebrow: 'مركز القيادة', title: 'اليوم' },
  life: { eyebrow: 'الصورة الكاملة', title: 'حياتي' },
  goals: { eyebrow: 'الاتجاه والنتيجة', title: 'الأهداف' },
  paths: { eyebrow: 'المشاريع والقرارات', title: 'المسارات' },
  'global-timeline': { eyebrow: 'ذاكرة حياتك', title: 'الخط الزمني' },
  reviews: { eyebrow: 'تعلّم من الواقع', title: 'المراجعات' },
  settings: { eyebrow: 'الخصوصية والتحكم', title: 'الإعدادات' },
}

interface HeaderProps {
  project?: MasaratProject
  onImport: () => void
  onChange: () => void
}

export function Header({ project, onImport, onChange }: HeaderProps) {
  const view = useMasaratStore((state) => state.view)
  const { language, setLanguage, t } = useI18n()
  const localizedTitles: Record<PrimaryView, { eyebrow: string; title: string }> = {
    today: { eyebrow: t.commandCenter, title: t.today }, life: { eyebrow: t.fullPicture, title: t.life }, goals: { eyebrow: t.direction, title: t.goals }, paths: { eyebrow: t.projectsDecisions, title: t.paths }, 'global-timeline': { eyebrow: t.lifeMemory, title: t.timeline }, reviews: { eyebrow: t.learnReality, title: t.reviews }, settings: { eyebrow: t.privacyControl, title: t.settings },
  }
  const progress = project ? calculateProgress(project) : 0
  const nextTask = project?.tasks.find((task) => task.status === 'in_progress') ?? project?.tasks.find((task) => task.status === 'pending')
  return (
    <header className="topbar">
      <div className="topbar__context">
        {project ? (
          <>
            <div className="progress-orb" style={{ '--progress': `${progress * 3.6}deg` } as React.CSSProperties}>
              <span>{progress}%</span>
            </div>
            <div>
              <span className="eyebrow">{t.activePath}</span>
              <h1>{project.project.title}</h1>
            </div>
            {nextTask && <div className="topbar__next"><Zap size={14} /><div><small>{t.next}</small><strong>{nextTask.title}</strong></div></div>}
          </>
        ) : (
          <div>
            <span className="eyebrow">{localizedTitles[view as PrimaryView]?.eyebrow ?? pageTitles[view as PrimaryView]?.eyebrow}</span>
            <h1>{localizedTitles[view as PrimaryView]?.title ?? 'Masarat'}</h1>
          </div>
        )}
      </div>
      <div className="topbar__actions">
        {project && (
          <>
            <button className="button button--ghost hide-mobile" onClick={() => downloadProject(project)} title="تصدير نسخة احتياطية">
              <Download size={17} />
              {t.export}
            </button>
            <button className="button button--accent" onClick={onChange}>
              <Sparkles size={17} />
              {t.changed}
            </button>
          </>
        )}
        <button className="language-switch" onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} title={t.languageTitle}><Languages size={16} /><span>{t.language}</span></button>
        <button className="icon-button" onClick={onImport} title={t.importFile}>
          {project ? <FileUp size={19} /> : <Plus size={20} />}
        </button>
      </div>
    </header>
  )
}
