import GithubSlugger from 'github-slugger'
import config from '/content/config.json'
import { parseDoc, published, tagSlug } from './parse.js'

const load = (files) => Object.entries(files).map(([file, raw]) => parseDoc(file, raw))

export { config, tagSlug }

export const posts = published(
  load(import.meta.glob('/content/posts/*.md', { query: '?raw', import: 'default', eager: true })),
)

export const pages = load(import.meta.glob('/content/pages/*.md', { query: '?raw', import: 'default', eager: true }))

// tags lists [tag, posts] pairs, most used first.
export const tags = (() => {
  const byTag = new Map()
  posts.forEach((p) => p.tags.forEach((t) => byTag.set(t, [...(byTag.get(t) ?? []), p])))
  return [...byTag].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
})()

export const isEnabled = (id) => (config.pages ?? []).includes(id)

// nav lists the menu items picked in the admin, in order.
export const nav = (config.pages ?? [])
  .map((id) => {
    if (id === 'archive') return { to: '/archive', label: 'Archive' }
    if (id === 'tags') return { to: '/tags', label: 'Tags' }
    const page = pages.find((p) => p.slug === id)
    return page && { to: `/${page.slug}`, label: page.title }
  })
  .filter(Boolean)

// headings returns the h2 and h3 of a markdown body, with the same ids rehype-slug makes.
export function headings(markdown) {
  const slugger = new GithubSlugger()
  const out = []
  let inCode = false
  for (const line of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) inCode = !inCode
    const m = !inCode && line.match(/^(#{2,3})\s+(.+?)\s*#*$/)
    if (!m) continue
    const text = m[2].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`~]/g, '')
    out.push({ depth: m[1].length, text, id: slugger.slug(text) })
  }
  return out
}

export const formatDate = (iso, opts = { year: 'numeric', month: 'long', day: 'numeric' }) =>
  iso ? new Date(iso).toLocaleDateString('en', opts) : ''
