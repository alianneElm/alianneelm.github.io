import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Clock, CheckCircle2, GraduationCap } from 'lucide-react'
import styles from './Certifications.module.css'

export default function Certifications() {
  const { t } = useTranslation()

  const certsRaw = t('certifications.certs', { returnObjects: true })
  const educationRaw = t('certifications.education', { returnObjects: true })
  const certs = Array.isArray(certsRaw) ? certsRaw as Array<{
    name: string; org: string; date?: string; valid?: string; status?: string
  }> : []
  const education = Array.isArray(educationRaw) ? educationRaw as Array<{
    degree: string; school: string; years: string; country: string
  }> : []

  return (
    <section id="certifications" className="py-32 px-6 relative">
      <div className={styles.cornerGlow} />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-xs tracking-widest uppercase text-[#00f5ff]/60 mb-4">
            {t('certifications.title')}
          </p>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-gradient-white tracking-section">
            {t('certifications.title')}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Certifications */}
          <div>
            <p className="text-xs tracking-widest uppercase text-[#bf5af2]/60 mb-6">
              {t('certifications.certsLabel')}
            </p>
            <div className="flex flex-col gap-4">
              {certs.map((cert, i) => (
                <motion.div
                  key={`${cert.name}-${cert.org}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card border-glow-purple rounded-2xl p-5 flex items-start gap-4"
                >
                  <div className={`${styles.certIconBg} w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                    {cert.status === 'in-progress'
                      ? <Clock size={18} strokeWidth={1.5} className="text-[#ff9f0a]" />
                      : <CheckCircle2 size={18} strokeWidth={1.5} className="text-[#bf5af2]" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{cert.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">{cert.org}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {cert.status === 'in-progress' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff9f0a]/10 text-[#ff9f0a] border border-[#ff9f0a]/20">
                          {t('certifications.inProgress')}
                        </span>
                      )}
                      {cert.date && !cert.status && (
                        <span className="text-xs text-white/30">{cert.date}</span>
                      )}
                      {cert.valid && (
                        <span className="text-xs text-white/30">
                          {t('certifications.valid')} {cert.valid}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <p className="text-xs tracking-widest uppercase text-[#00f5ff]/60 mb-6">
              {t('certifications.educationLabel')}
            </p>
            <div className="flex flex-col gap-4">
              {education.map((edu, i) => (
                <motion.div
                  key={`${edu.degree}-${edu.school}`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card border-glow-cyan rounded-2xl p-5 flex items-start gap-4"
                >
                  <div className={`${styles.eduIconBg} w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                    <GraduationCap size={18} strokeWidth={1.5} className="text-[#00f5ff]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{edu.degree}</p>
                    <p className="text-xs text-white/50 mt-0.5">{edu.school}</p>
                    <p className="text-xs text-white/30 mt-1">{edu.years} · {edu.country}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
