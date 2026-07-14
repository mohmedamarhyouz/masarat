import type { ComponentType } from 'react'
import { ArrowLeft, Check, Flag, GitFork, Goal, HelpCircle, Lightbulb, ListTodo, Milestone, RefreshCcw, ShieldAlert, Sparkles, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import type { MasaratNode } from '../../types/masarat'

export type CardData = {
  node: MasaratNode
  isDimmed: boolean
  inSelectedPath: boolean
  stageNumber: number
} & Record<string, unknown>
export type MasaratFlowNode = Node<CardData, 'masarat'>

const typeConfig: Record<MasaratNode['type'], { label: string; icon: ComponentType<{ size?: number }>; tone: string }> = {
  situation: { label: 'الوضع الآن', icon: Target, tone: 'slate' },
  goal: { label: 'الهدف', icon: Goal, tone: 'green' },
  decision: { label: 'قرار', icon: HelpCircle, tone: 'blue' },
  option: { label: 'خيار', icon: GitFork, tone: 'violet' },
  task: { label: 'مهمة', icon: ListTodo, tone: 'cyan' },
  scenario: { label: 'احتمال', icon: Sparkles, tone: 'amber' },
  risk: { label: 'خطر', icon: ShieldAlert, tone: 'red' },
  checkpoint: { label: 'نقطة مراجعة', icon: Milestone, tone: 'cyan' },
  change: { label: 'تغيير', icon: RefreshCcw, tone: 'violet' },
  outcome: { label: 'نتيجة', icon: Flag, tone: 'green' },
  lesson: { label: 'درس', icon: Lightbulb, tone: 'amber' },
}

const levelLabel = { low: 'منخفض', medium: 'متوسط', high: 'مرتفع', unknown: 'غير معروف' }

export function MasaratNodeCard({ data, selected }: NodeProps<MasaratFlowNode>) {
  const { node, isDimmed, inSelectedPath, stageNumber } = data
  const config = typeConfig[node.type]
  const Icon = config.icon
  return (
    <motion.div
      className={`flow-card flow-card--${config.tone} ${selected ? 'flow-card--focused' : ''} ${isDimmed ? 'flow-card--dimmed' : ''} ${inSelectedPath ? 'flow-card--path' : ''}`}
      dir="rtl"
      initial={{ opacity: 0, scale: .94, y: 8 }}
      animate={{ opacity: isDimmed ? .38 : 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 290, damping: 24, delay: Math.min(stageNumber * .035, .28) }}
    >
      <Handle type="target" position={Position.Left} className="flow-handle" />
      <div className="flow-card__meta">
        <span className="flow-card__type"><span><Icon size={15} /></span>{config.label}</span>
        <span className="flow-card__stage">مرحلة {stageNumber}</span>
      </div>
      <h3>{node.title}</h3>
      {node.description && <p>{node.description}</p>}
      {(node.probability || node.confidence) && (
        <div className="flow-card__levels">
          {node.probability && <span>الاحتمال <b>{levelLabel[node.probability]}</b></span>}
          {node.confidence && <span>الثقة <b>{levelLabel[node.confidence]}</b></span>}
        </div>
      )}
      <div className="flow-card__footer">
        {inSelectedPath ? <span className="selected-label"><Check size={12} /> ضمن المسار</span> : <span />}
        <span className="flow-card__open">التفاصيل <ArrowLeft size={13} /></span>
      </div>
      <Handle type="source" position={Position.Right} className="flow-handle" />
    </motion.div>
  )
}
