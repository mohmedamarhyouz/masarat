import { useState, type FormEvent } from 'react'
import type { Goal, LifeArea } from '../../types/masarat'
import { Modal } from './Modal'

export function GoalModal({ goal, areas, onClose, onSave }: {
  goal?: Goal
  areas: LifeArea[]
  onClose: () => void
  onSave: (goal: Goal) => Promise<void>
}) {
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
    <Modal title={goal ? 'تعديل الهدف' : 'هدف جديد'} subtitle="عرّف نتيجة واضحة، ثم اربط بها مشاريعك وقراراتك." onClose={onClose} wide>
      <form className="entity-form" onSubmit={submit}>
        <label><span>عنوان الهدف</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="ما النتيجة التي تريد الوصول إليها؟" autoFocus required /></label>
        <label><span>الوصف</span><textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="لماذا هذا الهدف مهم، وكيف يبدو النجاح؟" /></label>
        <div className="form-grid form-grid--three">
          <label><span>مجال الحياة</span><select value={areaId} onChange={(event) => setAreaId(event.target.value)}>{areas.filter((area) => !area.archived).map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}</select></label>
          <label><span>الحالة</span><select value={status} onChange={(event) => setStatus(event.target.value as Goal['status'])}><option value="planned">مخطط</option><option value="active">نشط</option><option value="paused">متوقف</option><option value="completed">مكتمل</option></select></label>
          <label><span>الموعد المستهدف</span><input type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} /></label>
        </div>
        <label className="range-field"><span>التقدم الحالي <b>{progress}%</b></span><input type="range" min="0" max="100" step="5" value={progress} onChange={(event) => setProgress(Number(event.target.value))} /></label>
        <div className="modal-actions"><button type="button" className="button button--ghost" onClick={onClose}>إلغاء</button><button className="button button--primary" disabled={saving}>{saving ? 'جارٍ الحفظ…' : 'حفظ الهدف'}</button></div>
      </form>
    </Modal>
  )
}
