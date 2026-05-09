import { z } from 'zod'
import { appSnapshotSchema, type AppSnapshot } from './types'

export const CURRENT_EXPORT_VERSION = 1
export const CURRENT_SCHEMA_VERSION = 1

export type WorkspaceImportResult = {
  snapshot: AppSnapshot
  format: 'envelope-v1' | 'raw-v1'
}

export type WorkspaceExportOptions = {
  appVersion: string
  commit: string
  generatedAt?: string
}

export const workspaceExportEnvelopeSchema = z.object({
  type: z.literal('gentle-adhd-flow-state'),
  exportVersion: z.literal(CURRENT_EXPORT_VERSION),
  appVersion: z.string(),
  schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
  generatedAt: z.string(),
  source: z.object({
    commit: z.string(),
    mode: z.literal('github-pages'),
  }),
  snapshot: appSnapshotSchema,
})

export type WorkspaceExportEnvelope = z.infer<typeof workspaceExportEnvelopeSchema>

export function createWorkspaceExport(
  snapshot: AppSnapshot,
  options: WorkspaceExportOptions,
): WorkspaceExportEnvelope {
  return {
    type: 'gentle-adhd-flow-state',
    exportVersion: CURRENT_EXPORT_VERSION,
    appVersion: options.appVersion,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    source: {
      commit: options.commit,
      mode: 'github-pages',
    },
    snapshot,
  }
}

export function parseWorkspaceImportText(text: string): WorkspaceImportResult {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    throw new Error(
      'Import failed: this is not valid JSON. Choose a Gentle ADHD Flow export or paste ordinary notes into Capture.',
    )
  }

  return parseWorkspaceImportValue(value)
}

export function parseWorkspaceImportValue(value: unknown): WorkspaceImportResult {
  const envelope = workspaceExportEnvelopeSchema.safeParse(value)
  if (envelope.success) {
    return {
      snapshot: migrateSnapshot(envelope.data.snapshot),
      format: 'envelope-v1',
    }
  }

  const raw = appSnapshotSchema.safeParse(value)
  if (raw.success) {
    return {
      snapshot: migrateSnapshot(raw.data),
      format: 'raw-v1',
    }
  }

  throw new Error(
    'Import failed: this JSON is not a Gentle ADHD Flow state file. Export from Settings, then import that file here.',
  )
}

export function migrateSnapshot(snapshot: AppSnapshot): AppSnapshot {
  if (snapshot.schemaVersion === CURRENT_SCHEMA_VERSION) return snapshot
  throw new Error(`Unsupported workspace schema version: ${snapshot.schemaVersion}`)
}

export function formatPlanText(snapshot: AppSnapshot) {
  const openTasks = snapshot.tasks.filter((task) => task.status !== 'done')
  if (openTasks.length === 0) return 'Gentle ADHD Flow plan\n\nNo open tasks.'

  const lines = openTasks.map((task, index) => {
    const due = task.dueDate ? `due ${task.dueDate}` : task.urgency
    return `${index + 1}. ${task.title}\n   Next: ${task.nextAction}\n   ${task.estimateMinutes}m · ${due} · ${task.context}`
  })

  return `Gentle ADHD Flow plan\n\n${lines.join('\n\n')}`
}

export function encodeShareState(snapshot: AppSnapshot) {
  const json = JSON.stringify(snapshot)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeShareState(encoded: string): AppSnapshot {
  const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  const json = new TextDecoder().decode(bytes)
  return parseWorkspaceImportText(json).snapshot
}

export function getShareStateFromHash(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  const encoded = params.get('state')
  return encoded ? decodeShareState(encoded) : undefined
}
