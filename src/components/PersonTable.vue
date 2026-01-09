<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProrator } from '@/stores/prorator'
import PersonRow from './PersonRow.vue'
import GenericButton from './GenericButton.vue'

const store = useProrator()
const { people } = storeToRefs(store)
</script>

<template>
  <div class="w-full flex flex-col gap-2 md:gap-4">
    <PersonRow v-for="person in people" :key="person.key" :person="person" />
  </div>
  <div class="grid grid-cols-2 gap-2 mt-6">
    <GenericButton class="py-4 w-full text-lg" @click="store.addPerson">Add person</GenericButton>
    <GenericButton
      class="py-4 w-full text-lg bg-blue-200 dark:bg-blue-600 no-underline!"
      @click="store.calculate"
      >Calculate</GenericButton
    >
  </div>
</template>
