import { describe, expect, it } from 'vitest'
import { createDefaultSnapshot } from './storage/defaultSnapshot'
import {
  createWorkspaceExport,
  decodeShareState,
  encodeShareState,
  formatPlanText,
  parseWorkspaceImportText,
} from './workspaceIO'

describe('workspaceIO', () => {
  it('round-trips versioned exports', () => {
    const snapshot = createDefaultSnapshot(new Date('2026-05-09T10:00:00Z'))
    const envelope = createWorkspaceExport(snapshot, {
      appVersion: '0.2.0',
      commit: 'abc1234',
      generatedAt: '2026-05-09T10:01:00Z',
    })

    const parsed = parseWorkspaceImportText(JSON.stringify(envelope))

    expect(parsed.format).toBe('envelope-v1')
    expect(parsed.snapshot).toEqual(snapshot)
  })

  it('imports legacy raw v1 snapshots', () => {
    const snapshot = createDefaultSnapshot(new Date('2026-05-09T10:00:00Z'))
    const parsed = parseWorkspaceImportText(JSON.stringify(snapshot))

    expect(parsed.format).toBe('raw-v1')
    expect(parsed.snapshot).toEqual(snapshot)
  })

  it('round-trips small share states', () => {
    const snapshot = createDefaultSnapshot(new Date('2026-05-09T10:00:00Z'))
    const encoded = encodeShareState(snapshot)

    expect(decodeShareState(encoded)).toEqual(snapshot)
  })

  it('formats open tasks for copy and print', () => {
    const snapshot = createDefaultSnapshot(new Date('2026-05-09T10:00:00Z'))
    snapshot.tasks.push({
      id: 'task_demo',
      title: 'Email accountant',
      nextAction: 'Open the email draft',
      createdAt: '2026-05-09T10:00:00Z',
      updatedAt: '2026-05-09T10:00:00Z',
      estimateMinutes: 15,
      energy: 'medium',
      urgency: 'soon',
      importance: 4,
      context: 'computer',
      status: 'next',
      source: 'test',
    })

    expect(formatPlanText(snapshot)).toContain('Email accountant')
    expect(formatPlanText(snapshot)).toContain('Open the email draft')
  })

  it('rejects invalid JSON with a user-actionable message', () => {
    expect(() => parseWorkspaceImportText('{nope')).toThrow(/not valid JSON/)
  })
})
