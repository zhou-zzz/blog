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
    <template v-if="!page">
      <div class="min-h-screen flex items-center justify-center">
        <div class="animate-pulse">
          加载中...
        </div>
      </div>
    </template>

    <template v-else-if="isNotFound">
      <article class="m-auto max-w-prose px-7 py-10">
        <h1 class="mb-4 text-4xl font-bold">
          {{ page.title }}
        </h1>
        <p class="text-gray-500">
          {{ page.body }}
        </p>
        <Back />
      </article>
    </template>

    <template v-else>
      <div class="relative">
        <Plum v-if="page.meta.plum" />
        <article class="slide-enter-content m-auto max-w-prose animate-delay-200 px-7 py-10">
          <ContentRenderer :value="page" />
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
