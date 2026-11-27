import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fontsURL, themeCSS } from './src/theme/theme.js'
import { parseDoc, published, tagSlug } from './src/lib/parse.js'

const config = JSON.parse(fs.readFileSync('content/config.json', 'utf8'))

const escapeHTML = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

const readDocs = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => parseDoc(f, fs.readFileSync(path.join(dir, f), 'utf8')))
    : []

// blogPlugin puts the site config into index.html, and writes one HTML file per route
// so GitHub Pages serves every URL with status 200.
function blogPlugin() {
  let outDir
  let isBuild = false

  return {
    name: 'blog',
    configResolved(c) {
      outDir = c.build.outDir
      isBuild = c.command === 'build'
    },
    transformIndexHtml(html) {
      const head = [
        `<title>${escapeHTML(config.title)}</title>`,
        `<meta name="description" content="${escapeHTML(config.description)}" />`,
        '<link rel="preconnect" href="https://fonts.googleapis.com" />',
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
        `<link rel="stylesheet" href="${escapeHTML(fontsURL(config.fonts))}" />`,
        `<style>${themeCSS(config).replace(/</g, '\\3c ')}</style>`,
      ]
      return html.replace('<!--head-->', head.join('\n    '))
    },
    closeBundle() {
      if (!isBuild) return
      const index = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
      const write = (route, title, description = config.description) => {
        const html = index
          .replace(/<title>.*?<\/title>/, `<title>${escapeHTML(title ? `${title} · ${config.title}` : config.title)}</title>`)
          .replace(/(<meta name="description" content=")[^"]*/, `$1${escapeHTML(description)}`)
        const file = path.join(outDir, route, route.endsWith('.html') ? '' : 'index.html')
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, html)
      }

      const posts = published(readDocs('content/posts'))
      posts.forEach((p) => write(`posts/${p.slug}`, p.title, p.summary || config.description))
      readDocs('content/pages').forEach((p) => write(p.slug, p.title, p.summary || config.description))
      write('archive', 'Archive')
      write('tags', 'Tags')
      new Set(posts.flatMap((p) => p.tags)).forEach((t) => write(`tags/${tagSlug(t)}`, `#${t}`))
      write('404.html', 'Not found')
    },
  }
}

export default defineConfig({
  plugins: [react(), blogPlugin()],
  build: {
    rollupOptions: {
      output: {
        // Split big libraries so browsers cache them between posts.
        manualChunks: (id) => {
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return 'react'
          if (id.includes('node_modules')) return 'markdown'
        },
      },
    },
  },
})
