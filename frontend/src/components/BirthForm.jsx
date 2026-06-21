import React, { useState } from 'react'

const CONCERNS = [
  'Sampoorn Kundali',
  'Career aur Vyapar',
  'Prem aur Vivah',
  'Swasthya aur Arogya',
  'Dhan aur Sampatti',
  'Parivaar aur Santaan',
]

const RASHI_MAP = [
  [1,20,'Makara'],[2,19,'Kumbha'],[3,20,'Meena'],[4,20,'Mesha'],
  [5,21,'Vrishabha'],[6,21,'Mithuna'],[7,22,'Karka'],[8,23,'Simha'],
  [9,23,'Kanya'],[10,23,'Tula'],[11,22,'Vrishchika'],[12,21,'Dhanu'],[12,31,'Makara'],
]
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function getRashi(m, d) {
  for (const [rm, rd, r] of RASHI_MAP) if (m < rm || (m === rm && d <= rd)) return r
  return 'Makara'
}

export default function BirthForm({ onSubmit }) {
  const [form, setForm] = useState({
    naam: '', ling: 'Purush',
    day: '', month: '', year: '',
    hour: '', minute: '',
    janm_sthan: '', current_city: '',
    concern: 'Sampoorn Kundali',
  })
  const [error, setError] = useState('')

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = () => {
    if (!form.naam || !form.day || !form.month || !form.year || !form.janm_sthan) {
      setError('Naam, janm tithi aur janm sthan zaruri hai!')
      return
    }
    const d = parseInt(form.day), m = parseInt(form.month), y = parseInt(form.year)
    if (isNaN(d)||isNaN(m)||isNaN(y)||d<1||d>31||m<1||m>12||y<1900||y>2010) {
      setError('Janm tithi sahi format mein daalein')
      return
    }
    const dob = new Date(y, m - 1, d)
    const today = new Date()
    const age = today.getFullYear() - y - ((today.getMonth()+1 < m || (today.getMonth()+1 === m && today.getDate() < d)) ? 1 : 0)
    const h = parseInt(form.hour) || 12, min = parseInt(form.minute) || 0

    setError('')
    onSubmit({
      naam: form.naam,
      ling: form.ling,
      janm_tithi: `${d} ${MONTHS[m-1]} ${y}`,
      janm_din: DAYS[dob.getDay()],
      janm_samay: `${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`,
      janm_sthan: form.janm_sthan,
      current_city: form.current_city || form.janm_sthan,
      umar: age,
      concern: form.concern,
      janm_varsh: y,
      janm_maah: m,
      janm_din_sankhya: d,
    })
  }

  return (
    <div style={styles.card}>
      {/* Sacred geometry header */}
      <div style={styles.mandalaWrap}>
        <svg viewBox="0 0 120 120" width="100" height="100" style={styles.mandala}>
          <circle cx="60" cy="60" r="55" fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.5"/>
          <circle cx="60" cy="60" r="40" fill="none" stroke="#c9a84c" strokeWidth="0.5" opacity="0.4"/>
          {[0,45,90,135].map(a=>(
            <line key={a} x1="60" y1="5" x2="60" y2="115"
              stroke="#c9a84c" strokeWidth="0.4" opacity="0.3"
              transform={`rotate(${a} 60 60)`}/>
          ))}
          <circle cx="60" cy="60" r="8" fill="#c9a84c" opacity="0.8"/>
          <text x="60" y="64" textAnchor="middle" fontSize="10" fill="#07060f">🔮</text>
        </svg>
      </div>

      <h2 style={styles.title}>Janma Patrika</h2>
      <p style={styles.subtitle}>Apni janm ki jankari bharen — Panditji kundali padh karenge</p>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        <div style={styles.field}>
          <label style={styles.label}>आपका नाम *</label>
          <input style={styles.input} placeholder="Poora naam likhein" value={form.naam} onChange={e=>set('naam',e.target.value)}/>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>लिंग *</label>
          <select style={styles.input} value={form.ling} onChange={e=>set('ling',e.target.value)}>
            <option>Purush</option><option>Mahila</option><option>Anya</option>
          </select>
        </div>

        <div style={{...styles.field, gridColumn:'1/-1'}}>
          <label style={styles.label}>जन्म तिथि *</label>
          <div style={styles.row}>
            <input style={{...styles.input,width:'70px'}} placeholder="DD" maxLength={2} value={form.day} onChange={e=>set('day',e.target.value.replace(/\D/,''))}/>
            <select style={{...styles.input,flex:1}} value={form.month} onChange={e=>set('month',e.target.value)}>
              <option value="">Month</option>
              {MONTHS.map((mo,i)=><option key={mo} value={i+1}>{mo}</option>)}
            </select>
            <input style={{...styles.input,width:'90px'}} placeholder="YYYY" maxLength={4} value={form.year} onChange={e=>set('year',e.target.value.replace(/\D/,''))}/>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>जन्म समय (HH:MM)</label>
          <div style={styles.row}>
            <input style={{...styles.input,width:'70px'}} placeholder="HH" maxLength={2} value={form.hour} onChange={e=>set('hour',e.target.value.replace(/\D/,''))}/>
            <span style={{color:'var(--gold)',fontSize:'1.4rem',padding:'0 4px'}}>:</span>
            <input style={{...styles.input,width:'70px'}} placeholder="MM" maxLength={2} value={form.minute} onChange={e=>set('minute',e.target.value.replace(/\D/,''))}/>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>जन्म स्थान *</label>
          <input style={styles.input} placeholder="Shehar / Gaon" value={form.janm_sthan} onChange={e=>set('janm_sthan',e.target.value)}/>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>वर्तमान निवास</label>
          <input style={styles.input} placeholder="Abhi kahan rehte hain" value={form.current_city} onChange={e=>set('current_city',e.target.value)}/>
        </div>

        <div style={{...styles.field, gridColumn:'1/-1'}}>
          <label style={styles.label}>मुख्य विषय</label>
          <div style={styles.chips}>
            {CONCERNS.map(c=>(
              <button key={c} style={{...styles.chip, ...(form.concern===c ? styles.chipActive : {})}}
                onClick={()=>set('concern',c)}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <button style={styles.btn} onClick={handleSubmit}>
        🕉️ &nbsp; Panditji Ko Bulaayein
      </button>
    </div>
  )
}

const styles = {
  card: { background:'rgba(14,12,30,0.85)', border:'1px solid rgba(201,168,76,0.25)',
    borderRadius:'20px', padding:'2.5rem 2rem', maxWidth:'580px', margin:'0 auto',
    backdropFilter:'blur(12px)', position:'relative', zIndex:1 },
  mandalaWrap: { display:'flex', justifyContent:'center', marginBottom:'1rem' },
  mandala: { animation:'spin-slow 30s linear infinite', filter:'drop-shadow(0 0 10px rgba(201,168,76,0.4))' },
  title: { fontFamily:'var(--font-display)', fontSize:'1.8rem', color:'var(--gold)',
    textAlign:'center', letterSpacing:'0.08em', marginBottom:'0.4rem' },
  subtitle: { textAlign:'center', color:'var(--mist)', fontSize:'0.95rem', marginBottom:'1.8rem' },
  error: { background:'rgba(255,80,80,0.1)', border:'1px solid rgba(255,80,80,0.3)',
    color:'#ff8080', padding:'0.7rem 1rem', borderRadius:'8px', marginBottom:'1rem', fontSize:'0.9rem' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.2rem', marginBottom:'1.8rem' },
  field: { display:'flex', flexDirection:'column', gap:'0.4rem' },
  label: { color:'var(--gold-light)', fontSize:'0.82rem', letterSpacing:'0.05em', fontFamily:'var(--font-display)' },
  input: { background:'rgba(42,36,80,0.6)', border:'1px solid rgba(201,168,76,0.2)',
    borderRadius:'8px', padding:'0.6rem 0.9rem', color:'var(--ivory)',
    fontSize:'1rem', fontFamily:'var(--font-body)', outline:'none',
    transition:'border-color 0.2s',
    ':focus':{borderColor:'var(--gold)'} },
  row: { display:'flex', gap:'0.5rem', alignItems:'center' },
  chips: { display:'flex', flexWrap:'wrap', gap:'0.5rem' },
  chip: { background:'rgba(42,36,80,0.5)', border:'1px solid rgba(201,168,76,0.2)',
    color:'var(--mist)', padding:'0.35rem 0.8rem', borderRadius:'999px',
    fontSize:'0.82rem', cursor:'pointer', transition:'all 0.2s', fontFamily:'var(--font-body)' },
  chipActive: { background:'rgba(201,168,76,0.15)', border:'1px solid var(--gold)',
    color:'var(--gold)' },
  btn: { width:'100%', background:'linear-gradient(135deg, #c9a84c, #7a6330)',
    color:'#07060f', border:'none', borderRadius:'10px', padding:'0.9rem',
    fontSize:'1.05rem', fontFamily:'var(--font-display)', fontWeight:'600',
    letterSpacing:'0.05em', cursor:'pointer', transition:'all 0.2s',
    boxShadow:'0 4px 20px rgba(201,168,76,0.3)' },
}
