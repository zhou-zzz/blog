<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div v-if="route.path !== '/'" class="mt-8 mb-8">
    <NuxtLink
      :to="route.path.split('/').slice(0, -1).join('/') || '/'"
      class="font-mono op50 hover:op95"
      v-text="'cd ..'"
    />
  </div>
</template>
