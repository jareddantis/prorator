<script setup lang="ts">
import { ProrationFixed } from '@/utils/models'
import { computed } from 'vue'

const { person } = defineProps<{ person: ProrationFixed }>()
const amount = computed(() => parseFloat(person.amount).toLocaleString())
</script>

<template>
  <div class="text-2xl flex flex-row gap-4 items-center">
    <p>{{ person.name }}</p>
    <hr class="w-full border-dotted" />
    <p class="font-mono">{{ amount }}</p>
  </div>
</template>
