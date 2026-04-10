import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Cloud } from 'lucide-react'
import styles from './TechStack.module.css'

const stack = {
  frontend: {
    color: '#00f5ff',
    icon: '◈',
    techs: ['React', 'TypeScript', 'JavaScript', 'Vue.js', 'Next.js', 'HTML', 'CSS', 'Redux'],
  },
  backend: {
    color: '#bf5af2',
    icon: '⬡',
    techs: ['Python', 'Java', 'Django', 'Spring Boot', 'Spring Security', 'Node.js', '.NET'],
  },
  cloud: {
    color: '#30d158',
    icon: null,
    techs: ['AWS', 'AWS Lambda', 'Microsoft Azure', 'Azure DevOps', 'Snowflake'],
  },
  databases: {
    color: '#ff9f0a',
    icon: '◉',
    techs: ['PostgreSQL', 'SQLite', 'MySQL', 'Azure PostgreSQL'],
  },
  devops: {
    color: '#0a84ff',
    icon: '⟳',
    techs: ['Docker', 'Kubernetes', 'GitHub Actions', 'Jenkins', 'Argo', 'CI/CD', 'Terraform', 'Postman'],
  },
  ai: {
    color: '#ff375f',
    icon: '✦',
    techs: ['LangChain', 'LLM', 'Generative AI', 'AI Ethics', 'Qiskit (Quantum)', 'GenAI'],
  },
}

type StackKey = keyof typeof stack

export default function TechStack() {
  const { t } = useTranslation()

  return (
    <section id="stack" className="py-32 px-6 relative">
      <div className={styles.bgAccent} />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-xs tracking-widest uppercase text-[#00f5ff]/60 mb-4">
            {t('stack.title')}
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-gradient-white tracking-section">
            {t('stack.subtitle')}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(Object.keys(stack) as StackKey[]).map((key, i) => {
            const { color, icon, techs } = stack[key]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-6"
                style={{ borderColor: `${color}20` }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl" style={{ color }}>
                    {key === 'cloud' ? <Cloud size={22} strokeWidth={1.5} /> : icon}
                  </span>
                  <p className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                    {t(`stack.${key}`)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{
                        background: `${color}12`,
                        color: `${color}cc`,
                        border: `1px solid ${color}22`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
