import { Bot, Check, Download, FileClock, GitCompareArrows, RotateCcw } from 'lucide-react'
import { downloadAIUpdatePackage, downloadProject } from '../lib/project-utils'
import { useMasaratStore } from '../store/use-masarat-store'
import type { MasaratProject } from '../types/masarat'

export function VersionsPage({ project, onNotify }: { project: MasaratProject; onNotify: (message: string) => void }) {
  const { restoreVersion } = useMasaratStore()
  const versions = [...project.versions].sort((a, b) => b.number - a.number)

  return (
    <div className="page page--versions">
      <div className="page-heading"><span className="eyebrow">لا تضيع الخطة القديمة</span><h2>الإصدارات والتحديث</h2><p>احفظ حالتك، أرسلها لأي AI عند حدوث تغيير كبير، ثم استورد الخطة المحدثة وقارنها قبل اعتمادها.</p></div>

      <section className="update-workflow">
        <div className="workflow-step"><span>1</span><div><Download size={19} /><strong>صدّر الحالة</strong><small>الخطة + التقدم + ما تغيّر</small></div></div>
        <i />
        <div className="workflow-step"><span>2</span><div><Bot size={19} /><strong>حدّثها مع AI</strong><small>خارج التطبيق، بلا API</small></div></div>
        <i />
        <div className="workflow-step"><span>3</span><div><GitCompareArrows size={19} /><strong>استورد وقارن</strong><small>تقدمك يبقى محفوظًا</small></div></div>
      </section>

      <section className="export-actions">
        <div><span className="export-icon export-icon--blue"><Bot size={23} /></span><div><h3>حزمة تحديث بواسطة AI</h3><p>تحتوي على تعليمات واضحة، الخطة الحالية، المهام المنجزة، سجل الواقع، وآخر تغيير.</p></div></div>
        <button className="button button--primary" onClick={() => { downloadAIUpdatePackage(project); onNotify('تم تجهيز حزمة التحديث') }}><Download size={17} /> تصدير للتحديث</button>
      </section>
      <section className="export-actions export-actions--secondary">
        <div><span className="export-icon"><FileClock size={23} /></span><div><h3>نسخة احتياطية كاملة</h3><p>ملف .masarat يمكن استيراده في أي وقت وعلى أي جهاز.</p></div></div>
        <button className="button button--ghost" onClick={() => { downloadProject(project); onNotify('تم تصدير النسخة الاحتياطية') }}><Download size={17} /> تصدير</button>
      </section>

      <section className="versions-list-section">
        <div className="section-heading"><div><span className="eyebrow">تاريخ الخطة</span><h3>النسخ المحفوظة</h3></div></div>
        <div className="versions-list">
          <article className="version-card version-card--current"><div className="version-node"><Check size={16} /></div><div><div className="version-card__title"><h4>الإصدار {project.project.currentVersion}</h4><span>الحالي</span></div><p>الخطة المستخدمة الآن، مع آخر تقدم ونتائج فعلية.</p><time>{new Date(project.project.updatedAt).toLocaleString('ar-MA', { dateStyle: 'long', timeStyle: 'short' })}</time></div></article>
          {versions.length ? versions.map((version) => (
            <article className="version-card" key={version.id}><div className="version-node"><FileClock size={16} /></div><div><div className="version-card__title"><h4>الإصدار {version.number}</h4></div><p>{version.reason}</p><time>{new Date(version.createdAt).toLocaleString('ar-MA', { dateStyle: 'long', timeStyle: 'short' })}</time></div><button className="button button--ghost button--small" onClick={async () => { if (window.confirm(`الرجوع إلى محتوى الإصدار ${version.number}؟ سيتم حفظ نسخة من حالتك الحالية أولًا.`)) { await restoreVersion(version); onNotify('تمت استعادة النسخة وإنشاء نسخة احتياطية للحالة السابقة') } }}><RotateCcw size={15} /> استعادة</button></article>
          )) : <div className="empty-versions">ستظهر هنا نسخة تلقائية عند تسجيل أول تغيير في الظروف.</div>}
        </div>
      </section>
    </div>
  )
}
