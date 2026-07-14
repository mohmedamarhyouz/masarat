import { useState, type FormEvent } from 'react'
import { linesToList, listToLines } from '../../lib/life-data'
import { useI18n } from '../../lib/i18n'
import type { Review } from '../../types/masarat'
import { Modal } from './Modal'

export function ReviewModal({ review, type = 'weekly', onClose, onSave }: {
  review?: Review
  type?: Review['type']
  onClose: () => void
  onSave: (review: Review) => Promise<void>
}) {
  const { language } = useI18n()
  const c = language === 'ar' ? { edit: 'تعديل المراجعة', title: 'مراجعة جديدة', subtitle: 'اكتب كل نقطة في سطر مستقل. تبقى المراجعة محلية على جهازك.', type: 'نوع المراجعة', weekly: 'أسبوعية', monthly: 'شهرية', yearly: 'سنوية', date: 'تاريخ البداية', summary: 'الخلاصة', summaryPlaceholder: 'كيف كانت هذه الفترة بصورة عامة؟', wins: 'ما الذي نجح؟', winsPlaceholder: 'إنجاز مهم\nقرار جيد', problems: 'المشكلات والتغييرات', problemsPlaceholder: 'عائق متكرر\nافتراض ثبت خطؤه', next: 'التركيز القادم', nextPlaceholder: 'أولوية أولى\nخطوة يجب حسمها', cancel: 'إلغاء', saving: 'جارٍ الحفظ…', save: 'حفظ المراجعة' } : { edit: 'Edit review', title: 'New review', subtitle: 'Write one item per line. This review remains local to your device.', type: 'Review type', weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly', date: 'Start date', summary: 'Summary', summaryPlaceholder: 'How did this period go overall?', wins: 'What worked?', winsPlaceholder: 'Important win\nGood decision', problems: 'Problems and changes', problemsPlaceholder: 'Recurring obstacle\nIncorrect assumption', next: 'Next focus', nextPlaceholder: 'Top priority\nDecision to resolve', cancel: 'Cancel', saving: 'Saving…', save: 'Save review' }
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
    <Modal title={review ? c.edit : c.title} subtitle={c.subtitle} onClose={onClose} wide>
      <form className="entity-form" onSubmit={submit}>
        <div className="form-grid"><label><span>{c.type}</span><select value={reviewType} onChange={(event) => setReviewType(event.target.value as Review['type'])}><option value="weekly">{c.weekly}</option><option value="monthly">{c.monthly}</option><option value="yearly">{c.yearly}</option></select></label><label><span>{c.date}</span><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required /></label></div>
        <label><span>{c.summary}</span><textarea rows={3} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder={c.summaryPlaceholder} required /></label>
        <div className="review-form-grid"><label><span>{c.wins}</span><textarea rows={5} value={wins} onChange={(event) => setWins(event.target.value)} placeholder={c.winsPlaceholder} /></label><label><span>{c.problems}</span><textarea rows={5} value={problems} onChange={(event) => setProblems(event.target.value)} placeholder={c.problemsPlaceholder} /></label><label><span>{c.next}</span><textarea rows={5} value={nextFocus} onChange={(event) => setNextFocus(event.target.value)} placeholder={c.nextPlaceholder} /></label></div>
        <div className="modal-actions"><button type="button" className="button button--ghost" onClick={onClose}>{c.cancel}</button><button className="button button--primary" disabled={saving}>{saving ? c.saving : c.save}</button></div>
      </form>
    </Modal>
  )
}
