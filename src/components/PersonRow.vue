<script setup lang="ts">
import { PersonRow, UpdateDaysEvent, UpdateNameEvent } from '@/utils/models'
import { ref } from 'vue'
import type { Ref } from 'vue'
import GenericButton from './GenericButton.vue'

const props = defineProps<{ data: PersonRow }>()
const { key, data: person } = props.data

const name: Ref<string> = ref(person.name)
const daysPresent: Ref<number> = ref(person.daysPresent)

const emit = defineEmits<{
  (e: 'updateName', data: UpdateNameEvent): void
  (e: 'updateDays', data: UpdateDaysEvent): void
  (e: 'delete', key: string): void
}>()

const handleNameChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  e.preventDefault()
  emit('updateName', { key, newName: target.value })
}

const handleDaysChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  e.preventDefault()

  try {
    const parsed = parseInt(target.value)
    emit('updateDays', { key, newDays: parsed })
  } catch {
    return
  }
}

const handleDelete = () => emit('delete', key)
</script>

<template>
  <div class="grid grid-cols-3 gap-4 items-center">
    <div class="col-span-2 flex flex-row gap-2 items-center">
      <GenericButton @click="handleDelete" class="text-xl no-underline!">&#x2715;</GenericButton>
      <input
        type="text"
        placeholder="Name"
        @change="handleNameChange"
        v-model="name"
        class="text-lg"
      />
    </div>
    <div class="flex flex-row gap-2 items-end">
      <input
        type="number"
        placeholder="Days present"
        @change="handleDaysChange"
        v-model="daysPresent"
        class="text-lg"
      />
      <p>days</p>
    </div>
  </div>
</template>
