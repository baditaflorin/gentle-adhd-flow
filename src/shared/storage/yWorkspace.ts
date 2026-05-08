import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { appSnapshotSchema, type AppSnapshot } from '../types'
import { createDefaultSnapshot } from './defaultSnapshot'

const storageName = 'gentle-adhd-flow-v1'
const doc = new Y.Doc()
const root = doc.getMap<unknown>('workspace')
const listeners = new Set<() => void>()

let synced = false

const persistence = new IndexeddbPersistence(storageName, doc)

persistence.once('synced', () => {
  synced = true
  if (!root.has('snapshot')) {
    root.set('snapshot', createDefaultSnapshot())
  }
  emit()
})

doc.on('update', emit)

function emit() {
  for (const listener of listeners) listener()
}

export function subscribeWorkspace(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getWorkspaceSnapshot(): AppSnapshot {
  const parsed = appSnapshotSchema.safeParse(root.get('snapshot'))
  if (parsed.success) return parsed.data
  return createDefaultSnapshot()
}

export function updateWorkspace(recipe: (draft: AppSnapshot) => AppSnapshot | void) {
  const current = structuredClone(getWorkspaceSnapshot())
  const result = recipe(current) ?? current
  root.set('snapshot', appSnapshotSchema.parse(result))
}

export function replaceWorkspace(snapshot: AppSnapshot) {
  root.set('snapshot', appSnapshotSchema.parse(snapshot))
}

export function getWorkspaceStatus() {
  return {
    synced,
    storageName,
  }
}
