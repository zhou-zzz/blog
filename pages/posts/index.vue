<script setup lang="ts">
import type { Post } from '~/types/types'
import usePagination from '~/hooks/usePagination'
import { getYear, groupBy } from '~/utils/groupBy'

const { data: posts } = await useAsyncData(() => queryCollection('content').path('/posts').all())

debugger
const { currentPage, totalPages, paginatedItems: currentPagePosts, nextPage, prevPage }
  = usePagination(posts, 10)

const postsGroupedByYear = computed(() => groupBy<Post>(getYear, currentPagePosts.value))
</script>

<template>
  <Plum />
  <main class="slide-enter-content m-auto max-w-prose animate-delay-200 px-7 py-10">
    <ul>
      <template v-if="!postsGroupedByYear.size">
        <div py2 op50>
          { '暂无文章' }
        </div>
      </template>
      <template v-for="[key, routes] of postsGroupedByYear" :key="key">
        <div class="relative py-6">
          <h2 class="text-xl text-zinc-800 font-medium dark:text-zinc-200">
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
