import { Boxes, GitBranch, ListChecks, Sparkles } from 'lucide-react'
import { Modal } from './Modal'

export function OnboardingModal({ onClose, onImport }: { onClose: () => void; onImport: () => void }) {
  const finish = () => { localStorage.setItem('masarat-onboarding-v1', 'done'); onClose() }
  return (
    <Modal title="مرحبًا بك في Masarat" subtitle="نظام شخصي يحفظ سبب قراراتك، لا مجرد قائمة مهام." onClose={finish} wide>
      <div className="onboarding-steps">
        <article><span><Boxes size={22} /></span><b>1</b><h3>نظّم حياتك</h3><p>قسّمها إلى مجالات، ثم أضف أهدافًا واضحة لكل مجال.</p></article>
        <article><span><GitBranch size={22} /></span><b>2</b><h3>افتح مسارًا</h3><p>استورد قرارًا أو Life Pack، وافهم الاحتمالات والمخاطر والسياق.</p></article>
        <article><span><ListChecks size={22} /></span><b>3</b><h3>نفّذ وتعلّم</h3><p>تابع الخطوات من Today، ثم قارن المتوقع بما حدث في المراجعات.</p></article>
      </div>
      <div className="onboarding-note"><Sparkles size={17} /><span>ابدأ بالمشروع التجريبي الموجود، أو استورد ملفك الخاص الآن.</span></div>
      <div className="modal-actions"><button className="button button--ghost" onClick={finish}>استكشاف المثال</button><button className="button button--primary" onClick={() => { localStorage.setItem('masarat-onboarding-v1', 'done'); onClose(); onImport() }}>استيراد ملفي</button></div>
    </Modal>
  )
}
