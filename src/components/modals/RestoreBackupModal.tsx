import { useRef, useState } from 'react'
import { ArchiveRestore, FileJson2, ShieldAlert } from 'lucide-react'
import { ZodError } from 'zod'
import { parseMasaratBackup } from '../../lib/schema'
import type { MasaratBackup } from '../../types/masarat'
import { Modal } from './Modal'

export function RestoreBackupModal({ onClose, onRestore }: { onClose: () => void; onRestore: (backup: MasaratBackup) => Promise<void> }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [backup, setBackup] = useState<MasaratBackup>()
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string>()
  const [saving, setSaving] = useState(false)

  const read = async (file?: File) => {
    if (!file) return
    setError(undefined)
    try { setBackup(parseMasaratBackup(JSON.parse(await file.text())) as MasaratBackup) }
    catch (reason) { setError(reason instanceof ZodError ? reason.issues[0]?.message ?? 'نسخة غير متوافقة' : 'تعذرت قراءة ملف النسخة الاحتياطية') }
  }

  return (
    <Modal title="استعادة نسخة كاملة" subtitle="تستبدل الاستعادة كل البيانات المحلية الحالية بعد التحقق من الملف." onClose={onClose} wide>
      {!backup ? <><button className="dropzone" onClick={() => inputRef.current?.click()}><span className="dropzone__icon"><ArchiveRestore size={27} /></span><strong>اختر ملف masarat-backup</strong><small>يُفحص محليًا قبل إجراء أي تغيير</small></button><input hidden ref={inputRef} type="file" accept=".json,application/json" onChange={(event) => read(event.target.files?.[0])} />{error && <div className="form-error">{error}</div>}</> : <div className="restore-preview"><div className="import-file-card"><span className="file-icon"><FileJson2 size={24} /></span><div><strong>نسخة {new Intl.DateTimeFormat('ar-MA').format(new Date(backup.exportedAt))}</strong><small>{backup.data.projects.length} مسارات · {backup.data.goals.length} أهداف · {backup.data.reviews.length} مراجعات</small></div><span className="valid-badge">صالحة</span></div><div className="danger-note"><ShieldAlert size={18} /><p><strong>تنبيه مهم</strong><span>سيتم استبدال البيانات الحالية بالكامل. صدّر نسخة حديثة أولًا إذا كنت تحتاج الرجوع إليها.</span></p></div><label className="confirm-check"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /> أفهم أن الاستعادة ستستبدل البيانات المحلية الحالية.</label><div className="modal-actions"><button className="button button--ghost" onClick={() => setBackup(undefined)}>اختيار ملف آخر</button><button className="button button--danger" disabled={!confirmed || saving} onClick={async () => { setSaving(true); await onRestore(backup) }}>{saving ? 'جارٍ الاستعادة…' : 'استعادة النسخة'}</button></div></div>}
    </Modal>
  )
}
