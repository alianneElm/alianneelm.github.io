import type { Experience, Education } from '../../lib/cvData'
import { EXPERIENCES, NONPROFIT, CERTIFICATIONS, EDUCATION, LANGUAGES } from '../../lib/cvData'

const BURGUNDY = '#7A1C3F'
const PAGE_W = '210mm'

interface GeneratedSummary { professional: string; personal: string; bonus: string }

export interface SellerInfo {
  name: string
  email: string
  phone: string
}

export interface Competencies {
  Plattformar?: string[]
  Tekniker?: string[]
  Verktyg?: string[]
  'Verksamhet och funktion'?: string[]
}

interface CVDocumentProps {
  summary: GeneratedSummary
  roleTitle: string
  highlightedExperiences?: string[]
  experienceHighlights?: Record<string, string>
  competencies?: Competencies
  seller?: SellerInfo
  editMode?: boolean
}

// ─── Editable text ────────────────────────────────────────────────────────────
function E({
  children, style, tag: Tag = 'p', editMode,
}: {
  children: string; style?: React.CSSProperties; tag?: 'p' | 'span' | 'h1' | 'h2'; editMode?: boolean
}) {
  if (!editMode) return <Tag style={style}>{children}</Tag>
  return (
    <Tag
      contentEditable suppressContentEditableWarning className="cv-editable"
      style={{ ...style, outline: 'none', cursor: 'text' }}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  )
}

// ─── Tech pill tags ───────────────────────────────────────────────────────────
function TechPills({ tech }: { tech: string }) {
  const tags = tech.split(/\s*·\s*/).filter(Boolean)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
      {tags.map((tag, i) => (
        <span key={i} style={{
          display: 'inline-block',
          border: '1px solid #ccc',
          borderRadius: '12px',
          padding: '2px 8px',
          fontSize: '7.5px',
          color: '#444',
          whiteSpace: 'nowrap',
        }}>
          {tag}
        </span>
      ))}
    </div>
  )
}

// ─── Page header (repeats on every page) ─────────────────────────────────────
function PageHeader({ seller }: { seller?: SellerInfo }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      marginBottom: '24px',
    }}>
      <img src="/consid-logo.svg" alt="Consid" style={{ height: '28px' }} />
      {seller?.name && (
        <div style={{ textAlign: 'right', lineHeight: 1.5 }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{seller.name}</p>
          {seller.email && <p style={{ fontSize: '9px', color: BURGUNDY, margin: 0 }}>{seller.email}</p>}
          {seller.phone && <p style={{ fontSize: '9px', color: BURGUNDY, margin: 0 }}>{seller.phone}</p>}
        </div>
      )}
    </div>
  )
}

