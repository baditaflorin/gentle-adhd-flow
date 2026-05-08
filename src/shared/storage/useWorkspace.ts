import { useCallback, useSyncExternalStore } from 'react'
import {
  getWorkspaceSnapshot,
  getWorkspaceStatus,
  replaceWorkspace,
  subscribeWorkspace,
  updateWorkspace,
} from './yWorkspace'
import type { AppSnapshot } from '../types'

export function useWorkspace() {
  const snapshot = useSyncExternalStore(
    subscribeWorkspace,
    getWorkspaceSnapshot,
    getWorkspaceSnapshot,
  )
  const status = getWorkspaceStatus()

  return {
    snapshot,
    isSynced: status.synced,
    storageName: status.storageName,
    updateWorkspace: useCallback(
      (recipe: (draft: AppSnapshot) => AppSnapshot | void) => updateWorkspace(recipe),
      [],
    ),
    replaceWorkspace: useCallback((next: AppSnapshot) => replaceWorkspace(next), []),
  }
}
