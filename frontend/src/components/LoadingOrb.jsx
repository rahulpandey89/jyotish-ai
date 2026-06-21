import React from 'react'

export default function LoadingOrb({ message = 'Panditji vichar kar rahe hain...' }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.orb}>
        <svg viewBox="0 0 120 120" width="110" height="110">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="1"/>
          <circle cx="60" cy="60" r="38" fill="none" stroke="rgba(201,168,76,0.2)" strokeWidth="0.8"
            strokeDasharray="6 4" style={{animation:'spin-slow 8s linear infinite'}}/>
          <circle cx="60" cy="60" r="26" fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.4)" strokeWidth="1"/>
          <text x="60" y="67" textAnchor="middle" fontSize="22" style={{filter:'drop-shadow(0 0 8px rgba(201,168,76,0.8))'}}>🔮</text>
        </svg>
      </div>
      <p style={styles.text}>{message}</p>
      <div style={styles.dots}>
        {[0,1,2].map(i=>(
          <span key={i} style={{...styles.dot, animationDelay:`${i*0.3}s`}}/>
        ))}
      </div>
    </div>
  )
}

const styles = {
  wrap: { display:'flex', flexDirection:'column', alignItems:'center', gap:'1.2rem', padding:'3rem 0' },
  orb: { filter:'drop-shadow(0 0 20px rgba(201,168,76,0.5))' },
  text: { color:'var(--mist)', fontFamily:'var(--font-display)', fontSize:'0.9rem',
    letterSpacing:'0.08em', textTransform:'uppercase' },
  dots: { display:'flex', gap:'0.5rem' },
  dot: { width:'6px', height:'6px', borderRadius:'50%', background:'var(--gold)',
    display:'inline-block', animation:'pulse-gold 1.2s ease-in-out infinite' },
}
