import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  type Edge,
  type NodeTypes,
  type ReactFlowInstance,
} from '@xyflow/react'
import { Eye, Focus, Layers3, LocateFixed, Route, ShieldAlert, Sparkles } from 'lucide-react'
import { MasaratNodeCard, type MasaratFlowNode } from '../components/canvas/MasaratNodeCard'
import { NodeDetailsPanel } from '../components/canvas/NodeDetailsPanel'
import { useMasaratStore } from '../store/use-masarat-store'
import type { MasaratProject, NodeType } from '../types/masarat'

const nodeTypes: NodeTypes = { masarat: MasaratNodeCard }
const filterOptions: Array<{ type: NodeType | 'all'; label: string }> = [
  { type: 'all', label: 'الكل' },
  { type: 'decision', label: 'القرارات' },
  { type: 'option', label: 'الخيارات' },
  { type: 'scenario', label: 'الاحتمالات' },
  { type: 'risk', label: 'المخاطر' },
  { type: 'outcome', label: 'النتائج' },
]

function layoutNodes(project: MasaratProject, filter: NodeType | 'all', pathOnly: boolean): MasaratFlowNode[] {
  const selectedIds = new Set(project.selectedPath?.nodeIds ?? [])
  const visible = project.nodes.filter((node) => {
    if (pathOnly && !selectedIds.has(node.id)) return false
    return filter === 'all' || node.type === filter || ['situation', 'goal', 'decision'].includes(node.type)
  })
  const byStage = new Map<number, typeof visible>()
  visible.forEach((node) => byStage.set(node.stage, [...(byStage.get(node.stage) ?? []), node]))

  return visible.map((node) => {
    const siblings = byStage.get(node.stage) ?? []
    const index = siblings.findIndex((item) => item.id === node.id)
    const laneGap = siblings.length > 4 ? 168 : 188
    const totalHeight = (siblings.length - 1) * laneGap
    return {
      id: node.id,
      type: 'masarat',
      position: { x: node.stage * 378, y: index * laneGap - totalHeight / 2 },
      data: {
        node,
        stageNumber: node.stage + 1,
        inSelectedPath: selectedIds.has(node.id),
        isDimmed: Boolean(project.selectedPath && !selectedIds.has(node.id)),
      },
    }
  })
}

