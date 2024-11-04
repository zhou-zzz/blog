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
  const isAppearanceTransition = document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition)
    return

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  // @ts-expect-error: Transition API
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
    <NuxtLink to="/" class="w-6 h-6 absolute lg:fixed select-none outline-none op70 hover:op100  dark:color-white">
      <img src="/logo.png" alt="">
      <!-- <img v-show="color.value === 'dark'" src="/logo.png" alt="logo">
      <img v-show="color.value !== 'dark'" src="/logo.png" alt="logo"> -->
    </NuxtLink>
    <nav class="flex justify-end items-center gap6">
      <NuxtLink to="/posts" title="Blog" class="op70 hover:op100  dark:color-white">
        <span class="lt-sm:hidden">Blog</span>
        <div i-ri-article-line sm:hidden />
      </NuxtLink>
      <NuxtLink to="/projects" title="Projects" class="op70 hover:op100 dark:color-white">
        <span class="lt-sm:hidden">Projects</span>
        <div i-ri-lightbulb-line class="sm:hidden" />
      </NuxtLink>
      <a href="https://github.com/zhou-zzz" target="_blank" title="GitHub" class="op70 hover:op100 dark:color-white">
        <div i-uil-github-alt />
      </a>
      <div i-carbon-sun dark:i-carbon-moon class=" cursor-pointer op70 hover:op100 dark:color-white" title="Toggle theme" @click="toggleDark" />
    </nav>
  </header>
</template>
