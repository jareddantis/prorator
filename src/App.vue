<script setup lang="ts">
import { ref, type Ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import PersonTable from './components/PersonTable.vue'

const amount: Ref<number> = ref(1000)
const days: Ref<number> = ref(28)
</script>

<template>
  <AppHeader />
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
      <PersonTable></PersonTable>
    </section>
  </main>
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
  @apply w-full border-b-1 border-gray-400;
}
</style>
