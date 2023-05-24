import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  // 是否显示加载ico
  showSpinner: false,
})

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook('page:start', () => {
    NProgress.start()
  })
  nuxtApp.hooks.hook('page:finish', () => {
    NProgress.done()
  })
})
