<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProrator } from './stores/prorator'
import AppHeader from './components/AppHeader.vue'
import PersonTable from './components/PersonTable.vue'
import AmountsPayable from './components/AmountsPayable.vue'

const store = useProrator()
const { amount, days, result, error } = storeToRefs(store)

onMounted(() => {
  store.loadState()
})
</script>

<template>
  <AppHeader @reset="store.reset" class="mb-8" />
  <main class="flex flex-col gap-6 md:gap-8 justify-between items-center">
    <section class="grid gap-2 sm:grid-cols-2 items-center">
      <h2>Amount to prorate</h2>
      <input type="number" v-model="amount" step=".01" class="text-2xl font-mono" />
    </section>

    <section class="grid gap-2 sm:grid-cols-2 items-center">
      <h2>Days to prorate over</h2>
      <input type="number" v-model="days" class="text-2xl font-mono" />
    </section>

    <section>
      <h2 class="mb-4">People</h2>
      <PersonTable />
    </section>

    <section v-if="error !== undefined">
      <hr class="border-dashed mb-8" />
      <p class="text-red-500! text-lg text-center">{{ error }}</p>
    </section>

    <section v-if="result !== undefined">
      <hr class="border-dashed mb-8" />
      <h1 class="text-lg">Amounts payable</h1>
      <AmountsPayable :result="result" />
    </section>
  </main>

  <footer class="mt-8">
    <p class="text-xs text-center text-gray-500 dark:text-blue-300!">
      Made with ❤️ by <a href="//dantis.me" target="_blank" class="underline">Jared Dantis</a>
    </p>
  </footer>
</template>
