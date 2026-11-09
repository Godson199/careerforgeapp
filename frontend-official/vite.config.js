import { defineConfig } from 'vite'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'

// Multi-page site: every *.html in the project root is an entry.
const input = Object.fromEntries(
  readdirSync(__dirname)
    .filter((f) => f.endsWith('.html'))
    .map((f) => [f.replace('.html', ''), resolve(__dirname, f)])
)

export default defineConfig({
  build: { rollupOptions: { input } },
})
