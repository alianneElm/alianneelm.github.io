import type { Experience, Education } from '../../lib/cvData'
import { EXPERIENCES, NONPROFIT, CERTIFICATIONS, EDUCATION, LANGUAGES } from '../../lib/cvData'

const BURGUNDY = '#7A1C3F'
const DARK_SIDEBAR = '#3A0F1E'
const PAGE_W = '210mm'
const PAD_H = '32px'
const PAD_V = '38px'

interface GeneratedSummary { professional: string; personal: string; bonus: string }
interface CVDocumentProps {
  summary: GeneratedSummary
  roleTitle: string
  highlightedExperiences?: string[]
}

// ─── Reusable logo row ────────────────────────────────────────────────────────
function LogoRow({ label }: { label?: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '14px',
    }}>
      <img src="/consid-logo.svg" alt="Consid" style={{ height: '26px' }} />
      {label && (
        <span style={{ fontSize: '10px', fontWeight: 700, color: BURGUNDY, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {label}
        </span>
      )}
    </div>
  )
}

// ─── Page 1: Cover ────────────────────────────────────────────────────────────
function CoverPage({ summary, roleTitle }: { summary: GeneratedSummary; roleTitle: string }) {
  return (
    <div style={{
      display: 'flex',
      width: PAGE_W,
      minHeight: '297mm',
      background: '#fff',
      pageBreakAfter: 'always',
      breakAfter: 'page',
      boxSizing: 'border-box',
    }}>
      {/* Dark sidebar */}
      <div style={{
        width: '70mm', minWidth: '70mm',
        background: DARK_SIDEBAR,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: '40px',
      }}>
        <img src="/profile.jpg" alt="Alianne Elm" style={{
          width: '164px', height: '206px',
          objectFit: 'cover', objectPosition: 'top',
        }} />
      </div>

      {/* Right */}
      <div style={{ flex: 1, padding: `36px ${PAD_V} 36px 34px`, display: 'flex', flexDirection: 'column' }}>
        <img src="/consid-logo.svg" alt="Consid" style={{ height: '26px', marginBottom: '30px', alignSelf: 'flex-start' }} />
        <h1 style={{ fontSize: '36px', fontWeight: 300, color: '#1a1a1a', margin: '0 0 5px 0', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
          Alianne Elm
        </h1>
        <p style={{ fontSize: '12px', fontWeight: 700, color: BURGUNDY, margin: '0 0 24px 0' }}>{roleTitle}</p>
        <p style={{ fontSize: '10px', lineHeight: 1.8, color: '#333', margin: '0 0 13px 0' }}>{summary.professional}</p>
        <p style={{ fontSize: '10px', lineHeight: 1.8, color: '#333', margin: '0 0 13px 0' }}>{summary.personal}</p>
        <p style={{ fontSize: '10px', lineHeight: 1.8, color: '#333', margin: 0 }}>{summary.bonus}</p>
      </div>
    </div>
  )
}

// ─── Experience entry ─────────────────────────────────────────────────────────
function ExpEntry({ exp }: { exp: Experience }) {
  return (
    <div style={{ display: 'flex', gap: '18px' }}>
      {/* Meta column */}
      <div style={{ width: '108px', minWidth: '108px', paddingTop: '2px' }}>
        <p style={{ fontSize: '9.5px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 3px 0', lineHeight: 1.35 }}>{exp.company}</p>
        <p style={{ fontSize: '8.5px', color: '#777', margin: '0 0 1px 0', lineHeight: 1.4 }}>{exp.period}</p>
        <p style={{ fontSize: '8.5px', color: '#777', margin: 0 }}>{exp.location}</p>
      </div>
      {/* Content column */}
      <div style={{ flex: 1, borderLeft: `2px solid ${BURGUNDY}`, paddingLeft: '13px' }}>
        <p style={{ fontSize: '10.5px', fontWeight: 700, color: BURGUNDY, margin: '0 0 5px 0' }}>{exp.role}</p>
        {exp.companyDescription && (
          <p style={{ fontSize: '9px', lineHeight: 1.65, color: '#444', margin: '0 0 6px 0' }}>{exp.companyDescription}</p>
        )}
        {exp.description.map((para, i) => (
          <p key={i} style={{ fontSize: '9px', lineHeight: 1.65, color: '#333', margin: '0 0 5px 0' }}>{para}</p>
        ))}
        {exp.tech && (
          <p style={{ fontSize: '8.5px', fontWeight: 700, color: BURGUNDY, margin: '5px 0 0 0', lineHeight: 1.55 }}>{exp.tech}</p>
        )}
      </div>
    </div>
  )
}

// ─── Section using <table> so <thead>/<tfoot> repeat on every printed page ───
function PrintableSection({
  label,
  title,
  children,
  breakBefore = false,
}: {
  label?: string
  title?: string
  children: React.ReactNode
  breakBefore?: boolean
}) {
  const headerPad = `${PAD_H} ${PAD_V} 12px ${PAD_V}`
  const footerPad = `8px ${PAD_V} 20px ${PAD_V}`

  return (
    <table style={{
      width: PAGE_W,
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
      background: '#fff',
      pageBreakBefore: breakBefore ? 'always' : 'auto',
      breakBefore: breakBefore ? 'page' : 'auto',
      pageBreakAfter: 'always',
      breakAfter: 'page',
    }}>
      {/* Header — repeats on every print page */}
      <thead>
        <tr>
          <td style={{ padding: headerPad }}>
            <LogoRow label={label} />
            {title && (
              <>
                <h2 style={{
                  fontSize: '16px', fontWeight: 700, color: '#1a1a1a',
                  margin: '0 0 5px 0',
                  borderBottom: '2px solid #1a1a1a', paddingBottom: '6px',
                }}>
                  {title}
                </h2>
              </>
            )}
          </td>
        </tr>
      </thead>

      {/* Footer — repeats on every print page */}
      <tfoot>
        <tr>
          <td style={{ padding: footerPad }}>
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '7px', display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: BURGUNDY, letterSpacing: '0.03em' }}>Alianne Elm</span>
            </div>
          </td>
        </tr>
      </tfoot>

      {/* Body */}
      <tbody>
        <tr>
          <td style={{ padding: `10px ${PAD_V} 0 ${PAD_V}` }}>
            {children}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

// ─── Experiences section ──────────────────────────────────────────────────────
function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <PrintableSection label="Projekt och uppdrag" title="Projekt och uppdrag">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {experiences.map(exp => (
          <div key={exp.id} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <ExpEntry exp={exp} />
            <div style={{ borderBottom: '1px solid #f0f0f0', marginTop: '18px' }} />
          </div>
        ))}
      </div>
    </PrintableSection>
  )
}

