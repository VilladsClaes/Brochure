import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import htmlIncludes from './tools/vite-plugin-html-includes.js'

const page = (path) => resolve(import.meta.dirname, path)

export default defineConfig({
  plugins: [htmlIncludes({ root: import.meta.dirname })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        forside: page('index.html'),
        om: page('om.html'),
        ture: page('ture.html'),
        vaerter: page('vaerter.html'),
        hold: page('hold.html'),
        blog: page('blog/index.html'),
        'blog-shelter': page('blog/shelter-og-roedvin.html'),
        'blog-baal': page('blog/baal-og-mjoed.html'),
        'blog-vinter': page('blog/vinterbadning.html'),
        kontakt: page('kontakt.html'),
        '404': page('404.html'),
      },
    },
  },
  server: {
    host: true,
    port: 3000,
  },
  preview: {
    host: true,
    port: 3000,
  },
})
