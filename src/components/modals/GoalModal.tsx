import { useState, type FormEvent } from 'react'
import type { Goal, LifeArea } from '../../types/masarat'
import { localizedAreaName, useI18n } from '../../lib/i18n'
import { Modal } from './Modal'

export function GoalModal({ goal, areas, onClose, onSave }: {
  goal?: Goal
  areas: LifeArea[]
  onClose: () => void
  onSave: (goal: Goal) => Promise<void>
}) {
  const { language } = useI18n()
  const c = language === 'ar' ? { edit: 'تعديل الهدف', title: 'هدف جديد', subtitle: 'عرّف نتيجة واضحة، ثم اربط بها مشاريعك وقراراتك.', name: 'عنوان الهدف', namePlaceholder: 'ما النتيجة التي تريد الوصول إليها؟', description: 'الوصف', descriptionPlaceholder: 'لماذا هذا الهدف مهم، وكيف يبدو النجاح؟', area: 'مجال الحياة', status: 'الحالة', planned: 'مخطط', active: 'نشط', paused: 'متوقف', completed: 'مكتمل', target: 'الموعد المستهدف', progress: 'التقدم الحالي', cancel: 'إلغاء', saving: 'جارٍ الحفظ…', save: 'حفظ الهدف' } : { edit: 'Edit goal', title: 'New goal', subtitle: 'Define a clear outcome, then connect projects and decisions to it.', name: 'Goal title', namePlaceholder: 'What outcome do you want to reach?', description: 'Description', descriptionPlaceholder: 'Why does this matter, and what does success look like?', area: 'Life area', status: 'Status', planned: 'Planned', active: 'Active', paused: 'Paused', completed: 'Completed', target: 'Target date', progress: 'Current progress', cancel: 'Cancel', saving: 'Saving…', save: 'Save goal' }
  const [title, setTitle] = useState(goal?.title ?? '')
  const [description, setDescription] = useState(goal?.description ?? '')
  const [areaId, setAreaId] = useState(goal?.areaId ?? areas[0]?.id ?? 'area-uncategorized')
  const [status, setStatus] = useState<Goal['status']>(goal?.status ?? 'active')
  const [targetDate, setTargetDate] = useState(goal?.targetDate?.slice(0, 10) ?? '')
  const [progress, setProgress] = useState(goal?.progress ?? 0)
  const [saving, setSaving] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    const now = new Date().toISOString()
    await onSave({ id: goal?.id ?? `goal-${crypto.randomUUID()}`, areaId, title: title.trim(), description: description.trim() || undefined, status, targetDate: targetDate || undefined, progress, createdAt: goal?.createdAt ?? now, updatedAt: now })
  }

  return (
    <Modal title={goal ? c.edit : c.title} subtitle={c.subtitle} onClose={onClose} wide>
      <form className="entity-form" onSubmit={submit}>
        <label><span>{c.name}</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={c.namePlaceholder} autoFocus required /></label>
        <label><span>{c.description}</span><textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder={c.descriptionPlaceholder} /></label>
        <div className="form-grid form-grid--three">
          <label><span>{c.area}</span><select value={areaId} onChange={(event) => setAreaId(event.target.value)}>{areas.filter((area) => !area.archived).map((area) => <option key={area.id} value={area.id}>{localizedAreaName(area, language)}</option>)}</select></label>
          <label><span>{c.status}</span><select value={status} onChange={(event) => setStatus(event.target.value as Goal['status'])}><option value="planned">{c.planned}</option><option value="active">{c.active}</option><option value="paused">{c.paused}</option><option value="completed">{c.completed}</option></select></label>
          <label><span>{c.target}</span><input type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} /></label>
        </div>
        <label className="range-field"><span>{c.progress} <b>{progress}%</b></span><input type="range" min="0" max="100" step="5" value={progress} onChange={(event) => setProgress(Number(event.target.value))} /></label>
        <div className="modal-actions"><button type="button" className="button button--ghost" onClick={onClose}>{c.cancel}</button><button className="button button--primary" disabled={saving}>{saving ? c.saving : c.save}</button></div>
      </form>
    </Modal>
  )
}
