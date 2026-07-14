import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, BookOpenCheck, CalendarRange, CheckCircle2, Edit3, Lightbulb, Plus, Trash2 } from 'lucide-react'
import { ReviewModal } from '../components/modals/ReviewModal'
import { useI18n } from '../lib/i18n'
import { useMasaratStore } from '../store/use-masarat-store'
import type { Review } from '../types/masarat'

export function ReviewsPage() {
  const { language, locale } = useI18n()
  const c = language === 'ar' ? { eyebrow: 'حوّل التجربة إلى معرفة', title: 'المراجعات', intro: 'اربط ما خططت له بما حدث فعليًا، وسجّل الدروس التي تريد الاحتفاظ بها للقرار القادم.', new: 'مراجعة جديدة', done7: 'إنجازات آخر 7 أيام', reality: 'أحداث الواقع', changes: 'تغييرات الظروف', expenses: 'مصاريف مسجلة', currency: 'د.م.', weekly: 'مراجعة أسبوعية', weeklyText: 'الإنجازات، العوائق، وما يستحق التركيز في الأسبوع القادم.', monthly: 'مراجعة شهرية', monthlyText: 'تقدم الأهداف، تغيّر المؤشرات، والقرارات التي تحتاج إعادة تقييم.', yearly: 'مراجعة سنوية', yearlyText: 'القرارات الكبيرة، الأنماط المتكررة، والدروس التي ستغيّر العام القادم.', start: 'ابدأ الآن', memory: 'ذاكرة التعلّم', saved: 'المراجعات المحفوظة', count: 'مراجعات', edit: 'تعديل المراجعة', delete: 'حذف المراجعة', wins: 'ما نجح', problems: 'المشكلات', next: 'التركيز القادم', empty: 'ابدأ أول مراجعة', emptyText: 'ستظهر هنا خلاصة ما حدث، وما تعلّمته، وما ستغيّره في الفترة القادمة.' } : { eyebrow: 'TURN EXPERIENCE INTO KNOWLEDGE', title: 'Reviews', intro: 'Connect what you planned to what really happened, and preserve lessons for your next decision.', new: 'New review', done7: 'Completed in 7 days', reality: 'Reality events', changes: 'Circumstance changes', expenses: 'Recorded expenses', currency: 'MAD', weekly: 'Weekly review', weeklyText: 'Wins, obstacles, and what deserves focus next week.', monthly: 'Monthly review', monthlyText: 'Goal progress, metric changes, and decisions that need re-evaluation.', yearly: 'Yearly review', yearlyText: 'Major decisions, recurring patterns, and lessons that can change next year.', start: 'Start now', memory: 'LEARNING MEMORY', saved: 'Saved reviews', count: 'reviews', edit: 'Edit review', delete: 'Delete review', wins: 'What worked', problems: 'Problems', next: 'Next focus', empty: 'Start your first review', emptyText: 'A summary of what happened, what you learned, and what you will change appears here.' }
  const reviewLabels = { weekly: c.weekly, monthly: c.monthly, yearly: c.yearly }
  const { projects, reviews, saveReview, deleteReview } = useMasaratStore()
  const [editing, setEditing] = useState<Review | 'weekly' | 'monthly' | 'yearly'>()
  const [since] = useState(() => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const completedThisWeek = projects.flatMap((project) => project.tasks).filter((task) => task.completedAt && new Date(task.completedAt) >= since).length
  const realityThisWeek = projects.flatMap((project) => project.realityEvents).filter((event) => new Date(event.date) >= since)
  const changesThisWeek = projects.flatMap((project) => project.changes).filter((event) => new Date(event.date) >= since).length
  const spendThisWeek = realityThisWeek.reduce((total, event) => total + (event.cost ?? 0), 0)

  return (
    <div className="page reviews-page">
      <section className="page-intro page-intro--simple"><div><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.intro}</p></div><button className="button button--primary" onClick={() => setEditing('weekly')}><Plus size={17} /> {c.new}</button></section>
      <section className="review-insights">
        <article><span><CheckCircle2 size={19} /></span><small>{c.done7}</small><strong>{completedThisWeek}</strong></article>
        <article><span><CalendarRange size={19} /></span><small>{c.reality}</small><strong>{realityThisWeek.length}</strong></article>
        <article><span><BarChart3 size={19} /></span><small>{c.changes}</small><strong>{changesThisWeek}</strong></article>
        <article><span><Lightbulb size={19} /></span><small>{c.expenses}</small><strong>{spendThisWeek.toLocaleString(locale)} {c.currency}</strong></article>
      </section>
      <div className="review-foundation review-foundation--actions">
        <button onClick={() => setEditing('weekly')}><span><CalendarRange size={22} /></span><h3>{c.weekly}</h3><p>{c.weeklyText}</p><b>{c.start}</b></button>
        <button onClick={() => setEditing('monthly')}><span><BarChart3 size={22} /></span><h3>{c.monthly}</h3><p>{c.monthlyText}</p><b>{c.start}</b></button>
        <button onClick={() => setEditing('yearly')}><span><Lightbulb size={22} /></span><h3>{c.yearly}</h3><p>{c.yearlyText}</p><b>{c.start}</b></button>
      </div>

      <section className="saved-reviews">
        <div className="section-heading"><div><span className="eyebrow">{c.memory}</span><h3>{c.saved}</h3></div><span className="section-count">{reviews.length} {c.count}</span></div>
        <div className="saved-review-list">
          {reviews.map((review, index) => (
            <motion.article key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }}>
              <div className="saved-review__top"><div><span>{reviewLabels[review.type]}</span><time>{new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(review.startDate))}</time></div><div><button aria-label={c.edit} onClick={() => setEditing(review)}><Edit3 size={15} /></button><button aria-label={c.delete} onClick={() => deleteReview(review.id)}><Trash2 size={15} /></button></div></div>
              <h3>{review.summary}</h3>
              <div className="review-columns"><div><small>{c.wins}</small>{review.wins.slice(0, 3).map((item) => <p key={item}>• {item}</p>)}</div><div><small>{c.problems}</small>{review.problems.slice(0, 3).map((item) => <p key={item}>• {item}</p>)}</div><div><small>{c.next}</small>{review.nextFocus.slice(0, 3).map((item) => <p key={item}>• {item}</p>)}</div></div>
            </motion.article>
          ))}
          {!reviews.length && <div className="empty-state review-empty"><BookOpenCheck size={32} /><strong>{c.empty}</strong><p>{c.emptyText}</p></div>}
        </div>
      </section>
      <AnimatePresence>{editing && <ReviewModal review={typeof editing === 'object' ? editing : undefined} type={typeof editing === 'string' ? editing : undefined} onClose={() => setEditing(undefined)} onSave={async (review) => { await saveReview(review); setEditing(undefined) }} />}</AnimatePresence>
    </div>
  )
}
