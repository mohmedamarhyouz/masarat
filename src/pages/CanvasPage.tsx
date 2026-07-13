import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Background, Controls, MarkerType, MiniMap, ReactFlow, type Edge, type NodeTypes } from '@xyflow/react'
import { Eye, Focus, Route } from 'lucide-react'
import { MasaratNodeCard, type MasaratFlowNode } from '../components/canvas/MasaratNodeCard'
import { NodeDetailsPanel } from '../components/canvas/NodeDetailsPanel'
import { useMasaratStore } from '../store/use-masarat-store'
import type { MasaratProject, NodeType } from '../types/masarat'

const nodeTypes: NodeTypes = { masarat: MasaratNodeCard }
const filterOptions: Array<{ type: NodeType | 'all'; label: string }> = [
  { type: 'all', label: 'الكل' }, { type: 'decision', label: 'القرارات' }, { type: 'option', label: 'الخيارات' }, { type: 'scenario', label: 'الاحتمالات' }, { type: 'risk', label: 'المخاطر' }, { type: 'outcome', label: 'النتائج' },
]

function layoutNodes(project: MasaratProject, filter: NodeType | 'all'): MasaratFlowNode[] {
  const visible = filter === 'all' ? project.nodes : project.nodes.filter((node) => node.type === filter || ['situation', 'goal', 'decision'].includes(node.type))
  const byStage = new Map<number, typeof visible>()
  visible.forEach((node) => byStage.set(node.stage, [...(byStage.get(node.stage) ?? []), node]))
  const selectedIds = new Set(project.selectedPath?.nodeIds ?? [])
  return visible.map((node) => {
    const siblings = byStage.get(node.stage) ?? []
    const index = siblings.findIndex((item) => item.id === node.id)
    const totalHeight = (siblings.length - 1) * 176
    return {
      id: node.id,
      type: 'masarat',
      position: { x: node.stage * 345, y: index * 176 - totalHeight / 2 },
      data: {
        node,
        inSelectedPath: selectedIds.has(node.id),
        isDimmed: Boolean(project.selectedPath && !selectedIds.has(node.id)),
      },
    }
  })
}

export function CanvasPage({ project }: { project: MasaratProject }) {
  const { selectedNodeId, setSelectedNode, choosePath } = useMasaratStore()
  const [filter, setFilter] = useState<NodeType | 'all'>('all')
  const nodes = useMemo(() => layoutNodes(project, filter), [project, filter])
  const visibleIds = useMemo(() => new Set(nodes.map((node) => node.id)), [nodes])
  const selectedIds = useMemo(() => new Set(project.selectedPath?.nodeIds ?? []), [project.selectedPath])
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
        markerEnd: { type: MarkerType.ArrowClosed, width: 15, height: 15 },
        className: selected ? 'flow-edge flow-edge--selected' : project.selectedPath ? 'flow-edge flow-edge--dimmed' : 'flow-edge',
        labelStyle: { fill: '#8290a8', fontSize: 11 },
        labelBgStyle: { fill: '#0b1120', fillOpacity: 0.94 },
      }
    }), [project.connections, project.selectedPath, selectedIds, visibleIds])
  const selectedNode = project.nodes.find((node) => node.id === selectedNodeId)

  return (
    <div className="canvas-page">
      <div className="canvas-toolbar">
        <div className="canvas-toolbar__title"><Route size={18} /><div><strong>خريطة القرار</strong><small>اسحب للاستكشاف · اضغط على أي بطاقة للتفاصيل</small></div></div>
        <div className="filter-pills">{filterOptions.map((item) => <button key={item.type} className={filter === item.type ? 'active' : ''} onClick={() => setFilter(item.type)}>{item.label}</button>)}</div>
        <div className="canvas-legend"><span><i className="legend-path" /> المسار الحالي</span><span><Eye size={14} /> الفروع محفوظة</span></div>
      </div>
      <div className="flow-wrap" dir="ltr">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => setSelectedNode(node.id)}
          onPaneClick={() => setSelectedNode(undefined)}
          fitView
          fitViewOptions={{ padding: 0.22, minZoom: 0.58, maxZoom: 0.9 }}
          minZoom={0.25}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1c2637" gap={24} size={1} />
          <Controls showInteractive={false} position="bottom-left" />
          <MiniMap position="bottom-right" nodeColor="#526276" maskColor="rgba(5, 9, 17, .72)" pannable zoomable />
          <div className="journey-chip"><Focus size={14} /> الرحلة كاملة</div>
        </ReactFlow>
      </div>
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
