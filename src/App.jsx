import { useState, useEffect, useRef } from "react";

// ─── NAVIGATION DATA ────────────────────────────────────────────────────────
const SECTIONS = [
  { part: 1, id: "p1-u0", label: "FOUNDATIONS", title: "The Architecture of a Joke", sub: "What comedy actually is" },
  { part: 1, id: "p1-u1", label: "UNIT I", title: "The Art of the Roast", sub: "Destroy people out of love" },
  { part: 1, id: "p1-u2", label: "UNIT II", title: "Stand-Up & Entertainment", sub: "Voice, bits, and writers' rooms" },
  { part: 1, id: "p1-u3", label: "UNIT III", title: "Cinematic & Script Comedy", sub: "Jokes that live in characters" },
  { part: 1, id: "p1-u4", label: "UNIT IV", title: "Advanced Techniques", sub: "The dangerous moves" },
  { part: 2, id: "p2-ch1", label: "CHAPTER I", title: "What Can Get You Sued", sub: "Know the charges first" },
  { part: 2, id: "p2-ch2", label: "CHAPTER II", title: "Legal Notice Received", sub: "Step-by-step survival" },
  { part: 2, id: "p2-ch3", label: "CHAPTER III", title: "Fake Copyright Strikes", sub: "Fight back and win" },
  { part: 2, id: "p2-ch4", label: "CHAPTER IV", title: "Public vs Private Figures", sub: "The line that changes everything" },
  { part: 2, id: "p2-ch5", label: "CHAPTER V", title: "Dos & Don'ts", sub: "The creator's legal code" },
  { part: 2, id: "p2-ch6", label: "CHAPTER VI", title: "The Disclaimer", sub: "One line that protects you" },
];

// ─── SHARED COMPONENTS ──────────────────────────────────────────────────────
const Seal = () => (
  <svg width="84" height="84" viewBox="0 0 90 90" fill="none">
    <circle cx="45" cy="45" r="42" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="4 2"/>
    <circle cx="45" cy="45" r="36" stroke="#8B5CF6" strokeWidth="0.5"/>
    <text x="45" y="37" textAnchor="middle" fontSize="17" fill="#8B5CF6" fontFamily="sans-serif">🎭</text>
    <text x="45" y="51" textAnchor="middle" fontSize="6" fill="#8B5CF6" fontFamily="sans-serif" letterSpacing="2">COMEDY</text>
    <text x="45" y="60" textAnchor="middle" fontSize="6" fill="#8B5CF6" fontFamily="sans-serif" letterSpacing="2">& LAW</text>
  </svg>
);

const P = ({ children }) => (
  <p style={{ fontSize: "clamp(0.92rem,2.5vw,0.98rem)", color: "#A8B2C1", lineHeight: 1.78, margin: "0.65rem 0", fontFamily: "'Inter',sans-serif" }}>{children}</p>
);
const H2 = ({ children, accent }) => (
  <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "clamp(1.15rem,3.5vw,1.4rem)", color: "#F5F7FB", margin: "2rem 0 0.55rem", lineHeight: 1.2, borderBottom: `1px solid ${accent||"rgba(245,247,251,0.1)"}`, paddingBottom: "0.45rem" }}>{children}</h2>
);
const H3 = ({ children, accent }) => (
  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: "0.98rem", color: accent||"#8B5CF6", margin: "1.4rem 0 0.35rem", letterSpacing: "0.01em" }}>{children}</h3>
);
const B = ({ children }) => <strong style={{ color: "#F5F7FB", fontWeight: 600 }}>{children}</strong>;
const Em = ({ children }) => <em style={{ color: "#8B5CF6", fontStyle: "italic" }}>{children}</em>;


const Reveal = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Divider = ({ accent }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "2rem 0" }}>
    <div style={{ flex: 1, height: "1px", background: "rgba(245,247,251,0.07)" }} />
    <span style={{ color: accent||"#8B5CF6", fontSize: "0.75rem", opacity: 0.5 }}>§</span>
    <div style={{ flex: 1, height: "1px", background: "rgba(245,247,251,0.07)" }} />
  </div>
);

const Rule = ({ icon, label, children }) => (
  <div className="content-row reveal-soft" style={{ display: "flex", gap: "0.7rem", margin: "0.6rem 0", alignItems: "flex-start" }}>
    <span style={{ fontSize: "0.9rem", flexShrink: 0, marginTop: "2px" }}>{icon}</span>
    <div style={{ fontSize: "0.89rem", color: "#A8B2C1", lineHeight: 1.65, fontFamily: "'Inter',sans-serif" }}>
      {label && <strong style={{ color: "#F5F7FB" }}>{label} — </strong>}
      {children}
    </div>
  </div>
);

const Step = ({ num, title, children }) => (
  <div style={{ display: "flex", gap: "0.9rem", margin: "1.1rem 0" }}>
    <div style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1px solid #8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'Space Grotesk',sans-serif", color: "#8B5CF6", fontSize: "0.82rem", fontWeight: 700, marginTop: "2px" }}>{num}</div>
    <div>
      {title && <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#F5F7FB", marginBottom: "0.25rem", fontFamily: "'Space Grotesk',sans-serif" }}>{title}</div>}
      <div style={{ fontSize: "0.89rem", color: "#A8B2C1", lineHeight: 1.65, fontFamily: "'Inter',sans-serif" }}>{children}</div>
    </div>
  </div>
);

const LawRef = ({ children }) => (
  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.76rem", color: "#8B5CF6", background: "rgba(139,92,246,0.1)", padding: "1px 5px", borderRadius: "3px", whiteSpace: "nowrap" }}>{children}</span>
);

const Warning = ({ children }) => (
  <div className="glass-card danger-card" style={{ background: "rgba(251,113,133,0.07)", border: "1px solid rgba(251,113,133,0.3)", borderLeft: "3px solid #FB7185", borderRadius: "4px", padding: "0.9rem 1.1rem", margin: "1.3rem 0" }}>
    <div style={{ fontSize: "0.6rem", fontFamily: "'JetBrains Mono',monospace", color: "#FB7185", letterSpacing: "0.1em", marginBottom: "0.35rem", fontWeight: 700 }}>⚠ CAUTION</div>
    <div style={{ fontSize: "0.89rem", color: "#CBD5E1", lineHeight: 1.65, fontFamily: "'Inter',sans-serif" }}>{children}</div>
  </div>
);

const Defense = ({ children }) => (
  <div className="glass-card accent-card" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.22)", borderLeft: "3px solid #8B5CF6", borderRadius: "4px", padding: "0.9rem 1.1rem", margin: "1.3rem 0" }}>
    <div style={{ fontSize: "0.6rem", fontFamily: "'JetBrains Mono',monospace", color: "#8B5CF6", letterSpacing: "0.1em", marginBottom: "0.35rem", fontWeight: 700 }}>✓ YOUR DEFENSE</div>
    <div style={{ fontSize: "0.89rem", color: "#CBD5E1", lineHeight: 1.65, fontFamily: "'Inter',sans-serif" }}>{children}</div>
  </div>
);

const Verdict = ({ children }) => (
  <div className="glass-card verdict-card" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(245,247,251,0.1)", borderRadius: "6px", padding: "1rem 1.2rem", margin: "1.5rem 0" }}>
    <div style={{ fontSize: "0.6rem", fontFamily: "'JetBrains Mono',monospace", color: "#555", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>§ VERDICT</div>
    <div style={{ fontSize: "0.93rem", color: "#F5F7FB", lineHeight: 1.72, fontStyle: "italic", fontFamily: "'Inter',sans-serif" }}>{children}</div>
  </div>
);

// ─── COMEDY-SPECIFIC COMPONENTS ─────────────────────────────────────────────
const Formula = ({ children }) => (
  <div className="glass-card formula-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,247,251,0.08)", borderRadius: "6px", padding: "0.9rem 1.1rem", margin: "1.2rem 0", textAlign: "center" }}>
    <div style={{ fontSize: "0.6rem", fontFamily: "'JetBrains Mono',monospace", color: "#666", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>THE FORMULA</div>
    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "clamp(0.72rem,2vw,0.82rem)", color: "#8B5CF6", lineHeight: 1.7 }}>{children}</div>
  </div>
);

const Exercise = ({ label, children }) => (
  <div className="glass-card exercise-card" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.2)", borderLeft: "3px solid #22D3EE", borderRadius: "4px", padding: "0.9rem 1.1rem", margin: "1.4rem 0" }}>
    <div style={{ fontSize: "0.6rem", fontFamily: "'JetBrains Mono',monospace", color: "#22D3EE", letterSpacing: "0.1em", marginBottom: "0.35rem", fontWeight: 700 }}>✏ {label||"EXERCISE"}</div>
    <div style={{ fontSize: "0.89rem", color: "#A8B2C1", lineHeight: 1.65, fontFamily: "'Inter',sans-serif" }}>{children}</div>
  </div>
);

const KeyNote = ({ children }) => (
  <div className="glass-card accent-card" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.18)", borderRadius: "6px", padding: "0.9rem 1.1rem", margin: "1.3rem 0" }}>
    <div style={{ fontSize: "0.6rem", fontFamily: "'JetBrains Mono',monospace", color: "#8B5CF6", letterSpacing: "0.1em", marginBottom: "0.35rem" }}>★ KEY CONCEPT</div>
    <div style={{ fontSize: "0.92rem", color: "#F5F7FB", lineHeight: 1.7, fontStyle: "italic", fontFamily: "'Inter',sans-serif" }}>{children}</div>
  </div>
);

