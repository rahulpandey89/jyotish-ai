import React, { useState } from 'react'
import BirthForm from './components/BirthForm.jsx'
import PanditCard from './components/PanditCard.jsx'
import SummaryCard from './components/SummaryCard.jsx'
import LoadingOrb from './components/LoadingOrb.jsx'
import { consultAllStream, consultPandit, getSummary } from './api/jyotish.js'

const STEPS = { FORM: 'form', LOADING: 'loading', RESULTS: 'results' }

export default function App() {
  const [step, setStep] = useState(STEPS.FORM)
  const [birthDetails, setBirthDetails] = useState(null)
  const [pandits, setPandits] = useState([])
  const [summary, setSummary] = useState('')
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [error, setError] = useState('')

  const handleFormSubmit = (details) => {
    setBirthDetails(details)
    setPandits([])
    setSummary('')
    setError('')
    setStep(STEPS.LOADING)

    const msgs = [
      'Kundali ki ganana ho rahi hai...',
      'Panditji dhyan laga rahe hain...',
      'Graha sthiti dekhi ja rahi hai...',
      'Dasha-antar-dasha vichar chal raha hai...',
    ]
    let mi = 0
    setLoadingMsg(msgs[0])
    const interval = setInterval(() => {
      mi = (mi + 1) % msgs.length
      setLoadingMsg(msgs[mi])
    }, 2500)

    consultAllStream(
      details,
      // onPandit — stream mein ek ek aata hai
      (panditData) => {
        setPandits(prev => [...prev, panditData])
        if (pandits.length === 0) setStep(STEPS.RESULTS)
      },
      // onDone
      () => {
        clearInterval(interval)
        setStep(STEPS.RESULTS)
        // Summary auto-fetch
        setSummaryLoading(true)
        getSummary(details)
          .then(res => setSummary(res.data.summary))
          .catch(() => setSummary('Summary abhi uplabdh nahi hai.'))
          .finally(() => setSummaryLoading(false))
      },
      // onError
      (err) => {
        clearInterval(interval)
        setError('Server se connect nahi ho pa raha. Backend chal raha hai? (localhost:8000)')
        setStep(STEPS.RESULTS)
      }
    )
  }

  const handleAskPandit = async (panditId, sawaal) => {
    const res = await consultPandit(panditId, birthDetails, sawaal)
    return res.data.response
  }

  const handleReset = () => {
    setStep(STEPS.FORM)
    setPandits([])
    setSummary('')
    setError('')
    setBirthDetails(null)
  }

  return (
    <div style={styles.page}>
      {/* Hero header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <h1 style={styles.logo}>🔮 ज्योतिष AI</h1>
          <p style={styles.tagline}>Panch Vidwan Panditji — GitHub Models Sanchalit</p>
        </div>
        {step !== STEPS.FORM && (
          <button style={styles.resetBtn} onClick={handleReset}>
            ← Nayi Kundali
          </button>
        )}
      </header>

      <main style={styles.main}>
        {/* Step: Form */}
        {step === STEPS.FORM && (
          <div style={styles.formWrap} className="fade-up">
            <BirthForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {/* Step: Loading (first load before any pandit arrives) */}
        {step === STEPS.LOADING && pandits.length === 0 && (
          <LoadingOrb message={loadingMsg} />
        )}

        {/* Step: Results */}
        {(step === STEPS.RESULTS || (step === STEPS.LOADING && pandits.length > 0)) && (
          <div style={styles.results}>
            {/* User chip */}
            {birthDetails && (
              <div style={styles.userChip} className="fade-up">
                <span style={styles.userDot}>◉</span>
                <span>
                  <strong style={{color:'var(--gold)'}}>{birthDetails.naam}</strong>
                  &nbsp;·&nbsp; {birthDetails.janm_tithi}
                  &nbsp;·&nbsp; {birthDetails.janm_sthan}
                  &nbsp;·&nbsp; {birthDetails.concern}
                </span>
              </div>
            )}

            {error && (
              <div style={styles.errorBox}>
                ⚠️ &nbsp;{error}
              </div>
            )}

            {/* Progress indicator while streaming */}
            {step === STEPS.LOADING && (
              <div style={styles.progressWrap}>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width:`${(pandits.length/6)*100}%`}}/>
                </div>
                <p style={styles.progressText}>{pandits.length}/6 Panditji ne jawab diya</p>
              </div>
            )}

            {/* Pandit cards */}
            <div style={styles.cards}>
              {pandits.map((p, i) => (
                <PanditCard
                  key={p.pandit_id}
                  pandit={p}
                  onAsk={handleAskPandit}
                  style={{animationDelay:`${i*0.1}s`}}
                />
              ))}
            </div>

            {/* Summary */}
            {(summaryLoading || summary) && (
              <SummaryCard summary={summary} loading={summaryLoading} />
            )}
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>🕉️ &nbsp;Jyotish AI sirf margdarshan ke liye hai — medical/legal advice nahi hai</p>
      </footer>
    </div>
  )
}

const styles = {
  page: { minHeight:'100vh', display:'flex', flexDirection:'column', position:'relative', zIndex:1 },
  header: { borderBottom:'1px solid rgba(201,168,76,0.15)', padding:'1.2rem 2rem',
    display:'flex', alignItems:'center', justifyContent:'space-between',
    background:'rgba(7,6,15,0.7)', backdropFilter:'blur(10px)',
    position:'sticky', top:0, zIndex:100 },
  headerInner: {},
  logo: { fontFamily:'var(--font-display)', fontSize:'1.5rem', color:'var(--gold)',
    letterSpacing:'0.08em', marginBottom:'0.1rem' },
  tagline: { color:'var(--mist)', fontSize:'0.78rem', letterSpacing:'0.05em' },
  resetBtn: { background:'transparent', border:'1px solid rgba(201,168,76,0.3)',
    color:'var(--gold)', padding:'0.45rem 1rem', borderRadius:'8px',
    fontSize:'0.85rem', cursor:'pointer', fontFamily:'var(--font-display)',
    letterSpacing:'0.03em' },
  main: { flex:1, padding:'2.5rem 1.5rem', maxWidth:'720px', margin:'0 auto', width:'100%' },
  formWrap: {},
  results: {},
  userChip: { display:'flex', alignItems:'center', gap:'0.6rem',
    background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.2)',
    borderRadius:'999px', padding:'0.5rem 1.1rem', marginBottom:'1.8rem',
    fontSize:'0.88rem', color:'var(--ivory)' },
  userDot: { color:'var(--gold)', fontSize:'0.7rem' },
  errorBox: { background:'rgba(255,80,80,0.08)', border:'1px solid rgba(255,80,80,0.25)',
    color:'#ff9090', padding:'0.9rem 1.2rem', borderRadius:'10px',
    marginBottom:'1.2rem', fontSize:'0.92rem' },
  progressWrap: { marginBottom:'1.5rem' },
  progressBar: { height:'3px', background:'rgba(201,168,76,0.15)',
    borderRadius:'2px', overflow:'hidden', marginBottom:'0.5rem' },
  progressFill: { height:'100%', background:'linear-gradient(to right, var(--gold-dim), var(--gold))',
    transition:'width 0.6s ease', borderRadius:'2px' },
  progressText: { color:'var(--mist)', fontSize:'0.8rem', textAlign:'right' },
  cards: {},
  footer: { borderTop:'1px solid rgba(201,168,76,0.1)', padding:'1rem 2rem',
    textAlign:'center', color:'var(--gold-dim)', fontSize:'0.8rem',
    fontStyle:'italic', letterSpacing:'0.03em' },
}
