import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArchiveRestore, Boxes, Database, Download, FileUp, HardDrive, LockKeyhole, WifiOff } from 'lucide-react'
import { RestoreBackupModal } from '../components/modals/RestoreBackupModal'
import { downloadBackup, downloadJsonFile } from '../lib/life-data'
import { useMasaratStore } from '../store/use-masarat-store'
import type { LifePack } from '../types/masarat'

export function SettingsPage({ onImport, onNotify }: { onImport: () => void; onNotify: (message: string) => void }) {
  const { projects, lifeAreas, goals, metrics, metricEntries, reviews, restoreBackup } = useMasaratStore()
  const [showRestore, setShowRestore] = useState(false)
  const data = { projects, lifeAreas, goals, metrics, metricEntries, reviews }

  const exportLifePack = () => {
    const pack: LifePack = { format: 'masarat', schemaVersion: '2.0', packageType: 'life-pack', title: 'Masarat Life Pack', exportedAt: new Date().toISOString(), areas: lifeAreas, goals, projects, metrics, metricEntries, reviews }
    downloadJsonFile(pack, `masarat-life-pack-${new Date().toISOString().slice(0, 10)}.json`)
  }

  return (
    <div className="page settings-page">
      <section className="page-intro page-intro--simple"><div><span className="eyebrow">أنت تملك بياناتك</span><h2>الخصوصية والبيانات</h2><p>Masarat يعمل محليًا، ولا يحتوي على ذكاء اصطناعي أو حساب أو خادم خلفي.</p></div></section>
      <div className="settings-grid">
        <article className="settings-card"><span><HardDrive size={21} /></span><div><h3>التخزين المحلي</h3><p>المشاريع والأهداف والمجالات والمراجعات محفوظة في IndexedDB على هذا الجهاز.</p></div><b className="settings-ok">فعال</b></article>
        <article className="settings-card"><span><WifiOff size={21} /></span><div><h3>العمل دون اتصال</h3><p>نسخة PWA تحفظ موارد التطبيق بعد أول تشغيل.</p></div><b className="settings-ok">فعال</b></article>
        <article className="settings-card"><span><LockKeyhole size={21} /></span><div><h3>البيانات شديدة الحساسية</h3><p>التخزين المحلي ليس تشفيرًا. لا تحفظ كلمات المرور أو وثائق الهوية داخل التطبيق.</p></div><b className="settings-warning">غير مشفر</b></article>
      </div>

      <section className="backup-grid">
        <article><span><Download size={22} /></span><div><h3>نسخة احتياطية كاملة</h3><p>تنزيل كل البيانات المحلية في ملف واحد يمكن استعادته لاحقًا.</p></div><button className="button button--primary" onClick={() => { downloadBackup(data); onNotify('تم إنشاء نسخة احتياطية كاملة') }}><Download size={16} /> تنزيل النسخة</button></article>
        <article><span><ArchiveRestore size={22} /></span><div><h3>استعادة نسخة</h3><p>فحص نسخة سابقة ومعاينتها قبل استبدال البيانات الحالية.</p></div><button className="button button--ghost" onClick={() => setShowRestore(true)}><ArchiveRestore size={16} /> استعادة</button></article>
        <article><span><Boxes size={22} /></span><div><h3>تصدير Life Pack 2.0</h3><p>حزمة منظمة يمكن تحديثها خارجيًا ثم دمجها مع الحفاظ على التقدم.</p></div><button className="button button--ghost" onClick={exportLifePack}><Boxes size={16} /> تصدير الحزمة</button></article>
      </section>

      <section className="data-panel"><div><span className="data-panel__icon"><Database size={22} /></span><div><h3>استيراد مشروع أو Life Pack</h3><p>يعرض Masarat العناصر الجديدة والتحديثات قبل الدمج، ويحافظ على الحالات والتكاليف الفعلية.</p></div></div><button className="button button--primary" onClick={onImport}><FileUp size={17} /> فتح الاستيراد</button></section>
      <AnimatePresence>{showRestore && <RestoreBackupModal onClose={() => setShowRestore(false)} onRestore={async (backup) => { await restoreBackup(backup); setShowRestore(false); onNotify('تمت استعادة النسخة الاحتياطية بنجاح') }} />}</AnimatePresence>
    </div>
  )
}
