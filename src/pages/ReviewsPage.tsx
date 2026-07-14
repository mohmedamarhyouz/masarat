import { BarChart3, BookOpenCheck, CalendarRange, Lightbulb } from 'lucide-react'

export function ReviewsPage() {
  return (
    <div className="page reviews-page">
      <section className="page-intro page-intro--simple"><div><span className="eyebrow">حوّل التجربة إلى معرفة</span><h2>المراجعات</h2><p>مراجعة أسبوعية وشهرية تربط ما خططت له بما حدث فعليًا، من دون ذكاء اصطناعي داخل التطبيق.</p></div></section>
      <div className="review-foundation">
        <article><span><CalendarRange size={22} /></span><h3>مراجعة أسبوعية</h3><p>الإنجازات، العوائق، وما يستحق التركيز في الأسبوع القادم.</p><button className="button button--ghost" disabled>قريبًا</button></article>
        <article><span><BarChart3 size={22} /></span><h3>مراجعة شهرية</h3><p>تقدم الأهداف، تغيّر المؤشرات، والقرارات التي تحتاج إعادة تقييم.</p><button className="button button--ghost" disabled>قريبًا</button></article>
        <article><span><Lightbulb size={22} /></span><h3>الدروس</h3><p>ما الذي توقعته؟ ماذا حدث؟ وما القاعدة التي ستأخذها للقرار القادم؟</p><button className="button button--ghost" disabled>قريبًا</button></article>
      </div>
      <div className="empty-state review-empty"><BookOpenCheck size={32} /><strong>بُني الأساس، وسيأتي التسجيل في المرحلة التالية</strong><p>بيانات المهام والواقع والتغييرات جاهزة لتغذية المراجعات دون تغيير بنية مشاريعك.</p></div>
    </div>
  )
}
