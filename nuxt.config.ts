import { appDescription } from './constants/index'

export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', '@unocss/nuxt', '@nuxt/content', '@nuxtjs/color-mode'],
  css: ['@unocss/reset/tailwind.css', '~/assets/css/global.css'],
  // 添加静态站点生成配置
  ssr: true,
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'vitesse-light',
            // Theme used if `html.dark`
            dark: 'vitesse-dark',
            // Theme used if `html.sepia`
            sepia: 'monokai',
          },
        },
      },
    },
  },
  colorMode: {
    classSuffix: '',
  },
  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: 'favicon.ico', sizes: 'any' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },
  compatibilityDate: '2025-02-26',
})
