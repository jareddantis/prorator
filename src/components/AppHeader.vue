<script setup lang="ts">
import GenericButton from './GenericButton.vue'

defineEmits(['reset'])
</script>

<template>
  <header class="flex flex-row">
    <h1 class="text-3xl">Prorator</h1>
    <GenericButton class="hover:text-red-700" @click="$emit('reset')"> Reset </GenericButton>
  </header>
</template>
