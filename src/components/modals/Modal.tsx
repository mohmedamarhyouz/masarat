import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  subtitle?: string
  children: ReactNode
  onClose: () => void
  wide?: boolean
}

export function Modal({ title, subtitle, children, onClose, wide = false }: ModalProps) {
  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
      <motion.section
        className={`modal ${wide ? 'modal--wide' : ''}`}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal__header">
          <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
          <button className="icon-button" onClick={onClose}><X size={19} /></button>
        </div>
        <div className="modal__body">{children}</div>
      </motion.section>
    </motion.div>
  )
}