// ─── Certs + Education + Nonprofit ───────────────────────────────────────────
function CertsSection() {
  return (
    <PrintableSection breakBefore>
      <div style={{ pageBreakInside: 'avoid', breakInside: 'avoid', marginBottom: '16px' }}>
        <ExpEntry exp={NONPROFIT} />
      </div>

      <div style={{ borderTop: '1px solid #e8e8e8', margin: '4px 0 16px 0' }} />

      <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 10px 0' }}>
        Kurser och Certifieringar
      </h2>
      {CERTIFICATIONS.map((cert, i) => (
        <p key={i} style={{
          fontSize: '9.5px', color: '#333', margin: '0 0 5px 0', lineHeight: 1.55,
          paddingLeft: '11px', borderLeft: `2px solid ${BURGUNDY}`,
        }}>
          {cert}
        </p>
      ))}

      <div style={{ borderTop: '1px solid #e8e8e8', margin: '16px 0' }} />

      <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 10px 0' }}>
        Utbildningar
      </h2>
      {EDUCATION.map((edu: Education, i: number) => (
        <div key={i} style={{ display: 'flex', gap: '24px', marginBottom: '9px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#1a1a1a', minWidth: '76px' }}>{edu.period}</span>
          <div>
            <p style={{ fontSize: '9.5px', fontWeight: 700, margin: 0, color: '#1a1a1a' }}>{edu.degree}</p>
            <p style={{ fontSize: '9px', color: '#666', margin: '2px 0 0 0' }}>{edu.school}</p>
          </div>
        </div>
      ))}
    </PrintableSection>
  )
}

