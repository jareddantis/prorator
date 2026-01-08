import z from 'zod'
import Decimal from 'decimal.js'

export const Person = z.object({
  key: z.uuidv4(),
  name: z.string().min(1, 'Names cannot be empty'),
  daysPresent: z.int().gt(0, 'Must have been present for at least 1 day'),
})
export type Person = z.infer<typeof Person>

export const People = z.array(Person).min(1, 'There must be at least one person')
export type People = z.infer<typeof People>

export const Proration = z.object({
  key: z.uuidv4(),
  name: z.string(),
  amount: z.instanceof(Decimal),
})
export type Proration = z.infer<typeof Proration>

export const ProrationRequest = z.object({
  amount: z.number().gt(0, 'Amount must be greater than zero'),
  days: z.int().gt(0, 'Days must be greater than zero'),
  people: People,
})
export type ProrationRequest = z.infer<typeof ProrationRequest>

export const ProrationFixed = z.object({
  key: z.string(),
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

export const UpdateNameEvent = z.object({
  key: z.string(),
  newName: z.string().min(1, 'New name cannot be empty'),
})
export type UpdateNameEvent = z.infer<typeof UpdateNameEvent>

export const UpdateDaysEvent = z.object({
  key: z.string(),
  // Default to at least 1 day
  newDays: z.int().gt(0, 'New days must be greater than 0').catch(1),
})
export type UpdateDaysEvent = z.infer<typeof UpdateDaysEvent>
