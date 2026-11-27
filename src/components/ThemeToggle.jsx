import { useEffect, useState } from 'react'
import { applyMode, nextMode, storedMode } from '../theme/theme.js'

const ICONS = {
  light: <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66 1.41-1.41M4.93 19.07l1.41-1.41m0-11.32L4.93 4.93m14.14 14.14-1.41-1.41M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />,
  dark: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />,
  system: <path d="M4 5h16v11H4zM9 20h6m-3-4v4" />,
}

// ThemeToggle cycles system → light → dark.
export default function ThemeToggle() {
  const [mode, setMode] = useState(storedMode)

  useEffect(() => {
    applyMode(mode)
    if (mode !== 'system') return
    const media = matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyMode('system')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [mode])

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => setMode(nextMode(mode))}
      aria-label={`Color mode: ${mode}. Change`}
      title={`Color mode: ${mode}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {ICONS[mode]}
      </svg>
    </button>
  )
}
