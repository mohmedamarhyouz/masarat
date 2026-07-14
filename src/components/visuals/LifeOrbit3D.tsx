import { motion } from 'framer-motion'
import { Orbit, Sparkles } from 'lucide-react'
import type { LifeArea } from '../../types/masarat'
import { useI18n } from '../../lib/i18n'

export function LifeOrbit3D({ areas, selectedId, onSelect, compact = false }: {
  areas: LifeArea[]
  selectedId?: string
  onSelect?: (areaId: string) => void
  compact?: boolean
}) {
  const { t } = useI18n()
  const visible = areas.filter((area) => !area.archived).slice(0, 9)
  const stable = visible.filter((area) => area.status === 'stable').length

  return (
    <div className={`life-orbit-scene ${compact ? 'life-orbit-scene--compact' : ''}`} aria-label={t.lifeOrbit}>
      <div className="orbit-stars" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--star': index } as React.CSSProperties} />)}</div>
      <div className="orbit-system">
        <div className="orbit-ring orbit-ring--one" /><div className="orbit-ring orbit-ring--two" /><div className="orbit-ring orbit-ring--three" />
        <motion.div className="orbit-core" animate={{ scale: [1, 1.06, 1], rotate: [0, 3, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
          <span><Sparkles size={20} /></span><strong>{stable}/{visible.length}</strong><small>{t.stableAreas}</small>
        </motion.div>
        <div className="orbit-nodes">
          {visible.map((area, index) => (
            <motion.button
              key={area.id}
              className={`orbit-node orbit-node--${area.status} ${selectedId === area.id ? 'active' : ''}`}
              style={{ '--angle': `${(360 / Math.max(visible.length, 1)) * index}deg`, '--orbit-color': area.color } as React.CSSProperties}
              onClick={() => onSelect?.(area.id)}
              whileHover={{ scale: 1.13 }}
              whileTap={{ scale: .94 }}
              title={area.name}
            ><i /><span>{area.name}</span></motion.button>
          ))}
        </div>
      </div>
      <div className="orbit-caption"><Orbit size={14} /> {t.selectArea}</div>
    </div>
  )
}
