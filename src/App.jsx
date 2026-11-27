import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Post from './pages/Post.jsx'
import Archive from './pages/Archive.jsx'
import { Tag, Tags } from './pages/Tags.jsx'
import Page from './pages/Page.jsx'
import NotFound from './pages/NotFound.jsx'
import { isEnabled } from './lib/content.js'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="site">
        <Header />
        <main id="main" className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:slug" element={<Post />} />
            {isEnabled('archive') && <Route path="/archive" element={<Archive />} />}
            {isEnabled('tags') && <Route path="/tags" element={<Tags />} />}
            {isEnabled('tags') && <Route path="/tags/:tag" element={<Tag />} />}
            <Route path="/:slug" element={<Page />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
