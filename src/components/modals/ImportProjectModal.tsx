import { useRef, useState, type DragEvent } from 'react'
import { Boxes, FileJson2, FileUp, GitCompareArrows, ShieldCheck } from 'lucide-react'
import { ZodError } from 'zod'
import { diffLifePack, type LifeDataState } from '../../lib/life-data'
import { diffProjects } from '../../lib/project-utils'
import { parseLifePack, parseMasaratProject } from '../../lib/schema'
import type { LifePack, LifePackDiff, MasaratProject, ProjectDiff } from '../../types/masarat'
import { Modal } from './Modal'

type Candidate =
  | { kind: 'project'; value: MasaratProject; diff?: ProjectDiff }
  | { kind: 'life-pack'; value: LifePack; diff: LifePackDiff }

interface ImportProjectModalProps {
  data: LifeDataState
  onClose: () => void
  onImport: (project: MasaratProject, mode: 'new' | 'update') => Promise<void>
  onImportLifePack: (pack: LifePack) => Promise<void>
}

export function ImportProjectModal({ data, onClose, onImport, onImportLifePack }: ImportProjectModalProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [candidate, setCandidate] = useState<Candidate>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const readFile = async (file?: File) => {
    if (!file) return
    setError(undefined)
    setCandidate(undefined)
    try {
      const raw = JSON.parse(await file.text())
      if (raw?.packageType === 'life-pack' || raw?.schemaVersion === '2.0') {
        const pack = parseLifePack(raw) as LifePack
        setCandidate({ kind: 'life-pack', value: pack, diff: diffLifePack(data, pack) })
      } else {
        const project = parseMasaratProject(raw) as MasaratProject
        const existing = data.projects.find((item) => item.project.id === project.project.id)
        setCandidate({ kind: 'project', value: project, diff: existing ? diffProjects(existing, project) : undefined })
      }
    } catch (reason) {
      if (reason instanceof ZodError) setError(reason.issues[0]?.message ?? 'بنية الملف غير متوافقة مع Masarat')
      else setError('تعذّر قراءة الملف. تأكد أنه JSON صالح بامتداد .masarat أو .json')
    }
  }

  const handleDrop = (event: DragEvent) => { event.preventDefault(); readFile(event.dataTransfer.files[0]) }
  const reset = () => { setCandidate(undefined); setError(undefined) }
  const confirm = async () => {
    if (!candidate) return
    setLoading(true)
    if (candidate.kind === 'life-pack') await onImportLifePack(candidate.value)
    else await onImport(candidate.value, candidate.diff ? 'update' : 'new')
  }

  return (
    <Modal title="استيراد إلى Masarat" subtitle="مشروع قرار واحد أو Life Pack كامل أنشأته مع أي مساعد خارجي." onClose={onClose} wide>
      {!candidate ? <>
        <button className="dropzone" onClick={() => inputRef.current?.click()} onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
          <span className="dropzone__icon"><FileUp size={27} /></span><strong>اسحب ملفك هنا، أو اضغط للاختيار</strong><small>يدعم مشروع Masarat 1.0 وLife Pack 2.0</small>
        </button>
        <input ref={inputRef} type="file" hidden accept=".masarat,.json,application/json" onChange={(event) => readFile(event.target.files?.[0])} />
        {error && <div className="form-error">{error}</div>}
        <div className="import-types"><span><FileJson2 size={18} /><strong>مشروع 1.0</strong><small>قرار أو تجربة واحدة</small></span><span><Boxes size={18} /><strong>Life Pack 2.0</strong><small>مجالات وأهداف ومسارات</small></span></div>
        <div className="trust-row"><span><ShieldCheck size={17} /> يُفحص محليًا</span><span><FileJson2 size={17} /> لا يُرفع إلى الإنترنت</span></div>
      </> : candidate.kind === 'project' ? (
        <div className="import-preview">
          <div className="import-file-card"><span className="file-icon"><FileJson2 size={24} /></span><div><strong>{candidate.value.project.title}</strong><small>{candidate.value.nodes.length} بطاقة · {candidate.value.tasks.length} مهمة · الإصدار {candidate.value.project.currentVersion}</small></div><span className="valid-badge">مشروع صالح</span></div>
          {candidate.diff && <div className="diff-box"><div className="diff-box__title"><GitCompareArrows size={18} /><strong>هذا تحديث لمشروع موجود</strong></div><p>سنحافظ على المهام المكتملة والتكاليف والملاحظات التي سجلتها.</p><div className="diff-stats"><span><b>+{candidate.diff.addedNodes.length}</b> بطاقات</span><span><b>−{candidate.diff.removedNodes.length}</b> بطاقات</span><span><b>+{candidate.diff.addedTasks.length}</b> مهام</span><span><b>{candidate.diff.changedTasks.length}</b> معدّلة</span></div></div>}
          <div className="modal-actions"><button className="button button--ghost" onClick={reset}>اختيار ملف آخر</button><button className="button button--primary" onClick={confirm} disabled={loading}>{loading ? 'جارٍ الحفظ…' : candidate.diff ? 'استيراد كتحديث' : 'استيراد المشروع'}</button></div>
        </div>
      ) : (
        <div className="import-preview">
          <div className="import-file-card"><span className="file-icon file-icon--pack"><Boxes size={24} /></span><div><strong>{candidate.value.title ?? 'Life Pack'}</strong><small>{candidate.value.areas.length} مجالات · {candidate.value.goals.length} أهداف · {candidate.value.projects.length} مسارات</small></div><span className="valid-badge">حزمة صالحة</span></div>
          <div className="diff-box diff-box--pack"><div className="diff-box__title"><GitCompareArrows size={18} /><strong>معاينة الدمج</strong></div><p>العناصر المتطابقة ستُحدّث بمعرّفاتها نفسها، وتقدم المشاريع الحالية سيبقى محفوظًا.</p><div className="pack-diff-grid"><span><b>+{candidate.diff.newAreas}</b> مجالات جديدة<small>{candidate.diff.updatedAreas} تحديث</small></span><span><b>+{candidate.diff.newGoals}</b> أهداف جديدة<small>{candidate.diff.updatedGoals} تحديث</small></span><span><b>+{candidate.diff.newProjects}</b> مسارات جديدة<small>{candidate.diff.updatedProjects} تحديث</small></span><span><b>+{candidate.diff.newMetrics}</b> مؤشرات جديدة<small>{candidate.diff.updatedMetrics} تحديث</small></span></div></div>
          <div className="modal-actions"><button className="button button--ghost" onClick={reset}>اختيار ملف آخر</button><button className="button button--primary" onClick={confirm} disabled={loading}>{loading ? 'جارٍ الدمج…' : 'دمج Life Pack'}</button></div>
        </div>
      )}
    </Modal>
  )
}