const Persona = ({ emoji, name, desc, examples }) => (
  <div style={{ borderLeft: "2px solid rgba(139,92,246,0.25)", paddingLeft: "1rem", margin: "0.9rem 0" }}>
    <div style={{ fontSize: "0.88rem", color: "#F5F7FB", fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif", marginBottom: "0.2rem" }}>{emoji} {name}</div>
    <div style={{ fontSize: "0.85rem", color: "#A8B2C1", lineHeight: 1.6, fontFamily: "'Inter',sans-serif" }}>{desc}</div>
    {examples && <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.25rem", fontFamily: "'JetBrains Mono',monospace" }}>e.g. {examples}</div>}
  </div>
);

const TableComp = ({ headers, rows }) => (
  <div style={{ overflowX: "auto", margin: "1.1rem 0", WebkitOverflowScrolling: "touch" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", fontFamily: "'Inter',sans-serif", minWidth: "320px" }}>
      <thead>
        <tr>{headers.map((h,i) => <th key={i} style={{ textAlign:"left", padding:"0.55rem 0.75rem", background:"rgba(139,92,246,0.09)", color:"#8B5CF6", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.08em", fontWeight:700, borderBottom:"1px solid rgba(139,92,246,0.18)", whiteSpace:"nowrap" }}>{h}</th>)}</tr>
      </thead>
      <tbody>{rows.map((row,i) => <tr key={i} style={{ borderBottom:"1px solid rgba(245,247,251,0.05)" }}>{row.map((cell,j) => <td key={j} style={{ padding:"0.55rem 0.75rem", color: j===0?"#F5F7FB":"#A8B2C1", lineHeight:1.5, verticalAlign:"top" }}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
);

const SectionRef = ({ id, label, number, title, sub, accent, children, innerRef }) => (
  <div ref={innerRef} id={id} className="section-reveal" style={{ scrollMarginTop: "72px" }}>
    <div style={{ padding: "2.8rem 0 0.5rem", borderTop: "1px solid rgba(245,247,251,0.05)", marginTop: "1.5rem" }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.58rem", color: accent||"#FB7185", letterSpacing: "0.16em", marginBottom: "0.35rem" }}>{label}</div>
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "clamp(1.5rem,5.5vw,2.1rem)", color: "#F5F7FB", lineHeight: 1.12, marginBottom: "0.35rem", letterSpacing: "-0.01em" }}>{title}</h1>
      <p style={{ fontSize: "0.83rem", color: "#555", fontStyle: "italic", fontFamily: "'Inter',sans-serif" }}>{sub}</p>
    </div>
    <Divider accent={accent} />
    {children}
  </div>
);

// ─── MAIN BOOK ───────────────────────────────────────────────────────────────
export default function CompleteRoastBook() {
  const [tocOpen, setTocOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const refs = useRef({});
  const scrollEl = useRef(null);

  useEffect(() => {
    const el = scrollEl.current;
    if (!el) return;
    const onScroll = () => {
      setScrolled(el.scrollTop > 70);
      const hits = SECTIONS.map(s => {
        const r = refs.current[s.id];
        return r ? { id: s.id, top: r.getBoundingClientRect().top } : null;
      }).filter(Boolean).filter(o => o.top < 140);
      if (hits.length) setActiveId(hits[hits.length - 1].id);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTocOpen(false);
  };

  const active = SECTIONS.find(s => s.id === activeId);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll(".hero-cover, .section-reveal").forEach((node) => {
        if (node.classList.contains("hero-cover")) node.classList.add("is-visible");
      });
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ background: "#070A0F", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter',sans-serif", overflowX: "hidden" }}>
      <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');

  :root{
    --bg:#070A0F;
    --surface:rgba(15,20,31,.72);
    --surface-strong:#0B1018;
    --text:#F5F7FB;
    --muted:#A8B2C1;
    --dim:#64748B;
    --violet:#8B5CF6;
    --cyan:#22D3EE;
    --pink:#FB7185;
    --line:rgba(148,163,184,.13);
    --shadow:0 24px 80px rgba(0,0,0,.35);
  }

  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font-family:Inter,system-ui,sans-sans-serif}
  button{font:inherit}
  ::selection{background:rgba(139,92,246,.32);color:#fff}

  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:#070A0F}
  ::-webkit-scrollbar-thumb{
    background:linear-gradient(180deg,var(--violet),var(--cyan));
    border-radius:999px
  }

  .app-shell{position:relative;isolation:isolate}
  .app-shell > *{position:relative;z-index:1}
  .ambient{
    position:fixed;
    width:420px;height:420px;
    border-radius:50%;
    filter:blur(90px);
    opacity:.12;
    pointer-events:none;
    z-index:0!important;
    animation:ambientFloat 12s ease-in-out infinite alternate;
  }
  .ambient-one{background:var(--violet);top:-180px;left:-160px}
  .ambient-two{background:var(--cyan);right:-180px;top:34%;animation-delay:-4s}
  .ambient-three{background:var(--pink);left:12%;bottom:-240px;opacity:.07;animation-delay:-8s}

  .top-progress{
    position:fixed;
    left:0;top:0;width:100%;height:2px;
    transform-origin:left center;
    background:linear-gradient(90deg,var(--violet),var(--cyan),var(--pink));
    box-shadow:0 0 18px rgba(139,92,246,.8);
    z-index:999!important;
    pointer-events:none;
  }

  .reveal,.section-reveal{
    opacity:0;
    transform:translateY(20px);
    transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1);
    transition-delay:var(--reveal-delay,0ms);
  }
  .reveal.is-visible,.section-reveal.is-visible{
    opacity:1;
    transform:none;
  }
  .reveal-soft{
    transition:transform .35s ease,opacity .35s ease,background .25s ease;
  }

  .hero-cover{
    position:relative;
    overflow:hidden;
    border-radius:28px;
    margin-top:18px;
    background:
      radial-gradient(circle at 50% 10%,rgba(139,92,246,.16),transparent 38%),
      radial-gradient(circle at 80% 60%,rgba(34,211,238,.08),transparent 32%),
      linear-gradient(180deg,rgba(255,255,255,.025),transparent 65%);
    box-shadow:inset 0 1px 0 rgba(255,255,255,.05),var(--shadow);
  }
  .hero-cover::before{
    content:"";
    position:absolute;
    inset:-2px;
    border-radius:30px;
    padding:1px;
    background:linear-gradient(135deg,rgba(139,92,246,.5),transparent 35%,rgba(34,211,238,.35),transparent 75%,rgba(251,113,133,.3));
    -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
    -webkit-mask-composite:xor;
    mask-composite:exclude;
    pointer-events:none;
  }
  .hero-cover h1{
    text-shadow:0 0 50px rgba(139,92,246,.16);
  }

  .glass-card{
    backdrop-filter:blur(16px);
    -webkit-backdrop-filter:blur(16px);
    box-shadow:0 12px 35px rgba(0,0,0,.16);
    transition:transform .3s ease,border-color .3s ease,box-shadow .3s ease;
  }
  .glass-card:hover{
    transform:translateY(-2px);
    box-shadow:0 18px 45px rgba(0,0,0,.24),0 0 28px rgba(139,92,246,.07);
  }

  .formula-card{
    position:relative;
    overflow:hidden;
  }
  .formula-card::after{
    content:"";
    position:absolute;
    width:120px;height:120px;
    border-radius:50%;
    right:-55px;top:-55px;
    background:rgba(139,92,246,.12);
    filter:blur(18px);
  }

  .exercise-card{box-shadow:0 0 30px rgba(34,211,238,.04)}
  .danger-card{box-shadow:0 0 30px rgba(251,113,133,.04)}
  .verdict-card{box-shadow:0 0 30px rgba(139,92,246,.04)}

  .toc-row{
    transition:background .2s ease,transform .2s ease,padding-left .2s ease;
  }
  .toc-row:hover{
    background:rgba(139,92,246,.08)!important;
    transform:translateX(3px);
  }

  .nav-btn{
    transition:transform .2s ease,background .2s ease,box-shadow .2s ease,opacity .2s ease;
  }
  .nav-btn:hover{
    opacity:1!important;
    transform:translateY(-1px);
    box-shadow:0 0 20px rgba(139,92,246,.15);
  }
  .nav-btn:active{transform:translateY(0) scale(.97)}

  @keyframes ambientFloat{
    from{transform:translate3d(-8px,-10px,0) scale(1)}
    to{transform:translate3d(18px,16px,0) scale(1.08)}
  }

  @media (prefers-reduced-motion:reduce){
    *,*::before,*::after{
      animation-duration:.01ms!important;
      animation-iteration-count:1!important;
      transition-duration:.01ms!important;
      scroll-behavior:auto!important
    }
    .reveal,.section-reveal{opacity:1;transform:none}
  }

  @media (max-width:720px){
    .ambient{width:260px;height:260px;filter:blur(70px);opacity:.09}
    .hero-cover{border-radius:20px;margin-top:10px}
  }
`}</style>

      {/* ── Sticky Header ── */}
      <div style={{ position:"sticky", top:0, zIndex:200, background: scrolled?"rgba(13,17,23,0.96)":"#070A0F", borderBottom: scrolled?"1px solid rgba(245,247,251,0.06)":"none", backdropFilter:"blur(10px)", padding:"0.55rem 1rem", display:"flex", alignItems:"center", justifyContent:"space-between", transition:"all 0.2s", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.55rem", minWidth:0 }}>
          <span style={{ color:"#8B5CF6", fontSize:"0.85rem", flexShrink:0 }}>🎭</span>
          <div style={{ minWidth:0 }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"0.78rem", color:"#F5F7FB", fontWeight:700, lineHeight:1, whiteSpace:"nowrap" }}>The Complete Roast Handbook</div>
            {active && scrolled && <div style={{ fontSize:"0.58rem", color:"#555", fontFamily:"'JetBrains Mono',monospace", marginTop:"2px", letterSpacing:"0.05em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{active.label} · {active.title.toUpperCase()}</div>}
          </div>
        </div>
        <button className="nav-btn" onClick={() => setTocOpen(!tocOpen)} style={{ background: tocOpen?"rgba(139,92,246,0.12)":"transparent", border:"1px solid rgba(139,92,246,0.22)", borderRadius:"5px", color:"#8B5CF6", padding:"0.3rem 0.65rem", fontSize:"0.68rem", fontFamily:"'JetBrains Mono',monospace", cursor:"pointer", flexShrink:0, letterSpacing:"0.04em" }}>
          {tocOpen ? "✕" : "≡ CONTENTS"}
        </button>
      </div>

      {/* ── TOC Overlay ── */}
      {tocOpen && (
        <div style={{ position:"sticky", top:"42px", zIndex:199, background:"#0B1018", borderBottom:"1px solid rgba(245,247,251,0.05)", maxHeight:"70vh", overflowY:"auto" }}>
          {/* Part I Header */}
          <div style={{ padding:"0.65rem 1rem 0.25rem", borderBottom:"1px solid rgba(245,247,251,0.04)" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.58rem", color:"#22D3EE", letterSpacing:"0.14em" }}>PART I</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"0.85rem", color:"#888", fontWeight:600 }}>Comedy Craft</div>
          </div>
          {SECTIONS.filter(s => s.part===1).map(s => (
            <div key={s.id} className="toc-row" onClick={() => scrollTo(s.id)} style={{ padding:"0.5rem 1rem 0.5rem 1.4rem", display:"flex", gap:"0.75rem", alignItems:"center", background: activeId===s.id?"rgba(34,211,238,0.05)":"transparent" }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.58rem", color:"#22D3EE", width:"68px", flexShrink:0 }}>{s.label}</span>
              <div>
                <div style={{ fontSize:"0.8rem", color: activeId===s.id?"#22D3EE":"#F5F7FB", fontFamily:"'Space Grotesk',sans-serif", lineHeight:1.2 }}>{s.title}</div>
                <div style={{ fontSize:"0.6rem", color:"#444", marginTop:"1px" }}>{s.sub}</div>
              </div>
            </div>
          ))}
          {/* Part II Header */}
          <div style={{ padding:"0.65rem 1rem 0.25rem", borderTop:"1px solid rgba(245,247,251,0.06)", borderBottom:"1px solid rgba(245,247,251,0.04)", marginTop:"0.25rem" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.58rem", color:"#FB7185", letterSpacing:"0.14em" }}>PART II</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"0.85rem", color:"#888", fontWeight:600 }}>The Roast & The Law</div>
          </div>
          {SECTIONS.filter(s => s.part===2).map(s => (
            <div key={s.id} className="toc-row" onClick={() => scrollTo(s.id)} style={{ padding:"0.5rem 1rem 0.5rem 1.4rem", display:"flex", gap:"0.75rem", alignItems:"center", background: activeId===s.id?"rgba(251,113,133,0.06)":"transparent" }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.58rem", color:"#FB7185", width:"68px", flexShrink:0 }}>{s.label}</span>
              <div>
                <div style={{ fontSize:"0.8rem", color: activeId===s.id?"#8B5CF6":"#F5F7FB", fontFamily:"'Space Grotesk',sans-serif", lineHeight:1.2 }}>{s.title}</div>
                <div style={{ fontSize:"0.6rem", color:"#444", marginTop:"1px" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Book Body ── */}
      <div ref={scrollEl} style={{ flex:1, overflowY:"auto", overflowX:"hidden" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 1.1rem 5rem" }}>

          {/* ════ COVER ════ */}
          <div className="hero-cover is-visible" style={{ textAlign:"center", padding:"clamp(4rem,10vw,7rem) 0 3.5rem", borderBottom:"1px solid rgba(245,247,251,0.06)" }}>
            <Seal />
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.6rem", color:"#555", letterSpacing:"0.2em", margin:"1.4rem 0 0.7rem", textTransform:"uppercase" }}>The Complete Creator's Reference</div>
            <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:"clamp(2rem,8.5vw,3.2rem)", color:"#F5F7FB", lineHeight:1.08, letterSpacing:"-0.02em", marginBottom:"0.5rem" }}>
              Comedy Craft<br/><em style={{ color:"#8B5CF6" }}>&</em> Creator Law
            </h1>
            <p style={{ fontSize:"clamp(0.92rem,2.8vw,1.05rem)", color:"#555", fontFamily:"'Inter',sans-serif", fontStyle:"italic", maxWidth:"300px", margin:"0 auto 1.8rem", lineHeight:1.6 }}>
              From writing your first roast to surviving your first legal notice
            </p>
            <div style={{ display:"flex", gap:"0.75rem", justifyContent:"center", flexWrap:"wrap" }}>
              <div style={{ background:"rgba(34,211,238,0.08)", border:"1px solid rgba(34,211,238,0.2)", borderRadius:"4px", padding:"0.35rem 0.9rem" }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.6rem", color:"#22D3EE", letterSpacing:"0.06em" }}>PART I: 5 UNITS · 14 LESSONS · 20+ DRILLS</span>
              </div>
              <div style={{ background:"rgba(251,113,133,0.08)", border:"1px solid rgba(251,113,133,0.2)", borderRadius:"4px", padding:"0.35rem 0.9rem" }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.6rem", color:"#FB7185", letterSpacing:"0.06em" }}>PART II: 6 LEGAL CHAPTERS · NOT LEGAL ADVICE</span>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════
               PART I DIVIDER
          ════════════════════════════════ */}
          <div style={{ padding:"2.5rem 0 1rem", textAlign:"center" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.6rem", color:"#22D3EE", letterSpacing:"0.22em", marginBottom:"0.4rem" }}>PART I</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:"clamp(1.4rem,5vw,1.9rem)", color:"#F5F7FB" }}>Comedy Craft</div>
            <div style={{ fontFamily:"'Inter',sans-serif", fontStyle:"italic", color:"#555", fontSize:"0.9rem", marginTop:"0.4rem" }}>A complete course in joke writing</div>
            <div style={{ height:"1px", background:"linear-gradient(90deg,transparent,rgba(34,211,238,0.3),transparent)", margin:"1.5rem 0 0" }} />
          </div>

          {/* ════ UNIT 0: FOUNDATIONS ════ */}
          <SectionRef id="p1-u0" label="FOUNDATIONS" title="The Architecture of a Joke" sub="Before you write anything, understand what a joke actually is" accent="#22D3EE" innerRef={el => refs.current["p1-u0"] = el}>

            <H2 accent="rgba(34,211,238,0.3)">Lesson 1 — What Makes Something Actually Funny</H2>
            <P>Comedy is the art of <B>violated expectations.</B> Every joke is a tiny con job — you lead someone down one path, then yank the floor out from under them. The listener laughs because they were fooled, but the fooling makes perfect sense in hindsight.</P>

            <KeyNote>The three pillars that run through every form of humor — stand-up, roast, sketch, film — are: Setup → Misdirection → Punchline. The Rule of Three. And Specificity over Vagueness.</KeyNote>

            <H3 accent="#22D3EE">The Rule of Three</H3>
            <P>List two expected things, make the third a grenade. <Em>"He was tall, dark, and on parole."</Em> The first two are normal. The third detonates. That's the whole trick — and it works every single time because two data points create a pattern, and humans are pattern-completion machines. The third item should break the pattern in the most unexpected but logical way possible.</P>

            <H3 accent="#22D3EE">Specificity Beats Vagueness Every Time</H3>
            <P><Em>"A big dog"</Em> is not funny. <Em>"A 200-lb mastiff in a turtleneck"</Em> is funny. Specificity creates a picture in the listener's mind. Pictures create laughs. Vague language gives the brain nothing to hold onto — and a brain with nothing to hold onto cannot laugh.</P>

            <Exercise label="DRILL">Take the generic statement "I had a bad day" and rewrite it ten times with maximum specificity each time. Make it visual, weird, and precise. The sixth version will probably be funny. The tenth might be genuinely great. Quantity breeds quality in joke writing.</Exercise>

            <Divider accent="#22D3EE" />

            <H2 accent="rgba(34,211,238,0.3)">Lesson 2 — The Anatomy of a Punchline</H2>
            <P>A punchline has three components even when they're packed into a single sentence. Missing any one of them is why most amateur jokes die in the middle of the delivery.</P>

            <H3 accent="#22D3EE">The Button Word</H3>
            <P>The last word of a punchline almost always carries the entire punch. It should be the strangest, most unexpected word you can land on. If you end on a weak word, the joke deflates mid-air. <Em>"I haven't slept in days... because that would be too long."</Em> The word <B>long</B> is doing all the work at the end. That's your button.</P>

            <H3 accent="#22D3EE">The Callback</H3>
            <P>Return to something you said earlier in the set — now twisted. The audience feels a flash of pride for remembering it, and that emotional recognition adds to the laugh. Callbacks are the most reliable laugh-amplifier in comedy because they reward the audience for paying attention.</P>

            <H3 accent="#22D3EE">The Topper</H3>
            <P>After you land a joke, top it with a second, harder hit. Comedians call this "milking." The audience laughs, you wait one beat, then give them one more layer they didn't see coming. The topper is what separates good joke writers from genuinely dangerous ones.</P>

            <Formula>Setup (plant assumption) → Tag (deepen assumption)<br/>→ Punchline (betray assumption) → Topper (betray the betrayal)</Formula>

            <Exercise label="DRILL">Write a joke with a setup and punchline. Now add a topper. Now add a second topper. How many layers can you stack before it stops being funny? That limit is your instinct — and instinct is trainable through repetition.</Exercise>
          </SectionRef>

          {/* ════ UNIT I: ROAST ════ */}
          <SectionRef id="p1-u1" label="UNIT I" title="The Art of the Roast" sub="How to destroy someone out of love" accent="#22D3EE" innerRef={el => refs.current["p1-u1"] = el}>

            <H2 accent="rgba(34,211,238,0.3)">Lesson 1 — Roasting vs. Bullying: The Critical Line</H2>
            <P>A roast <B>celebrates</B> through mockery. The target should laugh too — or at least be able to. If they can't, you haven't written a roast. You've written an attack dressed in comedy clothing, and that failure is entirely on the writer.</P>

            <KeyNote>The Golden Rule of Roasting: Attack the behavior, the choice, or the persona — never the wound.</KeyNote>

            <Rule icon="✅" label="Fair game">Ego, career flops, public reputation, things they've bragged about, fashion choices, known quirks, loudly-held opinions — anything they've voluntarily put in front of the world.</Rule>
            <Rule icon="❌" label="Off limits">Trauma they've never weaponized publicly, family members who didn't sign up for this, medical or mental health history, genuine insecurities they carry privately.</Rule>

            <H3 accent="#22D3EE">The Affection Test</H3>
            <P>After writing a roast joke, ask yourself honestly: if you said this to their face, would they feel <B>hated</B> — or would they feel like only someone who really knows them could land a hit that accurate? The second feeling is what you're going for. A great roast feels like intimacy dressed as an attack.</P>

            <H3 accent="#22D3EE">The Self-Deprecation Trick</H3>
            <P>Before you roast someone hard, throw yourself under the bus first. It signals that this is sport, not a hit job. It says: <Em>I'm in this ring with you, not standing above you.</Em> This one move disarms the audience's instinct to feel uncomfortable on the target's behalf.</P>

            <Exercise label="ASSIGNMENT">Pick a public figure you know well. Write five roast jokes. Then ask yourself honestly: could each one be said to their face without them feeling genuinely hurt? If not — revise until it could. That revision process is where the real craft lives.</Exercise>

            <Divider accent="#22D3EE" />

            <H2 accent="rgba(34,211,238,0.3)">Lesson 2 — Roast Structure: Opening, Escalation & The Closer</H2>
            <P>A roast set is a controlled demolition. You build them up just enough, then dismantle them brick by brick, methodically, with increasing precision. Every act should feel slightly hotter than the one before it.</P>

            <H3 accent="#22D3EE">Act 1 — The Soft Opener</H3>
            <P>Start with something they're proud of, then undercut it immediately. <Em>"John has been in this industry for 20 years. Twenty years of almost making it."</Em> Gentle enough to get a warm laugh, but it immediately signals to the room: we are not here to be kind tonight.</P>

            <H3 accent="#22D3EE">Act 2 — The Escalation</H3>
            <P>Each joke should hit slightly harder than the last. Build a rhythm. The audience should feel the temperature rising. Think of it like tightening a vice — steady, controlled, relentless. Never let the target or the audience catch their breath between hits.</P>

            <H3 accent="#22D3EE">Act 3 — The Character Indictment</H3>
            <P>One big swing that sums up their entire persona as a single punchline. This is the joke that defines the whole set. <Em>"Honestly, [name] is proof that persistence can replace talent. Not supplement it. Replace it entirely."</Em></P>

            <H3 accent="#22D3EE">Act 4 — The Reversal</H3>
            <P>End by genuinely lifting them up, or landing a joke that implies deep respect and love underneath all the carnage. This is what separates a roast from a takedown. <Em>"But seriously — there is nobody I'd rather be annihilated by in a meeting. Absolute legend."</Em></P>

            <H3 accent="#22D3EE">Your Tone Toolkit</H3>
            <Rule icon="🔥" label="Hyperbole">Push it past real into absurd. "The worst human alive" is funny. "Kinda bad" is not. The exaggeration is part of the contract.</Rule>
            <Rule icon="🎭" label="False Praise">Set up admiration, then land a quiet knife. "This guy is a true innovator — nobody else has managed to fail upward this gracefully."</Rule>
            <Rule icon="🔁" label="The Repeat">Come back to the same insult three times through the set, each time more ridiculous than before. The third callback gets the biggest laugh of all three.</Rule>

            <Exercise label="ASSIGNMENT">Write a 2-minute roast set for a friend using all four acts. Don't deliver it yet — just write it. Read it back aloud. Does each act feel genuinely hotter than the one before? If not, find what's missing and turn up the heat.</Exercise>

            <Divider accent="#22D3EE" />

            <H2 accent="rgba(34,211,238,0.3)">Lesson 3 — The Callback Roast: Building a Mythology</H2>
            <P>The best roast writers treat the entire set as a web. Every callback amplifies every joke that came before it. By the end you haven't told individual jokes — you've built a <B>mythology</B> around this person.</P>

            <H3 accent="#22D3EE">The Callback Loop</H3>
            <P>Introduce a concept early (<Em>"John once told me he's 'between projects'..."</Em>), then return to it twice more across the set. First mention: establishes premise. Second: extends it, gets a laugh. Third: twists the knife — biggest laugh of the three. The audience rewards you for the patience it took to set this up.</P>

            <H3 accent="#22D3EE">The Myth Arc</H3>
            <P>Build a false biography of your roast target across the whole set. By the end, you've told the funniest, most accurate, most damning life story they've ever heard about themselves. Structure it across time:</P>
            <Rule icon="👶">Childhood — the flaw emerging early, almost cute in its infancy</Rule>
            <Rule icon="💼">Career — the flaw persists and compounds, now affecting outcomes</Rule>
            <Rule icon="💔">Relationships — the flaw starts bleeding into other people's lives</Rule>
            <Rule icon="🏆">Legacy — the flaw is actually their defining feature, and weirdly, it's why everyone loves them</Rule>

            <Exercise label="DRILL">Pick one character flaw — real or imagined — of someone you want to roast. Write four jokes, each attacking that same flaw from a different angle: childhood, career, love life, legacy. Then write a single callback line that ties all four together in one sentence. That line is your closer.</Exercise>
          </SectionRef>

          {/* ════ UNIT II: STAND-UP ════ */}
          <SectionRef id="p1-u2" label="UNIT II" title="Stand-Up & Entertainment Writing" sub="Finding your voice and building material that holds a room" accent="#22D3EE" innerRef={el => refs.current["p1-u2"] = el}>

            <H2 accent="rgba(34,211,238,0.3)">Lesson 1 — Finding Your Voice: The Comic Persona</H2>
            <P>Every great comedian has a <B>persona</B> — a slightly heightened, slightly distorted version of themselves through which every joke is filtered. This isn't a lie or a mask. It's you with the volume turned up on specific frequencies and everything else dialed back.</P>

            <P>Your persona answers three questions: What do you notice that other people don't? What do you pretend to be okay with that you're clearly not? And what are you an unreliable narrator about?</P>

            <H3 accent="#22D3EE">The Four Classic Personas</H3>
            <Persona emoji="🤡" name="The Fool" desc="Obliviously optimistic. Always the one things happen to, never the one making things happen. Self-deprecating king. The audience laughs with them even as they laugh at them." examples="Charlie Chaplin, Michael Scott early seasons" />
            <Persona emoji="😤" name="The Cynic" desc="Sees through everything. Every premise is 'yeah, and here's why that's actually awful.' Dry, dark, detached. The world is disappointing them constantly, and they're going to tell you exactly how." examples="Bill Burr, Anthony Jeselnik, early Carlin" />
            <Persona emoji="👁️" name="The Observer" desc="Removed, clinical, watching human absurdity from a distance. Like a David Attenborough documentary about people at a Target. Deeply confused by normal things everyone else accepts." examples="Seinfeld, Gary Gulman, Jim Gaffigan" />
            <Persona emoji="💥" name="The Rebel" desc="Says the thing everyone thought but wouldn't dare say. High risk, high reward. Requires total commitment — half-measures in this persona read as trying too hard." examples="Chappelle, Hicks, early Pryor" />

            <H3 accent="#22D3EE">The Voice Test</H3>
            <P>Write the same premise — <Em>"I hate airports"</Em> — from each of the four personas. The version that feels most natural, most effortless to write? That's where you live. That's your voice. Everything else is technique — your persona is your foundation.</P>

            <Exercise label="ASSIGNMENT">Write a 200-word "about me" paragraph from the perspective of your comic persona. Not as yourself — as the character you become when you're performing. Read it aloud. Does it feel like you, but sharper? Funnier? More honest? That gap between who you are and who that character is — that gap is your material.</Exercise>

            <Divider accent="#22D3EE" />

            <H2 accent="rgba(34,211,238,0.3)">Lesson 2 — The Bit: Writing Extended Observational Comedy</H2>
            <P>A bit is not one joke. A bit is a whole world built around a single funny truth. It's an extended riff that builds on itself, gets progressively weirder, and lands somewhere the audience couldn't have predicted when you started.</P>

            <Formula>Premise → Explore → Heighten → Absurdist Peak → Tag → Land</Formula>

            <H3 accent="#22D3EE">Step 1: The Premise — "Funny Because It's True"</H3>
            <P>Great bits start with an observation that makes people immediately think <Em>"oh my god, YES."</Em> <B>"Self-checkout machines are designed to make you feel like the criminal."</B> Everyone has felt this. That shared recognition is the foundation of the whole bit.</P>

            <H3 accent="#22D3EE">Step 2: Explore Every Angle</H3>
            <P>List every variation of this truth, every person it applies to differently, every situation it creates. The machine accusing you. The awkward pause when it doesn't scan. The employee who "supervises" but is clearly just watching you do their job. The fact that you're bagging your own groceries with zero discount.</P>

            <H3 accent="#22D3EE">Step 3: Heighten Progressively</H3>
            <P>Each beat should be weirder than the last. A bit that flatlines dies. Every 30 seconds or so, crank the absurdity one notch further. The bit should feel like a roller coaster that only goes up.</P>

            <H3 accent="#22D3EE">Step 4: The Absurdist Peak</H3>
            <P>Go somewhere completely unhinged — but still logically connected to your original premise. The audience should feel <Em>"how did we get here?"</Em> and <Em>"of course we got here"</Em> simultaneously. <B>"At what point does self-checkout become self-incarceration?"</B></P>

            <H3 accent="#22D3EE">Step 5: The Tag</H3>
            <P>A quick throwaway hit after the main punchline. Two words or a quick image. It resets the audience's expectations and signals that the bit is landing. Experienced comedians use tags to "button" a bit cleanly before moving on.</P>

            <Exercise label="DRILL">Take one observation from today — anything real. Build it through all five steps. Write at least 300 words without stopping to edit. Don't touch it while it's coming out. Editing is for the second pass. First drafts are mining operations.</Exercise>

            <Divider accent="#22D3EE" />

            <H2 accent="rgba(34,211,238,0.3)">Lesson 3 — Hosting, Emceeing & Writers' Rooms</H2>
            <P>Writing for performance — late night, hosting gigs, award ceremonies — is different from personal stand-up. You're writing to land in <B>a specific room</B> with a specific energy, not just on paper. The rules shift accordingly.</P>

            <H3 accent="#22D3EE">Late Night Joke Structure</H3>
            <P>Monologue jokes are tight, fast, and usually riff off current events. The formula is almost mechanical, but it works because the audience is primed for it.</P>
            <Formula>[News item] → [Observational angle] → [Punchline in under 10 words]</Formula>
            <P><Em>"[Company] just announced an AI that can replace 50,000 jobs. They're calling it progress. I'm calling it my entire personality crisis."</Em></P>

            <H3 accent="#22D3EE">The Self-Aware Host</H3>
            <P>The audience is watching you hold the room. Acknowledge the energy in real time — this move creates intimacy and shows total confidence. <Em>"That got a light response. That's fine. I've bombed in nicer places."</Em> This kind of line makes the audience feel like they're in on it with you, which makes them trust you more.</P>

            <H3 accent="#22D3EE">Writers' Room Dynamics</H3>
            <P>In a room, quantity beats quality in the early rounds. Pitch everything. The terrible idea you're embarrassed about is often the seed of something great. The room process:</P>
            <Rule icon="1️⃣">Pitch the dumb idea — loudly, without hedging</Rule>
            <Rule icon="2️⃣">Someone upgrades it in a direction you didn't see</Rule>
            <Rule icon="3️⃣">Someone else tops the upgrade</Rule>
            <Rule icon="4️⃣">Writers' room magic happens and the room lands gold</Rule>
            <P>Your job is to keep pitching without shame. Silence is the enemy. The worst idea in the room is better than no idea in the room.</P>

            <Exercise label="ASSIGNMENT">Pretend you're hosting an awards show for your friend group. Write a 1-minute opening monologue with at least four jokes. Every single joke must reference someone in the room. Read it aloud. Time it. Edit for pacing.</Exercise>
          </SectionRef>

          {/* ════ UNIT III: CINEMATIC ════ */}
          <SectionRef id="p1-u3" label="UNIT III" title="Cinematic & Script Comedy" sub="Jokes that live inside characters, not above them" accent="#22D3EE" innerRef={el => refs.current["p1-u3"] = el}>

            <H2 accent="rgba(34,211,238,0.3)">Lesson 1 — Comedy in Dialogue</H2>
            <P>In scripts, jokes don't get told. They <B>happen.</B> Characters don't step up to a mic and do stand-up. They want things, misunderstand things, and fail at things — and that's where all the comedy lives. The moment a character is self-aware that they're being funny, the scene usually dies.</P>

            <H3 accent="#22D3EE">The Comedy of Mismatched Want</H3>
            <P>Put two characters in a scene where each wants something the other can't give them. Neither character breaks. That sustained tension <Em>is</Em> the joke. Character A desperately needs to end a conversation. Character B is emotionally oblivious and keeps extending it. The scene isn't built around one punchline — it's a sustained comedic engine running on incompatible goals.</P>

            <H3 accent="#22D3EE">The Reveal-and-React</H3>
            <P>One character knows something. The other doesn't. We watch the uninformed character react to circumstances we fully understand — and they completely misread. This is dramatic irony used as comedy. We're laughing at the gap between what they think is happening and what we know is actually happening.</P>

            <H3 accent="#22D3EE">Subtext in Comedy Dialogue</H3>
            <P>What characters <B>say</B> versus what they <B>mean</B> is the engine of great comic writing. Characters almost never say exactly what they feel. The comedy lives entirely in the gap between the two.</P>
            <Rule icon="❌" label="Bad">Character says directly: "I don't like you."</Rule>
            <Rule icon="✅" label="Good">"That's a really interesting perspective. Mm-hm. Yeah." <Em>(delivered while visibly hating every syllable)</Em></Rule>

            <H3 accent="#22D3EE">The Callback in Scripts</H3>
            <P>Plant a detail in Act 1 — a prop, a running line, a quirk — and pay it off in Act 3. The audience feels like detectives who cracked the case. That recognition, combined with the surprise of the payoff, produces one of the most satisfying laughs in all of comedy writing.</P>

            <Exercise label="EXERCISE">Write one page of dialogue between two characters where one is trying to break up with the other, but the other keeps interpreting everything as genuinely good news. No one raises their voice. No one says what they mean. Play it completely deadpan throughout.</Exercise>

            <Divider accent="#22D3EE" />

            <H2 accent="rgba(34,211,238,0.3)">Lesson 2 — Comedy Scene Construction</H2>
            <P>A comedy scene is a machine. It has moving parts, a rhythm, and a destination. If any one part is missing or out of order, the whole thing breaks down. Understand the machine and you can build it reliably.</P>

            <Formula>Establish → Disrupt → Escalate → Button</Formula>

            <H3 accent="#22D3EE">Beat 1 — Establish the Normal World</H3>
            <P>Show us the baseline. What does "fine" look like? This is the thing you're about to destroy. The audience needs to see normal before they can appreciate how far from normal you're about to take them.</P>

            <H3 accent="#22D3EE">Beat 2 — Introduce the Inciting Absurdity</H3>
            <P>Throw the grenade. A misunderstanding. The wrong person. An impossible object. An information gap. This is the thing that shouldn't be there — and now everything in the scene must contend with it.</P>

            <H3 accent="#22D3EE">Beat 3 — Escalate Relentlessly</H3>
            <P>Every attempt to fix the problem makes it worse. Each beat tops the one before it in absurdity. Never let the character catch their breath. The rule: the character's attempts to solve the problem are precisely what creates the next problem. This loop is where most of the comedy lives.</P>

            <H3 accent="#22D3EE">Beat 4 — The Button</H3>
            <P>The final image or line that punctuates the scene. Not necessarily a resolution — often the problem is still ongoing — but you cut away on the funniest possible moment. The button is what the audience will remember and quote later.</P>

            <KeyNote>The Yes-And Rule from improv applies directly to script comedy: every escalation should accept the reality of what came before and add to it. Never negate what was established. The more consistently the world's internal logic is maintained, the funnier the absurdity becomes as it escalates.</KeyNote>

            <Exercise label="ASSIGNMENT">Write a 3-page comedy scene using all four beats. The premise: someone is trying to return an item to a store. The receipt has been eaten by their dog. The item has been discontinued. And the customer service rep slowly reveals they are the same person who originally sold it to them.</Exercise>

            <Divider accent="#22D3EE" />

            <H2 accent="rgba(34,211,238,0.3)">Lesson 3 — Character Comedy: The Flaw is the Engine</H2>
            <P>Great comedy characters are essentially slaves to one defining flaw. This flaw creates every problem, every misunderstanding, every scene they inhabit. Strip the flaw out and you don't have a character anymore — you have a person, and persons aren't inherently funny.</P>

            <H3 accent="#22D3EE">The Classic Comedy Flaws</H3>
            <Persona emoji="🧠" name="Obliviousness" desc="They genuinely cannot see what is directly in front of them. The audience can always see the disaster coming before they can — and that gap is endlessly funny." examples="Michael Scott, Inspector Clouseau, Frasier Crane" />
            <Persona emoji="😤" name="Ego" desc="They believe absolutely in their own greatness. Every scene proves them wrong, but their belief never wavers. The ego is impervious to evidence." examples="David Brent, Basil Fawlty, Zoolander" />
            <Persona emoji="😨" name="Cowardice" desc="They want to do the brave or right thing, and they spectacularly, consistently cannot. The good intentions and the spectacular failure in execution is the entire comedy." examples="George Costanza, Blackadder's Baldrick" />
            <Persona emoji="💬" name="Pathological Honesty" desc="They say what everyone is thinking at the most catastrophically wrong moment possible. Every social situation is a minefield they walk through with zero awareness." examples="Curb Larry David, Ted Lasso's Rebecca early on" />
            <Persona emoji="🎯" name="Obsession" desc="One fixation warps every decision they make. The obsession is the lens through which the entire world is distorted." examples="Most Coen Brothers characters, Patrick Bateman played for horror-comedy" />

            <H3 accent="#22D3EE">The Comedy Character Worksheet</H3>
            <Rule icon="①">What does your character THINK they are?</Rule>
            <Rule icon="②">What are they ACTUALLY?</Rule>
            <Rule icon="③">What do they want in every scene?</Rule>
            <Rule icon="④">What do they always do instead?</Rule>
            <P>The gap between question 1 and question 2 is where every single joke comes from. The answers to 3 and 4 create the scene. Build your character around these four answers and you'll never run out of material.</P>

            <Exercise label="ASSIGNMENT">Create a character using the four questions. Write three scenes where their flaw gets them into progressively bigger trouble — same flaw, escalating consequences. Scene 3 should be a genuine catastrophe. Same character, different situations, identical flaw.</Exercise>

            <Divider accent="#22D3EE" />

            <H2 accent="rgba(34,211,238,0.3)">Lesson 4 — Writing Satire That Actually Says Something</H2>
            <P>Satire is comedy with a target that isn't a person. The target is a system, an institution, a lie that society tells itself every day with a completely straight face. Satire makes you laugh at something — and then makes you uncomfortable that you laughed.</P>

            <KeyNote>The Satire Formula: Take something real and broken. Depict it as if it were completely normal and logical. The horror of its normalcy is the joke.</KeyNote>

            <H3 accent="#22D3EE">The Three Types</H3>
            <Persona emoji="😊" name="Horatian Satire" desc="Gentle, warm, inviting the target to laugh at themselves. The satire has affection for what it skewers. It illuminates the absurdity without condemning the people inside it." examples="The Office UK, Parks and Rec, Schitt's Creek" />
            <Persona emoji="😡" name="Juvenalian Satire" desc="Biting, angry, contemptuous. The contempt is the point. It doesn't invite the target to laugh — it puts them on trial." examples="Network, Four Lions, Don't Look Up" />
            <Persona emoji="🌀" name="Menippean Satire" desc="Attacks ideas, not people. Takes absurdist logic to its extreme, internally consistent conclusion. The whole world becomes the target." examples="Catch-22, Dr. Strangelove, 1984 (dark satire)" />

            <H3 accent="#22D3EE">The Satirist's Trap: Preachiness</H3>
            <P>Satire stops being funny the moment the writer's contempt overwhelms the comedy. The joke should do all the work. If you have to explain what you're satirizing, you haven't written satire — you've written a lecture with jokes in it. The two feel completely different to an audience.</P>

            <Verdict>Could someone who disagrees with your message still find this funny? If yes — you've written satire. If no — you've written a sermon in a costume.</Verdict>

            <Exercise label="ASSIGNMENT">Pick one absurd social norm: performance reviews, toxic positivity, "networking," hustle culture. Write a 2-page scene where that norm is depicted as completely, earnestly, horrifyingly reasonable by every character involved. No one questions it. No one winks at the camera. Total commitment.</Exercise>
          </SectionRef>

          {/* ════ UNIT IV: ADVANCED ════ */}
          <SectionRef id="p1-u4" label="UNIT IV" title="Advanced Techniques" sub="The moves that separate good writers from dangerous ones" accent="#22D3EE" innerRef={el => refs.current["p1-u4"] = el}>

            <H2 accent="rgba(34,211,238,0.3)">Lesson 1 — The Misdirection Stack</H2>
            <P>Misdirection stacking is when each layer of a joke resets expectations and then betrays them again. You're not subverting once — you're building a recursive loop of surprise where each level fools the audience about what the next level will be.</P>

            <H3 accent="#22D3EE">The Double Subversion</H3>
            <P>Set up an expectation. Subvert it (first laugh). Then subvert the subversion (bigger laugh). <Em>"I told my therapist I felt invisible. She said I wasn't there. Then I realized — I had sent her a text."</Em> Each clause betrays the one before it. Three layers in three sentences.</P>

            <H3 accent="#22D3EE">The Brick Wall</H3>
            <P>A sequence of short jokes that individually score maybe a 4 out of 10, but stacked together build unstoppable momentum. By joke seven or eight, the audience is laughing at the relentlessness itself, not just the individual jokes. This was Mitch Hedberg's entire style and it made him legendary. The rhythm becomes the joke.</P>

            <H3 accent="#22D3EE">The Compounding Topper</H3>
            <P>After your punchline, immediately add a tag that recontextualizes the whole joke from a new angle — making everything that came before it funnier in retrospect. This is the difference between a joke that makes you laugh and a joke that makes you lean over to the person next to you.</P>

            <Exercise label="ARCHITECTURE DRILL">Write a joke. Write a topper to it. Write a topper to that topper. Then write a callback to the original that incorporates all three layers in a single line. This exercise teaches you to think in structures, not just individual lines. Do it daily for a week.</Exercise>

            <Divider accent="#22D3EE" />

            <H2 accent="rgba(34,211,238,0.3)">Lesson 2 — Writing Dark Comedy Without Crashing</H2>
            <P>Dark comedy is the most technically demanding form in existence. The margin between "devastatingly funny" and "genuinely harmful" is a millimeter thin — and the difference has nothing to do with <Em>what</Em> you joke about. It's entirely about <Em>how.</Em></P>

            <KeyNote>Dark comedy works by creating distance between the audience and the subject. That distance is what grants permission to laugh. The moment the distance collapses, the laugh dies and real discomfort takes over.</KeyNote>

            <H3 accent="#22D3EE">The Four Distance Tools</H3>
            <Rule icon="⏰" label="Time">The further in the past, the more distance exists. A tragedy from yesterday is news. From 20 years ago, it's history. From 500 years ago, it's a Monty Python sketch. Control your temporal distance carefully.</Rule>
            <Rule icon="🌀" label="Absurdity">Make the scenario so ludicrous it cannot be mistaken for reality. The more real the scenario feels, the less distance exists and the less permission to laugh.</Rule>
            <Rule icon="😈" label="The Villain as Subject">We can laugh at awful people doing awful things because we don't identify with them. We're watching the absurdity of evil, not experiencing it.</Rule>
            <Rule icon="🪞" label="Self-Directed Darkness">You can say almost anything if it's about your own pain. Your own darkness is your jurisdiction. Other people's darkness requires permission.</Rule>

            <P>The <B>Charlie Chaplin Principle:</B> <Em>"Life is a tragedy when seen in close-up, but a comedy in long-shot."</Em> Dark comedy zooms out until the tragedy becomes a pattern, and pattern becomes comedy. The craft is entirely in controlling the focal length.</P>

            <Warning>What kills dark comedy: punching down at victims instead of perpetrators, making the actual horror the punchline instead of the absurdity surrounding it, and forgetting to actually be funny. Darkness alone is not comedy. It's just darkness.</Warning>

            <Exercise label="EXERCISE">Take one uncomfortable social topic — not personal trauma, something taboo and social. Write three jokes about it from three different distances: close (uncomfortable), medium (edgy), and long shot (clearly absurdist). Notice how the further you zoom out, the safer and funnier it becomes. That zoom control is the skill to develop.</Exercise>

            <Divider accent="#22D3EE" />

            <H2 accent="rgba(34,211,238,0.3)">Lesson 3 — The Editing Process: Kill Your Darlings</H2>
            <P>Writing comedy is rewriting comedy. First drafts are not jokes. They are mining operations. You're not finding gold yet — you're finding out where to dig. The edit is where the actual joke gets born.</P>

            <H3 accent="#22D3EE">The Read-Aloud Rule</H3>
            <P>Every joke must be read aloud before you commit to it. What looks funny on the page often collapses in the mouth. What sounds funny in the mouth almost always works on stage. If you're reading your jokes only with your eyes, you're doing half the job.</P>

            <H3 accent="#22D3EE">The Word Economy Test</H3>
            <P>Count the words between your setup and your punchline. Every word that isn't either loading an expectation or delivering a surprise is <B>stealing laughter.</B> Find it and cut it without mercy.</P>
            <Rule icon="❌" label="Before">"So I went to the store the other day and I saw this guy who was, I don't know, maybe six feet tall, and he was wearing this really ridiculous hat."</Rule>
            <Rule icon="✅" label="After">"I saw a man in a hat so bad, I considered calling the police."</Rule>
            <P>Same joke. Twelve words instead of forty. The second one is a joke. The first one is a story about being in a store that happens to have a joke somewhere inside it.</P>

            <H3 accent="#22D3EE">The Punchline Position Test</H3>
            <P>The funny word must be the <B>last</B> word. If it isn't, restructure the entire sentence until it is. <Em>"I'm not lazy — I'm selectively efficient."</Em> The word <Em>efficient</Em> is the button. It's last. It lands. This is non-negotiable.</P>

            <H3 accent="#22D3EE">The Three-Draft System</H3>
            <Step num="1" title="Draft 1: Quantity">Write everything. Don't judge. Don't stop. Get it all out.</Step>
            <Step num="2" title="Draft 2: Ruthlessness">Find the 20% that is genuinely funny. Kill everything else. No mercy, no sentimentality.</Step>
            <Step num="3" title="Draft 3: Precision">Make that 20% as tight, specific, and sharp as you can possibly make it.</Step>

            <Exercise label="FINAL DRILL">Take one joke you've written. Edit it down by 30%. Then edit it down by another 30%. Read all three versions aloud. Which one is funniest? The answer to that question is a lesson you'll carry into every piece you ever write.</Exercise>

            <Verdict>Write every day, even badly. Study what makes you laugh and break it down mechanically. Perform everything aloud. Bomb, and learn from it. The best comedy always comes from a real place — find the thing that genuinely annoys, confuses, or breaks your heart a little. That's where the truth lives. Truth is what makes people laugh.</Verdict>
          </SectionRef>

          {/* ════════════════════════════════
               PART II DIVIDER
          ════════════════════════════════ */}
          <div style={{ padding:"3rem 0 1rem", textAlign:"center", marginTop:"1rem" }}>
            <div style={{ height:"1px", background:"linear-gradient(90deg,transparent,rgba(251,113,133,0.3),transparent)", marginBottom:"2rem" }} />
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.6rem", color:"#FB7185", letterSpacing:"0.22em", marginBottom:"0.4rem" }}>PART II</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:"clamp(1.4rem,5vw,1.9rem)", color:"#F5F7FB" }}>The Roast & The Law</div>
            <div style={{ fontFamily:"'Inter',sans-serif", fontStyle:"italic", color:"#555", fontSize:"0.9rem", marginTop:"0.4rem" }}>Legal risks, defenses, and what to do when things go wrong</div>
            <div style={{ background:"rgba(251,113,133,0.08)", border:"1px solid rgba(251,113,133,0.2)", borderRadius:"4px", padding:"0.35rem 0.9rem", display:"inline-block", marginTop:"1rem" }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.58rem", color:"#FB7185", letterSpacing:"0.06em" }}>EDUCATIONAL ONLY · NOT LEGAL ADVICE · CONSULT AN ADVOCATE</span>
            </div>
          </div>

          {/* ════ CH I: WHAT CAN GET YOU SUED ════ */}
          <SectionRef id="p2-ch1" label="CHAPTER I" title="What Can Get You Sued" sub="Know the charges before you step into the ring" accent="#FB7185" innerRef={el => refs.current["p2-ch1"] = el}>

            <H2>1. Defamation — Your Biggest Risk</H2>
            <P>Defamation means making a <B>false statement of fact</B> about someone that damages their reputation. In India, it isn't just a civil wrong — it's a <B>criminal offence</B> under <LawRef>Section 499 IPC</LawRef> (now <LawRef>Section 356 BNS 2023</LawRef>). The key word to tattoo in your brain: <B>false statement of fact.</B></P>

            <Warning><B>"Rahul actually embezzled money from his company"</B> — even said as a punchline, if it's false and a real person can identify themselves in it, that's defamation. Civil and criminal. Don't do it.</Warning>

            <Rule icon="✅" label="Safe">"Rahul is so lazy he's basically unemployed" — exaggerated opinion, generally protected.</Rule>
            <Rule icon="❌" label="Not safe">"Rahul stole from his investors" — factual claim. If false and identifiable, you're exposed.</Rule>

            <TableComp
              headers={["Type","Law","Max Punishment"]}
              rows={[
                ["Civil Defamation","Tort Law","Damages — money you pay them"],
                ["Criminal Defamation","Sec 499 IPC / Sec 356 BNS","2 years imprisonment + fine"],
              ]}
            />

            <Defense>
              <B>Truth</B> is a complete defense. Provably true = no case. Start collecting receipts.<br/><br/>
              <B>Fair Comment</B> — Opinions on matters of public interest are protected, as long as they're clearly opinions based on true underlying facts.<br/><br/>
              <B>Satire & Parody</B> — Courts recognize these as protected expression. But the satire must be unmistakably satirical. If a reasonable person could mistake your joke for a real claim, you're exposed.
            </Defense>

            <Divider />
            <H2>2. Obscenity — Section 294 IPC & Section 67 IT Act</H2>
            <P>Sexually explicit or grossly obscene content posted online attracts <LawRef>Section 67 IT Act</LawRef> — up to <B>3 years imprisonment</B> for first offence, 5 years for repeat. Edgy humor is fine. Graphic sexual content is a different territory with a different set of laws.</P>

            <Divider />
            <H2>3. Hurting Religious / Community Sentiments</H2>
            <P><LawRef>Section 295A IPC</LawRef> covers deliberate acts intended to outrage religious feelings — up to <B>3 years imprisonment.</B></P>
            <Warning>FIRs can be filed regardless of eventual outcome. In India, the process itself often becomes the punishment. Even if you win in court, you've spent months dealing with it. Tread carefully around religion, caste, and community.</Warning>

            <Divider />
            <H2>4. Cyber Laws for Online Roasts</H2>
            <TableComp
              headers={["Section","What It Covers","Risk"]}
              rows={[
                ["Sec 67 IT Act","Obscene content online","High"],
                ["Sec 66E IT Act","Publishing private images without consent","Very High"],
                ["Sec 507 IPC","Criminal intimidation anonymously","Medium"],
                ["Sec 509 IPC","Insulting modesty of a woman online","High"],
              ]}
            />
            <P>The moment your roast goes online, it's not just IPC — every IT Act provision becomes relevant. A private performance and a YouTube video are two completely different legal environments.</P>
          </SectionRef>

          {/* ════ CH II: LEGAL NOTICE ════ */}
          <SectionRef id="p2-ch2" label="CHAPTER II" title="Legal Notice Received" sub="Step-by-step survival when the letter arrives" accent="#FB7185" innerRef={el => refs.current["p2-ch2"] = el}>

            <P>A legal notice is <B>not a court order.</B> It's a letter. The sender is telling you their grievance and what they want. That's all. Most notices are designed to intimidate you into settling — not because the sender has a strong case, but because they're betting you'll panic.</P>

            <Verdict>A legal notice is a threat, not a sentence. Stay calm, stay strategic.</Verdict>

            <Step num="1" title="Read It Without Reacting">Identify exactly what they're claiming and what they're demanding — removal, money, apology, or all three. Know the demand fully before you plan any response.</Step>
            <Step num="2" title="Do NOT Respond Immediately or Publicly">Don't post about it. Don't call them out online. Don't send a snarky reply. Anything you say from this point creates a paper trail usable in court.</Step>
            <Step num="3" title="Consult a Lawyer Before Responding">Non-negotiable. A notice reply is a legal document. One wrong sentence can be quoted against you in every subsequent filing. Have an advocate draft it.</Step>
            <Step num="4" title="Honestly Assess the Claim">Did you state a false fact as truth? Problem. Was it clearly satire? Defense. Assess with honesty, not ego.</Step>
            <Step num="5" title="Choose Your Strategy">Three options — lawyer guides which one:</Step>

            <H3>Option A — Deny the Claims</H3>
            <P>Your lawyer drafts a formal reply stating the notice has no legal basis and explaining why. This closes the initial round and puts the burden back on them to actually file a case.</P>
            <H3>Option B — Negotiate</H3>
            <P>If there's partial merit — or even if there isn't but you want this gone — a private settlement (removing content + private apology) often ends it completely without court proceedings. Courts are expensive for both sides.</P>
            <H3>Option C — Ignore</H3>
            <P>Unanswered notices don't automatically become court cases, but silence can escalate things. <B>Generally not recommended</B> unless your lawyer specifically advises it.</P>

            <Defense>India's legal notices typically give a <B>60-day response window.</B> Use every day of it wisely. Don't rush, but don't miss the window.</Defense>

            <Step num="6" title="Preserve All Evidence">Screenshots, drafts, timestamps, prior communication — save everything before anything gets deleted. Backup to cloud immediately.</Step>

            <Warning>Never delete the content while a notice is active without legal advice. Deletion can be read as admission of guilt. Your lawyer will tell you if and when removal is the right move.</Warning>
          </SectionRef>

          {/* ════ CH III: COPYRIGHT STRIKES ════ */}
          <SectionRef id="p2-ch3" label="CHAPTER III" title="Fake Copyright Strikes" sub="How to fight back and how to win" accent="#FB7185" innerRef={el => refs.current["p2-ch3"] = el}>

            <H2>How Copyright Strikes Work</H2>
            <P>When someone files a copyright claim, platforms under the <B>DMCA</B> are legally required to take the content down without verifying if the claim is valid. This is called a takedown notice. A fake or abusive strike is when someone claims content they don't own — to silence critics, remove roasts, or weaponize the content system.</P>

            <H2>Fair Dealing Under Indian Copyright Act</H2>
            <P><LawRef>Section 52</LawRef> of India's Copyright Act protects fair dealing, which includes:</P>
            <Rule icon="✅">Parody and satire of the original work itself</Rule>
            <Rule icon="✅">Commentary and criticism of that specific work</Rule>
            <Rule icon="✅">News reporting and educational use</Rule>
            <Warning>Using someone's song as background music while roasting an unrelated person is NOT fair dealing. Fair dealing protects using the work to comment on that specific work — not as decoration.</Warning>

            <H2>What To Do on YouTube</H2>
            <Step num="1" title="File a Counter-Notification">YouTube has a formal counter-notice form. You submit it stating under penalty of perjury: the claim is wrong, you have the right to use the content, you consent to court jurisdiction.</Step>
            <Step num="2" title="Wait Out the Clock">After filing, the claimant has <B>10–14 business days</B> to file an actual lawsuit. If they don't — and most won't, because it was fake — YouTube automatically restores your content.</Step>
            <Step num="3" title="Report the Abuse">If the strike was clearly fabricated, report them to YouTube. Repeated false claims can get their account terminated and strip their monetization.</Step>

            <H2>Can You Sue Them Back?</H2>
            <TableComp
              headers={["Jurisdiction","Law","What You Can Claim"]}
              rows={[
                ["US-platform (DMCA)","Section 512(f) DMCA","Damages for knowingly false claims — it's perjury"],
                ["India (Civil)","Tort of malicious falsehood","Damages for lost revenue, reputational harm"],
                ["India (Criminal)","Section 182 / 211 IPC","False information / False charge to injure"],
              ]}
            />

            <Defense>Documented proof that someone filed a claim over content they provably don't own gives you legal ammunition against <em>them.</em> Save every platform notification, every email, every timestamp. That documentation is the foundation of a counter-claim.</Defense>

            <Verdict>A fake copyright strike is not just harassment — it's a legal offense. The person who filed it may have handed you a case against themselves.</Verdict>
          </SectionRef>

          {/* ════ CH IV: PUBLIC vs PRIVATE ════ */}
          <SectionRef id="p2-ch4" label="CHAPTER IV" title="Public vs. Private Figures" sub="The single distinction that changes everything" accent="#FB7185" innerRef={el => refs.current["p2-ch4"] = el}>

            <P>Who you roast determines what you can say about them and how much legal protection you have when you say it. This is the most important distinction in all of roast law.</P>

            <TableComp
              headers={["Factor","Public Figure","Private Individual"]}
              rows={[
                ["Defamation threshold","High — must prove actual malice","Low — just needs to show harm"],
                ["Satire protection","Strong — courts recognize it","Weak — courts are cautious"],
                ["Your legal risk","Lower","Significantly higher"],
                ["Right to criticize","Very broad","Much narrower"],
              ]}
            />

            <H2>Who Counts as a Public Figure?</H2>
            <Rule icon="⚖️">Politicians at any level of government</Rule>
            <Rule icon="⚖️">Celebrities — actors, musicians, influencers with substantial following</Rule>
            <Rule icon="⚖️">Businesspeople who appear in media or lead public companies</Rule>
            <Rule icon="⚖️">Journalists, commentators, activists who actively seek public attention</Rule>
            <Rule icon="⚖️">Creators and YouTubers who have built a substantial public persona</Rule>

            <Warning><B>A creator with 10,000 subscribers is not the same as one with 10 million</B> in terms of public figure status. Courts look at the degree of voluntary public exposure. Someone running a small local channel probably doesn't meet the threshold.</Warning>

            <H2>The Public Role Only Rule</H2>
            <P>Even public figures have protected private lives. You can roast their <B>public persona, professional decisions, and public statements.</B> The moment your roast crosses into private information they've never shared publicly — medical history, family members who aren't public figures — your legal protection weakens significantly regardless of how famous they are.</P>

            <Verdict>Roasting a Bollywood actor who gives interviews about their personal life: legally safer. Roasting your neighbor's kid with a small YouTube channel: legally riskier than it feels. Always assess their actual level of voluntary public exposure.</Verdict>
          </SectionRef>

          {/* ════ CH V: DOS AND DON'TS ════ */}
          <SectionRef id="p2-ch5" label="CHAPTER V" title="Dos & Don'ts" sub="The roast creator's legal code" accent="#FB7185" innerRef={el => refs.current["p2-ch5"] = el}>

            <H2>Always Do These</H2>
            <Rule icon="✅" label="Keep it clearly opinion">Use language like "I think," "seems like," "arguably" for anything factual-adjacent. This signals opinion, not reporting.</Rule>
            <Rule icon="✅" label="Base factual jokes on documented truth">If a joke is grounded in something real, make sure it's provably real. Screenshot the source.</Rule>
            <Rule icon="✅" label="Add a disclaimer">At the top of every roast. Chapter VI covers exactly what to write.</Rule>
            <Rule icon="✅" label="Keep records of your original content">Creation timestamps, draft files, original scripts. Your drafts are your defense if someone claims you stole material.</Rule>
            <Rule icon="✅" label="Stick to their public persona">What they've said publicly, done professionally, presented to the world. That's your territory.</Rule>
            <Rule icon="✅" label="Use fair dealing properly">If you're using a clip or image, it should be to comment specifically on that content — not as decoration.</Rule>

            <Divider />
            <H2>Never Do These</H2>
            <Rule icon="❌" label="State false facts disguised as jokes">Courts look at whether a reasonable person could understand the statement as fact. Ambiguity doesn't automatically protect you.</Rule>
            <Rule icon="❌" label="Use private images without consent">Section 66E IT Act. Even public figures' private images are protected unless they've been shared publicly.</Rule>
            <Rule icon="❌" label="Touch religion or caste with malicious intent">Section 295A gives prosecutors wide latitude. Even if your intent wasn't malicious, proving that in court is expensive.</Rule>
            <Rule icon="❌" label="File or encourage abusive copyright claims">If you ask your audience to mass-report someone's content knowing the claims are false, you're potentially liable too.</Rule>
            <Rule icon="❌" label="Name and dox someone while roasting them">Combining mockery with personal information (address, workplace, phone) transforms a roast into targeted harassment. Completely different legal territory.</Rule>

            <Divider />
            <H2>Grey Areas to Know</H2>
            <H3>"It's Obviously a Joke" Isn't a Defense Alone</H3>
            <P>The standard courts apply: would a <B>reasonable person</B> viewing the content in context understand it as comedy? If your editing, delivery, or framing makes it look even 30% like a serious claim, the defense weakens.</P>
            <H3>Monetization Changes the Stakes</H3>
            <P>The moment your roast is monetized — ads, sponsors, memberships — courts and claimants treat it differently. Commercial use weakens fair dealing arguments. Keep this in mind as your channel grows.</P>
          </SectionRef>

          {/* ════ CH VI: DISCLAIMER ════ */}
          <SectionRef id="p2-ch6" label="CHAPTER VI" title="The Disclaimer" sub="One line that does more legal work than you'd believe" accent="#FB7185" innerRef={el => refs.current["p2-ch6"] = el}>

            <P>At the beginning of any roast — video, live performance, published piece — include a disclaimer. It isn't a magic shield, but it does something very specific in a courtroom: it <B>establishes your intent on record</B> and shifts a reasonable person's interpretation from "factual reporting" to "clearly comedy." That shift matters enormously in a defamation case.</P>

            <H2>Standard Disclaimer — Copy This</H2>
            <div style={{ background:"rgba(139,92,246,0.05)", border:"1px solid rgba(139,92,246,0.18)", borderRadius:"6px", padding:"1.1rem 1.3rem", margin:"1.1rem 0" }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.58rem", color:"#8B5CF6", letterSpacing:"0.08em", marginBottom:"0.6rem" }}>STANDARD VERSION</div>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"1rem", color:"#F5F7FB", lineHeight:1.7, fontStyle:"italic" }}>"This is a comedy roast. All statements are hyperbolic, satirical, and for entertainment purposes only. Nothing stated here is intended as factual reporting. All views expressed are exaggerated opinions, not statements of fact."</p>
            </div>
            <div style={{ background:"rgba(139,92,246,0.05)", border:"1px solid rgba(139,92,246,0.18)", borderRadius:"6px", padding:"0.9rem 1.1rem", margin:"1rem 0" }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.58rem", color:"#8B5CF6", letterSpacing:"0.08em", marginBottom:"0.5rem" }}>SHORT VERSION (captions, cards)</div>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"0.95rem", color:"#F5F7FB", lineHeight:1.6, fontStyle:"italic" }}>"Comedy roast. All statements are satirical and for entertainment only. Not factual reporting."</p>
            </div>

            <H2>Where to Put It</H2>
            <Rule icon="📺" label="YouTube">First 5 seconds as text overlay, AND in the description above the fold</Rule>
            <Rule icon="📱" label="Instagram Reels">In the caption, first line, before hashtags</Rule>
            <Rule icon="🎤" label="Live performance">Opening line of your set, verbally: "Everything tonight is a roast, folks — exaggerated opinions, not facts."</Rule>
            <Rule icon="📝" label="Written piece">Above the headline or directly below it — before the reader gets into the content</Rule>

            <Warning>A disclaimer at the end of a video is significantly weaker than one at the start. Courts consider whether the audience was informed before consuming the content, not after. Put it first, always.</Warning>

            <Verdict>You can say almost anything in a roast about a public figure as long as it's clearly comedy, clearly exaggerated, and not a false statement of fact presented as truth. The moment your content looks like journalism — it gets treated like journalism. And journalism has to be accurate.</Verdict>

            {/* Back matter */}
            <div style={{ textAlign:"center", padding:"3rem 0 1rem", marginTop:"1rem", borderTop:"1px solid rgba(245,247,251,0.05)" }}>
              <div style={{ fontSize:"1.3rem", marginBottom:"0.9rem" }}>🎭 ⚖️</div>
              <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontStyle:"italic", color:"#444", fontSize:"0.88rem", lineHeight:1.75, maxWidth:"360px", margin:"0 auto 1.2rem" }}>
                This handbook is legal education and creative craft education only. For your specific situation — especially if a notice has been filed — consult a qualified advocate. Laws change, interpretations vary, and your exact case always matters.
              </p>
              <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontStyle:"italic", color:"#333", fontSize:"0.85rem", lineHeight:1.7, maxWidth:"360px", margin:"0 auto" }}>
                Now go write something funny.<br/>Just make sure it's true, or obviously not.
              </p>
              <div style={{ marginTop:"1.5rem", fontFamily:"'JetBrains Mono',monospace", fontSize:"0.55rem", color:"#2a2a2a", letterSpacing:"0.1em" }}>
                COMEDY CRAFT & CREATOR LAW · COMPLETE EDITION · EDUCATIONAL ONLY
              </div>
            </div>
          </SectionRef>

        </div>
      </div>
    </div>
  );
}