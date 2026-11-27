// Small helpers for the blog: color mode, copy buttons, heading links,
// table of contents highlight and reading progress.
(function () {
  var root = document.documentElement
  var media = matchMedia('(prefers-color-scheme: dark)')

  // Color mode: system, light or dark. Previews force a mode, so skip them.
  var toggle = document.querySelector('.theme-toggle')
  if (toggle && !root.hasAttribute('data-preview')) {
    var mode = 'system'
    try { mode = localStorage.getItem('theme') || 'system' } catch (e) {}

    var apply = function () {
      try {
        if (mode === 'system') localStorage.removeItem('theme')
        else localStorage.setItem('theme', mode)
      } catch (e) {}
      var dark = mode === 'dark' || (mode === 'system' && media.matches)
      root.dataset.theme = dark ? 'dark' : 'light'
      toggle.dataset.mode = mode
      toggle.setAttribute('aria-label', 'Color mode: ' + mode + '. Change')
    }

    toggle.hidden = false
    apply()
    toggle.addEventListener('click', function () {
      mode = { system: 'light', light: 'dark', dark: 'system' }[mode]
      apply()
    })
    media.addEventListener('change', function () {
      if (mode === 'system') apply()
    })
  }

  // Copy buttons on code blocks
  document.querySelectorAll('.code-block').forEach(function (block) {
    var button = block.querySelector('.copy')
    if (!button || !navigator.clipboard) return
    button.hidden = false
    button.addEventListener('click', function () {
      navigator.clipboard.writeText(block.querySelector('pre').innerText).then(function () {
        button.textContent = 'Copied'
        setTimeout(function () { button.textContent = 'Copy' }, 1500)
      })
    })
  })

  // "#" links next to headings
  document.querySelectorAll('.prose h2[id], .prose h3[id]').forEach(function (h) {
    var a = document.createElement('a')
    a.href = '#' + h.id
    a.className = 'anchor'
    a.textContent = '#'
    a.setAttribute('aria-hidden', 'true')
    a.tabIndex = -1
    h.appendChild(a)
  })

  // Highlight the table of contents item for the heading on screen
  var links = document.querySelectorAll('.toc a')
  if (links.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        links.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id)
        })
      })
    }, { rootMargin: '0px 0px -75% 0px' })
    links.forEach(function (link) {
      var target = document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)))
      if (target) observer.observe(target)
    })
  }

  // Reading progress bar
  var bar = document.querySelector('.progress')
  if (bar) {
    var frame = null
    var update = function () {
      frame = null
      var max = root.scrollHeight - innerHeight
      bar.style.setProperty('--progress', max > 0 ? Math.min(1, scrollY / max) : 0)
    }
    var schedule = function () { if (!frame) frame = requestAnimationFrame(update) }
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
    update()
  }
})()
