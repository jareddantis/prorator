import { ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import type { Person, ProrationResult } from '@/utils/models'
import { prorate } from '@/utils/prorator'
import { ProrationRequest } from '@/utils/models'
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from '@/utils/persistence'

const DEFAULT_AMOUNT: number = 1_000
const DEFAULT_DAYS: number = 30

const createPerson = (daysPresent?: number): Person => {
  return {
    key: uuidv4(),
    name: '',
    daysPresent: daysPresent ?? DEFAULT_DAYS,
  }
}

export const useProrator = defineStore('prorator', () => {
  // State
  const amount = ref<number>(DEFAULT_AMOUNT)
  const days = ref<number>(DEFAULT_DAYS)
  const people = ref<Person[]>([createPerson()])
  const result = ref<ProrationResult | undefined>(undefined)
  const error = ref<string | undefined>(undefined)

  // Actions
  const addPerson = () => {
    const defaultDays =
      people.value.length > 0 ? (people.value[0]?.daysPresent ?? days.value) : days.value
    people.value.push(createPerson(defaultDays))
  }

  const updatePersonName = (key: string, newName: string) => {
    const person = people.value.find((p) => p.key === key)
    if (person) {
      person.name = newName
    }
  }

  const updatePersonDays = (key: string, newDays: number) => {
    const person = people.value.find((p) => p.key === key)
    if (person && newDays > 0) {
      person.daysPresent = newDays
    }
  }

  const deletePerson = (key: string) => {
    const filtered = people.value.filter((p) => p.key !== key)
    if (filtered.length === 0) {
      // Always keep at least one person
      people.value = [createPerson()]
    } else {
      people.value = filtered
    }
  }

  const calculate = () => {
    result.value = undefined
    error.value = undefined

    try {
      const request = ProrationRequest.parse({
        amount: amount.value,
        days: days.value,
        people: people.value,
      })

      result.value = prorate(request)
      saveToLocalStorage(request)
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        error.value = JSON.parse(e.message)[0]?.['message'] || 'Validation error'
      } else {
        error.value = `${e}`
      }
      throw e
    }
  }

  const reset = () => {
    amount.value = DEFAULT_AMOUNT
    days.value = DEFAULT_DAYS
    people.value = [createPerson()]
    result.value = undefined
    error.value = undefined
    clearLocalStorage()
  }

  const loadState = () => {
    const savedState = loadFromLocalStorage()
    if (savedState) {
      amount.value = savedState.amount
      days.value = savedState.days

      if (savedState.people.length > 0) people.value = savedState.people
    }
  }

  return {
    // State
    amount,
    days,
    people,
    result,
    error,
    // Actions
    addPerson,
    updatePersonName,
    updatePersonDays,
    deletePerson,
    calculate,
    reset,
    loadState,
  }
})
