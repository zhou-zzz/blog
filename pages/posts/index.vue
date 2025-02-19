<script setup lang="ts">
import usePagination from '~/hooks/usePagination'
import type { Post } from '~/types/types'
import { getYear, groupBy } from '~/utils/groupBy'

const posts = await queryContent('/posts').find() as Post[]
const sortPosts = posts.sort((a, b) => +new Date(b.date) - +new Date(a.date))

const { currentPage, totalPages, paginatedItems: currentPagePosts, nextPage, prevPage }
  = usePagination(sortPosts, 10)

const postsGroupedByYear = computed(() => groupBy<Post>(getYear, currentPagePosts.value))
</script>

<template>
  <Plum />
  <main class="m-auto max-w-prose px-7 py-10 slide-enter-content animate-delay-200">
    <ul>
      <template v-if="!postsGroupedByYear.size">
        <div py2 op50>
          { '暂无文章' }
        </div>
      </template>
      <template v-for="[key, routes] of postsGroupedByYear" :key="key">
        <div class="relative py-8">
          <h2 class="year-title text-[120px] font-extralight absolute -top-12 -left-8 select-none pointer-events-none">
            {{ key }}
          </h2>
        </div>
        <PostList :posts="routes" />
      </template>
    </ul>

    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @prev="prevPage"
      @next="nextPage"
    />

    <Back />
  </main>
</template>

<style scoped>
.year-title {
  font-family: "Inter", "SF Pro Display", -apple-system, sans-serif;
  color: rgba(0, 0, 0, 0.035);
  letter-spacing: -0.08em;
  transform: translateZ(0);
  transition: all 0.3s ease;
  font-feature-settings: "tnum" 1;
}

:root.dark .year-title {
  color: rgba(255, 255, 255, 0.035);
}

@media (hover: hover) {
  .year-title:hover {
    color: rgba(0, 0, 0, 0.05);
  }

  :root.dark .year-title:hover {
    color: rgba(255, 255, 255, 0.05);
  }
}
</style>
