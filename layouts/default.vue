<script setup lang="ts">
// 使用防抖来优化scroll事件处理
const isBackToTop = ref(false)

// 使用节流函数优化scroll事件
const scroll = useThrottleFn(() => {
  isBackToTop.value = window.scrollY > 100
}, 200)

// 平滑滚动到顶部
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// 生命周期钩子
onMounted(() => window.addEventListener('scroll', scroll))
onUnmounted(() => window.removeEventListener('scroll', scroll))
</script>

<template>
  <NavBar />
  <slot />
  <Transition name="fade">
    <div
      v-show="isBackToTop"
      class="fixed right-8 bottom-8 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:translate-y-[-2px] bg-gray-50 dark:color-#222 text-gray-700 dark:text-gray-200 hover:shadow-md dark:hover:shadow-dark-md"
      @click="scrollToTop"
    >
      <div i-carbon-arrow-up />
    </div>
  </Transition>
</template>
