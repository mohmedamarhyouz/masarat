import { useState, type FormEvent } from 'react'
import type { RealityEvent } from '../../types/masarat'
import { Modal } from './Modal'

export function RealityEventModal({ onClose, onSave }: { onClose: () => void; onSave: (event: RealityEvent) => Promise<void> }) {
  const [type, setType] = useState<RealityEvent['type']>('observation')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSave({
      id: `event-${crypto.randomUUID()}`,
      date: new Date().toISOString(),
      type,
      title,
      description: description || undefined,
      cost: cost ? Number(cost) : undefined,
    })
  }

  return (
    <Modal title="سجّل ما حدث فعلًا" subtitle="ملاحظة أو كلفة أو نتيجة من الواقع، بعيدًا عن التوقعات." onClose={onClose}>
      <form className="stack-form" onSubmit={submit}>
        <label>نوع الحدث<select value={type} onChange={(event) => setType(event.target.value as RealityEvent['type'])}><option value="observation">ملاحظة</option><option value="expense">مصروف</option><option value="result">نتيجة تجربة</option><option value="note">معلومة</option></select></label>
        <label>ماذا حدث؟<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="مثال: قطعت 34 كم بشحنة واحدة" required /></label>
        <label>التفاصيل<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="الوقت، الظروف، وما لاحظته…" /></label>
        <label>الكلفة الفعلية بالدرهم — اختياري<input type="number" min="0" value={cost} onChange={(event) => setCost(event.target.value)} placeholder="0" /></label>
        <div className="modal-actions"><button type="button" className="button button--ghost" onClick={onClose}>إلغاء</button><button className="button button--primary">إضافة للسجل</button></div>
      </form>
    </Modal>
  )
}
