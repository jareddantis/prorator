<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { Person } from '@/utils/models'
import { v4 as uuid } from 'uuid'
import { UpdateNameEvent, UpdateDaysEvent } from '@/utils/models'
import { loadState } from '@/utils/persistence'
import PersonRow from './PersonRow.vue'
import GenericButton from './GenericButton.vue'

const emit = defineEmits<{
  (e: 'calculate', people: Person[]): void
}>()

const createPerson = (daysPresent?: number): Person => {
  return {
    key: uuid(),
    name: '',
    daysPresent: daysPresent ?? 1,
  }
}
const people: Ref<Person[]> = ref([createPerson()])

onMounted(() => {
  const state = loadState()
  if (state) {
    people.value = state.people
  }

  if (people.value.length == 0) handleAddPerson()
})

const handleAddPerson = () => {
  const defaultDays = people.value.length > 0 ? people.value[0]?.daysPresent : 1
  people.value.push(createPerson(defaultDays))
}

const handleNameChange = (data_: unknown) => {
  const data = UpdateNameEvent.parse(data_)

  for (const person of people.value) {
    if (person.key == data.key) {
      person.name = data.newName
    }
  }
}

const handleDaysChange = (data_: unknown) => {
  const data = UpdateDaysEvent.parse(data_)

  for (const person of people.value) {
    if (person.key == data.key) {
      person.daysPresent = data.newDays
    }
  }
}

const handleDelete = (key: string) => {
  let newValue = people.value.filter((p) => p.key != key)
  if (newValue.length == 0) {
    newValue = [createPerson()]
  }

  people.value = newValue
}

const handleCalculate = () => {
  emit('calculate', people.value)
}

const reset = (defaultDays?: number) => {
  people.value = [createPerson(defaultDays)]
}

defineExpose({ reset })
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <PersonRow
      v-for="person in people"
      :key="person.key"
      :person="person"
      @update-name="handleNameChange"
      @update-days="handleDaysChange"
      @delete="handleDelete"
    />
    <div class="grid grid-cols-2 gap-2">
      <GenericButton class="py-4 w-full text-lg" @click="handleAddPerson">Add person</GenericButton>
      <GenericButton
        class="py-4 w-full text-lg bg-blue-200 dark:bg-blue-600 no-underline!"
        @click="handleCalculate"
        >Calculate</GenericButton
      >
    </div>
  </div>
</template>
