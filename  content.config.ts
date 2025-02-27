import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        tag: z.array(z.string()),
        image: z.string(),
        date: z.date(),
        plum: z.boolean(),
        title: z.string(),
        description: z.string(),
      }),
    }),
  },
})
