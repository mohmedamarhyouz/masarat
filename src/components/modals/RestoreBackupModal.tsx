import { useRef, useState } from 'react'
import { ArchiveRestore, FileJson2, ShieldAlert } from 'lucide-react'
import { ZodError } from 'zod'
import { parseMasaratBackup } from '../../lib/schema'
import { useI18n } from '../../lib/i18n'
import type { MasaratBackup } from '../../types/masarat'
import { Modal } from './Modal'

export function RestoreBackupModal({ onClose, onRestore }: { onClose: () => void; onRestore: (backup: MasaratBackup) => Promise<void> }) {
  const { language, locale } = useI18n()
  const c = language === 'ar' ? { incompatible: 'نسخة غير متوافقة', unreadable: 'تعذرت قراءة ملف النسخة الاحتياطية', title: 'استعادة نسخة كاملة', subtitle: 'تستبدل الاستعادة كل البيانات المحلية الحالية بعد التحقق من الملف.', choose: 'اختر ملف masarat-backup', local: 'يُفحص محليًا قبل إجراء أي تغيير', backup: 'نسخة', paths: 'مسارات', goals: 'أهداف', reviews: 'مراجعات', valid: 'صالحة', warning: 'تنبيه مهم', warningText: 'سيتم استبدال البيانات الحالية بالكامل. صدّر نسخة حديثة أولًا إذا كنت تحتاج الرجوع إليها.', confirm: 'أفهم أن الاستعادة ستستبدل البيانات المحلية الحالية.', another: 'اختيار ملف آخر', restoring: 'جارٍ الاستعادة…', restore: 'استعادة النسخة' } : { incompatible: 'Incompatible backup', unreadable: 'Could not read the backup file', title: 'Restore a full backup', subtitle: 'Restoring replaces all current local data after the file is validated.', choose: 'Choose a masarat-backup file', local: 'Validated locally before anything changes', backup: 'Backup from', paths: 'paths', goals: 'goals', reviews: 'reviews', valid: 'Valid', warning: 'Important warning', warningText: 'All current data will be replaced. Export a fresh backup first if you may need to return to it.', confirm: 'I understand that restoring will replace current local data.', another: 'Choose another file', restoring: 'Restoring…', restore: 'Restore backup' }
  const inputRef = useRef<HTMLInputElement>(null)
  const [backup, setBackup] = useState<MasaratBackup>()
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string>()
  const [saving, setSaving] = useState(false)

  const read = async (file?: File) => {
    if (!file) return
    setError(undefined)
    try { setBackup(parseMasaratBackup(JSON.parse(await file.text())) as MasaratBackup) }
    catch (reason) { setError(reason instanceof ZodError ? reason.issues[0]?.message ?? c.incompatible : c.unreadable) }
  }

  return (
    <Modal title={c.title} subtitle={c.subtitle} onClose={onClose} wide>
      {!backup ? <><button className="dropzone" onClick={() => inputRef.current?.click()}><span className="dropzone__icon"><ArchiveRestore size={27} /></span><strong>{c.choose}</strong><small>{c.local}</small></button><input hidden ref={inputRef} type="file" accept=".json,application/json" onChange={(event) => read(event.target.files?.[0])} />{error && <div className="form-error">{error}</div>}</> : <div className="restore-preview"><div className="import-file-card"><span className="file-icon"><FileJson2 size={24} /></span><div><strong>{c.backup} {new Intl.DateTimeFormat(locale).format(new Date(backup.exportedAt))}</strong><small>{backup.data.projects.length} {c.paths} · {backup.data.goals.length} {c.goals} · {backup.data.reviews.length} {c.reviews}</small></div><span className="valid-badge">{c.valid}</span></div><div className="danger-note"><ShieldAlert size={18} /><p><strong>{c.warning}</strong><span>{c.warningText}</span></p></div><label className="confirm-check"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /> {c.confirm}</label><div className="modal-actions"><button className="button button--ghost" onClick={() => setBackup(undefined)}>{c.another}</button><button className="button button--danger" disabled={!confirmed || saving} onClick={async () => { setSaving(true); await onRestore(backup) }}>{saving ? c.restoring : c.restore}</button></div></div>}
    </Modal>
  )
}
