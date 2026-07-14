import { useState, type FormEvent } from 'react'
import type { LifeArea } from '../../types/masarat'
import { useI18n } from '../../lib/i18n'
import { Modal } from './Modal'

export function LifeAreaModal({ area, nextOrder, onClose, onSave }: {
  area?: LifeArea
  nextOrder: number
  onClose: () => void
  onSave: (area: LifeArea) => Promise<void>
}) {
  const { language } = useI18n()
  const c = language === 'ar' ? { edit: 'تعديل مجال الحياة', title: 'مجال حياة جديد', subtitle: 'اجعل المجال عامًا بما يكفي ليجمع أهدافًا ومسارات متعددة.', name: 'اسم المجال', placeholder: 'مثال: الصحة', icon: 'الأيقونة', status: 'الحالة الحالية', stable: 'مستقر', attention: 'يحتاج انتباه', critical: 'حرج', color: 'لون المجال', cancel: 'إلغاء', saving: 'جارٍ الحفظ…', save: 'حفظ المجال', icons: [['wallet', 'المال'], ['graduation-cap', 'الدراسة'], ['briefcase', 'المسار المهني'], ['heart-pulse', 'الصحة'], ['route', 'التنقل'], ['users', 'العائلة'], ['sparkles', 'التطور الشخصي'], ['inbox', 'عام']] } : { edit: 'Edit life area', title: 'New life area', subtitle: 'Keep the area broad enough to hold multiple goals and paths.', name: 'Area name', placeholder: 'Example: Health', icon: 'Icon', status: 'Current status', stable: 'Stable', attention: 'Needs attention', critical: 'Critical', color: 'Area colour', cancel: 'Cancel', saving: 'Saving…', save: 'Save area', icons: [['wallet', 'Money'], ['graduation-cap', 'Study'], ['briefcase', 'Career'], ['heart-pulse', 'Health'], ['route', 'Transport'], ['users', 'Family'], ['sparkles', 'Personal growth'], ['inbox', 'General']] }
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
    <Modal title={area ? c.edit : c.title} subtitle={c.subtitle} onClose={onClose}>
      <form className="entity-form" onSubmit={submit}>
        <label><span>{c.name}</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder={c.placeholder} autoFocus required /></label>
        <div className="form-grid">
          <label><span>{c.icon}</span><select value={icon} onChange={(event) => setIcon(event.target.value)}>{c.icons.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label><span>{c.status}</span><select value={status} onChange={(event) => setStatus(event.target.value as LifeArea['status'])}><option value="stable">{c.stable}</option><option value="attention">{c.attention}</option><option value="critical">{c.critical}</option></select></label>
        </div>
        <label className="color-field"><span>{c.color}</span><div><input type="color" value={color} onChange={(event) => setColor(event.target.value)} /><code>{color}</code></div></label>
        <div className="modal-actions"><button type="button" className="button button--ghost" onClick={onClose}>{c.cancel}</button><button className="button button--primary" disabled={saving}>{saving ? c.saving : c.save}</button></div>
      </form>
    </Modal>
  )
}
