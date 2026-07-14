import { useRef, useState, type DragEvent } from 'react'
import { Boxes, FileJson2, FileUp, GitCompareArrows, ShieldCheck } from 'lucide-react'
import { ZodError } from 'zod'
import { diffLifePack, type LifeDataState } from '../../lib/life-data'
import { useI18n } from '../../lib/i18n'
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
  const { language } = useI18n()
  const c = language === 'ar' ? { invalid: 'بنية الملف غير متوافقة مع Masarat', unreadable: 'تعذّر قراءة الملف. تأكد أنه JSON صالح بامتداد .masarat أو .json', title: 'استيراد إلى Masarat', subtitle: 'مشروع قرار واحد أو Life Pack كامل أنشأته مع أي مساعد خارجي.', drop: 'اسحب ملفك هنا، أو اضغط للاختيار', supports: 'يدعم مشروع Masarat 1.0 وLife Pack 2.0', project: 'مشروع 1.0', projectHint: 'قرار أو تجربة واحدة', pack: 'Life Pack 2.0', packHint: 'مجالات وأهداف ومسارات', local: 'يُفحص محليًا', private: 'لا يُرفع إلى الإنترنت', cards: 'بطاقة', tasks: 'مهمة', version: 'الإصدار', validProject: 'مشروع صالح', update: 'هذا تحديث لمشروع موجود', preserve: 'سنحافظ على المهام المكتملة والتكاليف والملاحظات التي سجلتها.', changed: 'معدّلة', choose: 'اختيار ملف آخر', saving: 'جارٍ الحفظ…', importUpdate: 'استيراد كتحديث', importProject: 'استيراد المشروع', areas: 'مجالات', goals: 'أهداف', paths: 'مسارات', validPack: 'حزمة صالحة', preview: 'معاينة الدمج', mergeText: 'العناصر المتطابقة ستُحدّث بمعرّفاتها نفسها، وتقدم المشاريع الحالية سيبقى محفوظًا.', newAreas: 'مجالات جديدة', newGoals: 'أهداف جديدة', newPaths: 'مسارات جديدة', newMetrics: 'مؤشرات جديدة', updated: 'تحديث', merging: 'جارٍ الدمج…', merge: 'دمج Life Pack' } : { invalid: 'This file is not compatible with Masarat', unreadable: 'Could not read the file. Use valid JSON with a .masarat or .json extension.', title: 'Import into Masarat', subtitle: 'A single decision project or a complete Life Pack created with any external assistant.', drop: 'Drop your file here, or click to choose', supports: 'Supports Masarat Project 1.0 and Life Pack 2.0', project: 'Project 1.0', projectHint: 'One decision or experiment', pack: 'Life Pack 2.0', packHint: 'Areas, goals and paths', local: 'Validated locally', private: 'Never uploaded', cards: 'cards', tasks: 'tasks', version: 'version', validProject: 'Valid project', update: 'This updates an existing project', preserve: 'Completed tasks, actual costs, and your notes will be preserved.', changed: 'changed', choose: 'Choose another file', saving: 'Saving…', importUpdate: 'Import update', importProject: 'Import project', areas: 'areas', goals: 'goals', paths: 'paths', validPack: 'Valid pack', preview: 'Merge preview', mergeText: 'Matching items update using stable IDs, while existing project progress remains preserved.', newAreas: 'new areas', newGoals: 'new goals', newPaths: 'new paths', newMetrics: 'new metrics', updated: 'updated', merging: 'Merging…', merge: 'Merge Life Pack' }
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
      if (reason instanceof ZodError) setError(reason.issues[0]?.message ?? c.invalid)
      else setError(c.unreadable)
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
    <Modal title={c.title} subtitle={c.subtitle} onClose={onClose} wide>
      {!candidate ? <>
        <button className="dropzone" onClick={() => inputRef.current?.click()} onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
          <span className="dropzone__icon"><FileUp size={27} /></span><strong>{c.drop}</strong><small>{c.supports}</small>
        </button>
        <input ref={inputRef} type="file" hidden accept=".masarat,.json,application/json" onChange={(event) => readFile(event.target.files?.[0])} />
        {error && <div className="form-error">{error}</div>}
        <div className="import-types"><span><FileJson2 size={18} /><strong>{c.project}</strong><small>{c.projectHint}</small></span><span><Boxes size={18} /><strong>{c.pack}</strong><small>{c.packHint}</small></span></div>
        <div className="trust-row"><span><ShieldCheck size={17} /> {c.local}</span><span><FileJson2 size={17} /> {c.private}</span></div>
      </> : candidate.kind === 'project' ? (
        <div className="import-preview">
          <div className="import-file-card"><span className="file-icon"><FileJson2 size={24} /></span><div><strong>{candidate.value.project.title}</strong><small>{candidate.value.nodes.length} {c.cards} · {candidate.value.tasks.length} {c.tasks} · {c.version} {candidate.value.project.currentVersion}</small></div><span className="valid-badge">{c.validProject}</span></div>
          {candidate.diff && <div className="diff-box"><div className="diff-box__title"><GitCompareArrows size={18} /><strong>{c.update}</strong></div><p>{c.preserve}</p><div className="diff-stats"><span><b>+{candidate.diff.addedNodes.length}</b> {c.cards}</span><span><b>−{candidate.diff.removedNodes.length}</b> {c.cards}</span><span><b>+{candidate.diff.addedTasks.length}</b> {c.tasks}</span><span><b>{candidate.diff.changedTasks.length}</b> {c.changed}</span></div></div>}
          <div className="modal-actions"><button className="button button--ghost" onClick={reset}>{c.choose}</button><button className="button button--primary" onClick={confirm} disabled={loading}>{loading ? c.saving : candidate.diff ? c.importUpdate : c.importProject}</button></div>
        </div>
      ) : (
        <div className="import-preview">
          <div className="import-file-card"><span className="file-icon file-icon--pack"><Boxes size={24} /></span><div><strong>{candidate.value.title ?? 'Life Pack'}</strong><small>{candidate.value.areas.length} {c.areas} · {candidate.value.goals.length} {c.goals} · {candidate.value.projects.length} {c.paths}</small></div><span className="valid-badge">{c.validPack}</span></div>
          <div className="diff-box diff-box--pack"><div className="diff-box__title"><GitCompareArrows size={18} /><strong>{c.preview}</strong></div><p>{c.mergeText}</p><div className="pack-diff-grid"><span><b>+{candidate.diff.newAreas}</b> {c.newAreas}<small>{candidate.diff.updatedAreas} {c.updated}</small></span><span><b>+{candidate.diff.newGoals}</b> {c.newGoals}<small>{candidate.diff.updatedGoals} {c.updated}</small></span><span><b>+{candidate.diff.newProjects}</b> {c.newPaths}<small>{candidate.diff.updatedProjects} {c.updated}</small></span><span><b>+{candidate.diff.newMetrics}</b> {c.newMetrics}<small>{candidate.diff.updatedMetrics} {c.updated}</small></span></div></div>
          <div className="modal-actions"><button className="button button--ghost" onClick={reset}>{c.choose}</button><button className="button button--primary" onClick={confirm} disabled={loading}>{loading ? c.merging : c.merge}</button></div>
        </div>
      )}
    </Modal>
  )
}
