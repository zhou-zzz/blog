<script setup lang="ts">
import dayjs from 'dayjs'
import type { Post } from '~/types/types'

defineProps<{
  posts: Post[]
}>()

function formatDate(d: string | Date) {
  const date = dayjs(d)
  return date.format('YYYY年MM月DD日')
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="post of posts"
      :key="post._path"
      class="group"
    >
      <NuxtLink
        :to="post._path"
        class="block py-3 -mx-2 px-2 transition-colors duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
      >
        <div class="flex items-center">
          <span class="flex-1 text-zinc-800 dark:text-zinc-100">
            {{ post.title }}
          </span>
          <div class="text-sm text-zinc-400 dark:text-zinc-500 transform transition-transform duration-300 group-hover:translate-x-1">
            →
          </div>
        </div>

        <div class="mt-2 flex items-center gap-3 text-sm text-zinc-400 dark:text-zinc-500">
          <time :datetime="post.date" class="font-mono">
            {{ formatDate(post.date!) }}
          </time>

          <div v-if="post.tag" class="flex items-center gap-2">
            <span
              v-for="tag in post.tag"
              :key="tag"
              class="flex items-center gap-1"
            >
              <div class="i-carbon-tag text-xs opacity-60" />
              {{ tag }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
a {
  -webkit-tap-highlight-color: transparent;
}
</style>
