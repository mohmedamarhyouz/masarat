import { Check, Clock3, Coins, HeartPulse, ShieldCheck, X } from 'lucide-react'
import { motion } from 'framer-motion'
import type { MasaratNode } from '../../types/masarat'

const labels = {
  situation: 'الوضع الحالي', goal: 'هدف', decision: 'قرار', option: 'خيار', task: 'مهمة', scenario: 'احتمال', risk: 'خطر', checkpoint: 'مراجعة', change: 'تغيير', outcome: 'نتيجة', lesson: 'درس',
}
const levels = { low: 'منخفض', medium: 'متوسط', high: 'مرتفع', unknown: 'غير معروف' }

export function NodeDetailsPanel({ node, isChosen, onClose, onChoose }: { node: MasaratNode; isChosen: boolean; onClose: () => void; onChoose: () => void }) {
  return (
    <motion.aside className="details-panel" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
      <div className="details-panel__header"><span className={`node-kind node-kind--${node.type}`}>{labels[node.type]}</span><button className="icon-button icon-button--small" onClick={onClose}><X size={17} /></button></div>
      <h2>{node.title}</h2>
      <p className="details-panel__description">{node.description ?? 'لا يوجد وصف إضافي لهذه البطاقة.'}</p>

      {(node.probability || node.confidence) && <div className="details-levels">{node.probability && <div><small>مدى الاحتمال</small><strong>{levels[node.probability]}</strong></div>}{node.confidence && <div><small>درجة الثقة</small><strong>{levels[node.confidence]}</strong></div>}</div>}

      {node.impact && (
        <section className="details-section"><h3>التأثير المتوقع</h3><div className="impact-list"><span><Coins size={16} /> مالي <b>{levels[node.impact.financial]}</b></span><span><Clock3 size={16} /> زمني <b>{levels[node.impact.time]}</b></span><span><HeartPulse size={16} /> نفسي <b>{levels[node.impact.emotional]}</b></span></div></section>
      )}
      {(node.bestCase || node.worstCase) && <section className="details-section"><h3>حدود السيناريو</h3>{node.bestCase && <div className="case-note case-note--good"><small>أفضل حالة</small><p>{node.bestCase}</p></div>}{node.worstCase && <div className="case-note case-note--bad"><small>أسوأ حالة</small><p>{node.worstCase}</p></div>}</section>}
      {node.mitigation && <section className="details-section"><h3>تقليل الخطر</h3><div className="mitigation"><ShieldCheck size={17} /><p>{node.mitigation}</p></div></section>}
      {node.earlySignals?.length ? <section className="details-section"><h3>علامات مبكرة</h3><ul className="signal-list">{node.earlySignals.map((signal) => <li key={signal}><span />{signal}</li>)}</ul></section> : null}

      {node.type === 'option' && <button className={`button ${isChosen ? 'button--chosen' : 'button--primary'} button--full`} onClick={onChoose} disabled={isChosen}>{isChosen ? <><Check size={17} /> هذا هو المسار الحالي</> : 'اعتماد هذا المسار'}</button>}
    </motion.aside>
  )
}
