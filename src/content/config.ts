import { defineCollection, z } from 'astro:content';

const homepageCollection = defineCollection({
  type: 'content',
  schema: z.object({
    meta: z.object({
      title: z.string(),
      description: z.string(),
    }),
    title: z.string(),
    languageMenu: z.object({
      english: z.string(),
      japanese: z.string(),
      moai: z.string(),
    }),
    textarea: z.object({
      origin: z.object({
        label: z.string(),
        placeholder: z.string(),
        copy: z.object({
          hover: z.string(),
          clicked: z.string(),
        }),
      }),
      moai: z.object({
        label: z.string(),
        placeholder: z.string(),
        audio: z.object({
          hover: z.string(),
          dialog: z.string(),
        }),
        copy: z.object({
          hover: z.string(),
          clicked: z.string(),
        }),
      }),
      error: z.string(),
    }),
    footer: z.object({
      GitHub: z.string(),
    }),
  }),
});

export const collections = {
  homepage: homepageCollection,
};
