import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { AppShell } from './components/app-shell/AppShell'
import { ChangeModal } from './components/modals/ChangeModal'
import { ImportProjectModal } from './components/modals/ImportProjectModal'
import { OnboardingModal } from './components/modals/OnboardingModal'
import { RealityEventModal } from './components/modals/RealityEventModal'
import { DashboardPage } from './pages/DashboardPage'
import { GlobalTimelinePage } from './pages/GlobalTimelinePage'
import { GoalsPage } from './pages/GoalsPage'
import { LifePage } from './pages/LifePage'
import { PathOverviewPage } from './pages/PathOverviewPage'
import { ReviewsPage } from './pages/ReviewsPage'
import { SettingsPage } from './pages/SettingsPage'
import { TodayPage } from './pages/TodayPage'
import { isPathView, useMasaratStore } from './store/use-masarat-store'
import type { ChangeEvent, RealityEvent } from './types/masarat'

const CanvasPage = lazy(() => import('./pages/CanvasPage').then((module) => ({ default: module.CanvasPage })))
const PlanPage = lazy(() => import('./pages/PlanPage').then((module) => ({ default: module.PlanPage })))
const TimelinePage = lazy(() => import('./pages/TimelinePage').then((module) => ({ default: module.TimelinePage })))
const VersionsPage = lazy(() => import('./pages/VersionsPage').then((module) => ({ default: module.VersionsPage })))

function App() {
  const {
    projects,
    lifeAreas,
    goals,
    metrics,
    metricEntries,
    reviews,
    activeProjectId,
    view,
    isReady,
    initialize,
    importProject,
    importLifePack,
    recordChange,
    addRealityEvent,
  } = useMasaratStore()
  const [showImport, setShowImport] = useState(false)
  const [showChange, setShowChange] = useState(false)
  const [showReality, setShowReality] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => localStorage.getItem('masarat-onboarding-v1') !== 'done')
  const [toast, setToast] = useState<string>()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(undefined), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const activeProject = useMemo(
    () => projects.find((project) => project.project.id === activeProjectId),
    [activeProjectId, projects],
  )

  if (!isReady) {
    return (
      <div className="app-loader">
        <div className="loader-mark"><span /></div>
        <p>نرتّب مساراتك…</p>
      </div>
    )
  }

  const page = (() => {
    if (view === 'today') return <TodayPage onQuickEvent={() => setShowReality(true)} onQuickChange={() => setShowChange(true)} />
    if (view === 'life') return <LifePage />
    if (view === 'goals') return <GoalsPage />
    if (view === 'paths') return <DashboardPage onImport={() => setShowImport(true)} />
    if (view === 'global-timeline') return <GlobalTimelinePage />
    if (view === 'reviews') return <ReviewsPage />
    if (view === 'settings') return <SettingsPage onImport={() => setShowImport(true)} onNotify={setToast} />
    if (!activeProject) {
      return <DashboardPage onImport={() => setShowImport(true)} />
    }
    if (view === 'path-overview') return <PathOverviewPage project={activeProject} />
    if (view === 'canvas') return <CanvasPage project={activeProject} />
    if (view === 'plan') return <PlanPage project={activeProject} />
    if (view === 'timeline') {
      return <TimelinePage project={activeProject} onAddEvent={() => setShowReality(true)} />
    }
    return <VersionsPage project={activeProject} onNotify={setToast} />
  })()

  const saveChange = async (change: ChangeEvent) => {
    await recordChange(change)
    setShowChange(false)
    setToast('تم حفظ التغيير وإنشاء نسخة من الخطة السابقة')
  }

  const saveReality = async (event: RealityEvent) => {
    await addRealityEvent(event)
    setShowReality(false)
    setToast('تمت إضافة الحدث إلى سجل الواقع')
  }

  return (
    <>
      <AppShell
        project={isPathView(view) ? activeProject : undefined}
        onImport={() => setShowImport(true)}
        onChange={() => setShowChange(true)}
      >
        <AnimatePresence mode="wait">
          <motion.main
            key={`${view}-${activeProjectId ?? 'none'}`}
            className="page-stage"
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<div className="page-loader">جارٍ فتح المسار…</div>}>{page}</Suspense>
          </motion.main>
        </AnimatePresence>
      </AppShell>

      <AnimatePresence>
        {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} onImport={() => setShowImport(true)} />}
        {showImport && (
          <ImportProjectModal
            data={{ projects, lifeAreas, goals, metrics, metricEntries, reviews }}
            onClose={() => setShowImport(false)}
            onImport={async (project, mode) => {
              await importProject(project, mode)
              setShowImport(false)
              setToast(mode === 'update' ? 'تم تحديث المشروع مع الحفاظ على تقدمك' : 'تم استيراد المشروع بنجاح')
            }}
            onImportLifePack={async (pack) => {
              await importLifePack(pack)
              setShowImport(false)
              setToast('تم دمج Life Pack مع الحفاظ على تقدم المشاريع الحالية')
            }}
          />
        )}
        {showChange && activeProject && <ChangeModal onClose={() => setShowChange(false)} onSave={saveChange} />}
        {showReality && activeProject && <RealityEventModal onClose={() => setShowReality(false)} onSave={saveReality} />}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
            <CheckCircle2 size={18} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
