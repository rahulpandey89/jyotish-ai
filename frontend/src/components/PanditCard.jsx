import React, { useState } from 'react'

export default function PanditCard({ pandit, onAsk }) {
  const [expanded, setExpanded] = useState(true)
  const [sawaal, setSawaal] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reply, setReply] = useState('')

  const handleAsk = async () => {
    if (!sawaal.trim()) return
    setLoading(true)
    setReply('')
    try {
      const res = await onAsk(pandit.pandit_id, sawaal)
      setReply(res)
      setSawaal('')
      setShowInput(false)
    } catch (e) {
      setReply('Kshama karein, kuch garbad ho gayi.')
    }
    setLoading(false)
  }

  return (
    <div style={styles.card} className="fade-up">
      {/* Header */}
      <div style={styles.header} onClick={()=>setExpanded(p=>!p)}>
        <div style={styles.iconWrap}>
          <span style={styles.icon}>{pandit.icon}</span>
        </div>
        <div style={styles.info}>
          <h3 style={styles.naam}>{pandit.pandit_naam}</h3>
          <p style={styles.specialty}>{pandit.specialty}</p>
        </div>
        <span style={{...styles.chevron, transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'}}>▾</span>
      </div>

      {expanded && (
        <div style={styles.body}>
          {/* Main response */}
          {pandit.response && (
            <div style={styles.response}>
              <div style={styles.responseBar}/>
              <p style={styles.responseText}>{pandit.response}</p>
            </div>
          )}

          {/* Follow-up reply */}
          {reply && (
            <div style={{...styles.response, marginTop:'1rem', borderLeft:'2px solid var(--accent)'}}>
              <div style={{...styles.responseBar, background:'var(--accent)'}}/>
              <p style={styles.replyLabel}>Aapke sawaal ka jawab:</p>
              <p style={styles.responseText}>{reply}</p>
            </div>
          )}

          {/* Ask button + input */}
          <div style={styles.askWrap}>
            {!showInput ? (
              <button style={styles.askBtn} onClick={()=>setShowInput(true)}>
                💬 &nbsp;Isse Sawaal Poochhein
              </button>
            ) : (
              <div style={styles.inputRow}>
                <input
                  style={styles.input}
                  placeholder={`${pandit.pandit_naam} se poochhein...`}
                  value={sawaal}
                  onChange={e=>setSawaal(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&handleAsk()}
                  autoFocus
                />
                <button style={styles.sendBtn} onClick={handleAsk} disabled={loading}>
                  {loading ? '⏳' : '→'}
                </button>
                <button style={styles.cancelBtn} onClick={()=>setShowInput(false)}>✕</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  card: { background:'rgba(14,12,30,0.8)', border:'1px solid rgba(201,168,76,0.2)',
    borderRadius:'16px', overflow:'hidden', marginBottom:'1rem',
    backdropFilter:'blur(8px)', transition:'border-color 0.3s',
    boxShadow:'0 4px 24px rgba(0,0,0,0.4)' },
  header: { display:'flex', alignItems:'center', gap:'1rem', padding:'1.1rem 1.3rem',
    cursor:'pointer', userSelect:'none', ':hover':{background:'rgba(201,168,76,0.03)'} },
  iconWrap: { width:'44px', height:'44px', borderRadius:'50%',
    background:'rgba(201,168,76,0.12)', border:'1px solid rgba(201,168,76,0.3)',
    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  icon: { fontSize:'1.4rem' },
  info: { flex:1 },
  naam: { fontFamily:'var(--font-display)', fontSize:'1rem', color:'var(--gold)',
    marginBottom:'0.15rem', letterSpacing:'0.03em' },
  specialty: { color:'var(--mist)', fontSize:'0.82rem' },
  chevron: { color:'var(--gold-dim)', fontSize:'1.1rem', transition:'transform 0.3s', flexShrink:0 },
  body: { padding:'0 1.3rem 1.3rem' },
  response: { borderLeft:'2px solid rgba(201,168,76,0.4)', paddingLeft:'1rem',
    position:'relative', marginBottom:'0.5rem' },
  responseBar: { position:'absolute', left:'-2px', top:0, width:'2px', height:'100%',
    background:'linear-gradient(to bottom, var(--gold), transparent)' },
  responseText: { color:'var(--ivory)', lineHeight:'1.8', fontSize:'1rem',
    fontFamily:'var(--font-body)', whiteSpace:'pre-wrap' },
  replyLabel: { color:'var(--accent-soft)', fontSize:'0.8rem', marginBottom:'0.4rem',
    fontFamily:'var(--font-display)' },
  askWrap: { marginTop:'1rem' },
  askBtn: { background:'transparent', border:'1px solid rgba(201,168,76,0.3)',
    color:'var(--gold)', padding:'0.45rem 1rem', borderRadius:'8px',
    fontSize:'0.88rem', cursor:'pointer', fontFamily:'var(--font-body)',
    transition:'all 0.2s' },
  inputRow: { display:'flex', gap:'0.5rem' },
  input: { flex:1, background:'rgba(42,36,80,0.6)', border:'1px solid rgba(201,168,76,0.3)',
    borderRadius:'8px', padding:'0.55rem 0.9rem', color:'var(--ivory)',
    fontSize:'0.95rem', fontFamily:'var(--font-body)', outline:'none' },
  sendBtn: { background:'var(--gold)', color:'#07060f', border:'none',
    borderRadius:'8px', padding:'0.5rem 1rem', fontWeight:'bold', cursor:'pointer',
    fontSize:'1rem', transition:'opacity 0.2s' },
  cancelBtn: { background:'transparent', border:'1px solid rgba(255,255,255,0.1)',
    color:'var(--mist)', borderRadius:'8px', padding:'0.5rem 0.7rem', cursor:'pointer' },
}
