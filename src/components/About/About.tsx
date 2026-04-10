import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Target, Rocket, ShieldCheck, Zap, HeartHandshake } from 'lucide-react'
import styles from './About.module.css'

const traitIcons = [
  <Target size={28} strokeWidth={1.5} className="text-[#00f5ff]" />,
  <Rocket size={28} strokeWidth={1.5} className="text-[#bf5af2]" />,
  <ShieldCheck size={28} strokeWidth={1.5} className="text-[#30d158]" />,
  <Zap size={28} strokeWidth={1.5} className="text-[#ff9f0a]" />,
]

const traits = ['trait1', 'trait2', 'trait3', 'trait4'] as const

export default function About() {
  const { t, i18n } = useTranslation()
  const isSv = i18n.language === 'sv'

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: title + text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs tracking-widest uppercase text-[#00f5ff]/60 mb-4">
              {t('about.title')}
            </p>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight mb-2 text-gradient-white tracking-section">
              Alianne Elm
            </h2>

            {/* Country chips */}
            <div className="flex items-center gap-2 mb-8 flex-wrap">
              <span className="chip"><span className="text-sm">🇨🇺</span> {t('about.cuba')}</span>
              <span className="text-white/15 text-xs">·</span>
              <span className="chip"><span className="text-sm">🇪🇸</span> {t('about.origin')}</span>
              <span className="text-white/15 text-xs">·</span>
              <span className="chip"><span className="text-sm">🇸🇪</span> {t('about.based')}</span>
            </div>

            <p className="text-white/60 leading-relaxed text-lg mb-5">{t('about.body')}</p>
            <p className="text-white/50 leading-relaxed">{t('about.body2')}</p>
          </motion.div>

          {/* Right: traits + stats + personal cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            {/* Trait chips 2×2 */}
            <div className="grid grid-cols-2 gap-4">
              {traits.map((trait, i) => (
                <motion.div
                  key={trait}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass-card rounded-2xl p-6 text-center glow-cyan"
                >
                  <div className="flex justify-center mb-3">{traitIcons[i]}</div>
                  <p className="text-sm font-semibold text-white/80">{t(`about.${trait}`)}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="glass-card border-glow-cyan rounded-2xl p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-[clamp(2rem,6vw,3.5rem)] font-bold text-gradient-cyan leading-none">7+</p>
                <p className="text-sm text-white/40 mt-1">{isSv ? 'års erfarenhet' : 'years of experience'}</p>
              </div>
              <div className="text-center">
                <p className="text-[clamp(2rem,6vw,3.5rem)] font-bold text-gradient-purple leading-none">3</p>
                <p className="text-sm text-white/40 mt-1">{isSv ? 'länder' : 'countries'}</p>
              </div>
              <div className="text-right">
                <p className="text-[clamp(2rem,6vw,3.5rem)] font-bold leading-none" style={{ color: '#30d158' }}>10+</p>
                <p className="text-sm text-white/40 mt-1">{isSv ? 'tech-stackar' : 'tech stacks'}</p>
              </div>
            </motion.div>

            {/* Quantum card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className={`${styles.quantumCardBorder} glass-card rounded-2xl p-5 flex items-start gap-4`}
            >
              <div className={`${styles.quantumIconBg} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg`}>
                ⟨ψ|
              </div>
              <div>
                <p className="text-sm font-semibold text-white/80 mb-1">{t('about.quantumTitle')}</p>
                <p className="text-xs text-white/40 leading-relaxed">{t('about.quantumDesc')}</p>
              </div>
            </motion.div>

            {/* Nonprofit card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className={`${styles.nonprofitCardBorder} glass-card rounded-2xl p-5 flex items-start gap-4`}
            >
              <div className={`${styles.nonprofitIconBg} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <HeartHandshake size={18} strokeWidth={1.5} style={{ color: '#bf5af2' }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-sm font-semibold text-white/80">{t('about.nonprofitTitle')}</p>
                  <span className="chip"><span>🇨🇺</span> Cuba</span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{t('about.nonprofitDesc')}</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
