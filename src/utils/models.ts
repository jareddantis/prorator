import z from 'zod'
import Decimal from 'decimal.js'

export const Person = z.object({
  name: z.string().min(1),
  daysPresent: z.int().gt(0),
})
export type Person = z.infer<typeof Person>

export const Proration = z.object({
  name: z.string(),
  amount: z.instanceof(Decimal),
})
export type Proration = z.infer<typeof Proration>

export const ProrationRequest = z.object({
  amount: z.number().gt(0),
  days: z.int().gt(0),
  people: z.array(Person).min(1),
})
export type ProrationRequest = z.infer<typeof ProrationRequest>

export const ProrationFixed = z.object({
  name: z.string(),
  amount: z.string(),
})
export type ProrationFixed = z.infer<typeof ProrationFixed>

export const ProrationResult = z.object({
  amountPerPersonPerDay: z.string(),
  perPerson: z.array(ProrationFixed),
})
export type ProrationResult = z.infer<typeof ProrationResult>

/**
 * Frontend models
 */

export const PersonRow = z.object({
  key: z.uuidv4(),
  data: Person,
})
export type PersonRow = z.infer<typeof PersonRow>

export const UpdateNameEvent = z.object({
  key: z.string(),
  newName: z.string().min(1),
})
export type UpdateNameEvent = z.infer<typeof UpdateNameEvent>

export const UpdateDaysEvent = z.object({
  key: z.string(),
  // Default to at least 1 day
  newDays: z.int().gt(0).catch(1),
})
export type UpdateDaysEvent = z.infer<typeof UpdateDaysEvent>
