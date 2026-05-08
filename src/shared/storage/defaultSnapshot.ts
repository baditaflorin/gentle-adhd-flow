import type { AppSnapshot } from '../types'
import { newId } from '../id'

export function createDefaultSnapshot(now = new Date()): AppSnapshot {
  const createdAt = now.toISOString()
  return {
    schemaVersion: 1,
    tasks: [],
    habits: [
      {
        id: newId('habit'),
        title: 'Drink water',
        cue: 'After opening the app',
        createdAt,
        checkIns: {},
      },
      {
        id: newId('habit'),
        title: 'Two-minute reset',
        cue: 'Before a focus session',
        createdAt,
        checkIns: {},
      },
    ],
    focusSessions: [],
    captures: [],
    settings: {
      soundscape: 'forest',
      focusMinutes: 25,
      gentleVoice: true,
    },
  }
}
