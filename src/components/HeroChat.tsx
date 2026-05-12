import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, AlertTriangle, Info, Star, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ReactNode } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Map text markers → lucide icon + color
const MARKER_MAP: Record<string, { icon: ReactNode; color: string }> = {
  '[check]': { icon: <CheckCircle2 size={13} strokeWidth={2} />, color: '#30d158' },
  '[warn]':  { icon: <AlertTriangle size={13} strokeWidth={2} />, color: '#ff9f0a' },
  '[info]':  { icon: <Info size={13} strokeWidth={2} />,         color: 'rgba(255,255,255,0.4)' },
  '[star]':  { icon: <Star size={13} strokeWidth={2} />,         color: '#00f5ff' },
  '[bonus]': { icon: <Sparkles size={13} strokeWidth={2} />,     color: '#bf5af2' },
}

// Detect and strip a leading marker from a text string
function parseMarker(text: string): { marker: keyof typeof MARKER_MAP | null; rest: string } {
  for (const key of Object.keys(MARKER_MAP)) {
    if (text.trimStart().startsWith(key)) {
      return { marker: key, rest: text.trimStart().slice(key.length) }
    }
  }
  return { marker: null, rest: text }
}

// Inline icon badge
function MarkerIcon({ markerKey }: { markerKey: string }) {
  const m = MARKER_MAP[markerKey]
  if (!m) return null
  return (
    <span className="inline-flex items-center flex-shrink-0 mt-[1px]" style={{ color: m.color }}>
      {m.icon}
    </span>
  )
}

// Extract leading plain text from React children to detect markers
function extractLeadingText(children: ReactNode): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) {
    const first = children[0]
    if (typeof first === 'string') return first
  }
  return ''
}

// Replace leading text in children once marker is stripped
function stripMarkerFromChildren(children: ReactNode, markerKey: string): ReactNode {
  if (typeof children === 'string') {
    return children.trimStart().slice(markerKey.length)
  }
  if (Array.isArray(children)) {
    const [first, ...rest] = children
    if (typeof first === 'string') {
      return [first.trimStart().slice(markerKey.length), ...rest]
    }
  }
  return children
}

// Renders assistant markdown with icon markers and cyberpunk styles
function AssistantMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => {
          const leading = extractLeadingText(children)
          const { marker, rest: _ } = parseMarker(leading)
          if (marker) {
            return (
              <p className="mb-2 last:mb-0 leading-relaxed flex gap-2 items-start">
                <MarkerIcon markerKey={marker} />
                <span>{stripMarkerFromChildren(children, marker)}</span>
              </p>
            )
          }
          return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
        },
        strong: ({ children }) => (
          <strong className="font-semibold text-[#00f5ff]">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-white/70">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className="mt-2 mb-2 flex flex-col gap-1.5 last:mb-0">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mt-2 mb-2 flex flex-col gap-1.5 list-decimal list-inside last:mb-0">{children}</ol>
        ),
        li: ({ children }) => {
          const leading = extractLeadingText(children)
          const { marker } = parseMarker(leading)
          if (marker) {
            return (
              <li className="flex gap-2 items-start">
                <span className="flex-shrink-0 mt-[1px]">
                  <MarkerIcon markerKey={marker} />
                </span>
                <span>{stripMarkerFromChildren(children, marker)}</span>
              </li>
            )
          }
          return (
            <li className="flex gap-2 items-start">
              <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-[#00f5ff]/60 flex-shrink-0" />
              <span>{children}</span>
            </li>
          )
        },
        code: ({ children }) => (
          <code
            className="px-1.5 py-0.5 rounded text-xs font-mono"
            style={{ background: 'rgba(0,245,255,0.08)', color: '#00f5ff' }}
          >
            {children}
          </code>
        ),
        h3: ({ children }) => {
          const leading = extractLeadingText(children)
          const { marker } = parseMarker(leading)
          if (marker) {
            return (
              <h3 className="font-semibold text-white/90 mt-3 mb-1 first:mt-0 flex gap-2 items-center">
                <MarkerIcon markerKey={marker} />
                <span>{stripMarkerFromChildren(children, marker)}</span>
              </h3>
            )
          }
          return <h3 className="font-semibold text-white/90 mt-3 mb-1 first:mt-0">{children}</h3>
        },
        hr: () => <hr className="my-3 border-white/10" />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

const AiAvatar = () => (
  <div
    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold mt-0.5"
    style={{
      background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(191,90,242,0.15))',
      border: '1px solid rgba(0,245,255,0.25)',
    }}
  >
    AI
  </div>
)