// ─── Languages ───────────────────────────────────────────────────────────────
function LanguagesSection() {
  return (
    <PrintableSection breakBefore title="Språk">
      {LANGUAGES.map((l, i) => (
        <div key={i} style={{
          display: 'flex', gap: '36px', alignItems: 'center',
          padding: '9px 0', borderBottom: '1px solid #f0f0f0',
          pageBreakInside: 'avoid', breakInside: 'avoid',
        }}>
          <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#1a1a1a', minWidth: '90px' }}>{l.lang}</span>
          <span style={{ fontSize: '10.5px', color: '#555' }}>{l.level}</span>
        </div>
      ))}
    </PrintableSection>
  )
}

// ─── Consid company page ──────────────────────────────────────────────────────
function ConsidPage() {
  return (
    <div style={{
      width: PAGE_W, background: '#f5f0ed', boxSizing: 'border-box',
      padding: '56px 60px', minHeight: '200mm',
      pageBreakBefore: 'always', breakBefore: 'page',
    }}>
      <img src="/consid-logo.svg" alt="Consid" style={{ height: '26px', marginBottom: '48px', display: 'block' }} />
      <h1 style={{ fontSize: '46px', fontWeight: 300, color: BURGUNDY, margin: '0 0 40px 0', lineHeight: 1.1 }}>
        Vilka är Consid?
      </h1>
      <div style={{ maxWidth: '460px' }}>
        {[
          'Genom djup kunskap inom IT, kommunikation och design kan Consid se till att du blir bäst i världen på det du gör. Vi skapar nya möjligheter i en digital värld tillsammans med våra kunder, och är idag ett av Sveriges snabbast växande och mest stabila konsultbolag.',
          'Idag är det de aktörer som kan skapa de starkaste och mest sömlösa användarupplevelserna som också vinner sin plats i människors medvetande. Överallt där du möter din målgrupp, kan Consid bygga värde och fördjupa din relation till de människor du vill nå fram till.',
          'Våra konsulter arbetar i dynamiska team, där spetskompetenser sätts samman utifrån en förståelse för din verksamhet, din omvärld och dina utmaningar. I allt vi gör strävar vi efter att leva upp till våra tre värdeord entreprenörskap, engagemang och effekt.',
        ].map((text, i) => (
          <p key={i} style={{ fontSize: '10.5px', lineHeight: 1.8, color: '#333', margin: '0 0 16px 0' }}>{text}</p>
        ))}
        <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#1a1a1a', margin: '26px 0 6px 0' }}>
          Vill du veta mer? Tveka inte att kontakta oss!
        </p>
        <p style={{ fontSize: '10.5px', color: BURGUNDY, margin: '0 0 3px 0' }}>sales@consid.se</p>
        <p style={{ fontSize: '10.5px', color: BURGUNDY, margin: 0 }}>www.consid.se</p>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function CVDocument({ summary, roleTitle, highlightedExperiences }: CVDocumentProps) {
  const ordered = highlightedExperiences?.length
    ? [
        ...EXPERIENCES.filter(e => highlightedExperiences.includes(e.id)),
        ...EXPERIENCES.filter(e => !highlightedExperiences.includes(e.id)),
      ]
    : EXPERIENCES

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { margin: 0 !important; background: #fff !important; }
          #cv-document * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          tbody { display: table-row-group; }
        }
      `}</style>
      <div id="cv-document" style={{ fontFamily: 'Arial, Helvetica, sans-serif', background: '#fff' }}>
        <CoverPage summary={summary} roleTitle={roleTitle} />
        <ExperienceSection experiences={ordered} />
        <CertsSection />
        <LanguagesSection />
        <ConsidPage />
      </div>
    </>
  )
}
