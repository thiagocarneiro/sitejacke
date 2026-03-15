// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://nutricionistajackeline.com.br',
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'always',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      filter: (page) => !page.includes('/keystatic'),
      serialize(item) {
        const url = item.url;
        if (url === 'https://nutricionistajackeline.com.br/') {
          item.priority = 1.0;
        } else if (url.includes('/atendimento-e-consultas')) {
          item.priority = 0.9;
        } else if (url.includes('/sobre') || url.includes('/blog/')) {
          item.priority = 0.8;
        } else if (url.includes('/contato')) {
          item.priority = 0.7;
        } else {
          item.priority = 0.6;
        }
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
    react(),
    keystatic(),
  ],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
