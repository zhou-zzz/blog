import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

export interface Post extends ParsedContent {
  plum?: boolean
  tag?: string[]
  date: string
  type?: string
  [key: string]: any
}
