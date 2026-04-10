import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function Languages() {
  const { t } = useTranslation()
  const list = t('languages.list', { returnObjects: true }) as Array<{
    lang: string; level: string; pct: number
  }>

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-widest uppercase text-[#00f5ff]/60 mb-4">
            {t('languages.title')}
          </p>
          <h2
            className="text-[clamp(2rem,4vw,3rem)] font-bold text-gradient-white"
            style={{ letterSpacing: '-0.02em' }}
          >
            {t('languages.title')}
          </h2>
        </motion.div>

        <div className="flex flex-col gap-6">
          {list.map(({ lang, level, pct }, i) => (
            <motion.div
              key={lang}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex justify-between items-baseline mb-3">
                <span className="font-semibold text-white">{lang}</span>
                <span className="text-sm text-white/40">{level}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      i === 0
                        ? 'linear-gradient(90deg, #bf5af2, #00f5ff)'
                        : i === 1
                        ? 'linear-gradient(90deg, #00f5ff, #0a84ff)'
                        : 'linear-gradient(90deg, #0a84ff, #30d158)',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
