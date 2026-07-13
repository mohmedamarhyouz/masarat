import { useRef, useState, type DragEvent } from 'react'
import { FileJson2, FileUp, GitCompareArrows, ShieldCheck } from 'lucide-react'
import { ZodError } from 'zod'
import { diffProjects } from '../../lib/project-utils'
import { parseMasaratProject } from '../../lib/schema'
import type { MasaratProject, ProjectDiff } from '../../types/masarat'
import { Modal } from './Modal'

interface ImportProjectModalProps {
  projects: MasaratProject[]
  onClose: () => void
  onImport: (project: MasaratProject, mode: 'new' | 'update') => Promise<void>
}

export function ImportProjectModal({ projects, onClose, onImport }: ImportProjectModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [candidate, setCandidate] = useState<MasaratProject>()
  const [diff, setDiff] = useState<ProjectDiff>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const readFile = async (file?: File) => {
    if (!file) return
    setError(undefined)
    setCandidate(undefined)
    try {
      const raw = JSON.parse(await file.text())
      const project = parseMasaratProject(raw) as MasaratProject
      const existing = projects.find((item) => item.project.id === project.project.id)
      setCandidate(project)
      setDiff(existing ? diffProjects(existing, project) : undefined)
    } catch (reason) {
      if (reason instanceof ZodError) {
        setError(reason.issues[0]?.message ?? 'بنية الملف غير متوافقة مع Masarat 1.0')
      } else {
        setError('تعذّر قراءة الملف. تأكد أنه JSON صالح بامتداد .masarat أو .json')
      }
    }
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    readFile(event.dataTransfer.files[0])
  }

  const confirm = async () => {
    if (!candidate) return
    setLoading(true)
    await onImport(candidate, diff ? 'update' : 'new')
  }

  return (
    <Modal title="استيراد مشروع" subtitle="ملف منظم أنشأته مع أي مساعد ذكاء اصطناعي، أو حررته يدويًا." onClose={onClose} wide>
      {!candidate ? (
        <>
          <button className="dropzone" onClick={() => inputRef.current?.click()} onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
            <span className="dropzone__icon"><FileUp size={27} /></span>
            <strong>اسحب ملفك هنا، أو اضغط للاختيار</strong>
            <small>يدعم .masarat و .json — الإصدار 1.0</small>
          </button>
          <input ref={inputRef} type="file" hidden accept=".masarat,.json,application/json" onChange={(event) => readFile(event.target.files?.[0])} />
          {error && <div className="form-error">{error}</div>}
          <div className="trust-row">
            <span><ShieldCheck size={17} /> يُفحص محليًا</span>
            <span><FileJson2 size={17} /> لا يُرفع إلى الإنترنت</span>
          </div>
        </>
      ) : (
        <div className="import-preview">
          <div className="import-file-card">
            <span className="file-icon"><FileJson2 size={24} /></span>
            <div><strong>{candidate.project.title}</strong><small>{candidate.nodes.length} بطاقة · {candidate.tasks.length} مهمة · الإصدار {candidate.project.currentVersion}</small></div>
            <span className="valid-badge">ملف صالح</span>
          </div>
          {diff && (
            <div className="diff-box">
              <div className="diff-box__title"><GitCompareArrows size={18} /><strong>هذا تحديث لمشروع موجود</strong></div>
              <p>سنحافظ على المهام المكتملة والتكاليف والملاحظات التي سجلتها.</p>
              <div className="diff-stats">
                <span><b>+{diff.addedNodes.length}</b> بطاقات</span>
                <span><b>−{diff.removedNodes.length}</b> بطاقات</span>
                <span><b>+{diff.addedTasks.length}</b> مهام</span>
                <span><b>{diff.changedTasks.length}</b> معدّلة</span>
              </div>
            </div>
          )}
          <div className="modal-actions">
            <button className="button button--ghost" onClick={() => { setCandidate(undefined); setDiff(undefined) }}>اختيار ملف آخر</button>
            <button className="button button--primary" onClick={confirm} disabled={loading}>{loading ? 'جارٍ الحفظ…' : diff ? 'استيراد كتحديث' : 'استيراد المشروع'}</button>
          </div>
        </div>
      )}
    </Modal>
  )
}
