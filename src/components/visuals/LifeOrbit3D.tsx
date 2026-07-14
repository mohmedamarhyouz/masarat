import { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, HeartPulse, Inbox, Orbit, Route, Sparkles, Users, Wallet } from 'lucide-react'
import type { LifeArea } from '../../types/masarat'
import { localizedAreaName, useI18n } from '../../lib/i18n'

const icons = { wallet: Wallet, 'graduation-cap': GraduationCap, briefcase: Briefcase, 'heart-pulse': HeartPulse, route: Route, users: Users, sparkles: Sparkles, inbox: Inbox }
const positions = [
  { x: 7, y: 18, z: 34 }, { x: 38, y: 2, z: -6 }, { x: 73, y: 12, z: 18 },
  { x: 82, y: 52, z: 42 }, { x: 60, y: 78, z: 5 }, { x: 22, y: 75, z: 30 },
  { x: 2, y: 51, z: -4 }, { x: 48, y: 50, z: -28 },
]

export function LifeOrbit3D({ areas, selectedId, onSelect, compact = false }: {
  areas: LifeArea[]
  selectedId?: string
  onSelect?: (areaId: string) => void
  compact?: boolean
}) {
  const { language, t } = useI18n()
  const visible = areas.filter((area) => !area.archived).slice(0, 8)
  const stable = visible.filter((area) => area.status === 'stable').length
  const attention = visible.filter((area) => area.status !== 'stable').length
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  return (
    <div
      className={`life-orbit-scene ${compact ? 'life-orbit-scene--compact' : ''}`}
      aria-label={t.lifeOrbit}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        setTilt({ x: ((event.clientY - rect.top) / rect.height - .5) * -5, y: ((event.clientX - rect.left) / rect.width - .5) * 7 })
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="orbit-stars" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} />)}</div>
      <motion.div className="orbit-stage" animate={{ rotateX: tilt.x, rotateY: tilt.y }} transition={{ type: 'spring', stiffness: 100, damping: 18 }}>
        <svg className="orbit-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {visible.map((_, index) => <line key={index} x1="50" y1="50" x2={positions[index].x + 6} y2={positions[index].y + 7} />)}
          <ellipse cx="50" cy="50" rx="42" ry="30" /><ellipse cx="50" cy="50" rx="31" ry="20" />
        </svg>
        <motion.div className="orbit-core" animate={{ y: [0, -5, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
          <span><Sparkles size={compact ? 18 : 22} /></span>
          <strong>{stable}<small>/{visible.length}</small></strong>
          <em>{t.stableAreas}</em>
          <i>{attention ? `${attention} ${t.attention}` : t.stable}</i>
        </motion.div>
        {visible.map((area, index) => {
          const Icon = icons[area.icon as keyof typeof icons] ?? Inbox
          const position = positions[index]
          const name = localizedAreaName(area, language)
          return (
            <motion.button
              key={area.id}
              className={`orbit-area orbit-area--${area.status} ${selectedId === area.id ? 'active' : ''}`}
              style={{ left: `${position.x}%`, top: `${position.y}%`, '--orbit-color': area.color, '--orbit-z': `${position.z}px` } as React.CSSProperties}
              onClick={() => onSelect?.(area.id)}
              whileHover={{ scale: 1.07, z: 60 }}
              whileTap={{ scale: .97 }}
              title={name}
            >
              <span><Icon size={compact ? 15 : 17} /></span><strong>{name}</strong><i />
            </motion.button>
          )
        })}
      </motion.div>
      <div className="orbit-caption"><Orbit size={15} /> {t.selectArea}</div>
    </div>
  )
}
