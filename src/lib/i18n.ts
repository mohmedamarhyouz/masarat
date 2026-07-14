import { useMasaratStore } from '../store/use-masarat-store'

export type Language = 'ar' | 'en'

const defaultAreaNames: Record<string, { ar: string; en: string }> = {
  'area-money': { ar: 'المال', en: 'Money' },
  'area-study': { ar: 'الدراسة', en: 'Study' },
  'area-career': { ar: 'المسار المهني', en: 'Career' },
  'area-health': { ar: 'الصحة', en: 'Health' },
  'area-transport': { ar: 'التنقل', en: 'Transport' },
  'area-family': { ar: 'العائلة', en: 'Family' },
  'area-growth': { ar: 'التطور الشخصي', en: 'Personal growth' },
  'area-uncategorized': { ar: 'غير مصنف', en: 'Uncategorized' },
}

export function localizedAreaName(area: { id: string; name: string }, language: Language) {
  return defaultAreaNames[area.id]?.[language] ?? area.name
}

const copy = {
  ar: {
    navControl: 'القيادة', navPlan: 'التخطيط', navReflect: 'المراجعة',
    today: 'اليوم', todayHint: 'مركز التركيز', life: 'حياتي', lifeHint: 'كل المجالات', goals: 'الأهداف', goalsHint: 'ما تريد تحقيقه', paths: 'المسارات', pathsHint: 'المشاريع والقرارات', timeline: 'الخط الزمني', timelineHint: 'ما حدث وتغيّر', reviews: 'المراجعات', reviewsHint: 'تعلّم وعدّل', settings: 'الإعدادات', settingsHint: 'الخصوصية والنسخ',
    localPrivate: 'محلي وخاص', localPrivateHint: 'بياناتك لا تغادر جهازك', commandCenter: 'مركز القيادة', fullPicture: 'الصورة الكاملة', direction: 'الاتجاه والنتيجة', projectsDecisions: 'المشاريع والقرارات', lifeMemory: 'ذاكرة حياتك', learnReality: 'تعلّم من الواقع', privacyControl: 'الخصوصية والتحكم', activePath: 'المسار النشط', next: 'التالي', export: 'تصدير', changed: 'تغيّر شيء', importFile: 'استيراد ملف Masarat',
    clearStep: 'وضوح أكثر، ضجيج أقل', heroToday: 'اعرف ما يحتاج انتباهك الآن.', heroTodayText: 'مساراتك، مخاطرك، تقدمك وواقعك في مركز قيادة واحد.', resume: 'متابعة من حيث توقفت', openExecution: 'فتح التنفيذ', quickAdd: 'إضافة سريعة', noteResult: 'ملاحظة أو نتيجة', expense: 'مصروف', importantNow: 'الأهم الآن', todayFocus: 'تركيز اليوم', stepsOfThree: 'من 3 خطوات', noDeadline: 'دون موعد', complete: 'إكمال', allClear: 'كل شيء واضح لليوم', noOpenTasks: 'لا توجد مهام مفتوحة في مساراتك الحالية.', showMore: 'عرض بقية المهام', checkpoints: 'نقاط المراجعة', overdueReview: 'مراجعة متأخرة تحتاج قرارًا', noReviews: 'لا توجد مراجعات قادمة.', attentionSignals: 'إشارات الانتباه', activeNoNext: 'هناك مسار نشط بلا خطوة تالية. راجعه حتى لا يتوقف بصمت.', allHaveNext: 'كل المسارات النشطة لديها خطوة تالية واضحة.', reviewPath: 'راجع المسار',
    smartBrief: 'الملخص الذكي', smartOffline: 'تحليل محلي دون ذكاء اصطناعي', noAlerts: 'الوضع متوازن حاليًا', noAlertsText: 'لا توجد إشارات حرجة. استمر في تنفيذ الخطوة التالية ومراجعة الواقع.', open: 'فتح',
    progress: 'التقدم', completed: 'مكتملة', active: 'نشطة', health: 'توازن المجالات', weeklyActivity: 'نشاط 7 أيام', tasks: 'مهام', events: 'أحداث',
    connectedPicture: 'منظومة واحدة مترابطة', heroLife: 'شاهد حياتك كمنظومة، لا كقوائم.', heroLifeText: 'حرّك المدار، اختر مجالًا، وافهم أهدافه ومساراته وإشاراته من مكان واحد.', newArea: 'مجال جديد', hideArchived: 'إخفاء المؤرشف', showArchived: 'عرض المؤرشف', stableAreas: 'مجالات مستقرة', stable: 'مستقر', attention: 'يحتاج انتباه', critical: 'حرج', archived: 'مؤرشف', edit: 'تعديل', archive: 'أرشفة', areaGoals: 'أهداف', areaPaths: 'مسارات', nextStep: 'الخطوة التالية', noOpenStep: 'لا توجد خطوة مفتوحة', openArea: 'فتح المجال',
    language: 'English', languageTitle: 'Switch to English', lifeOrbit: 'مدار حياتك', selectArea: 'اختر مجالًا لاستكشافه',
  },
  en: {
    navControl: 'CONTROL', navPlan: 'PLAN', navReflect: 'REFLECT',
    today: 'Today', todayHint: 'Focus center', life: 'My Life', lifeHint: 'Every life area', goals: 'Goals', goalsHint: 'Desired outcomes', paths: 'Paths', pathsHint: 'Projects & decisions', timeline: 'Timeline', timelineHint: 'What happened', reviews: 'Reviews', reviewsHint: 'Learn & adjust', settings: 'Settings', settingsHint: 'Privacy & backup',
    localPrivate: 'Local & private', localPrivateHint: 'Your data stays on this device', commandCenter: 'COMMAND CENTER', fullPicture: 'THE FULL PICTURE', direction: 'DIRECTION & OUTCOME', projectsDecisions: 'PROJECTS & DECISIONS', lifeMemory: 'YOUR LIFE MEMORY', learnReality: 'LEARN FROM REALITY', privacyControl: 'PRIVACY & CONTROL', activePath: 'ACTIVE PATH', next: 'NEXT', export: 'Export', changed: 'Something changed', importFile: 'Import Masarat file',
    clearStep: 'More clarity, less noise', heroToday: 'Know what needs your attention now.', heroTodayText: 'Your paths, risks, progress and reality in one command center.', resume: 'Continue where you stopped', openExecution: 'Open execution', quickAdd: 'Quick capture', noteResult: 'Note or result', expense: 'Expense', importantNow: 'MOST IMPORTANT', todayFocus: 'Today’s focus', stepsOfThree: 'of 3 actions', noDeadline: 'No deadline', complete: 'Complete', allClear: 'Everything is clear today', noOpenTasks: 'There are no open tasks in your current paths.', showMore: 'Show remaining tasks', checkpoints: 'Checkpoints', overdueReview: 'overdue review needs a decision', noReviews: 'No upcoming reviews.', attentionSignals: 'Attention signals', activeNoNext: 'An active path has no next action. Review it before it silently stalls.', allHaveNext: 'Every active path has a clear next action.', reviewPath: 'Review path',
    smartBrief: 'Smart brief', smartOffline: 'Private rule-based analysis', noAlerts: 'Your system is balanced', noAlertsText: 'No critical signals. Keep executing the next action and recording reality.', open: 'Open',
    progress: 'Progress', completed: 'Completed', active: 'Active', health: 'Life-area balance', weeklyActivity: '7-day activity', tasks: 'Tasks', events: 'Events',
    connectedPicture: 'ONE CONNECTED SYSTEM', heroLife: 'See your life as a system, not lists.', heroLifeText: 'Rotate the orbit, select an area, and understand its goals, paths, and signals in one place.', newArea: 'New area', hideArchived: 'Hide archived', showArchived: 'Show archived', stableAreas: 'stable areas', stable: 'Stable', attention: 'Needs attention', critical: 'Critical', archived: 'Archived', edit: 'Edit', archive: 'Archive', areaGoals: 'Goals', areaPaths: 'Paths', nextStep: 'Next action', noOpenStep: 'No open action', openArea: 'Open area',
    language: 'العربية', languageTitle: 'التبديل إلى العربية', lifeOrbit: 'Your Life Orbit', selectArea: 'Select an area to explore',
  },
} as const

export function useI18n() {
  const language = useMasaratStore((state) => state.language)
  const setLanguage = useMasaratStore((state) => state.setLanguage)
  return { language, setLanguage, t: copy[language], locale: language === 'ar' ? 'ar-MA' : 'en-GB', dir: language === 'ar' ? 'rtl' as const : 'ltr' as const }
}