export default function HeroChat() {
  const { t, i18n } = useTranslation()
  const isSv = i18n.language === 'sv'
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const lastAssistantRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    if (loading) {
      // User just sent — scroll to bottom to show the loading dots
      container.scrollTop = container.scrollHeight
    } else if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      // New assistant response — scroll to show the TOP of the message
      const el = lastAssistantRef.current
      if (el) {
        const offset = el.getBoundingClientRect().top - container.getBoundingClientRect().top
        container.scrollTop = container.scrollTop + offset - 16
      }
    }
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: Message = { role: 'user', content: text }
    const next = [...messages, userMessage]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: isSv
            ? 'Något gick fel. Försök igen om ett ögonblick.'
            : 'Something went wrong. Please try again in a moment.',
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      <div
        className="glass-card rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(0,245,255,0.15)' }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center gap-3 border-b"
          style={{ borderColor: 'rgba(0,245,255,0.08)' }}
        >
          <div className="relative flex-shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(191,90,242,0.15))',
                border: '1px solid rgba(0,245,255,0.3)',
              }}
            >
              AI
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#30d158] border border-[#050508]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80">{t('chat.title')}</p>
            <p className="text-xs text-white/35">{t('chat.subtitle')}</p>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="px-5 py-4 flex flex-col gap-4 overflow-y-auto"
          style={{ minHeight: '200px', maxHeight: '380px' }}
        >
          {/* Intro */}
          <div className="flex gap-3 items-start">
            <AiAvatar />
            <div
              className="rounded-2xl rounded-tl-sm px-4 py-3 text-base text-white/75 leading-relaxed max-w-[88%]"
              style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.1)' }}
            >
              {t('chat.intro')}
            </div>
          </div>

          {/* Conversation */}
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isLastAssistant = msg.role === 'assistant' && i === messages.length - 1
              return (
              <motion.div
                key={i}
                ref={isLastAssistant ? lastAssistantRef : undefined}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.role === 'assistant' && <AiAvatar />}

                <div
                  className="rounded-2xl px-4 py-3 text-base leading-relaxed max-w-[88%]"
                  style={
                    msg.role === 'user'
                      ? {
                          background: 'linear-gradient(135deg, rgba(0,245,255,0.12), rgba(10,132,255,0.12))',
                          border: '1px solid rgba(0,245,255,0.2)',
                          borderTopRightRadius: '4px',
                          color: 'rgba(255,255,255,0.85)',
                        }
                      : {
                          background: 'rgba(0,245,255,0.05)',
                          border: '1px solid rgba(0,245,255,0.1)',
                          borderTopLeftRadius: '4px',
                          color: 'rgba(255,255,255,0.72)',
                        }
                  }
                >
                  {msg.role === 'assistant'
                    ? <AssistantMarkdown content={msg.content} />
                    : msg.content
                  }
                </div>
              </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 items-start"
              >
                <AiAvatar />
                <div
                  className="rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center"
                  style={{ background: 'rgba(0,245,255,0.05)', border: '1px solid rgba(0,245,255,0.1)' }}
                >
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#00f5ff]"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div
          className="px-4 py-3 flex items-center gap-3 border-t"
          style={{ borderColor: 'rgba(0,245,255,0.08)' }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t('chat.placeholder')}
            disabled={loading}
            className="flex-1 bg-transparent text-base text-white/80 placeholder-white/30 outline-none"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-30"
            style={{
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, #00f5ff, #0a84ff)'
                : 'rgba(255,255,255,0.06)',
            }}
          >
            <Send size={14} strokeWidth={2} style={{ color: input.trim() && !loading ? '#050508' : 'rgba(255,255,255,0.4)' }} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
