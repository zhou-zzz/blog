<script setup lang="ts">
import type { Post } from '~/types/types'
import usePagination from '~/hooks/usePagination'
import { getYear, groupBy } from '~/utils/groupBy'

const notes = await queryContent('/life').find() as Post[]
const sortNotes = notes.sort((a, b) => +new Date(b.date) - +new Date(a.date))

const { currentPage, totalPages, paginatedItems: currentPageNotes, nextPage, prevPage }
  = usePagination(sortNotes, 10)

const notesGroupedByYear = computed(() => groupBy<Post>(getYear, currentPageNotes.value))
</script>

<template>
  <Plum />
  <main class="m-auto max-w-prose px-7 py-10 slide-enter-content animate-delay-200">
    <ul>
      <template v-if="!notesGroupedByYear.size">
        <div py2 op50>
          { '暂无笔记' }
        </div>
      </template>
      <template v-for="[key, routes] of notesGroupedByYear" :key="key">
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