export function CanvasPage({ project }: { project: MasaratProject }) {
  const { selectedNodeId, setSelectedNode, choosePath } = useMasaratStore()
  const [filter, setFilter] = useState<NodeType | 'all'>('all')
  const [pathOnly, setPathOnly] = useState(false)
  const [flow, setFlow] = useState<ReactFlowInstance<MasaratFlowNode, Edge>>()
  const nodes = useMemo(() => layoutNodes(project, filter, pathOnly), [project, filter, pathOnly])
  const visibleIds = useMemo(() => new Set(nodes.map((node) => node.id)), [nodes])
  const selectedIds = useMemo(() => new Set(project.selectedPath?.nodeIds ?? []), [project.selectedPath])
  const selectedNode = project.nodes.find((node) => node.id === selectedNodeId)
  const selectedPathNodes = useMemo(
    () => project.nodes.filter((node) => selectedIds.has(node.id)).sort((a, b) => a.stage - b.stage),
    [project.nodes, selectedIds],
  )
  const riskCount = project.nodes.filter((node) => node.type === 'risk').length

  const edges = useMemo<Edge[]>(() => project.connections
    .filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target))
    .map((edge) => {
      const selected = selectedIds.has(edge.source) && selectedIds.has(edge.target)
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: 'smoothstep',
        animated: selected,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: selected ? 18 : 14,
          height: selected ? 18 : 14,
          color: selected ? '#62aaff' : '#3b4a61',
        },
        className: selected ? 'flow-edge flow-edge--selected' : project.selectedPath ? 'flow-edge flow-edge--dimmed' : 'flow-edge',
        labelStyle: { fill: selected ? '#bcd9ff' : '#7f8da3', fontSize: 12, fontWeight: 600 },
        labelBgStyle: { fill: '#0b121e', fillOpacity: 0.96 },
        labelBgPadding: [7, 4] as [number, number],
        labelBgBorderRadius: 7,
      }
    }), [project.connections, project.selectedPath, selectedIds, visibleIds])

  const fitMap = useCallback(() => {
    window.requestAnimationFrame(() => flow?.fitView({ padding: 0.24, duration: 650, maxZoom: 0.92 }))
  }, [flow])

  useEffect(() => {
    fitMap()
  }, [filter, pathOnly, fitMap])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedNode(undefined)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [setSelectedNode])

  return (
    <div className="canvas-page">
      <div className="canvas-toolbar">
        <div className="canvas-toolbar__title">
          <span className="canvas-toolbar__icon"><Route size={19} /></span>
          <div><strong>خريطة القرار</strong><small>استكشف الفروع ثم افتح أي بطاقة</small></div>
        </div>

        <div className="canvas-view-switch" aria-label="طريقة عرض الخريطة">
          <button className={!pathOnly ? 'active' : ''} onClick={() => setPathOnly(false)}><Layers3 size={15} /> كل الفروع</button>
          <button className={pathOnly ? 'active' : ''} onClick={() => setPathOnly(true)} disabled={!project.selectedPath}><Route size={15} /> مساري فقط</button>
        </div>

        <div className="filter-pills">{filterOptions.map((item) => (
          <button key={item.type} className={filter === item.type ? 'active' : ''} onClick={() => setFilter(item.type)}>{item.label}</button>
        ))}</div>

        <button className="canvas-fit-button" onClick={fitMap} title="إظهار الخريطة كاملة"><LocateFixed size={17} /><span>توسيط</span></button>
      </div>

      <div className="canvas-insights" dir="rtl">
        <span><Sparkles size={14} /> {nodes.length} بطاقة ظاهرة</span>
        <span><ShieldAlert size={14} /> {riskCount} مخاطر تحتاج انتباهًا</span>
        <span className="canvas-insights__hint"><Eye size={14} /> عجلة الفأرة للتقريب · اسحب المساحة للتحرك</span>
      </div>

      <div className="flow-wrap" dir="ltr">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={setFlow}
          onNodeClick={(_, node) => setSelectedNode(node.id)}
          onPaneClick={() => setSelectedNode(undefined)}
          fitView
          fitViewOptions={{ padding: 0.24, minZoom: 0.5, maxZoom: 0.9 }}
          minZoom={0.24}
          maxZoom={1.65}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#26354a" gap={28} size={1.2} />
          <Controls showInteractive={false} position="bottom-left" />
          <MiniMap
            position="bottom-right"
            nodeColor={(node) => selectedIds.has(node.id) ? '#5aa7ff' : '#46556c'}
            maskColor="rgba(5, 9, 17, .76)"
            pannable
            zoomable
          />
          <motion.div className="journey-chip" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <Focus size={14} /> الخريطة تتحرك معك
          </motion.div>
        </ReactFlow>
      </div>

      {project.selectedPath && !pathOnly && (
        <motion.div className="path-dock" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }} dir="rtl">
          <div className="path-dock__title"><span><Route size={16} /></span><div><small>المسار المعتمد</small><strong>{project.nodes.find((node) => node.id === project.selectedPath?.optionNodeId)?.title}</strong></div></div>
          <div className="path-dock__nodes">
            {selectedPathNodes.slice(0, 6).map((node, index) => (
              <button key={node.id} onClick={() => setSelectedNode(node.id)} title={node.title}>
                <i>{index + 1}</i><span>{node.title}</span>
              </button>
            ))}
            {selectedPathNodes.length > 6 && <em>+{selectedPathNodes.length - 6}</em>}
          </div>
          <button className="path-dock__focus" onClick={() => setPathOnly(true)}>عرض المسار فقط</button>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedNode && (
          <NodeDetailsPanel
            node={selectedNode}
            isChosen={project.selectedPath?.optionNodeId === selectedNode.id}
            onClose={() => setSelectedNode(undefined)}
            onChoose={() => choosePath(selectedNode.id)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
