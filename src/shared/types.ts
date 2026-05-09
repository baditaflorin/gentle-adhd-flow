import { z } from 'zod'

export const energySchema = z.enum(['low', 'medium', 'high'])
export const urgencySchema = z.enum(['later', 'soon', 'now'])
export const taskStatusSchema = z.enum(['inbox', 'next', 'doing', 'done'])

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  nextAction: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().optional(),
  dueDate: z.string().optional(),
  estimateMinutes: z.number().int().min(1).max(240),
  energy: energySchema,
  urgency: urgencySchema,
  importance: z.number().int().min(1).max(5),
  context: z.string(),
  status: taskStatusSchema,
  source: z.string(),
})

export const habitSchema = z.object({
  id: z.string(),
  title: z.string(),
  cue: z.string(),
  createdAt: z.string(),
  checkIns: z.record(z.string(), z.boolean()),
})

export const focusSessionSchema = z.object({
  id: z.string(),
  taskId: z.string().optional(),
  taskTitle: z.string(),
  startedAt: z.string(),
  endedAt: z.string(),
  minutes: z.number().int().min(1),
  soundscape: z.string(),
})

export const captureEntrySchema = z.object({
  id: z.string(),
  text: z.string(),
  createdAt: z.string(),
  taskIds: z.array(z.string()),
})

export const appSnapshotSchema = z.object({
  schemaVersion: z.literal(1),
  tasks: z.array(taskSchema),
  habits: z.array(habitSchema),
  focusSessions: z.array(focusSessionSchema),
  captures: z.array(captureEntrySchema),
  settings: z.object({
    soundscape: z.enum(['forest', 'lofi', 'rainline']),
    focusMinutes: z.number().int().min(5).max(90),
    gentleVoice: z.boolean(),
  }),
})

export const buildMetaSchema = z.object({
  version: z.string(),
  commit: z.string(),
  builtAt: z.string(),
})

export type Energy = z.infer<typeof energySchema>
export type Urgency = z.infer<typeof urgencySchema>
export type TaskStatus = z.infer<typeof taskStatusSchema>
export type Task = z.infer<typeof taskSchema>
export type Habit = z.infer<typeof habitSchema>
export type FocusSession = z.infer<typeof focusSessionSchema>
export type CaptureEntry = z.infer<typeof captureEntrySchema>
export type AppSnapshot = z.infer<typeof appSnapshotSchema>
export type BuildMeta = z.infer<typeof buildMetaSchema>

export type WorkspaceUpdater = (recipe: (draft: AppSnapshot) => AppSnapshot | void) => void
