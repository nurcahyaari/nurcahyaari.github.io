// Markdown parsing shared by the app and the build script (vite.config.js).
import fm from 'front-matter'

const WORDS_PER_MINUTE = 230

const toISO = (d) => (d ? new Date(d).toISOString() : null)

// parseDoc turns a markdown file into a post or page object.
export function parseDoc(file, raw) {
  const { attributes: a, body } = fm(raw)
  const slug = file.split('/').pop().replace(/\.md$/, '')
  const words = body.split(/\s+/).filter(Boolean).length
  return {
    slug,
    title: a.title || slug,
    summary: a.summary || '',
    tags: a.tags || [],
    draft: Boolean(a.draft),
    date: toISO(a.date),
    updated: toISO(a.updated),
    body,
    minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  }
}

// published drops drafts and sorts newest first.
export const published = (docs) =>
  docs.filter((d) => !d.draft).sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

export const tagSlug = (tag) => tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
