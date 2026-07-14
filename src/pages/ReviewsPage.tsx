import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, BookOpenCheck, CalendarRange, CheckCircle2, Edit3, Lightbulb, Plus, Trash2 } from 'lucide-react'
import { ReviewModal } from '../components/modals/ReviewModal'
import { useMasaratStore } from '../store/use-masarat-store'
import type { Review } from '../types/masarat'

const reviewLabels = { weekly: 'مراجعة أسبوعية', monthly: 'مراجعة شهرية', yearly: 'مراجعة سنوية' }

export function ReviewsPage() {
  const { projects, reviews, saveReview, deleteReview } = useMasaratStore()
  const [editing, setEditing] = useState<Review | 'weekly' | 'monthly' | 'yearly'>()
  const [since] = useState(() => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const completedThisWeek = projects.flatMap((project) => project.tasks).filter((task) => task.completedAt && new Date(task.completedAt) >= since).length
  const realityThisWeek = projects.flatMap((project) => project.realityEvents).filter((event) => new Date(event.date) >= since)
  const changesThisWeek = projects.flatMap((project) => project.changes).filter((event) => new Date(event.date) >= since).length
  const spendThisWeek = realityThisWeek.reduce((total, event) => total + (event.cost ?? 0), 0)

  return (
    <div className="page reviews-page">
      <section className="page-intro page-intro--simple"><div><span className="eyebrow">حوّل التجربة إلى معرفة</span><h2>المراجعات</h2><p>اربط ما خططت له بما حدث فعليًا، وسجّل الدروس التي تريد الاحتفاظ بها للقرار القادم.</p></div><button className="button button--primary" onClick={() => setEditing('weekly')}><Plus size={17} /> مراجعة جديدة</button></section>
      <section className="review-insights">
        <article><span><CheckCircle2 size={19} /></span><small>إنجازات آخر 7 أيام</small><strong>{completedThisWeek}</strong></article>
        <article><span><CalendarRange size={19} /></span><small>أحداث الواقع</small><strong>{realityThisWeek.length}</strong></article>
        <article><span><BarChart3 size={19} /></span><small>تغييرات الظروف</small><strong>{changesThisWeek}</strong></article>
        <article><span><Lightbulb size={19} /></span><small>مصاريف مسجلة</small><strong>{spendThisWeek.toLocaleString('ar-MA')} د.م.</strong></article>
      </section>
      <div className="review-foundation review-foundation--actions">
        <button onClick={() => setEditing('weekly')}><span><CalendarRange size={22} /></span><h3>مراجعة أسبوعية</h3><p>الإنجازات، العوائق، وما يستحق التركيز في الأسبوع القادم.</p><b>ابدأ الآن</b></button>
        <button onClick={() => setEditing('monthly')}><span><BarChart3 size={22} /></span><h3>مراجعة شهرية</h3><p>تقدم الأهداف، تغيّر المؤشرات، والقرارات التي تحتاج إعادة تقييم.</p><b>ابدأ الآن</b></button>
        <button onClick={() => setEditing('yearly')}><span><Lightbulb size={22} /></span><h3>مراجعة سنوية</h3><p>القرارات الكبيرة، الأنماط المتكررة، والدروس التي ستغيّر العام القادم.</p><b>ابدأ الآن</b></button>
      </div>

      <section className="saved-reviews">
        <div className="section-heading"><div><span className="eyebrow">ذاكرة التعلّم</span><h3>المراجعات المحفوظة</h3></div><span className="section-count">{reviews.length} مراجعات</span></div>
        <div className="saved-review-list">
          {reviews.map((review, index) => (
            <motion.article key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }}>
              <div className="saved-review__top"><div><span>{reviewLabels[review.type]}</span><time>{new Intl.DateTimeFormat('ar-MA', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(review.startDate))}</time></div><div><button aria-label="تعديل المراجعة" onClick={() => setEditing(review)}><Edit3 size={15} /></button><button aria-label="حذف المراجعة" onClick={() => deleteReview(review.id)}><Trash2 size={15} /></button></div></div>
              <h3>{review.summary}</h3>
              <div className="review-columns"><div><small>ما نجح</small>{review.wins.slice(0, 3).map((item) => <p key={item}>• {item}</p>)}</div><div><small>المشكلات</small>{review.problems.slice(0, 3).map((item) => <p key={item}>• {item}</p>)}</div><div><small>التركيز القادم</small>{review.nextFocus.slice(0, 3).map((item) => <p key={item}>• {item}</p>)}</div></div>
            </motion.article>
          ))}
          {!reviews.length && <div className="empty-state review-empty"><BookOpenCheck size={32} /><strong>ابدأ أول مراجعة</strong><p>ستظهر هنا خلاصة ما حدث، وما تعلّمته، وما ستغيّره في الفترة القادمة.</p></div>}
        </div>
      </section>
      <AnimatePresence>{editing && <ReviewModal review={typeof editing === 'object' ? editing : undefined} type={typeof editing === 'string' ? editing : undefined} onClose={() => setEditing(undefined)} onSave={async (review) => { await saveReview(review); setEditing(undefined) }} />}</AnimatePresence>
    </div>
  )
}
