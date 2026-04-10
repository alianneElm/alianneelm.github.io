import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Flame, Users, ClipboardCheck, Sun, MessageSquare, RefreshCw, Lightbulb, Compass } from 'lucide-react'
import styles from './SoftSkills.module.css'

const skills = [
  { key: 'hardWorking',   Icon: Flame,          color: '#ff375f' },
  { key: 'teamPlayer',    Icon: Users,          color: '#00f5ff' },
  { key: 'responsible',   Icon: ClipboardCheck, color: '#30d158' },
  { key: 'positive',      Icon: Sun,            color: '#ff9f0a' },
  { key: 'communicator',  Icon: MessageSquare,  color: '#bf5af2' },
  { key: 'adaptable',     Icon: RefreshCw,      color: '#0a84ff' },
  { key: 'problemSolver', Icon: Lightbulb,      color: '#ffd60a' },
  { key: 'selfDriven',    Icon: Compass,        color: '#30d158' },
]

export default function SoftSkills() {
  const { t } = useTranslation()

  return (
    <section id="softskills" className="py-32 px-6 relative">
      <div className={styles.bgAccent} />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-xs tracking-widest uppercase text-[#bf5af2]/60 mb-4">
            {t('softskills.title')}
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-gradient-white tracking-section">
            {t('softskills.subtitle')}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills.map(({ key, Icon, color }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4"
              style={{ borderColor: `${color}20` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}14` }}
              >
                <Icon size={20} strokeWidth={1.5} style={{ color }} />
              </div>
              <div>
                <p className="font-semibold text-white text-sm mb-1">
                  {t(`softskills.${key}.label`)}
                </p>
                <p className="text-xs text-white/40 leading-relaxed">
                  {t(`softskills.${key}.desc`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
