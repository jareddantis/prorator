import { Proration, ProrationFixed, ProrationRequest, ProrationResult } from './models'
import Decimal from 'decimal.js'

const DECIMAL_PLACES = 2

const addProration = (prorations: Proration[], key: string, amount: Decimal) => {
  for (const proration of prorations) {
    if (proration.key == key) {
      proration.amount = proration.amount.plus(amount)
      return
    }
  }
}

const addExcess = (prorations: Proration[], keys: string[], amount: Decimal) => {
  for (const proration of prorations) {
    if (keys.includes(proration.key)) {
      proration.amount = proration.amount.plus(amount)
    }
  }
}

const toFixed = (prorations: Proration[], decimalPlaces: number): ProrationFixed[] => {
  return prorations.map(({ key, name, amount }) => {
    return {
      key,
      name,
      amount: amount.toFixed(decimalPlaces),
    }
  })
}

const checkSumIsCorrect = (prorations: Proration[], expectedSum: Decimal) => {
  // Only compare fixed-point results - errors smaller than 0.01 are OK
  const total = prorations
    .reduce((acc: Decimal, cur: Proration) => acc.plus(cur.amount), new Decimal(0))
    .toFixed(2)
  const expected = expectedSum.toFixed(2)

  if (expected != total) {
    throw new Error(`Incorrect sum "${total}" (expected "${expected}")`)
  }
}

export const prorate = (request_: unknown): ProrationResult => {
  const { amount: _amount, days, people } = ProrationRequest.parse(request_)
  const numberOfPeople = people.length
  const peopleToCoverExcess = people
    .filter((person) => person.daysPresent == days)
    .map((person) => person.key)

  if (peopleToCoverExcess.length <= 0) {
    throw new Error(`Error: At least one person must have been present for all ${days} days.`)
  }

  const amount = new Decimal(_amount)
  const amountPerPerson = amount.dividedBy(numberOfPeople)
  const amountPerPersonPerDay = amountPerPerson.dividedBy(days)

  const prorations: Proration[] = people.map((p) => {
    return {
      key: p.key,
      name: p.name,
      amount: new Decimal(0),
    }
  })

  for (const person of people) {
    if (person.daysPresent > days) {
      throw new Error(
        `Person "${person.name}" cannot exceed total number of days (${person.daysPresent} > ${days})`,
      )
    }

    const payable = amountPerPersonPerDay.mul(person.daysPresent)
    addProration(prorations, person.key, payable)

    const unused = amountPerPerson.sub(payable)
    const unusedPerPerson = unused.div(peopleToCoverExcess.length)
    addExcess(prorations, peopleToCoverExcess, unusedPerPerson)
  }

  checkSumIsCorrect(prorations, amount)

  return {
    amountPerPersonPerDay: amountPerPersonPerDay.toFixed(DECIMAL_PLACES),
    perPerson: toFixed(prorations, DECIMAL_PLACES),
  }
}
