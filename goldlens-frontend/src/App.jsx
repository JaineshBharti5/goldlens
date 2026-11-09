import { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import relativeValue from './data/relativeValue.json'
import backtest from './data/backtest.json'
import termStructure from './data/termStructure.json'
import goldBars from './assets/gold-bars.jpg'
import iconLiveAnalysis from './assets/icon-live-analysis.png'
import iconTermStructure from './assets/icon-term-structure.png'
import iconBacktest from './assets/icon-backtest.png'
import logo from './assets/logo.png'

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-logo">
        <img src={logo} alt="GoldLens logo" className="nav-logo-img" />
        GoldLens
      </div>
      <div className="nav-links">
        <a href="#problem">Problem</a>
        <a href="#live">Live Analysis</a>
        <a href="#term">Term Structure</a>
        <a href="#backtest">Backtest</a>
        <a href="#team">Team</a>
      </div>
      <a className="btn btn-primary" href="https://github.com/JaineshBharti5" target="_blank" rel="noreferrer" style={{ boxShadow: '4px 4px 0 0 #000', padding: '.7rem 1.4rem' }}>
        View on GitHub
      </a>
    </nav>
  )
}

function Hero() {
  return (
    <section className="stage hero" id="hero">
      <div className="dots" />
      <div className="hero-copy">
        <div className="pill">NEW: MCX Bhavcopy Auto-Normalizer</div>
        <h1>Four contracts. One metal. Real <span className="stroke">gaps</span>.</h1>
        <p>GOLDM, GOLDTEN, GOLDGUINEA and GOLDPETAL all track the same gold — but liquidity, roll timing and purity pull their prices apart. GoldLens measures exactly how far, and whether that gap is worth trading.</p>
        <div className="hero-cta">
          <a href="#live" className="btn btn-primary">See Live Analysis</a>
          <a href="#backtest" className="btn btn-secondary">View Backtest</a>
        </div>
      </div>
      <div className="mockup">
        <div className="mockup-bar">
          <div className="mockup-dot" style={{ background: '#ff5f57' }} />
          <div className="mockup-dot" style={{ background: '#febc2e' }} />
          <div className="mockup-dot" style={{ background: '#28c840' }} />
        </div>
        <div className="mockup-body mockup-body-img">
          <img
            src={goldBars}
            alt="Stacked gold bullion bars"
            className="mockup-img"
          />
        </div>
      </div>
    </section>
  )
}

