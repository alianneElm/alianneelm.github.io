import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import styles from './Footer.module.css'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer id="contact" className="py-32 px-6 relative overflow-hidden">
      <div className={styles.bottomGlow} />

      <div className="max-w-4xl mx-auto relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs tracking-widest uppercase text-[#00f5ff]/60 mb-6">
            {t('footer.contact')}
          </p>

          <h2
            className="text-[clamp(2.5rem,8vw,6rem)] font-bold mb-8 leading-none tracking-hero"
          >
            <span className="text-gradient-white">Alianne</span>{' '}
            <span className="text-gradient-cyan">Elm</span>
          </h2>

          <p className="text-white/40 mb-10 text-lg">{t('footer.role')}</p>

          <a
            href="mailto:alianne.elm@consid.se"
            className={`${styles.ctaPrimary} inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full font-semibold text-base tracking-wide transition-all duration-300 glow-cyan`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            alianne.elm@consid.se
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/20"
        >
          <span>© 2026 Alianne Elm</span>
          <span className="text-gradient-cyan opacity-60">Consid</span>
          <a href="#hero" className="hover:text-white/40 transition-colors">↑ {t('footer.backToTop')}</a>
        </motion.div>
      </div>
    </footer>
  )
}
