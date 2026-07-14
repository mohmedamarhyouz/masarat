import { useState, type FormEvent } from 'react'
import type { LifeArea } from '../../types/masarat'
import { Modal } from './Modal'

const iconOptions = [
  ['wallet', 'المال'], ['graduation-cap', 'الدراسة'], ['briefcase', 'المسار المهني'], ['heart-pulse', 'الصحة'],
  ['route', 'التنقل'], ['users', 'العائلة'], ['sparkles', 'التطور الشخصي'], ['inbox', 'عام'],
]

export function LifeAreaModal({ area, nextOrder, onClose, onSave }: {
  area?: LifeArea
  nextOrder: number
  onClose: () => void
  onSave: (area: LifeArea) => Promise<void>
}) {
  const [name, setName] = useState(area?.name ?? '')
  const [icon, setIcon] = useState(area?.icon ?? 'sparkles')
  const [color, setColor] = useState(area?.color ?? '#64adff')
  const [status, setStatus] = useState<LifeArea['status']>(area?.status ?? 'stable')
  const [saving, setSaving] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    const now = new Date().toISOString()
    await onSave({
      id: area?.id ?? `area-${crypto.randomUUID()}`,
      name: name.trim(),
      icon,
      color,
      status,
      order: area?.order ?? nextOrder,
      createdAt: area?.createdAt ?? now,
      updatedAt: now,
      archived: false,
    })
  }

  return (
    <Modal title={area ? 'تعديل مجال الحياة' : 'مجال حياة جديد'} subtitle="اجعل المجال عامًا بما يكفي ليجمع أهدافًا ومسارات متعددة." onClose={onClose}>
      <form className="entity-form" onSubmit={submit}>
        <label><span>اسم المجال</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="مثال: الصحة" autoFocus required /></label>
        <div className="form-grid">
          <label><span>الأيقونة</span><select value={icon} onChange={(event) => setIcon(event.target.value)}>{iconOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label><span>الحالة الحالية</span><select value={status} onChange={(event) => setStatus(event.target.value as LifeArea['status'])}><option value="stable">مستقر</option><option value="attention">يحتاج انتباه</option><option value="critical">حرج</option></select></label>
        </div>
        <label className="color-field"><span>لون المجال</span><div><input type="color" value={color} onChange={(event) => setColor(event.target.value)} /><code>{color}</code></div></label>
        <div className="modal-actions"><button type="button" className="button button--ghost" onClick={onClose}>إلغاء</button><button className="button button--primary" disabled={saving}>{saving ? 'جارٍ الحفظ…' : 'حفظ المجال'}</button></div>
      </form>
    </Modal>
  )
}
