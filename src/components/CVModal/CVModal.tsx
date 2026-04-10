import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import styles from './CVModal.module.css'

interface CVModalProps {
  open: boolean
  onClose: () => void
}

export default function CVModal({ open, onClose }: CVModalProps) {
  const { t } = useTranslation()

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`${styles.panel} fixed inset-4 md:inset-8 lg:inset-16 z-[70] flex flex-col rounded-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className={`${styles.headerBorder} flex items-center justify-between px-5 py-4 flex-shrink-0`}>
              <div className="flex items-center gap-3">
                <div className={`${styles.headerIconBg} w-7 h-7 rounded-lg flex items-center justify-center`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f5ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-white/80">{t('cv.title')}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/cv.pdf"
                  download="Alianne_Elm_CV_2026.pdf"
                  className={`${styles.downloadBtn} flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200`}
                >
                  <Download size={12} strokeWidth={2} />
                  {t('cv.download')}
                </a>
                <button
                  onClick={onClose}
                  aria-label="Close CV viewer"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* PDF viewer */}
            <div className="flex-1 min-h-0">
              <iframe
                src="/cv.pdf"
                className="w-full h-full"
                title="Alianne Elm CV"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
