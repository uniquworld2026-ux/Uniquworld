import { copyFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const indexHtml = resolve(root, 'dist/index.html')
const notFoundHtml = resolve(root, 'dist/404.html')

if (!existsSync(indexHtml)) {
  console.error('copy-spa-fallback: dist/index.html missing — run vite build first')
  process.exit(1)
}

// Hostinger / some CDNs serve 404.html for unknown paths; same shell as index
// keeps React Router working for /admin, /categories, etc.
copyFileSync(indexHtml, notFoundHtml)
console.log('copy-spa-fallback: wrote dist/404.html')
