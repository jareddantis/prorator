import { prorate } from '../prorator.ts'
import { expect, test } from 'vitest'
import { z } from 'zod'
import { Person, ProrationResult } from '../models.ts'

test('happy path - prorate 1000 equally across 2 people', () => {
  const people: Person[] = [
    { name: 'A', daysPresent: 30 },
    { name: 'B', daysPresent: 30 },
  ]

  const result = prorate({
    amount: 1000,
    days: 30,
    people,
  })

  const expectedResult: ProrationResult = {
    amountPerPersonPerDay: '16.67',
    perPerson: expect.arrayContaining([
      { name: 'A', amount: '500.00' },
      { name: 'B', amount: '500.00' },
    ]),
  }

  expect(result).toEqual(expectedResult)
})

test('happy path - prorate 1000 equally across 4 people', () => {
  const people: Person[] = [
    { name: 'A', daysPresent: 30 },
    { name: 'B', daysPresent: 30 },
    { name: 'C', daysPresent: 30 },
    { name: 'D', daysPresent: 30 },
  ]

  const result = prorate({
    amount: 1000,
    days: 30,
    people,
  })

  const expectedResult: ProrationResult = {
    amountPerPersonPerDay: '8.33',
    perPerson: expect.arrayContaining([
      { name: 'A', amount: '250.00' },
      { name: 'B', amount: '250.00' },
      { name: 'C', amount: '250.00' },
      { name: 'D', amount: '250.00' },
    ]),
  }

  expect(result).toEqual(expectedResult)
})

test('prorate 4000 with one person partially absent', () => {
  const people: Person[] = [
    { name: 'A', daysPresent: 30 },
    { name: 'B', daysPresent: 30 },
    { name: 'C', daysPresent: 20 },
    { name: 'D', daysPresent: 30 },
  ]

  const result = prorate({
    amount: 4000,
    days: 30,
    people,
  })

  const expectedResult: ProrationResult = {
    amountPerPersonPerDay: '33.33',
    perPerson: expect.arrayContaining([
      { name: 'A', amount: '1111.11' },
      { name: 'B', amount: '1111.11' },
      { name: 'C', amount: '666.67' },
      { name: 'D', amount: '1111.11' },
    ]),
  }

  expect(result).toEqual(expectedResult)
})

test('prorate 3591.18 unequally (1)', () => {
  const people: Person[] = [
    { name: 'A', daysPresent: 28 },
    { name: 'B', daysPresent: 11 },
    { name: 'C', daysPresent: 31 },
    { name: 'D', daysPresent: 31 },
  ]

  const result = prorate({
    amount: 3591.18,
    days: 31,
    people,
  })

  const expectedResult: ProrationResult = {
    amountPerPersonPerDay: '28.96',
    perPerson: expect.arrayContaining([
      { name: 'A', amount: '810.91' }, // From user: 810.60
      { name: 'B', amount: '318.57' }, // From user: 318.45
      { name: 'C', amount: '1230.85' }, // From user: 1231.00
      { name: 'D', amount: '1230.85' }, // From user: 1231.00
    ]),
  }

  expect(result).toEqual(expectedResult)
})

test('prorate 3591.18 unequally (2)', () => {
  const people: Person[] = [
    { name: 'A', daysPresent: 20 },
    { name: 'B', daysPresent: 15 },
    { name: 'C', daysPresent: 31 },
    { name: 'D', daysPresent: 31 },
  ]

  const result = prorate({
    amount: 3591.18,
    days: 31,
    people,
  })

  const expectedResult: ProrationResult = {
    amountPerPersonPerDay: '28.96',
    perPerson: expect.arrayContaining([
      { name: 'A', amount: '579.22' }, // From user: 579.00
      { name: 'B', amount: '434.42' }, // From user: 434.25
      { name: 'C', amount: '1288.77' }, // From user: 1288.965
      { name: 'D', amount: '1288.77' }, // From user: 1288.965
    ]),
  }

  expect(result).toEqual(expectedResult)
})

test('person cannot exceed total days', () => {
  const people: Person[] = [
    { name: 'A', daysPresent: 31 },
    { name: 'B', daysPresent: 30 },
  ]

  expect(() =>
    prorate({
      amount: 1000,
      days: 30,
      people,
    }),
  ).toThrowError(/cannot exceed total number of days/)
})

test('person cannot have 0 days', () => {
  const people: Person[] = [
    { name: 'A', daysPresent: 0 },
    { name: 'B', daysPresent: 30 },
  ]

  expect(() =>
    prorate({
      amount: 1000,
      days: 30,
      people,
    }),
  ).toThrowError(/Too small: expected number to be >0/)
})

test('amount cannot be 0', () => {
  const people: Person[] = [
    { name: 'A', daysPresent: 30 },
    { name: 'B', daysPresent: 30 },
  ]

  expect(() =>
    prorate({
      amount: 0,
      days: 30,
      people,
    }),
  ).toThrowError(/Too small: expected number to be >0/)
})

test('days cannot be 0', () => {
  const people: Person[] = [
    { name: 'A', daysPresent: 30 },
    { name: 'B', daysPresent: 30 },
  ]

  expect(() =>
    prorate({
      amount: 1000,
      days: 0,
      people,
    }),
  ).toThrowError(/Too small: expected number to be >0/)
})
