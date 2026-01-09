<script setup lang="ts">
import type { Person } from '@/utils/models'
import { useProrator } from '@/stores/prorator'
import GenericButton from './GenericButton.vue'

const { person } = defineProps<{ person: Person }>()
const { key, name, daysPresent } = person

const store = useProrator()

const handleNameChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const sanitized = target.value.trim()
  if (sanitized.length > 0) {
    store.updatePersonName(key, sanitized)
  }
}

const handleDaysChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const parsed = parseInt(target.value)
  if (!isNaN(parsed) && parsed > 0) {
    store.updatePersonDays(key, parsed)
  }
}

const handleDelete = () => store.deletePerson(key)
</script>

<template>
  <div class="grid grid-cols-3 gap-4 items-center">
    <div class="col-span-2 flex flex-row gap-2 items-center">
      <GenericButton @click="handleDelete" class="text-xl no-underline!">&#x2715;</GenericButton>
      <input
        type="text"
        placeholder="Name"
        @change="handleNameChange"
        :value="name"
        class="text-xl"
      />
    </div>
    <div class="flex flex-row gap-2 items-end">
      <input
        type="number"
        placeholder="Days present"
        @change="handleDaysChange"
        :value="daysPresent"
        class="text-xl font-mono"
      />
      <p>days</p>
    </div>
  </div>
</template>
