import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { MapPin, FileText } from 'lucide-react'
import CVModal from '../CVModal'
import styles from './Hero.module.css'

const floatVariants: Variants = {
  animate: {
    y: [0, -18, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const },
  },
}

export default function Hero() {
  const { t } = useTranslation()
  const [cvOpen, setCvOpen] = useState(false)
  const handleCvClose = useCallback(() => setCvOpen(false), [])

  return (
    <>
      <CVModal open={cvOpen} onClose={handleCvClose} />
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
      >
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            variants={floatVariants}
            animate="animate"
            className={`${styles.orbCyan} absolute top-1/4 left-1/4 w-96 h-96 rounded-full`}
          />
          <motion.div
            variants={floatVariants}
            animate="animate"
            className={`${styles.orbPurple} absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full`}
          />
          <div className={styles.gridPattern} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="inline-flex items-center gap-2 border-glow-cyan rounded-full px-4 py-1.5 mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse" />
            <span className="text-xs tracking-widest uppercase text-[#00f5ff]/80">
              {t('hero.available')}
            </span>
          </motion.div>

          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className={styles.avatarRing} />
              <div className={`${styles.avatarBorder} relative w-28 h-28 rounded-full overflow-hidden`}>
                <img
                  src="/profile.jpg"
                  alt="Alianne Elm"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3rem,10vw,7rem)] font-bold tracking-tight leading-none mb-3 tracking-hero"
          >
            <span className="text-gradient-white">Alianne</span>{' '}
            <span className="text-gradient-cyan">Elm</span>
          </motion.h1>

          {/* Role + location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          >
            <p className="text-lg md:text-xl text-white/40 tracking-widest uppercase">
              {t('hero.role')}
            </p>
            <span className="hidden sm:block text-white/20">·</span>
            <span className="flex items-center gap-1.5 text-sm text-white/30">
              <MapPin size={13} strokeWidth={1.5} />
              {t('hero.location')}
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-[clamp(1.1rem,3vw,1.5rem)] text-white/65 leading-relaxed max-w-2xl mx-auto mb-14 whitespace-pre-line"
          >
            {t('hero.tagline')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#stack"
              className={`${styles.ctaPrimary} inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 glow-cyan`}
            >
              {t('hero.cta')}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M8 1a.5.5 0 01.5.5v11.793l3.146-3.147a.5.5 0 01.708.708l-4 4a.5.5 0 01-.708 0l-4-4a.5.5 0 01.708-.708L7.5 13.293V1.5A.5.5 0 018 1z" />
              </svg>
            </a>
            <a
              href="#experience"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-sm tracking-wide border-glow-purple text-[#bf5af2] hover:bg-[#bf5af2]/10 transition-all duration-300"
            >
              {t('nav.experience')}
            </a>
            <button
              onClick={() => setCvOpen(true)}
              className={`${styles.ctaGhost} inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm tracking-wide text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300`}
            >
              <FileText size={15} strokeWidth={1.5} />
              {t('cv.button')}
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-12 bg-gradient-to-b from-[#00f5ff]/40 to-transparent mx-auto"
            />
          </motion.div>
        </div>
      </section>
    </>
  )
}
