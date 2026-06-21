import React from 'react'

export default function SummaryCard({ summary, loading }) {
  return (
    <div style={styles.card} className="fade-up">
      <div style={styles.header}>
        <span style={styles.icon}>🌟</span>
        <div>
          <h3 style={styles.title}>Pandit Samiti Ka Samyukt Nirnay</h3>
          <p style={styles.sub}>Sabhi Panditji ka milaa hua gyaan</p>
        </div>
      </div>
      <div style={styles.divider}/>
      {loading ? (
        <div style={styles.loadWrap}>
          <div style={styles.spinner}/>
          <p style={styles.loadText}>Pandit Samiti vichar-vimarsh kar rahi hai...</p>
        </div>
      ) : (
        <p style={styles.text}>{summary}</p>
      )}
    </div>
  )
}

const styles = {
  card: { background:'linear-gradient(135deg, rgba(26,22,53,0.9), rgba(42,36,80,0.6))',
    border:'1px solid rgba(201,168,76,0.4)', borderRadius:'16px', padding:'1.8rem',
    boxShadow:'0 8px 40px rgba(201,168,76,0.15)', marginTop:'2rem' },
  header: { display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' },
  icon: { fontSize:'2rem', filter:'drop-shadow(0 0 12px rgba(201,168,76,0.8))' },
  title: { fontFamily:'var(--font-display)', color:'var(--gold)', fontSize:'1.1rem', letterSpacing:'0.05em' },
  sub: { color:'var(--mist)', fontSize:'0.82rem', marginTop:'0.2rem' },
  divider: { height:'1px', background:'linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)', marginBottom:'1.2rem' },
  loadWrap: { display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem', padding:'1rem 0' },
  spinner: { width:'36px', height:'36px', border:'3px solid rgba(201,168,76,0.2)',
    borderTop:'3px solid var(--gold)', borderRadius:'50%', animation:'spin-slow 1s linear infinite' },
  loadText: { color:'var(--mist)', fontSize:'0.9rem', fontStyle:'italic' },
  text: { color:'var(--ivory)', lineHeight:'1.9', whiteSpace:'pre-wrap', fontFamily:'var(--font-body)', fontSize:'1.02rem' },
}
