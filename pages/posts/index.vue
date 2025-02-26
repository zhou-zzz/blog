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
        <div class="relative py-6">
          <h2 class="text-xl font-medium text-zinc-800 dark:text-zinc-200">
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
