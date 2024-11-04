<script setup lang="ts">
interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

defineProps<{
  headers: TocLink[]
}>()

const activeId = ref('')

// 处理滚动到指定位置
function scrollToHeader(id: string) {
  if (process.client) {
    const element = document.getElementById(id)
    if (element)
      element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 改进滚动监听逻辑
onMounted(() => {
  // 创建 Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      // 找到当前可见的标题
      const visibleHeadings = entries.filter(entry => entry.isIntersecting)
        .map(entry => entry.target.id)
        .sort((a, b) => {
          // 获取元素在页面中的位置，靠上的优先
          const posA = document.getElementById(a)?.getBoundingClientRect().top || 0
          const posB = document.getElementById(b)?.getBoundingClientRect().top || 0
          return posA - posB
        })

      if (visibleHeadings.length > 0) {
        // 使用第一个可见的标题作为当前活动标题
        activeId.value = visibleHeadings[0]
      }
    },
    {
      // 调整观察区域，使其更准确
      rootMargin: '-10% 0px -85% 0px',
      threshold: [0, 1],
    },
  )

  // 观察所有标题元素
  document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]').forEach((heading) => {
    observer.observe(heading)
  })

  // 添加滚动事件监听，用于处理快速滚动的情况
  const handleScroll = () => {
    const headings = Array.from(document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]'))

    // 找到最接近视口顶部的标题
    const found = headings.reduce((nearest, heading) => {
      const distance = Math.abs(heading.getBoundingClientRect().top)
      if (distance < Math.abs(nearest.getBoundingClientRect().top))
        return heading

      return nearest
    }, headings[0])

    if (found)
      activeId.value = found.id
  }

  window.addEventListener('scroll', useThrottleFn(handleScroll, 100))

  // 组件卸载时清理
  onUnmounted(() => {
    observer.disconnect()
    window.removeEventListener('scroll', handleScroll)
  })
})

// 节流函数
function useThrottleFn(fn: Function, delay: number) {
  let lastTime = 0
  return function (...args: any[]) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

// 改进缩进计算
function getIndentStyle(depth: number) {
  return {
    paddingLeft: `${(depth - 1) * 1}rem`,
  }
}
</script>

<template>
  <ClientOnly>
    <nav class="toc fixed right-4 top-20 w-64">
      <div class="text-sm p-4 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur">
        <div class="font-bold mb-3 text-gray-900 dark:text-gray-100">
          目录
        </div>
        <ul class="space-y-2">
          <template v-for="header in headers" :key="header.id">
            <li>
              <a
                :href="`#${header.id}`"
                :style="getIndentStyle(header.depth)"
                class="block py-1 transition-colors duration-200 hover:text-primary-500"
                :class="[
                  activeId === header.id
                    ? 'text-primary-500 font-medium'
                    : 'text-gray-500 dark:text-gray-400',
                ]"
                @click.prevent="scrollToHeader(header.id)"
              >
                {{ header.text }}
              </a>
              <!-- 递归渲染子标题 -->
              <ul v-if="header.children && header.children.length" class="space-y-2 mt-2">
                <li v-for="child in header.children" :key="child.id">
                  <a
                    :href="`#${child.id}`"
                    :style="getIndentStyle(child.depth)"
                    class="block py-1 transition-colors duration-200 hover:text-primary-500"
                    :class="[
                      activeId === child.id
                        ? 'text-primary-500 font-medium'
                        : 'text-gray-500 dark:text-gray-400',
                    ]"
                    @click.prevent="scrollToHeader(child.id)"
                  >
                    {{ child.text }}
                  </a>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </ClientOnly>
</template>

<style scoped>
.toc {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.toc::-webkit-scrollbar {
  width: 4px;
}

.toc::-webkit-scrollbar-track {
  background: transparent;
}

.toc::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

/* 添加平滑滚动效果 */
:root {
  scroll-behavior: smooth;
}
</style>
