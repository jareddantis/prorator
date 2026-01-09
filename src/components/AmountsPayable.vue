<script setup lang="ts">
import { ProrationResult } from '@/utils/models'
import AmountPayable from './AmountPayable.vue'

const { result } = defineProps<{ result: ProrationResult }>()
</script>

<template>
  <p class="text-sm text-gray-500 dark:text-blue-300! mb-4">
    Each person pays {{ result.amountPerPersonPerDay }} per day
  </p>
  <div class="flex flex-col gap-1">
    <AmountPayable v-for="person in result.perPerson" :key="person.key" :person="person" />
  </div>
</template>
