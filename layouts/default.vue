<script setup ts>
const isBackToTop = ref(false)

function scroll() {
  isBackToTop.value = window.pageYOffset > 100
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', scroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', scroll)
})
</script>

<template>
  <NavBar />
  <slot />
  <div
    v-show="isBackToTop"
    class="slide-enter-content animate-delay-200 text-8 cursor-pointer  color-#ccc fixed right-2rem bottom-2rem"
    i-ph:rocket
    @click="scrollToTop"
  />
</template>
