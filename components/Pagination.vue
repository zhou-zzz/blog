<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  prev: []
  next: []
}>()
</script>

<template>
  <div class="flex justify-center items-center gap-3 mt-12">
    <button
      class="w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 hover:bg-zinc-200/10 disabled:opacity-30 disabled:cursor-not-allowed"
      :disabled="currentPage === 1"
      @click="emit('prev')"
    >
      <div class="i-carbon-chevron-left text-xl" />
    </button>

    <div class="flex items-center gap-2 text-sm op60">
      <span class="font-medium">{{ currentPage }}</span>
      <span class="op50">/</span>
      <span>{{ totalPages }}</span>
    </div>

    <button
      class="w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 hover:bg-zinc-200/10 disabled:opacity-30 disabled:cursor-not-allowed"
      :disabled="currentPage === totalPages"
      @click="emit('next')"
    >
      <div class="i-carbon-chevron-right text-xl" />
    </button>
  </div>
</template>
