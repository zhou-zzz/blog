<script setup lang="ts">
const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : '#ffffff',
  }],
})

function toggleDark(event: MouseEvent) {
  // 检查浏览器是否支持 View Transition API
  if (!document.startViewTransition) {
    // 降级方案：直接切换主题
    color.preference = color.value === 'dark' ? 'light' : 'dark'
    return
  }

  // 检查用户是否开启了减少动画选项
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    color.preference = color.value === 'dark' ? 'light' : 'dark'
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  const transition = document.startViewTransition(async () => {
    color.preference = color.value === 'dark' ? 'light' : 'dark'
    await nextTick()
  })

  transition.ready
    .then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      document.documentElement.animate(
        {
          clipPath: color.value === 'dark'
            ? [...clipPath].reverse()
            : clipPath,
        },
        {
          duration: 400,
          easing: 'ease-out',
          pseudoElement: color.value === 'dark'
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        },
      )
    })
}
</script>

<template>
  <header class="p8 text-gray-700">
    <NuxtLink to="/" class="absolute h-6 w-6 select-none op70 outline-none lg:fixed dark:color-white hover:op100">
      <img src="/logo.png" alt="">
    </NuxtLink>
    <nav class="flex items-center justify-end gap6">
      <NuxtLink to="/posts" title="Blog" class="op70 dark:color-white hover:op100">
        <span class="lt-sm:hidden">Blog</span>
        <div i-ri-article-line sm:hidden />
      </NuxtLink>
      <NuxtLink to="/notes" title="Notes" class="op70 dark:color-white hover:op100">
        <span class="lt-sm:hidden">Notes</span>
        <div i-ri-book-line sm:hidden />
      </NuxtLink>
      <NuxtLink to="/life" title="Life" class="op70 dark:color-white hover:op100">
        <span class="lt-sm:hidden">Life</span>
        <div i-ri-camera-line sm:hidden />
      </NuxtLink>
      <NuxtLink to="/projects" title="Projects" class="op70 dark:color-white hover:op100">
        <span class="lt-sm:hidden">Projects</span>
        <div i-ri-lightbulb-line class="sm:hidden" />
      </NuxtLink>
      <a href="https://github.com/zhou-zzz" target="_blank" title="GitHub" class="op70 dark:color-white hover:op100">
        <div i-uil-github-alt />
      </a>
      <div i-carbon-sun dark:i-carbon-moon class="cursor-pointer op70 dark:color-white hover:op100" title="Toggle theme" @click="toggleDark" />
    </nav>
  </header>
</template>

<style>
.nav-container {
  padding: 2rem;
}
</style>
