import { z } from 'zod'
import { NODE_TYPES } from '../types/masarat'

const levelSchema = z.enum(['low', 'medium', 'high', 'unknown'])
const constraintSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(['financial', 'time', 'safety', 'personal', 'technical', 'other']),
})
const impactSchema = z.object({ financial: levelSchema, time: levelSchema, emotional: levelSchema })
const nodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(NODE_TYPES),
  title: z.string().min(1),
  description: z.string().optional(),
  stage: z.number().int().min(0),
  probability: levelSchema.optional(),
  confidence: levelSchema.optional(),
  impact: impactSchema.optional(),
  bestCase: z.string().optional(),
  worstCase: z.string().optional(),
  mitigation: z.string().optional(),
  earlySignals: z.array(z.string()).optional(),
  status: z.enum(['open', 'selected', 'dismissed', 'occurred']).optional(),
})
const connectionSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  label: z.string().optional(),
  condition: z.string().optional(),
})
const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'blocked', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
  relatedNodeId: z.string().optional(),
  estimatedCost: z.number().nonnegative().optional(),
  actualCost: z.number().nonnegative().optional(),
  notes: z.string().optional(),
  completedAt: z.string().optional(),
})
const assumptionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  status: z.enum(['unverified', 'verified', 'invalid']),
  verificationTaskId: z.string().optional(),
})
const checkpointSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  date: z.string(),
  criteria: z.array(z.string()),
  status: z.enum(['upcoming', 'completed', 'missed']),
})
const realityEventSchema = z.object({
  id: z.string().min(1),
  date: z.string(),
  type: z.enum(['observation', 'expense', 'result', 'note']),
  title: z.string().min(1),
  description: z.string().optional(),
  cost: z.number().nonnegative().optional(),
  relatedNodeId: z.string().optional(),
})
const changeSchema = z.object({
  id: z.string().min(1),
  date: z.string(),
  category: z.enum(['budget', 'time', 'goal', 'housing', 'work-study', 'new-info', 'unexpected', 'opinion']),
  title: z.string().min(1),
  description: z.string(),
  affectedNodeIds: z.array(z.string()),
})
const snapshotSchema = z.object({
  goal: z.string(),
  constraints: z.array(constraintSchema),
  nodes: z.array(nodeSchema),
  connections: z.array(connectionSchema),
  tasks: z.array(taskSchema),
  assumptions: z.array(assumptionSchema),
  checkpoints: z.array(checkpointSchema),
})
const versionSchema = z.object({
  id: z.string().min(1),
  number: z.number().int().positive(),
  createdAt: z.string(),
  reason: z.string(),
  snapshot: snapshotSchema,
})

export const masaratProjectSchema = z.object({
  format: z.literal('masarat'),
  schemaVersion: z.literal('1.0'),
  project: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string(),
    goal: z.string().min(1),
    status: z.enum(['exploring', 'active', 'paused', 'completed']),
    createdAt: z.string(),
    updatedAt: z.string(),
    currentVersion: z.number().int().positive(),
  }),
  constraints: z.array(constraintSchema).default([]),
  nodes: z.array(nodeSchema).min(1),
  connections: z.array(connectionSchema).default([]),
  tasks: z.array(taskSchema).default([]),
  assumptions: z.array(assumptionSchema).default([]),
  checkpoints: z.array(checkpointSchema).default([]),
  realityEvents: z.array(realityEventSchema).default([]),
  changes: z.array(changeSchema).default([]),
  versions: z.array(versionSchema).default([]),
  selectedPath: z.object({
    optionNodeId: z.string(),
    nodeIds: z.array(z.string()),
    selectedAt: z.string(),
  }).optional(),
}).superRefine((project, ctx) => {
  const nodeIds = new Set(project.nodes.map((node) => node.id))
  if (nodeIds.size !== project.nodes.length) {
    ctx.addIssue({ code: 'custom', message: 'معرّفات البطاقات يجب أن تكون فريدة', path: ['nodes'] })
  }
  project.connections.forEach((connection, index) => {
    if (!nodeIds.has(connection.source) || !nodeIds.has(connection.target)) {
      ctx.addIssue({ code: 'custom', message: 'رابط يشير إلى بطاقة غير موجودة', path: ['connections', index] })
    }
  })
  const taskIds = new Set(project.tasks.map((task) => task.id))
  if (taskIds.size !== project.tasks.length) {
    ctx.addIssue({ code: 'custom', message: 'معرّفات المهام يجب أن تكون فريدة', path: ['tasks'] })
  }
})

export type ParsedMasaratProject = z.infer<typeof masaratProjectSchema>

export function parseMasaratProject(input: unknown) {
  return masaratProjectSchema.parse(input)
}
