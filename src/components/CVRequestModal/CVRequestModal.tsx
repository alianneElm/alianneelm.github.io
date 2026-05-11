import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Sparkles, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface CVRequestModalProps {
  open: boolean
  onClose: () => void
}

export default function CVRequestModal({ open, onClose }: CVRequestModalProps) {
  const [text, setText] = useState('')
  const navigate = useNavigate()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus textarea when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 120)
    } else {
      setText('')
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleGenerate = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    navigate(`/cv?role=${encodeURIComponent(trimmed)}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop + centering container */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(5,5,8,0.82)', backdropFilter: 'blur(6px)' }}
          >
          {/* Modal — stops click propagation so clicking inside doesn't close */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '580px' }}
          >
            <div
              className="glass-card rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(122,28,63,0.35)' }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-5 border-b"
                style={{ borderColor: 'rgba(122,28,63,0.2)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(122,28,63,0.3), rgba(160,32,80,0.2))',
                      border: '1px solid rgba(122,28,63,0.4)',
                    }}
                  >
                    <FileText size={14} style={{ color: '#e0607e' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/85">Generera anpassat CV</p>
                    <p className="text-xs text-white/35">Klistra in uppdragsbeskrivning eller krav</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                <style>{`
                  .cv-modal-textarea::placeholder { color: rgba(255,255,255,0.38); }
                `}</style>
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Klistra in uppdragsbeskrivningen här…"
                  rows={9}
                  className="cv-modal-textarea w-full bg-transparent outline-none resize-none leading-relaxed"
                  style={{
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.85)',
                    caretColor: '#e0607e',
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate()
                  }}
                />
              </div>

              {/* Footer */}
              <div
                className="px-6 py-4 flex items-center justify-between border-t"
                style={{ borderColor: 'rgba(255,255,255,0.05)' }}
              >
                <span className="text-xs text-white/20">⌘ + Enter för att generera</span>
                <button
                  onClick={handleGenerate}
                  disabled={!text.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                  style={{
                    background: text.trim()
                      ? 'linear-gradient(135deg, #7A1C3F, #a02050)'
                      : 'rgba(255,255,255,0.06)',
                    color: text.trim() ? '#fff' : 'rgba(255,255,255,0.25)',
                    cursor: text.trim() ? 'pointer' : 'not-allowed',
                    border: 'none',
                  }}
                >
                  <Sparkles size={14} />
                  Generera CV
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
