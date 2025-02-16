<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first())
const isNotFound = computed(() => !page.value)

// 提取所有级别的标题
const headers = computed(() => {
  if (!page.value)
    return []
  const headings = page.value.body.toc?.links || []
  return headings
})
</script>

<template>
  <ClientOnly>
    <template v-if="isNotFound">
      <div class="flex justify-center items-center min-h-screen">
        <div class="animate-pulse">
          页面未找到
        </div>
      </div>
    </template>

    <template v-else>
      <div class="relative">
        <Plum v-if="page?.meta.plum" />
        <article class="m-auto max-w-prose px-7 py-10 slide-enter-content animate-delay-200">
          <ContentRenderer v-if="page" :value="page" />
          <div v-else>
            Home not found
          </div>
          <Back />
        </article>
        <TableOfContents
          v-if="headers && headers.length > 0"
          :headers="headers"
        />
      </div>
    </template>
  </ClientOnly>
</template>

<style>
@media (min-width: 1024px) {
  article {
    margin-right: 16rem;
  }
}
</style>
