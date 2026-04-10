import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'sv' ? 'en' : 'sv')

  const links = [
    { key: 'nav.about', href: '#about' },
    { key: 'nav.stack', href: '#stack' },
    { key: 'nav.experience', href: '#experience' },
    { key: 'nav.certifications', href: '#certifications' },
    { key: 'nav.softskills', href: '#softskills' },
  ]

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div
        className={`mx-auto max-w-6xl px-6 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'glass-card rounded-2xl py-3 px-6' : ''
        }`}
      >
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
            style={{ border: '1.5px solid rgba(0,245,255,0.35)' }}
          >
            <img
              src="/profile.jpg"
              alt="Alianne Elm"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <span className="text-sm font-semibold tracking-widest uppercase text-gradient-cyan">
            AE
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="text-sm text-white/50 hover:text-white transition-colors duration-200"
            >
              {t(l.key)}
            </a>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLang}
            className="text-xs font-semibold tracking-widest border-glow-cyan rounded-full px-4 py-1.5 text-[#00f5ff] hover:bg-[#00f5ff]/10 transition-all duration-200"
          >
            {i18n.language === 'sv' ? 'EN' : 'SV'}
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/60 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              {menuOpen ? (
                <path fillRule="evenodd" clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              ) : (
                <path fillRule="evenodd" clipRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass-card mx-4 mt-2 rounded-2xl p-6 flex flex-col gap-4"
          >
            {links.map((l) => (
              <a
                key={l.key}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {t(l.key)}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
