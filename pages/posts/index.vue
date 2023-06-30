<script setup lang="ts">
import dayjs from 'dayjs'
import type { Post } from '~/types/types'

const articles = await queryContent('/posts').find() as Post[]
const sortArticles = articles.sort((a, b) => +new Date(b.date) - +new Date(a.date))

type GroupByKey<T> = string | ((item: T) => string)
function groupBy<T>(key: GroupByKey<T>, data: T[]): Map<string, T[]> {
  if (typeof key === 'string')
    key = (item: T) => (item as any)[key as string]
  return data.reduce((map, obj) => {
    const val = (key as (item: T) => string)(obj)
    const prev = map.get(val)
    if (prev)
      prev.push(obj)
    else
      map.set(val, [obj])
    return map
  }, new Map<string, T[]>())
}

function getYear(article: Post) {
  return article.date!.slice(0, 4)
}

function formatDate(d: string | Date) {
  const date = dayjs(d)
  return date.format('MMM D')
}

const articlesGroupedByYear = groupBy<Post>(getYear, sortArticles)
</script>

<template>
  <Plum />
  <main class="m-auto max-w-prose px-7 py-10 slide-enter-content animate-delay-200">
    <ul>
      <template v-if="!articlesGroupedByYear.size">
        <div py2 op50>
          { nothing here yet }
        </div>
      </template>
      <template v-for="[key, routes] of articlesGroupedByYear" :key="key">
        <div class="select-none relative h20 pointer-events-none">
          <span
            text-8em color-transparent absolute left--3rem top--2rem font-bold text-stroke-2 text-stroke-hex-aaa op10
          >{{ key }}</span>
        </div>
        <NuxtLink
          v-for="route of routes" :key="route._path" :to="route._path"
          class="block font-normal mb-6 mt-2 no-underline op70 hover:op100"
        >
          <li class="no-underline font-500" flex="~ col md:row gap-2 md:items-center">
            <div class="title text-lg leading-1.2em" flex="~ gap-2 wrap">
              <span
                v-if="route.type"
                align-middle flex-none
                class="text-xs bg-zinc:15 text-zinc5 rounded px-1 py-0.5 ml--12 mr2 my-auto hidden md:block"
              >{{ route.type }}</span>
              <span align-middle text-lg>{{ route.title }}</span>
            </div>

            <div flex="~ gap-2 items-center">
              <span text-sm op50 ws-nowrap>
                {{ formatDate(route.date!) }}
              </span>
              <span
                v-for="tag of route.tag" :key="tag" text-sm op50 ws-nowrap
              >{{ tag }}</span>
              <span
                v-if="route.type"
                align-middle flex-none
                class="text-xs bg-zinc:15 text-zinc5 rounded px-1 py-0.5 my-auto md:hidden"
              >{{ route.type }}</span>
            </div>
          </li>
        </NuxtLink>
      </template>
    </ul>
    <Back />
  </main>
</template>
