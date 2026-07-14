import { useState, type FormEvent } from 'react'
import { linesToList, listToLines } from '../../lib/life-data'
import type { Review } from '../../types/masarat'
import { Modal } from './Modal'

export function ReviewModal({ review, type = 'weekly', onClose, onSave }: {
  review?: Review
  type?: Review['type']
  onClose: () => void
  onSave: (review: Review) => Promise<void>
}) {
  const [reviewType, setReviewType] = useState<Review['type']>(review?.type ?? type)
  const [startDate, setStartDate] = useState(review?.startDate.slice(0, 10) ?? new Date().toISOString().slice(0, 10))
  const [summary, setSummary] = useState(review?.summary ?? '')
  const [wins, setWins] = useState(review ? listToLines(review.wins) : '')
  const [problems, setProblems] = useState(review ? listToLines(review.problems) : '')
  const [nextFocus, setNextFocus] = useState(review ? listToLines(review.nextFocus) : '')
  const [saving, setSaving] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    const now = new Date().toISOString()
    await onSave({ id: review?.id ?? `review-${crypto.randomUUID()}`, type: reviewType, startDate, summary: summary.trim(), wins: linesToList(wins), problems: linesToList(problems), nextFocus: linesToList(nextFocus), createdAt: review?.createdAt ?? now, updatedAt: now })
  }

  return (
    <Modal title={review ? 'تعديل المراجعة' : 'مراجعة جديدة'} subtitle="اكتب كل نقطة في سطر مستقل. تبقى المراجعة محلية على جهازك." onClose={onClose} wide>
      <form className="entity-form" onSubmit={submit}>
        <div className="form-grid"><label><span>نوع المراجعة</span><select value={reviewType} onChange={(event) => setReviewType(event.target.value as Review['type'])}><option value="weekly">أسبوعية</option><option value="monthly">شهرية</option><option value="yearly">سنوية</option></select></label><label><span>تاريخ البداية</span><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required /></label></div>
        <label><span>الخلاصة</span><textarea rows={3} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="كيف كانت هذه الفترة بصورة عامة؟" required /></label>
        <div className="review-form-grid"><label><span>ما الذي نجح؟</span><textarea rows={5} value={wins} onChange={(event) => setWins(event.target.value)} placeholder={'إنجاز مهم\nقرار جيد'} /></label><label><span>المشكلات والتغييرات</span><textarea rows={5} value={problems} onChange={(event) => setProblems(event.target.value)} placeholder={'عائق متكرر\nافتراض ثبت خطؤه'} /></label><label><span>التركيز القادم</span><textarea rows={5} value={nextFocus} onChange={(event) => setNextFocus(event.target.value)} placeholder={'أولوية أولى\nخطوة يجب حسمها'} /></label></div>
        <div className="modal-actions"><button type="button" className="button button--ghost" onClick={onClose}>إلغاء</button><button className="button button--primary" disabled={saving}>{saving ? 'جارٍ الحفظ…' : 'حفظ المراجعة'}</button></div>
      </form>
    </Modal>
  )
}
