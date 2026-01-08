<script setup lang="ts">
import { onMounted, ref, useTemplateRef, type Ref } from 'vue'
import { prorate } from './utils/prorator'
import { ProrationRequest, ProrationResult } from './utils/models'
import { z } from 'zod'
import type { ComponentExposed } from 'vue-component-type-helpers'
import { saveState, loadState, clearState } from './utils/persistence'
import AppHeader from './components/AppHeader.vue'
import PersonTable from './components/PersonTable.vue'

const amount: Ref<number> = ref(1000)
const days: Ref<number> = ref(28)
const result: Ref<ProrationResult | undefined> = ref(undefined)
const error: Ref<string | undefined> = ref(undefined)

const tableRef = useTemplateRef<ComponentExposed<typeof PersonTable>>('table')

onMounted(() => {
  const state = loadState()
  if (state) {
    amount.value = state.amount
    days.value = state.days
  }
})

const handleCalculate = (data: unknown) => {
  result.value = undefined

  try {
    const request = ProrationRequest.parse({
      amount: amount.value,
      days: days.value,
      people: data,
    })

    result.value = prorate(request)
    saveState(request)
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      error.value = JSON.parse(e.message)[0]['message']
    } else {
      error.value = `${e}`
    }
    throw e
  }

  error.value = undefined
}

const handleReset = () => {
  amount.value = 1000
  days.value = 28
  tableRef.value?.reset(28)
  clearState()
}
</script>

<template>
  <AppHeader @reset="handleReset" />
  <main class="flex flex-col gap-8">
    <section class="grid sm:grid-cols-2 items-center">
      <h2>Amount to prorate</h2>
      <input type="number" v-model="amount" step=".01" class="text-2xl font-mono" />
    </section>

    <section class="grid sm:grid-cols-2 items-center">
      <h2>Days to prorate over</h2>
      <input type="number" v-model="days" class="text-2xl font-mono" />
    </section>

    <section>
      <h2 class="mb-4">People</h2>
      <PersonTable @calculate="handleCalculate" ref="table"></PersonTable>
    </section>

    <section v-if="error !== undefined">
      <hr class="border-dashed mb-8" />
      <p class="text-red-500! text-lg text-center">{{ error }}</p>
    </section>

    <section v-if="result !== undefined">
      <hr class="border-dashed mb-8" />
      <h1 class="text-lg">Amounts payable</h1>
      <p class="text-sm text-gray-500 dark:text-blue-300! mb-4">
        Each person pays {{ result.amountPerPersonPerDay }} per day
      </p>
      <div
        v-for="person in result.perPerson"
        :key="person.key"
        class="text-2xl flex flex-row gap-4 items-center"
      >
        <p>{{ person.name }}</p>
        <hr class="w-full border-dotted" />
        <p class="font-mono">{{ parseFloat(person.amount).toLocaleString() }}</p>
      </div>
    </section>
  </main>
  <footer class="my-8">
    <p class="text-xs text-center text-blue-300!">
      Made with ❤️ by <a href="//dantis.me" target="_blank" class="underline">Jared Dantis</a>
    </p>
  </footer>
</template>

<style>
@reference "tailwindcss/theme";

header,
main {
  @apply max-w-4xl w-full mx-auto px-8 py-8 justify-between items-center;
}

section {
  @apply w-full;
}

input {
  @apply w-full border-b border-gray-400;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
}
</style>
