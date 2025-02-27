<script setup lang="ts">
const { data: page } = await useAsyncData(() => queryCollection('content').path('/').first())
</script>

<template>
  <div class="relative">
    <Plum v-if="page?.meta.plum" />
    <article class="slide-enter-content m-auto max-w-prose animate-delay-200 px-7 py-10">
      <ContentRenderer v-if="page" :value="page" />
      <Back />
    </article>
  </div>
</template>
