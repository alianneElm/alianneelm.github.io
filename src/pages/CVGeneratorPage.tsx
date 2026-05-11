import { useState, useRef, useEffect } from 'react'
import { useReactToPrint } from 'react-to-print'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Download, Loader2, Sparkles } from 'lucide-react'
import CVDocument from '../components/CVDocument/CVDocument'
import { DEFAULT_SUMMARY } from '../lib/cvData'

interface GeneratedSummary {
  professional: string
  personal: string
  bonus: string
}

export default function CVGeneratorPage() {
  const [searchParams] = useSearchParams()
  const [roleInput, setRoleInput] = useState(() => searchParams.get('role') ?? '')
  const [roleTitle, setRoleTitle] = useState('Systemutvecklare')
  const [summary, setSummary] = useState<GeneratedSummary>(DEFAULT_SUMMARY)
  const [highlightedExperiences, setHighlightedExperiences] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [error, setError] = useState('')

  const cvRef = useRef<HTMLDivElement>(null)

  // Auto-generate if role came from URL param
  useEffect(() => {
    const roleFromUrl = searchParams.get('role')
    if (roleFromUrl && roleFromUrl.trim()) {
      generate(roleFromUrl.trim())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePrint = useReactToPrint({
    contentRef: cvRef,
    documentTitle: `Alianne Elm CV - ${roleTitle}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body { margin: 0; padding: 0; }
        .cv-page {
          page-break-after: always;
          width: 210mm;
          min-height: 297mm;
          box-sizing: border-box;
          background: white !important;
        }
        .cv-page:last-child {
          page-break-after: avoid;
        }
      }
    `,
  })

  const generate = async (overrideText?: string) => {
    const text = (overrideText ?? roleInput).trim()
    if (!text) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleDescription: text }),
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setSummary(data.summary)
      setRoleTitle(data.roleTitle || 'Systemutvecklare')
      setHighlightedExperiences(data.highlightedExperiences || [])
      setGenerated(true)
    } catch {
      setError('Något gick fel. Försök igen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f2', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Top bar */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #e0e0e0',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#555',
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            <ArrowLeft size={15} />
            Tillbaka
          </Link>
          <img src="/consid-logo.svg" alt="Consid" style={{ height: '24px' }} />
          <span style={{ color: '#bbb', fontSize: '13px' }}>CV-generator · Alianne Elm</span>
        </div>

        <button
          onClick={handlePrint}
          disabled={!generated}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: generated ? '#7A1C3F' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '9px 20px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: generated ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
          }}
        >
          <Download size={15} />
          Ladda ner PDF
        </button>
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', gap: 0, minHeight: 'calc(100vh - 57px)' }}>
        {/* Sidebar / form */}
        <div
          style={{
            width: '360px',
            minWidth: '360px',
            background: '#fff',
            borderRight: '1px solid #e0e0e0',
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px 0' }}>
              Generera anpassat CV
            </h2>
            <p style={{ fontSize: '12px', color: '#888', margin: 0, lineHeight: 1.6 }}>
              Beskriv uppdraget eller rollen så anpassar AI:n sammanfattningen och lyfter fram rätt erfarenheter.
            </p>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#444', display: 'block', marginBottom: '8px' }}>
              Beskriv uppdraget
            </label>
            <textarea
              value={roleInput}
              onChange={e => setRoleInput(e.target.value)}
              placeholder="Ex: Java-backend­utvecklare med Spring Boot till ett fintechbolag i Stockholm, 6 månader. Krav: erfarenhet av AWS, säkerhetskritiska system och Agile."
              rows={6}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '12px',
                lineHeight: 1.6,
                color: '#333',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'Arial, Helvetica, sans-serif',
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: '12px', color: '#c0392b', margin: 0 }}>{error}</p>
          )}

          <button
            onClick={() => generate()}
            disabled={loading || !roleInput.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: roleInput.trim() && !loading ? '#7A1C3F' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: roleInput.trim() && !loading ? 'pointer' : 'not-allowed',
              transition: 'background 0.2s',
            }}
          >
            {loading ? (
              <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Genererar…</>
            ) : (
              <><Sparkles size={15} /> Generera CV</>
            )}
          </button>

          {generated && (
            <div
              style={{
                background: '#f0f7f0',
                border: '1px solid #b8ddb8',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '12px',
                color: '#2d6a2d',
                lineHeight: 1.5,
              }}
            >
              ✓ CV anpassat för: <strong>{roleTitle}</strong>. Klicka på "Ladda ner PDF" för att spara.
            </div>
          )}

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
            <p style={{ fontSize: '11px', color: '#aaa', margin: 0, lineHeight: 1.6 }}>
              AI:n skriver om sammanfattningen och prioriterar relevant erfarenhet. Teknisk data och erfarenheter ändras aldrig.
            </p>
          </div>
        </div>

        {/* CV preview */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {!generated && (
            <div
              style={{
                background: 'rgba(122,28,63,0.05)',
                border: '1px dashed rgba(122,28,63,0.2)',
                borderRadius: '12px',
                padding: '20px 28px',
                marginBottom: '8px',
                fontSize: '12px',
                color: '#7A1C3F',
                maxWidth: '794px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <strong>Förhandsgranskning</strong> — CV:t visas nedan med standardinnehåll. Beskriv uppdraget till vänster och klicka "Generera CV" för ett skräddarsytt resultat.
            </div>
          )}

          {/* The actual CV — scaled for screen preview */}
          <div
            style={{
              transform: 'scale(0.85)',
              transformOrigin: 'top center',
              width: '794px',    // A4 @ 96dpi
              marginBottom: '-120px', // compensate for scale
            }}
          >
            <div ref={cvRef}>
              <CVDocument
                summary={summary}
                roleTitle={roleTitle}
                highlightedExperiences={highlightedExperiences}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spin animation */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
