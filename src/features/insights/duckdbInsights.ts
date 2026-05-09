import type { AppSnapshot } from '../../shared/types'

export type InsightReport = {
  engine: 'duckdb' | 'fallback'
  openTasks: number
  completedTasks: number
  focusMinutes: number
  highEnergyTasks: number
  message: string
}

export async function runInsights(snapshot: AppSnapshot): Promise<InsightReport> {
  try {
    const duckdb = await import('@duckdb/duckdb-wasm')
    const bundles = duckdb.getJsDelivrBundles()
    const bundle = await duckdb.selectBundle(bundles)
    const worker = new Worker(bundle.mainWorker!)
    const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING)
    const db = new duckdb.AsyncDuckDB(logger, worker)
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker)
    const connection = await db.connect()

    await db.registerFileText('tasks.json', JSON.stringify(snapshot.tasks))
    await db.registerFileText('focus.json', JSON.stringify(snapshot.focusSessions))
    const taskRows = await connection.query(`
      SELECT
        count(*) FILTER (WHERE status != 'done') AS openTasks,
        count(*) FILTER (WHERE status = 'done') AS completedTasks,
        count(*) FILTER (WHERE energy = 'high' AND status != 'done') AS highEnergyTasks
      FROM read_json_auto('tasks.json')
    `)
    const focusRows = await connection.query(`
      SELECT coalesce(sum(minutes), 0) AS focusMinutes
      FROM read_json_auto('focus.json')
    `)
    const taskStats = taskRows.toArray()[0]
    const focusStats = focusRows.toArray()[0]
    await connection.close()
    await db.terminate()
    worker.terminate()

    return makeReport({
      engine: 'duckdb',
      openTasks: readDuckNumber(taskStats, 'openTasks'),
      completedTasks: readDuckNumber(taskStats, 'completedTasks'),
      highEnergyTasks: readDuckNumber(taskStats, 'highEnergyTasks'),
      focusMinutes: readDuckNumber(focusStats, 'focusMinutes'),
    })
  } catch {
    return makeReport({
      engine: 'fallback',
      openTasks: snapshot.tasks.filter((task) => task.status !== 'done').length,
      completedTasks: snapshot.tasks.filter((task) => task.status === 'done').length,
      highEnergyTasks: snapshot.tasks.filter(
        (task) => task.energy === 'high' && task.status !== 'done',
      ).length,
      focusMinutes: snapshot.focusSessions.reduce((total, session) => total + session.minutes, 0),
    })
  }
}

function readDuckNumber(row: unknown, key: string) {
  if (!row || typeof row !== 'object' || !(key in row)) return 0
  const value = row[key as keyof typeof row]
  return typeof value === 'number' || typeof value === 'bigint' ? Number(value) : 0
}

function makeReport(report: Omit<InsightReport, 'message'>): InsightReport {
  const message =
    report.highEnergyTasks > 2
      ? 'Protect one high-energy task with a focus block.'
      : report.openTasks > 0
        ? 'The list is visible. One next action is enough.'
        : 'Clear board. Enjoy the quiet.'
  return { ...report, message }
}
