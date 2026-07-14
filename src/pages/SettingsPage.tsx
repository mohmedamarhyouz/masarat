import { Database, FileUp, HardDrive, LockKeyhole, WifiOff } from 'lucide-react'

export function SettingsPage({ onImport }: { onImport: () => void }) {
  return (
    <div className="page settings-page">
      <section className="page-intro page-intro--simple"><div><span className="eyebrow">أنت تملك بياناتك</span><h2>الخصوصية والبيانات</h2><p>Masarat يعمل محليًا، ولا يحتوي على ذكاء اصطناعي أو حساب أو خادم خلفي.</p></div></section>
      <div className="settings-grid">
        <article className="settings-card"><span><HardDrive size={21} /></span><div><h3>التخزين المحلي</h3><p>المشاريع والأهداف والمجالات محفوظة في IndexedDB على هذا الجهاز.</p></div><b className="settings-ok">فعال</b></article>
        <article className="settings-card"><span><WifiOff size={21} /></span><div><h3>العمل دون اتصال</h3><p>نسخة PWA تحفظ موارد التطبيق بعد أول تشغيل.</p></div><b className="settings-ok">فعال</b></article>
        <article className="settings-card"><span><LockKeyhole size={21} /></span><div><h3>تشفير البيانات الحساسة</h3><p>لا تحفظ كلمات المرور أو وثائق الهوية قبل إضافة التشفير.</p></div><b className="settings-soon">مخطط</b></article>
      </div>
      <section className="data-panel"><div><span className="data-panel__icon"><Database size={22} /></span><div><h3>استيراد بيانات</h3><p>استورد مشروع `.masarat` الآن. دعم Life Pack الكامل سيُضاف مع معاينة التعارضات قبل الدمج.</p></div></div><button className="button button--primary" onClick={onImport}><FileUp size={17} /> استيراد مشروع</button></section>
    </div>
  )
}
