<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { PersonRow as PersonRowT } from '@/utils/models'
import { v4 as uuid } from 'uuid'
import { UpdateNameEvent, UpdateDaysEvent } from '@/utils/models'
import PersonRow from './PersonRow.vue'
import GenericButton from './GenericButton.vue'

const createPerson = () => {
  return {
    key: uuid(),
    data: { name: '', daysPresent: 1 },
  }
}
const people: Ref<PersonRowT[]> = ref([createPerson()])

onMounted(() => {
  if (people.value.length == 0) handleAddPerson()
})

const handleAddPerson = () => people.value.push(createPerson())

const handleNameChange = (data_: unknown) => {
  const data = UpdateNameEvent.parse(data_)

  for (const person of people.value) {
    if (person.key == data.key) {
      person.data.name = data.newName
    }
  }
}

const handleDaysChange = (data_: unknown) => {
  const data = UpdateDaysEvent.parse(data_)

  for (const person of people.value) {
    if (person.key == data.key) {
      person.data.daysPresent = data.newDays
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
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <PersonRow
      v-for="person in people"
      :key="person.key"
      :data="person"
      @update-name="handleNameChange"
      @update-days="handleDaysChange"
      @delete="handleDelete"
    />
    <div class="grid grid-cols-2 gap-2">
      <GenericButton class="py-4 w-full text-lg" @click="handleAddPerson">Add person</GenericButton>
      <GenericButton class="py-4 w-full text-lg bg-blue-200 no-underline!">Calculate</GenericButton>
    </div>
  </div>
</template>
