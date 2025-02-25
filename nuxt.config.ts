import process from 'node:process'
import { appDescription } from './constants/index'

export default defineNuxtConfig({
  extends: [process.env.THEME_ELEMENTS || '@nuxt-themes/elements', process.env.THEME_TYPOGRAPHY || '@nuxt-themes/typography'],
  modules: ['@vueuse/nuxt', '@unocss/nuxt', '@nuxt/content', '@nuxtjs/color-mode'],
  css: ['@unocss/reset/tailwind.css', '~/assets/css/global.css'],

  content: {
    highlight: {
      preload: ['javascript', 'typescript', 'vue', 'vue-html'],
      theme: {
        // Default theme (same as single string)
        default: 'vitesse-light',
        // Theme used if `html.dark`
        dark: 'vitesse-dark',
        // Theme used if `html.sepia`
        sepia: 'monokai',
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

  compatibilityDate: '2025-02-25',
})