function Marquee() {
  const items = ['GOLD', 'GOLDM', 'GOLDTEN', 'GOLDGUINEA', 'GOLDPETAL', 'MCX BHAVCOPY']
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[...Array(6)].map((_, g) => (
          <div className="marquee-group" key={g} aria-hidden={g > 0}>
            {items.map((t) => <div className="marquee-item" key={t}>{t}</div>)}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProblemSolution() {
  const problems = [
    'Inconsistent date formats and expiry codes make raw Bhavcopy data unusable without cleanup.',
    'Thin liquidity and near-month roll artifacts create mispricing that looks tradeable but isn\u2019t.',
    'An apparent "edge" is often just gold\u2019s own price trend in disguise.',
    'Retail traders and quant desks still rely on manual spreadsheets.',
  ]
  const solutions = [
    'Auto-normalizes every contract to price-per-gram, 999 purity, on one common basis.',
    'Flags gaps only after filtering for liquidity and roll-window noise.',
    'Strips out gold\u2019s own beta before scoring a spread as a real signal.',
    'Backtests every signal cost-adjusted, walk-forward, and reports it honestly.',
  ]
  return (
    <section id="problem">
      <div className="kicker">THE PROBLEM</div>
      <h2>No tool watches the gaps between them</h2>
      <p className="lead">MCX's public Bhavcopy data is free, messy and scattered across four contract types. Nothing today normalizes it, tracks the spread, or tells a trader whether a mispricing is real or just noise.</p>
      <div className="compare">
        <div className="compare-card card-problem">
          <h3>Without GoldLens</h3>
          <ul>
            {problems.map((p, i) => (
              <li key={i}><span className="mark mark-x">✕</span>{p}</li>
            ))}
          </ul>
        </div>
        <div className="compare-card card-solution">
          <h3>With GoldLens</h3>
          <ul>
            {solutions.map((s, i) => (
              <li key={i}><span className="mark mark-check">✓</span>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function FeatureGrid() {
  const features = [
    { icon: iconLiveAnalysis, title: 'Live Analysis', desc: 'Normalized price per gram across all five contracts, updated per session.', href: '#live' },
    { icon: iconTermStructure, title: 'Term Structure', desc: 'Annualized carry by contract, so you know exactly what contango is costing.', href: '#term' },
    { icon: iconBacktest, title: 'Backtest', desc: 'Cost-adjusted, walk-forward results — no hindsight bias, no cherry-picking.', href: '#backtest' },
  ]
  return (
    <section className="feature-section">
      <div className="kicker">WHAT'S INSIDE</div>
      <h2>One dashboard, three views</h2>
      <div className="grid3" style={{ marginTop: '2.5rem' }}>
        {features.map((f) => (
          <a className="feature-card" href={f.href} key={f.title}>
            <div className="feature-icon"><img src={f.icon} alt="" className="feature-icon-img" /></div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

function LiveAnalysis() {
  // listed top-to-bottom, the same order the lines sit on the chart
  const symbols = ['GOLD', 'GOLDGUINEA', 'GOLDPETAL', 'GOLDM', 'GOLDTEN']
  // same colours used for the lines, legend text and hover-box text
  const colors = { GOLD: '#171e19', GOLDGUINEA: '#3f8f82', GOLDM: '#a67c52', GOLDPETAL: '#2f5d9a', GOLDTEN: '#b5524f' }
  const textColors = colors
  const tint = (name, content) => <span style={{ color: textColors[name] }}>{content}</span>
  return (
    <section id="live">
      <div className="kicker">LIVE ANALYSIS</div>
      <h2>Normalized price, per gram, 999 purity</h2>
      <p className="lead">All five gold contracts converted onto a common basis — the gaps between the lines are the mispricing GoldLens hunts for.</p>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={relativeValue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="date" stroke="#000" fontSize={12} />
            <YAxis stroke="#000" fontSize={12} domain={['auto', 'auto']} />
            <Tooltip
              content={({ active, payload, label }) =>
                active && payload && payload.length ? (
                  <div style={{ background: '#fff', border: '2px solid #000', padding: '10px 14px' }}>
                    <p style={{ margin: '0 0 6px' }}>{label}</p>
                    {payload.map((p) => (
                      <p key={p.dataKey} style={{ margin: 0, color: textColors[p.dataKey], display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden="true">
                          <line x1="0" y1="5" x2="22" y2="5" stroke={colors[p.dataKey]} strokeWidth="2" />
                          <circle cx="11" cy="5" r="3.5" fill="#fff" stroke={colors[p.dataKey]} strokeWidth="2" />
                        </svg>
                        {p.dataKey} : {p.value}
                      </p>
                    ))}
                  </div>
                ) : null
              }
            />
            <Legend formatter={(value) => tint(value, value)} />
            {symbols.map(s => (
              <Line key={s} type="monotone" dataKey={s} stroke={colors[s]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="note">Latest flag: <strong>GOLDTEN — {relativeValue[relativeValue.length - 1].GOLDTEN_flag}</strong> for five consecutive sessions.</p>

      <div className="gl-ticker">
        <div className="gl-ticker-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="gl-ticker-group" aria-hidden={i > 0}>
              <span>SEE THE SPREAD.</span><span>SPOT THE EDGE.</span><span>MEASURE THE CARRY.</span><span>DISCOVER THE VALUE.</span><span>THINK BEYOND GOLD.</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function TermStructure() {
  return (
    <section id="term">
      <div className="kicker">TERM STRUCTURE</div>
      <h2>Annualized carry by contract</h2>
      <p className="lead">Every contract sits in contango — far-month pricier than near-month — but the size of that carry differs by contract.</p>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={termStructure}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="symbol" stroke="#000" fontSize={12} />
            <YAxis stroke="#000" fontSize={12} unit="%" />
            <Tooltip contentStyle={{ background: '#fff', border: '2px solid #000' }} itemStyle={{ color: '#a67c52' }} />
            <Bar dataKey="annualizedCarryPct" fill="#ffe17c" stroke="#000" strokeWidth={2} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { color: 'var(--sage)', title: 'Pull Bhavcopy', desc: 'Daily MCX Bhavcopy data ingested for all four contracts.' },
    { color: 'var(--yellow)', title: 'Normalize', desc: 'Everything converted to price-per-gram, 999 purity, common basis.' },
    { color: 'var(--white)', title: 'Flag & Backtest', desc: 'Real gaps flagged, then tested cost-adjusted and walk-forward.' },
  ]
  return (
    <section className="dark-section">
      <div className="kicker">HOW IT WORKS</div>
      <h2>From messy data to an honest signal</h2>
      <div className="steps">
        {steps.map((s, i) => (
          <div className="step" key={s.title}>
            <div className="step-circle" style={{ '--step-color': s.color }}>{i + 1}</div>
            <h4>{s.title}</h4>
            <p>{s.desc}</p>
            <div className="step-line" />
          </div>
        ))}
      </div>
    </section>
  )
}

function Backtest() {
  return (
    <section id="backtest">
      <div className="kicker">BACKTEST — COST-ADJUSTED, WALK-FORWARD</div>
      <h2>Honest results, not hopeful ones</h2>
      <div className="stats">
        <div className="stat"><b>{backtest.totalReturnPct}%</b><span>total return</span></div>
        <div className="stat"><b>{backtest.sharpeRatio}</b><span>Sharpe ratio</span></div>
        <div className="stat"><b>{backtest.winRatePct}%</b><span>win rate</span></div>
        <div className="stat"><b>{backtest.maxDrawdownPct}%</b><span>max drawdown</span></div>
      </div>
      <div className="chart-box" style={{ marginTop: '1.5rem' }}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={backtest.cumulativeCurve}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="date" stroke="#000" fontSize={12} />
            <YAxis stroke="#000" fontSize={12} unit="%" />
            <Tooltip contentStyle={{ background: '#fff', border: '2px solid #000' }} itemStyle={{ color: '#a67c52' }} />
            <Area type="monotone" dataKey="value" stroke="#000" strokeWidth={2} fill="#ffe17c" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="note">On {backtest.tradingDays} trading days of live-collected data, the simple threshold strategy shows no edge after transaction costs — exactly the kind of result GoldLens is built to report honestly, not hide.</p>
    </section>
  )
}

function Personas() {
  const personas = [
    { cls: 'persona-sage', badge: 'RETAIL TRADER', title: 'Stop guessing the spread', desc: 'See which contract is actually mispriced today, without opening four separate charts.' },
    { cls: 'persona-yellow', badge: 'QUANT RESEARCHER', title: 'Skip the cleanup step', desc: 'Normalized, purity-adjusted data ready for your own models — no Bhavcopy wrangling.' },
    { cls: 'persona-dark', badge: 'DATA NERD', title: 'Read the backtest, not the hype', desc: 'Walk-forward, cost-adjusted results reported even when the edge disappears.' },
  ]
  return (
    <section className="persona-section">
      <div className="kicker">WHO IT'S FOR</div>
      <h2>Built for people who check their assumptions</h2>
      <div className="grid3" style={{ marginTop: '2.5rem' }}>
        {personas.map((p) => (
          <div className={`persona-card ${p.cls}`} key={p.badge}>
            <div className="persona-badge">{p.badge}</div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="dots" />
      <h2>See the gaps MCX doesn't show you</h2>
      <div className="hero-cta">
        <a href="#live" className="btn btn-primary">See Live Analysis</a>
        <a href="https://github.com/JaineshBharti5" target="_blank" rel="noreferrer" className="btn btn-secondary">View on GitHub</a>
      </div>
    </section>
  )
}

const GH_URL = 'https://github.com/JaineshBharti5'

function MarketStatus() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const day = ist.getDay()
  const mins = ist.getHours() * 60 + ist.getMinutes()
  const open = day >= 1 && day <= 5 && mins >= 540 && mins < 1410 // 9:00 - 23:30 IST
  const time = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false })
  return (
    <div className={`mkt ${open ? 'open' : 'closed'}`}>
      <span className="mkt-dot" />
      MCX {open ? 'OPEN' : 'CLOSED'} · {time} IST
    </div>
  )
}

function Footer() {
  const [copied, setCopied] = useState(false)
  const [openTeam, setOpenTeam] = useState(0)
  const team = [
    { initials: 'AK', name: 'Aman Kumar', role: 'Strategy & Backtesting', tags: ['Strategy', 'Backtesting'],
      focus: ['Designs the spread-flagging strategy', 'Runs cost-adjusted, walk-forward backtests', 'Reports results honestly, even when the edge disappears'] },
    { initials: 'RV', name: 'R Vishal Karthik', role: 'Research & Docs', tags: ['Research', 'Docs'],
      focus: ['Researches MCX gold contracts and Bhavcopy data', 'Documents the methodology and findings', 'Keeps the project explainable end to end'] },
    { initials: 'JB', name: 'Jainesh Bharti', role: 'Frontend & Backend', tags: ['Frontend', 'Backend'],
      focus: ['Builds this dashboard in React, Recharts and Vite', 'Builds the data export behind the charts', 'Ships the frontend and backend end to end'] },
  ]
  const goldlensLinks = [
    { href: '#hero', label: 'Overview', sub: 'What GoldLens does' },
    { href: '#problem', label: 'Problem', sub: 'Why the gaps exist' },
  ]
  const productLinks = [
    { href: '#live', icon: iconLiveAnalysis, label: 'Live Analysis', sub: 'Normalized price per gram' },
    { href: '#term', icon: iconTermStructure, label: 'Term Structure', sub: 'Annualized carry by contract' },
    { href: '#backtest', icon: iconBacktest, label: 'Backtest', sub: 'Cost-adjusted, walk-forward' },
  ]
  const stats = [
    { n: '999', l: 'Purity' },
    { n: '1 g', l: 'Common basis' },
    { n: 'Daily', l: 'Bhavcopy' },
  ]
  const renderLinks = (list) => list.map((l, i) => (
    <a className="ft-link" href={l.href} key={l.label}>
      <span className="ft-link-idx">{String(i + 1).padStart(2, '0')}</span>
      <span className="ft-link-text"><b>{l.label}</b><small>{l.sub}</small></span>
      <span className="ft-link-arrow">→</span>
    </a>
  ))
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(GH_URL) } catch (err) { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <footer id="team">
      <div className="ft-top">
        <h3 className="ft-tag">Four contracts. One metal. Real <em>gaps</em>.</h3>
        <div className="ft-actions">
          <a className="ft-btn" href="#live">See Live Analysis →</a>
          <a className="ft-btn ft-btn-ghost" href={GH_URL} target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </div>

      <div className="footer-grid">
        <div className="footer-col">
          <h4>GoldLens</h4>
          <div className="brand-card">
            <div className="brand-head">
              <img src={logo} alt="" className="brand-logo" />
              <div>
                <b>GoldLens</b>
                <small>Cross-contract gold intelligence</small>
              </div>
            </div>
            <p>Measures the gaps between MCX gold contracts — and whether they're worth trading.</p>
            <div className="brand-stats">
              {stats.map((x) => (
                <div key={x.l}><strong>{x.n}</strong><span>{x.l}</span></div>
              ))}
            </div>
          </div>
          {renderLinks(goldlensLinks)}
        </div>

        <div className="footer-col">
          <h4>Product</h4>
          {productLinks.map((l) => (
            <a className="prod-tile" href={l.href} key={l.label}>
              <span className="prod-icon"><img src={l.icon} alt="" /></span>
              <span className="prod-text"><b>{l.label}</b><small>{l.sub}</small></span>
              <span className="prod-arrow">↗</span>
            </a>
          ))}
        </div>

        <div className="footer-col">
          <h4>Team</h4>
          <div className="team-head">
            <div className="avatar-stack">
              {team.map((m) => <span key={m.initials}>{m.initials}</span>)}
            </div>
            <span>{team.length} builders</span>
            <span className="team-hint">Click a card</span>
          </div>
          {team.map((m, i) => {
            const open = openTeam === i
            return (
              <div className={`team-card${open ? ' open' : ''}`} key={m.name}>
                <button type="button" className="team-main" aria-expanded={open} onClick={() => setOpenTeam(open ? -1 : i)}>
                  <div className="avatar-ring"><div className="avatar">{m.initials}</div></div>
                  <div className="team-info">
                    <strong>{m.name}</strong>
                    <div className="team-role">{m.role}</div>
                    <div className="team-tags">{m.tags.map((t) => <em key={t}>{t}</em>)}</div>
                  </div>
                  <svg className="team-chevron" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                <div className="team-more">
                  <div className="team-more-inner">
                    <div className="team-more-title">Focus areas</div>
                    <ul>
                      {m.focus.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="ft-word" aria-label="GoldLens">
        {'GOLDLENS'.split('').map((ch, i) => <span key={i} style={{ '--i': i }}>{ch}</span>)}
      </div>

      <div className="footer-bottom">
        <div className="fb-left">
          <MarketStatus />
        </div>
        <div className="social">
          <a href={GH_URL} target="_blank" rel="noreferrer" title="Open GitHub" aria-label="GitHub">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>
          <button type="button" onClick={copyLink} title="Copy GitHub link" aria-label="Copy GitHub link">
            {copied ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg>
            )}
          </button>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="Back to top" aria-label="Back to top">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></svg>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <ProblemSolution />
      <FeatureGrid />
      <LiveAnalysis />
      <TermStructure />
      <HowItWorks />
      <Backtest />
      <Personas />
      <FinalCTA />
      <Footer />
    </>
  )
}