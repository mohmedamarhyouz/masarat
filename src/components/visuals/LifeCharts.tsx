import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, CheckCircle2 } from 'lucide-react'
import { useI18n } from '../../lib/i18n'

export function ProgressDonut({ value, label }: { value: number; label?: string }) {
  const { t } = useI18n()
  const radius = 42
  const circumference = Math.PI * 2 * radius
  return (
    <div className="smart-donut">
      <svg viewBox="0 0 110 110" role="img" aria-label={`${label ?? t.progress}: ${value}%`}>
        <defs><linearGradient id="donut-gradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#62b8ff" /><stop offset="1" stopColor="#8c6cff" /></linearGradient></defs>
        <circle className="smart-donut__track" cx="55" cy="55" r={radius} />
        <motion.circle className="smart-donut__value" cx="55" cy="55" r={radius} strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference * (1 - value / 100) }} transition={{ duration: 1.1, ease: 'easeOut' }} />
      </svg>
      <div><strong>{value}%</strong><small>{label ?? t.progress}</small></div>
    </div>
  )
}

export interface ActivityPoint { label: string; tasks: number; events: number }

export function ActivityBars({ data }: { data: ActivityPoint[] }) {
  const { t } = useI18n()
  const [selected, setSelected] = useState(data.length - 1)
  const max = Math.max(1, ...data.map((item) => item.tasks + item.events))
  const active = data[selected] ?? data[0]
  return (
    <div className="activity-chart">
      <div className="activity-chart__head"><div><span><Activity size={15} /> {t.weeklyActivity}</span><strong>{(active?.tasks ?? 0) + (active?.events ?? 0)}</strong></div><div className="chart-legend"><span><i className="task" />{t.tasks}</span><span><i className="event" />{t.events}</span></div></div>
      <div className="activity-bars">
        {data.map((item, index) => {
          const taskHeight = Math.max(4, (item.tasks / max) * 100)
          const eventHeight = Math.max(3, (item.events / max) * 100)
          return <button key={`${item.label}-${index}`} className={selected === index ? 'active' : ''} onClick={() => setSelected(index)} aria-label={`${item.label}: ${item.tasks + item.events}`}><span className="bar-stack"><motion.i className="bar-task" initial={{ height: 0 }} animate={{ height: `${taskHeight}%` }} transition={{ delay: index * .05, duration: .55 }} /><motion.i className="bar-event" initial={{ height: 0 }} animate={{ height: `${eventHeight}%` }} transition={{ delay: index * .05 + .08, duration: .55 }} /></span><small>{item.label}</small></button>
        })}
      </div>
      <div className="activity-chart__detail"><CheckCircle2 size={14} /><span>{active?.tasks ?? 0} {t.tasks} · {active?.events ?? 0} {t.events}</span></div>
    </div>
  )
}

export function HealthSegments({ stable, attention, critical }: { stable: number; attention: number; critical: number }) {
  const { t } = useI18n()
  const total = Math.max(1, stable + attention + critical)
  return (
    <div className="health-segments">
      <div className="health-segments__head"><span>{t.health}</span><strong>{stable}/{total}</strong></div>
      <div className="health-track"><motion.i className="stable" initial={{ width: 0 }} animate={{ width: `${stable / total * 100}%` }} /><motion.i className="attention" initial={{ width: 0 }} animate={{ width: `${attention / total * 100}%` }} /><motion.i className="critical" initial={{ width: 0 }} animate={{ width: `${critical / total * 100}%` }} /></div>
      <div className="health-labels"><span><i className="stable" />{t.stable} {stable}</span><span><i className="attention" />{t.attention} {attention}</span><span><i className="critical" />{t.critical} {critical}</span></div>
    </div>
  )
}
