<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const page = ref<any>()
const isNotFound = ref(false)

// 提取所有级别的标题
const headers = computed(() => {
  if (!page.value?._dir)
    return []
  const headings = page.value.body.toc?.links || []
  return headings
})

async function fetchPage() {
  try {
    page.value = await queryContent(route.path).findOne()
    isNotFound.value = false
  }
  catch (err) {
    console.error(`页面未找到: ${route.path}`, err)
    isNotFound.value = true
    page.value = await get404Page()

    if (route.path !== '/404')
      router.replace('/404')
  }
}

async function get404Page() {
  try {
    return await queryContent('/404').findOne()
  }
  catch (error) {
    console.error('404页面未找到:', error)
    return {
      title: '页面未找到',
      body: '抱歉，您访问的页面不存在。',
    }
  }
}

await fetchPage()
</script>

<template>
  <ClientOnly>
    <template v-if="!page">
      <div class="flex justify-center items-center min-h-screen">
        <div class="animate-pulse">
          加载中...
        </div>
      </div>
    </template>

    <template v-else-if="isNotFound">
      <article class="m-auto max-w-prose px-7 py-10">
        <h1 class="text-4xl font-bold mb-4">
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
        <Plum v-if="page.plum" />
        <article class="m-auto max-w-prose px-7 py-10 slide-enter-content animate-delay-200">
          <ContentRenderer :value="page" />
          <Back />
        </article>
        <TableOfContents
          v-if="headers && headers.length > 0"
          :headers="headers"
          class="hidden lg:block"
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
