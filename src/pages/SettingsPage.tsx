import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArchiveRestore, Boxes, Database, Download, FileUp, HardDrive, LockKeyhole, WifiOff } from 'lucide-react'
import { RestoreBackupModal } from '../components/modals/RestoreBackupModal'
import { downloadBackup, downloadJsonFile } from '../lib/life-data'
import { useI18n } from '../lib/i18n'
import { useMasaratStore } from '../store/use-masarat-store'
import type { LifePack } from '../types/masarat'

export function SettingsPage({ onImport, onNotify }: { onImport: () => void; onNotify: (message: string) => void }) {
  const { language } = useI18n()
  const c = language === 'ar' ? { eyebrow: 'أنت تملك بياناتك', title: 'الخصوصية والبيانات', intro: 'Masarat يعمل محليًا، ولا يحتوي على ذكاء اصطناعي أو حساب أو خادم خلفي.', local: 'التخزين المحلي', localText: 'المشاريع والأهداف والمجالات والمراجعات محفوظة في IndexedDB على هذا الجهاز.', active: 'فعال', offline: 'العمل دون اتصال', offlineText: 'نسخة PWA تحفظ موارد التطبيق بعد أول تشغيل.', sensitive: 'البيانات شديدة الحساسية', sensitiveText: 'التخزين المحلي ليس تشفيرًا. لا تحفظ كلمات المرور أو وثائق الهوية داخل التطبيق.', unencrypted: 'غير مشفر', backup: 'نسخة احتياطية كاملة', backupText: 'تنزيل كل البيانات المحلية في ملف واحد يمكن استعادته لاحقًا.', download: 'تنزيل النسخة', backupDone: 'تم إنشاء نسخة احتياطية كاملة', restore: 'استعادة نسخة', restoreText: 'فحص نسخة سابقة ومعاينتها قبل استبدال البيانات الحالية.', restoreButton: 'استعادة', pack: 'تصدير Life Pack 2.0', packText: 'حزمة منظمة يمكن تحديثها خارجيًا ثم دمجها مع الحفاظ على التقدم.', exportPack: 'تصدير الحزمة', import: 'استيراد مشروع أو Life Pack', importText: 'يعرض Masarat العناصر الجديدة والتحديثات قبل الدمج، ويحافظ على الحالات والتكاليف الفعلية.', openImport: 'فتح الاستيراد', restored: 'تمت استعادة النسخة الاحتياطية بنجاح' } : { eyebrow: 'YOU OWN YOUR DATA', title: 'Privacy and data', intro: 'Masarat works locally, with no AI API, account, or backend server.', local: 'Local storage', localText: 'Projects, goals, areas and reviews are stored in IndexedDB on this device.', active: 'Active', offline: 'Offline mode', offlineText: 'The PWA keeps app resources available after the first load.', sensitive: 'Highly sensitive data', sensitiveText: 'Local storage is not encryption. Do not store passwords or identity documents in the app.', unencrypted: 'Not encrypted', backup: 'Full backup', backupText: 'Download all local data in one restorable file.', download: 'Download backup', backupDone: 'Full backup created', restore: 'Restore backup', restoreText: 'Inspect and preview an earlier backup before replacing current data.', restoreButton: 'Restore', pack: 'Export Life Pack 2.0', packText: 'A structured package that can be updated externally and merged while preserving progress.', exportPack: 'Export pack', import: 'Import a project or Life Pack', importText: 'Masarat previews new items and updates before merging, while preserving progress and actual costs.', openImport: 'Open import', restored: 'Backup restored successfully' }
  const { projects, lifeAreas, goals, metrics, metricEntries, reviews, restoreBackup } = useMasaratStore()
  const [showRestore, setShowRestore] = useState(false)
  const data = { projects, lifeAreas, goals, metrics, metricEntries, reviews }

  const exportLifePack = () => {
    const pack: LifePack = { format: 'masarat', schemaVersion: '2.0', packageType: 'life-pack', title: 'Masarat Life Pack', exportedAt: new Date().toISOString(), areas: lifeAreas, goals, projects, metrics, metricEntries, reviews }
    downloadJsonFile(pack, `masarat-life-pack-${new Date().toISOString().slice(0, 10)}.json`)
  }

  return (
    <div className="page settings-page">
      <section className="page-intro page-intro--simple"><div><span className="eyebrow">{c.eyebrow}</span><h2>{c.title}</h2><p>{c.intro}</p></div></section>
      <div className="settings-grid">
        <article className="settings-card"><span><HardDrive size={21} /></span><div><h3>{c.local}</h3><p>{c.localText}</p></div><b className="settings-ok">{c.active}</b></article>
        <article className="settings-card"><span><WifiOff size={21} /></span><div><h3>{c.offline}</h3><p>{c.offlineText}</p></div><b className="settings-ok">{c.active}</b></article>
        <article className="settings-card"><span><LockKeyhole size={21} /></span><div><h3>{c.sensitive}</h3><p>{c.sensitiveText}</p></div><b className="settings-warning">{c.unencrypted}</b></article>
      </div>

      <section className="backup-grid">
        <article><span><Download size={22} /></span><div><h3>{c.backup}</h3><p>{c.backupText}</p></div><button className="button button--primary" onClick={() => { downloadBackup(data); onNotify(c.backupDone) }}><Download size={16} /> {c.download}</button></article>
        <article><span><ArchiveRestore size={22} /></span><div><h3>{c.restore}</h3><p>{c.restoreText}</p></div><button className="button button--ghost" onClick={() => setShowRestore(true)}><ArchiveRestore size={16} /> {c.restoreButton}</button></article>
        <article><span><Boxes size={22} /></span><div><h3>{c.pack}</h3><p>{c.packText}</p></div><button className="button button--ghost" onClick={exportLifePack}><Boxes size={16} /> {c.exportPack}</button></article>
      </section>

      <section className="data-panel"><div><span className="data-panel__icon"><Database size={22} /></span><div><h3>{c.import}</h3><p>{c.importText}</p></div></div><button className="button button--primary" onClick={onImport}><FileUp size={17} /> {c.openImport}</button></section>
      <AnimatePresence>{showRestore && <RestoreBackupModal onClose={() => setShowRestore(false)} onRestore={async (backup) => { await restoreBackup(backup); setShowRestore(false); onNotify(c.restored) }} />}</AnimatePresence>
    </div>
  )
}
