// Theme helpers shared by the blog and the admin UI.
// Keep this file free of imports so both apps can use it.

export const FONTS = [
  { name: 'Literata', category: 'serif' },
  { name: 'Source Serif 4', category: 'serif' },
  { name: 'Newsreader', category: 'serif' },
  { name: 'Lora', category: 'serif' },
  { name: 'Merriweather', category: 'serif' },
  { name: 'Inter', category: 'sans-serif' },
  { name: 'Source Sans 3', category: 'sans-serif' },
  { name: 'IBM Plex Sans', category: 'sans-serif' },
  { name: 'Atkinson Hyperlegible', category: 'sans-serif' },
  { name: 'JetBrains Mono', category: 'monospace' },
  { name: 'IBM Plex Mono', category: 'monospace' },
  { name: 'Source Code Pro', category: 'monospace' },
]

export const PALETTE_KEYS = ['bg', 'surface', 'text', 'muted', 'accent', 'border']

const FALLBACK = {
  serif: 'Georgia, serif',
  'sans-serif': 'system-ui, sans-serif',
  monospace: 'ui-monospace, monospace',
}

const findFont = (name) => FONTS.find((f) => f.name === name)

const fontStack = (name, category) =>
  `"${name}", ${FALLBACK[findFont(name)?.category ?? category]}`

// Google Fonts URL for the body, heading and mono fonts.
export function fontsURL(fonts) {
  const families = [...new Set(Object.values(fonts))].filter(Boolean).map((name) => {
    const font = findFont(name)
    const axes = !font ? '' : font.category === 'monospace' ? ':wght@400;700' : ':ital,wght@0,400;0,700;1,400'
    return 'family=' + name.replace(/ /g, '+') + axes
  })
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
}

// CSS variables for one color palette, e.g. { '--bg': '#fff' }.
export const paletteVars = (palette) =>
  Object.fromEntries(Object.entries(palette).map(([k, v]) => [`--${k}`, v]))

export const fontVars = (fonts) => ({
  '--font-body': fontStack(fonts.body, 'serif'),
  '--font-heading': fontStack(fonts.heading, 'sans-serif'),
  '--font-mono': fontStack(fonts.mono, 'monospace'),
})

// CSS that applies a site config on top of tokens.css.
export function themeCSS(config) {
  const decl = (vars) => Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')
  return [
    `html:root[data-theme="light"]{${decl(paletteVars(config.theme.light))}}`,
    `html:root[data-theme="dark"]{${decl(paletteVars(config.theme.dark))}}`,
    `html:root{${decl(fontVars(config.fonts))}}`,
  ].join('')
}

// Color mode: "system", "light" or "dark". The choice is kept per browser.
const MODE_KEY = 'theme'

export function storedMode() {
  try {
    return localStorage.getItem(MODE_KEY) || 'system'
  } catch {
    return 'system'
  }
}

export function applyMode(mode) {
  try {
    if (mode === 'system') localStorage.removeItem(MODE_KEY)
    else localStorage.setItem(MODE_KEY, mode)
  } catch {
    // Storage can be blocked. The mode still applies to this page.
  }
  const dark = mode === 'dark' || (mode === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
}

export const nextMode = (mode) => ({ system: 'light', light: 'dark', dark: 'system' })[mode] ?? 'system'
