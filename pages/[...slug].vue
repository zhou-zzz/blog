<script setup ts>
const route = useRoute()
const router = useRouter()
const page = ref()

try {
  page.value = await queryContent(route.path).findOne()
}
catch {
  page.value = await queryContent('/404').findOne()
  router.replace('/404')
}
</script>

<template>
  <ClientOnly>
    <template v-if="page">
      <Plum v-if="page.plum" />
      <article class="m-auto max-w-prose px-7 py-10 slide-enter-content animate-delay-200">
        <ContentRenderer :value="page" />
        <Back />
      </article>
    </template>
    <template />
  </ClientOnly>
</template>
