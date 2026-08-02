import { z } from 'zod'
import { newId } from '../../shared/id'
import { addDays, localDateKey } from '../../shared/time'
import {
  habitSchema,
  taskSchema,
  type Energy,
  type Habit,
  type Task,
  type Urgency,
} from '../../shared/types'

export const extractionResultSchema = z.object({
  tasks: z.array(taskSchema),
  habits: z.array(habitSchema),
  confidence: z.number().min(0).max(1),
})

export type ExtractionResult = z.infer<typeof extractionResultSchema>

const actionPrefixes =
  /^(todo|task|remember to|i need to|need to|i have to|have to|must|should|please)\s+/i

const taskSignals =
  /\b(call|email|text|buy|book|schedule|pay|finish|write|send|clean|prepare|review|fix|make|start|submit|renew|cancel|pick up|follow up|ship|file)\b/i

export function extractBrainDump(text: string, now = new Date()): ExtractionResult {
  const createdAt = now.toISOString()
  const chunks = splitBrainDump(text)
  const tasks: Task[] = []
  const habits: Habit[] = []

  for (const chunk of chunks) {
    if (isHabit(chunk)) {
      habits.push({
        id: newId('habit'),
        title: cleanTitle(chunk.replace(/\b(habit|daily|every day|each day)\b/gi, '')),
        cue: inferHabitCue(chunk),
        createdAt,
        checkIns: {},
      })
      continue
    }

    const hasTaskSignal = taskSignals.test(chunk) || Boolean(inferDueDate(chunk, now))
    if (!hasTaskSignal) continue

    const title = cleanTitle(chunk)
    if (!title) continue

    const energy = inferEnergy(chunk)
    tasks.push({
      id: newId('task'),
      title,
      nextAction: inferNextAction(title, chunk),
      createdAt,
      updatedAt: createdAt,
      dueDate: inferDueDate(chunk, now),
      estimateMinutes: inferEstimate(chunk, energy),
      energy,
      urgency: inferUrgency(chunk),
      importance: inferImportance(chunk),
      context: inferContext(chunk),
      status: 'next',
      source: 'brain-dump',
    })
  }

  if (tasks.length === 0 && text.trim()) {
    tasks.push({
      id: newId('task'),
      title: 'Clarify the brain dump',
      nextAction: 'Circle one sentence that wants attention first',
      createdAt,
      updatedAt: createdAt,
      estimateMinutes: 10,
      energy: 'low',
      urgency: 'soon',
      importance: 3,
      context: 'planning',
      status: 'next',
      source: 'brain-dump',
    })
  }

  return {
    tasks,
    habits,
    confidence: Math.min(0.96, 0.45 + tasks.length * 0.12 + habits.length * 0.08),
  }
}

// Real brain dumps -- especially voice transcripts, which often arrive with
// little or no punctuation -- routinely chain several distinct tasks with
// "and"/"then"/"also"/commas instead of sentence breaks, e.g. "call mom and
// email boss and buy milk". Splitting only on sentence punctuation collapsed
// runs like that into a single garbled task and silently dropped the rest.
// We additionally split at a conjunction/comma boundary, but only when it is
// immediately followed (after optional filler words like "i need to") by an
// actual task verb -- so plain item lists such as "buy milk and eggs and
// bread" are correctly left as one task instead of being shredded into
// fragments that lack a verb and would otherwise vanish.
const taskVerbSource =
  '(?:call|email|text|buy|book|schedule|pay|finish|write|send|clean|prepare|review|fix|make|start|submit|renew|cancel|pick up|follow up|ship|file)'

const fillerSource =
  "(?:(?:i\\s+)?(?:really\\s+|probably\\s+|also\\s+|gotta\\s+|got\\s+to\\s+|need(?:s)?\\s+to\\s+|have\\s+to\\s+|has\\s+to\\s+|must\\s+|should\\s+|please\\s+|remember\\s+(?:to\\s+)?|dont\\s+forget\\s+(?:to\\s+)?|don't\\s+forget\\s+(?:to\\s+)?)){0,3}"

const conjunctionBoundary = new RegExp(
  `(?:,\\s*|\\s+(?:and then|and also|and|then|plus)\\s+)(?=${fillerSource}${taskVerbSource}\\b)`,
  'gi',
)

function splitBrainDump(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?:\n|[.;]|(?:\s-\s)|(?:\s•\s))/)
    .flatMap((part) => part.split(conjunctionBoundary))
    .map((part) => part.trim())
    .filter(Boolean)
}