// ─── Cover page ───────────────────────────────────────────────────────────────
function CoverPage({ summary, roleTitle, competencies, seller, editMode }: {
  summary: GeneratedSummary; roleTitle: string; competencies?: Competencies; seller?: SellerInfo; editMode?: boolean
}) {
  const competencyCategories = [
    { label: 'Plattformar', items: competencies?.Plattformar ?? [] },
    { label: 'Tekniker', items: competencies?.Tekniker ?? [] },
    { label: 'Verktyg', items: competencies?.Verktyg ?? [] },
    { label: 'Verksamhet och funktion', items: competencies?.['Verksamhet och funktion'] ?? [] },
  ].filter(c => c.items.length > 0)

  return (
    <div style={{
      width: PAGE_W, minHeight: '297mm', background: '#fff',
      pageBreakAfter: 'always', breakAfter: 'page', boxSizing: 'border-box',
      padding: '32px 38px',
    }}>
      <PageHeader seller={seller} />

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

        {/* Left column: photo + competencies */}
        <div style={{ width: '160px', minWidth: '160px', flexShrink: 0 }}>
          <img
            src="/profile.jpg" alt="Alianne Elm"
            style={{ width: '160px', height: '200px', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
          />
          {competencyCategories.length > 0 && (
            <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {competencyCategories.map(cat => (
                <div key={cat.label}>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: BURGUNDY, margin: '0 0 4px 0' }}>{cat.label}</p>
                  {cat.items.map((item, i) => (
                    <p key={i} style={{ fontSize: '9px', color: '#333', margin: '0 0 2px 0', lineHeight: 1.4 }}>{item}</p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: name + role + summary */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '38px', fontWeight: 300, color: '#1a1a1a', margin: '0 0 4px 0', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
            Alianne Elm
          </h1>
          <E tag="p" editMode={editMode} style={{ fontSize: '13px', fontWeight: 700, color: BURGUNDY, margin: '0 0 18px 0' }}>
            {roleTitle}
          </E>
          <div style={{ borderBottom: `1px solid ${BURGUNDY}`, marginBottom: '16px', opacity: 0.3 }} />
          <E tag="p" editMode={editMode} style={{ fontSize: '10px', lineHeight: 1.8, color: '#333', margin: '0 0 12px 0' }}>
            {summary.professional}
          </E>
          <E tag="p" editMode={editMode} style={{ fontSize: '10px', lineHeight: 1.8, color: '#333', margin: '0 0 12px 0' }}>
            {summary.personal}
          </E>
          <E tag="p" editMode={editMode} style={{ fontSize: '10px', lineHeight: 1.8, color: '#333', margin: 0 }}>
            {summary.bonus}
          </E>
        </div>
      </div>
    </div>
  )
}

// ─── Experience entry ─────────────────────────────────────────────────────────
function ExpEntry({ exp, highlight, editMode }: { exp: Experience; highlight?: string; editMode?: boolean }) {
  return (
    <div style={{ marginBottom: '24px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
      <p style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 1px 0' }}>{exp.company}</p>
      <p style={{ fontSize: '9px', color: '#777', margin: '0 0 1px 0' }}>{exp.period}</p>
      {exp.location && <p style={{ fontSize: '9px', color: '#777', margin: '0 0 6px 0' }}>{exp.location}</p>}
      <p style={{ fontSize: '11px', fontWeight: 700, color: BURGUNDY, margin: '0 0 8px 0' }}>{exp.role}</p>

      {/* AI relevance highlight */}
      {highlight && (
        <div style={{
          background: 'rgba(122,28,63,0.05)',
          borderLeft: `3px solid ${BURGUNDY}`,
          padding: '5px 9px', marginBottom: '8px', borderRadius: '0 3px 3px 0',
        }}>
          <E tag="p" editMode={editMode} style={{ fontSize: '8.5px', fontStyle: 'italic', color: BURGUNDY, margin: 0, lineHeight: 1.6 }}>
            {highlight}
          </E>
        </div>
      )}

      {exp.companyDescription && (
        <E tag="p" editMode={editMode} style={{ fontSize: '9px', lineHeight: 1.65, color: '#444', margin: '0 0 6px 0' }}>
          {exp.companyDescription}
        </E>
      )}
      {exp.description.map((para, i) => (
        <E key={i} tag="p" editMode={editMode} style={{ fontSize: '9px', lineHeight: 1.65, color: '#333', margin: '0 0 5px 0' }}>
          {para}
        </E>
      ))}
      {exp.tech && <TechPills tech={exp.tech} />}
    </div>
  )
}

// ─── Printable section (table so header repeats on print) ────────────────────
function PrintableSection({
  title, children, seller, breakBefore = false,
}: {
  title?: string; children: React.ReactNode; seller?: SellerInfo; breakBefore?: boolean
}) {
  return (
    <table style={{
      width: PAGE_W, borderCollapse: 'collapse', tableLayout: 'fixed', background: '#fff',
      pageBreakBefore: breakBefore ? 'always' : 'auto',
      breakBefore: breakBefore ? 'page' : 'auto',
      pageBreakAfter: 'always', breakAfter: 'page',
    }}>
      <thead>
        <tr>
          <td style={{ padding: '28px 38px 12px 38px' }}>
            <PageHeader seller={seller} />
            {title && (
              <h2 style={{
                fontSize: '18px', fontWeight: 700, color: '#1a1a1a',
                margin: '0 0 6px 0', paddingBottom: '8px',
                borderBottom: `2px solid #1a1a1a`,
              }}>
                {title}
              </h2>
            )}
          </td>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <td style={{ padding: '8px 38px 20px 38px' }}>
            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '6px', display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: BURGUNDY }}>Alianne Elm</span>
            </div>
          </td>
        </tr>
      </tfoot>
      <tbody>
        <tr>
          <td style={{ padding: '8px 38px 0 38px' }}>{children}</td>
        </tr>
      </tbody>
    </table>
  )
}

// ─── Experiences section ──────────────────────────────────────────────────────
function ExperienceSection({ experiences, experienceHighlights, seller, editMode }: {
  experiences: Experience[]; experienceHighlights?: Record<string, string>; seller?: SellerInfo; editMode?: boolean
}) {
  return (
    <PrintableSection title="Projekt och uppdrag" seller={seller}>
      {experiences.map(exp => (
        <ExpEntry key={exp.id} exp={exp} highlight={experienceHighlights?.[exp.id]} editMode={editMode} />
      ))}
    </PrintableSection>
  )
}

// ─── Certs + Education + Nonprofit ───────────────────────────────────────────
function CertsSection({ seller, editMode }: { seller?: SellerInfo; editMode?: boolean }) {
  return (
    <PrintableSection seller={seller} breakBefore>
      <div style={{ marginBottom: '20px', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 1px 0' }}>{NONPROFIT.company}</p>
        <p style={{ fontSize: '9px', color: '#777', margin: '0 0 6px 0' }}>{NONPROFIT.period}</p>
        <p style={{ fontSize: '11px', fontWeight: 700, color: BURGUNDY, margin: '0 0 8px 0' }}>{NONPROFIT.role}</p>
        {NONPROFIT.description.map((para, i) => (
          <E key={i} tag="p" editMode={editMode} style={{ fontSize: '9px', lineHeight: 1.65, color: '#333', margin: '0 0 5px 0' }}>
            {para}
          </E>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #e8e8e8', margin: '4px 0 16px 0' }} />

      <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 10px 0' }}>Kurser och Certifieringar</h2>
      {CERTIFICATIONS.map((cert, i) => (
        <E key={i} tag="p" editMode={editMode} style={{
          fontSize: '9.5px', color: '#333', margin: '0 0 5px 0', lineHeight: 1.55,
          paddingLeft: '11px', borderLeft: `2px solid ${BURGUNDY}`,
        }}>
          {cert}
        </E>
      ))}

      <div style={{ borderTop: '1px solid #e8e8e8', margin: '16px 0' }} />

      <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 10px 0' }}>Utbildningar</h2>
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
function LanguagesSection({ seller }: { seller?: SellerInfo }) {
  return (
    <PrintableSection seller={seller} breakBefore title="Språk">
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

// ─── Consid page ──────────────────────────────────────────────────────────────
function ConsidPage() {
  return (
    <div style={{
      width: PAGE_W, background: '#f5f0ed', boxSizing: 'border-box',
      padding: '56px 60px', minHeight: '200mm',
      pageBreakBefore: 'always', breakBefore: 'page',
    }}>
      <img src="/consid-logo.svg" alt="Consid" style={{ height: '28px', marginBottom: '60px', display: 'block' }} />
      <h1 style={{ fontSize: '52px', fontWeight: 300, color: BURGUNDY, margin: '0 0 48px 0', lineHeight: 1.1 }}>
        Vilka är Consid?
      </h1>
      <div style={{ maxWidth: '480px' }}>
        {[
          'Genom djup kunskap inom IT, kommunikation och design kan Consid se till att du blir bäst i världen på det du gör. Vi skapar nya möjligheter i en digital värld tillsammans med våra kunder, och är idag ett av Sveriges snabbast växande och mest stabila konsultbolag.',
          'Idag är det de aktörer som kan skapa de starkaste och mest sömlösa användarupplevelserna som också vinner sin plats i människors medvetande. Överallt där du möter din målgrupp, kan Consid bygga värde och fördjupa din relation till de människor du vill nå fram till.',
          'Våra konsulter arbetar i dynamiska team, där spetskompetenser sätts samman utifrån en förståelse för din verksamhet, din omvärld och dina utmaningar. I allt vi gör strävar vi efter att leva upp till våra tre värdeord entreprenörskap, engagemang och effekt.',
        ].map((text, i) => (
          <p key={i} style={{ fontSize: '10.5px', lineHeight: 1.8, color: '#333', margin: '0 0 16px 0' }}>{text}</p>
        ))}
        <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#1a1a1a', margin: '32px 0 6px 0' }}>
          Vill du veta mer? Tveka inte att kontakta oss!
        </p>
        <p style={{ fontSize: '10.5px', color: BURGUNDY, margin: '0 0 4px 0', textDecoration: 'underline' }}>sales@consid.se</p>
        <p style={{ fontSize: '10.5px', color: BURGUNDY, margin: 0, textDecoration: 'underline' }}>www.consid.se</p>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function CVDocument({
  summary, roleTitle, highlightedExperiences, experienceHighlights,
  competencies, seller, editMode,
}: CVDocumentProps) {
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
          #cv-document * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          tbody { display: table-row-group; }
          .cv-editable { outline: none !important; box-shadow: none !important; }
        }
        .cv-editable:hover { outline: 1px dashed rgba(122,28,63,0.45) !important; border-radius: 2px; }
        .cv-editable:focus { outline: 1px solid rgba(122,28,63,0.7) !important; border-radius: 2px; background: rgba(122,28,63,0.03); }
      `}</style>
      <div id="cv-document" style={{ fontFamily: 'Arial, Helvetica, sans-serif', background: '#fff' }}>
        <CoverPage summary={summary} roleTitle={roleTitle} competencies={competencies} seller={seller} editMode={editMode} />
        <ExperienceSection experiences={ordered} experienceHighlights={experienceHighlights} seller={seller} editMode={editMode} />
        <CertsSection seller={seller} editMode={editMode} />
        <LanguagesSection seller={seller} />
        <ConsidPage />
      </div>
    </>
  )
}
