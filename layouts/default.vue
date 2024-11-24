<script setup lang="ts">
const isBackToTop = ref(false)

// 使用 useScroll 来监听滚动
const { y } = useScroll(window)

// 使用计算属性来控制按钮显示
const showBackToTop = computed(() => {
  return y.value > 100
})

// 平滑滚动到顶部
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<template>
  <NavBar />
  <slot />
  <Transition name="fade">
    <div
      v-show="showBackToTop"
      class="fixed right-8 bottom-8 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:translate-y-[-2px] bg-gray-50 dark:color-#222 text-gray-700 dark:text-gray-200 hover:shadow-md"
      @click="scrollToTop"
    >
      <div i-carbon-arrow-up />
    </div>
  </Transition>
</template>