// Time words we recognise as "this is when, not what". When one of these
// follows "by/before/after", the prefix-plus-time-word phrase is a time
// clause and can be safely stripped from the task title. The previous
// implementation matched "by/before/after" + any \w+, which butchered
// titles like "pay rent before the deadline" into "Pay rent deadline".
const timeWordPattern =
  '(?:today|tomorrow|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday|noon|midnight|morning|afternoon|evening|breakfast|lunch|dinner|bed|bedtime|work|school|class|standup|the meeting|the call|the appointment|\\d{1,2}(?::\\d{2})?\\s?(?:am|pm)?|\\d{1,2}\\/\\d{1,2})'

function cleanTitle(value: string) {
  const cleaned = value
    .replace(actionPrefixes, '')
    .replace(
      /\b(today|tomorrow|tonight|this week|next week|every morning|each morning|every night|each night)\b/gi,
      '',
    )
    .replace(new RegExp(`\\b(by|before|after)\\s+${timeWordPattern}\\b`, 'gi'), '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!cleaned) return ''
  return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}`
}

function inferNextAction(title: string, original: string) {
  const lower = original.toLowerCase()
  if (lower.includes('email')) return `Open the email draft for "${title}"`
  if (lower.includes('call')) return `Find the number for "${title}"`
  if (lower.includes('buy')) return `Put "${title}" on a short shopping list`
  if (lower.includes('book') || lower.includes('schedule'))
    return `Open the calendar for "${title}"`
  if (lower.includes('clean')) return `Set a 10-minute timer for "${title}"`
  return `Start with a 10-minute version of "${title}"`
}

function inferEnergy(value: string): Energy {
  const lower = value.toLowerCase()
  if (/\b(tiny|quick|easy|2 min|two minute|tired|low energy)\b/.test(lower)) return 'low'
  if (/\b(deep|hard|complex|focus|draft|write|finish|project)\b/.test(lower)) return 'high'
  return 'medium'
}

function inferUrgency(value: string): Urgency {
  const lower = value.toLowerCase()
  if (/\b(urgent|asap|now|today|tonight|deadline)\b/.test(lower)) return 'now'
  if (
    /\b(tomorrow|soon|this week|friday|monday|tuesday|wednesday|thursday|saturday|sunday)\b/.test(
      lower,
    )
  ) {
    return 'soon'
  }
  return 'later'
}

function inferImportance(value: string) {
  const lower = value.toLowerCase()
  if (/\b(urgent|deadline|bill|tax|rent|doctor|client|boss)\b/.test(lower)) return 5
  if (/\b(important|must|need to|have to|submit)\b/.test(lower)) return 4
  if (/\b(maybe|someday|could)\b/.test(lower)) return 2
  return 3
}

function inferEstimate(value: string, energy: Energy) {
  const match = value.match(/\b(\d{1,3})\s?(m|min|minute|minutes|h|hr|hour|hours)\b/i)
  if (match) {
    const amount = Number(match[1])
    const unit = match[2].toLowerCase()
    return Math.min(unit.startsWith('h') ? amount * 60 : amount, 240)
  }
  if (energy === 'low') return 10
  if (energy === 'high') return 45
  return 25
}

function inferContext(value: string) {
  const lower = value.toLowerCase()
  if (/\b(call|phone|text)\b/.test(lower)) return 'phone'
  if (/\b(email|write|draft|send|review)\b/.test(lower)) return 'computer'
  if (/\b(buy|pick up|errand|store)\b/.test(lower)) return 'errand'
  if (/\b(clean|laundry|kitchen|home)\b/.test(lower)) return 'home'
  return 'planning'
}

function inferDueDate(value: string, now: Date) {
  const lower = value.toLowerCase()
  if (lower.includes('today') || lower.includes('tonight')) return localDateKey(now)
  if (lower.includes('tomorrow')) return localDateKey(addDays(now, 1))

  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const weekday = weekdays.findIndex((day) => lower.includes(day))
  if (weekday >= 0) {
    const daysUntil = (weekday - now.getDay() + 7) % 7 || 7
    return localDateKey(addDays(now, daysUntil))
  }

  const dateMatch = lower.match(/\b(\d{1,2})\/(\d{1,2})\b/)
  if (dateMatch) {
    const parsed = new Date(now.getFullYear(), Number(dateMatch[1]) - 1, Number(dateMatch[2]))
    return localDateKey(parsed)
  }

  return undefined
}

function isHabit(value: string) {
  return /\b(habit|daily|every day|each day|every morning|each morning|every night|each night)\b/i.test(
    value,
  )
}

function inferHabitCue(value: string) {
  const lower = value.toLowerCase()
  if (lower.includes('morning')) return 'Morning'
  if (lower.includes('night')) return 'Evening'
  if (lower.includes('after')) return value.slice(value.toLowerCase().indexOf('after')).trim()
  return 'Daily check-in'
}
