<script setup ts>
const route = useRoute()
const page = await queryContent(route.path).findOne()
</script>

<template>
  <ClientOnly>
    <Plum v-if="page.plum" />
    <article class="m-auto max-w-prose px-7 py-10 slide-enter-content animate-delay-200">
      <ContentRenderer :value="page" />
      <Back />
    </article>
  </ClientOnly>
</template>
