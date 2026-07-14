import { Boxes, GitBranch, ListChecks, Sparkles } from 'lucide-react'
import { useI18n } from '../../lib/i18n'
import { Modal } from './Modal'

export function OnboardingModal({ onClose, onImport }: { onClose: () => void; onImport: () => void }) {
  const { language } = useI18n()
  const c = language === 'ar' ? { title: 'مرحبًا بك في Masarat', subtitle: 'نظام شخصي يحفظ سبب قراراتك، لا مجرد قائمة مهام.', organize: 'نظّم حياتك', organizeText: 'قسّمها إلى مجالات، ثم أضف أهدافًا واضحة لكل مجال.', path: 'افتح مسارًا', pathText: 'استورد قرارًا أو Life Pack، وافهم الاحتمالات والمخاطر والسياق.', learn: 'نفّذ وتعلّم', learnText: 'تابع الخطوات من Today، ثم قارن المتوقع بما حدث في المراجعات.', note: 'ابدأ بالمشروع التجريبي الموجود، أو استورد ملفك الخاص الآن.', explore: 'استكشاف المثال', import: 'استيراد ملفي' } : { title: 'Welcome to Masarat', subtitle: 'A personal system that remembers why you decided—not another task list.', organize: 'Organize your life', organizeText: 'Divide it into areas, then set clear goals for each area.', path: 'Open a path', pathText: 'Import a decision or Life Pack and understand scenarios, risks, and context.', learn: 'Execute and learn', learnText: 'Follow actions from Today, then compare expectations with reality in Reviews.', note: 'Start with the included example, or import your own file now.', explore: 'Explore example', import: 'Import my file' }
  const finish = () => { localStorage.setItem('masarat-onboarding-v1', 'done'); onClose() }
  return (
    <Modal title={c.title} subtitle={c.subtitle} onClose={finish} wide>
      <div className="onboarding-steps">
        <article><span><Boxes size={22} /></span><b>1</b><h3>{c.organize}</h3><p>{c.organizeText}</p></article>
        <article><span><GitBranch size={22} /></span><b>2</b><h3>{c.path}</h3><p>{c.pathText}</p></article>
        <article><span><ListChecks size={22} /></span><b>3</b><h3>{c.learn}</h3><p>{c.learnText}</p></article>
      </div>
      <div className="onboarding-note"><Sparkles size={17} /><span>{c.note}</span></div>
      <div className="modal-actions"><button className="button button--ghost" onClick={finish}>{c.explore}</button><button className="button button--primary" onClick={() => { localStorage.setItem('masarat-onboarding-v1', 'done'); onClose(); onImport() }}>{c.import}</button></div>
    </Modal>
  )
}
