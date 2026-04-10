import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Bot, CreditCard, Package, Radio } from 'lucide-react'

const roleKeys = ['devoteam', 'octane', 'tedsys', 'gualda'] as const
type RoleKey = typeof roleKeys[number]

const roleColors: Record<RoleKey, string> = {
  devoteam: '#00f5ff',
  octane:   '#bf5af2',
  tedsys:   '#0a84ff',
  gualda:   '#30d158',
}

const RoleIcon = ({ roleKey, color }: { roleKey: RoleKey; color: string }) => {
  const props = { size: 18, color, strokeWidth: 1.5 }
  if (roleKey === 'devoteam') return <Bot {...props} />
  if (roleKey === 'octane')   return <CreditCard {...props} />
  if (roleKey === 'tedsys')   return <Package {...props} />
  return <Radio {...props} />
}

export default function Experience() {
  const { t } = useTranslation()

  return (
    <section id="experience" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-xs tracking-widest uppercase text-[#00f5ff]/60 mb-4">
            {t('experience.title')}
          </p>
          <h2
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-gradient-white"
            style={{ letterSpacing: '-0.02em' }}
          >
            {t('experience.subtitle')}
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#00f5ff]/30 via-[#bf5af2]/20 to-transparent" />

          <div className="flex flex-col gap-10">
            {roleKeys.map((key, i) => {
              const color = roleColors[key]
              const role = t(`experience.roles.${key}.role`)
              const company = t(`experience.roles.${key}.company`)
              const period = t(`experience.roles.${key}.period`)
              const location = t(`experience.roles.${key}.location`)
              const summary = t(`experience.roles.${key}.summary`)

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="pl-16 relative"
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-[18px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: color, background: '#050508' }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  </div>

                  <div
                    className="glass-card rounded-2xl p-6 hover:border-opacity-40 transition-all duration-300"
                    style={{ borderColor: `${color}20` }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <RoleIcon roleKey={key} color={color} />
                          <h3 className="font-bold text-white text-lg">{role}</h3>
                        </div>
                        <p className="text-sm font-semibold" style={{ color }}>{company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/40 font-mono">{period}</p>
                        <p className="text-xs text-white/30 mt-1 flex items-center justify-end gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          {location}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-white/55 leading-relaxed">{summary}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
