import { useState, type FormEvent } from 'react'
import type { ChangeEvent } from '../../types/masarat'
import { Modal } from './Modal'

const categories: Array<{ value: ChangeEvent['category']; label: string }> = [
  { value: 'budget', label: 'الميزانية' },
  { value: 'time', label: 'الوقت' },
  { value: 'housing', label: 'السكن' },
  { value: 'work-study', label: 'العمل أو الدراسة' },
  { value: 'goal', label: 'الهدف' },
  { value: 'new-info', label: 'معلومة جديدة' },
  { value: 'unexpected', label: 'حدث غير متوقع' },
  { value: 'opinion', label: 'تغيّر رأيي' },
]

export function ChangeModal({ onClose, onSave }: { onClose: () => void; onSave: (change: ChangeEvent) => Promise<void> }) {
  const [category, setCategory] = useState<ChangeEvent['category']>('new-info')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSave({
      id: `change-${crypto.randomUUID()}`,
      date: new Date().toISOString(),
      category,
      title,
      description,
      affectedNodeIds: [],
    })
  }

  return (
    <Modal title="ما الذي تغيّر؟" subtitle="سنحفظ نسخة من الخطة الحالية قبل تسجيل التغيير." onClose={onClose}>
      <form className="stack-form" onSubmit={submit}>
        <label>نوع التغيير<select value={category} onChange={(event) => setCategory(event.target.value as ChangeEvent['category'])}>{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label>عنوان مختصر<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="مثال: حصلت على السكن الوظيفي" required /></label>
        <label>ماذا يعني هذا للخطة؟<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="أضف المسافة الجديدة، الكلفة، أو أي معلومة مهمة…" rows={4} required /></label>
        <div className="info-note">لن تتغير الخطة تلقائيًا. صدّرها لاحقًا للتحديث بواسطة AI، ثم استورد النسخة الجديدة وراجع الفرق.</div>
        <div className="modal-actions"><button type="button" className="button button--ghost" onClick={onClose}>إلغاء</button><button className="button button--primary">حفظ وإنشاء نسخة</button></div>
      </form>
    </Modal>
  )
}
