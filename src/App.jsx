import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Clock, BookOpen, CheckCircle2, Circle, Flame, TrendingUp, Calendar,
  Download, Upload, Search, X, Zap, Award, ChevronDown, RotateCcw,
  Sparkles, Trophy, Repeat, PenLine, Share2, Grid3x3, BarChart3, Rocket,
  ChevronRight, Plus, Trash2, Star, Compass, Medal,
} from "lucide-react";

/* ============================================================
   SYLLABUS DATA — JEE Main + Advanced, chapter-wise
   w = weightage (High / Medium / Low)
   d = difficulty (Easy / Medium / Hard)
   ============================================================ */

const SUBJECT_META = {
  physics: { label: "Physics", short: "PHY", color: "#8482ff", glow: "rgba(132,130,255,0.45)" },
  pc: { label: "Physical Chemistry", short: "P.Chem", color: "#e0a0c2", glow: "rgba(224,160,194,0.45)" },
  ioc: { label: "Inorganic Chemistry", short: "I.Chem", color: "#e0ac67", glow: "rgba(224,172,103,0.45)" },
  oc: { label: "Organic Chemistry", short: "O.Chem", color: "#3ecf94", glow: "rgba(62,207,148,0.45)" },
  maths: { label: "Mathematics", short: "MATH", color: "#5eb1f0", glow: "rgba(94,177,240,0.45)" },
};

const CHAPTERS = {
  physics: [
    { id: "phy1", name: "Units and Measurements", w: "Low", d: "Easy" },
    { id: "phy2", name: "Vectors", w: "Low", d: "Easy" },
    { id: "phy3", name: "Kinematics", w: "Medium", d: "Medium" },
    { id: "phy4", name: "Laws of Motion", w: "Medium", d: "Medium" },
    { id: "phy5", name: "Work, Energy and Power", w: "Medium", d: "Medium" },
    { id: "phy6", name: "Rotational Motion", w: "High", d: "Hard" },
    { id: "phy7", name: "Gravitation", w: "Medium", d: "Medium" },
    { id: "phy8", name: "Mechanical Properties of Solids", w: "Low", d: "Easy" },
    { id: "phy9", name: "Mechanical Properties of Fluids", w: "Medium", d: "Medium" },
    { id: "phy10", name: "Thermal Properties of Matter", w: "Low", d: "Medium" },
    { id: "phy11", name: "Thermodynamics", w: "Medium", d: "Medium" },
    { id: "phy12", name: "Kinetic Theory of Gases", w: "Low", d: "Easy" },
    { id: "phy13", name: "Oscillations (SHM)", w: "High", d: "Medium" },
    { id: "phy14", name: "Waves", w: "Medium", d: "Medium" },
    { id: "phy15", name: "Electrostatics", w: "High", d: "Hard" },
    { id: "phy16", name: "Capacitance", w: "Medium", d: "Medium" },
    { id: "phy17", name: "Current Electricity", w: "High", d: "Hard" },
    { id: "phy18", name: "Magnetic Effects of Current", w: "High", d: "Hard" },
    { id: "phy19", name: "Magnetism and Matter", w: "Low", d: "Medium" },
    { id: "phy20", name: "Electromagnetic Induction", w: "High", d: "Medium" },
    { id: "phy21", name: "Alternating Current", w: "Medium", d: "Medium" },
    { id: "phy22", name: "Electromagnetic Waves", w: "Low", d: "Easy" },
    { id: "phy23", name: "Ray Optics", w: "High", d: "Medium" },
    { id: "phy24", name: "Wave Optics", w: "Medium", d: "Medium" },
    { id: "phy25", name: "Dual Nature of Matter and Radiation", w: "Medium", d: "Easy" },
    { id: "phy26", name: "Atoms", w: "Low", d: "Easy" },
    { id: "phy27", name: "Nuclei", w: "Low", d: "Easy" },
    { id: "phy28", name: "Semiconductor Electronics", w: "Medium", d: "Medium" },
    { id: "phy29", name: "Communication Systems", w: "Low", d: "Easy" },
    { id: "phy30", name: "Experimental Physics", w: "Medium", d: "Medium" },
  ],
  pc: [
    { id: "pc1", name: "Mole Concept & Stoichiometry", w: "High", d: "Medium" },
    { id: "pc2", name: "Atomic Structure", w: "High", d: "Medium" },
    { id: "pc3", name: "States of Matter (Gaseous & Liquid)", w: "Low", d: "Easy" },
    { id: "pc4", name: "Thermodynamics (Chemistry)", w: "High", d: "Medium" },
    { id: "pc5", name: "Chemical Equilibrium", w: "High", d: "Medium" },
    { id: "pc6", name: "Ionic Equilibrium", w: "High", d: "Hard" },
    { id: "pc7", name: "Redox Reactions", w: "Medium", d: "Easy" },
    { id: "pc8", name: "Electrochemistry", w: "High", d: "Medium" },
    { id: "pc9", name: "Chemical Kinetics", w: "Medium", d: "Medium" },
    { id: "pc10", name: "Solutions", w: "Medium", d: "Medium" },
    { id: "pc11", name: "Surface Chemistry", w: "Low", d: "Easy" },
    { id: "pc12", name: "Solid State", w: "Medium", d: "Medium" },
  ],
  ioc: [
    { id: "ioc1", name: "Periodic Table and Periodicity", w: "High", d: "Easy" },
    { id: "ioc2", name: "Chemical Bonding", w: "High", d: "Hard" },
    { id: "ioc3", name: "Hydrogen", w: "Low", d: "Easy" },
    { id: "ioc4", name: "s-Block Elements", w: "Medium", d: "Easy" },
    { id: "ioc5", name: "p-Block Elements (Group 13-14)", w: "Medium", d: "Medium" },
    { id: "ioc6", name: "p-Block Elements (Group 15-18)", w: "High", d: "Medium" },
    { id: "ioc7", name: "d and f Block Elements", w: "High", d: "Medium" },
    { id: "ioc8", name: "Coordination Compounds", w: "High", d: "Hard" },
    { id: "ioc9", name: "Metallurgy (General Principles)", w: "Low", d: "Easy" },
    { id: "ioc10", name: "Qualitative Analysis", w: "Medium", d: "Medium" },
    { id: "ioc11", name: "Environmental Chemistry", w: "Low", d: "Easy" },
  ],
  oc: [
    { id: "oc1", name: "Basic Concepts & GOC (IUPAC, Isomerism)", w: "High", d: "Hard" },
    { id: "oc2", name: "Hydrocarbons", w: "Medium", d: "Medium" },
    { id: "oc3", name: "Haloalkanes and Haloarenes", w: "Medium", d: "Medium" },
    { id: "oc4", name: "Alcohols, Phenols and Ethers", w: "High", d: "Medium" },
    { id: "oc5", name: "Aldehydes and Ketones", w: "High", d: "Medium" },
    { id: "oc6", name: "Carboxylic Acids and Derivatives", w: "Medium", d: "Medium" },
    { id: "oc7", name: "Amines", w: "Medium", d: "Medium" },
    { id: "oc8", name: "Biomolecules", w: "Low", d: "Easy" },
    { id: "oc9", name: "Polymers", w: "Low", d: "Easy" },
    { id: "oc10", name: "Chemistry in Everyday Life", w: "Low", d: "Easy" },
  ],
  maths: [
    { id: "m1", name: "Sets, Relations and Functions", w: "Medium", d: "Medium" },
    { id: "m2", name: "Complex Numbers", w: "Medium", d: "Medium" },
    { id: "m3", name: "Quadratic Equations", w: "Medium", d: "Easy" },
    { id: "m4", name: "Sequences and Series", w: "Medium", d: "Medium" },
    { id: "m5", name: "Permutations and Combinations", w: "High", d: "Hard" },
    { id: "m6", name: "Binomial Theorem", w: "Medium", d: "Medium" },
    { id: "m7", name: "Matrices", w: "Medium", d: "Medium" },
    { id: "m8", name: "Determinants", w: "Medium", d: "Medium" },
    { id: "m9", name: "Straight Lines", w: "Medium", d: "Medium" },
    { id: "m10", name: "Circles", w: "High", d: "Medium" },
    { id: "m11", name: "Parabola", w: "Medium", d: "Medium" },
    { id: "m12", name: "Ellipse", w: "Medium", d: "Medium" },
    { id: "m13", name: "Hyperbola", w: "Low", d: "Medium" },
    { id: "m14", name: "Limits, Continuity and Differentiability", w: "High", d: "Hard" },
    { id: "m15", name: "Differentiation", w: "Medium", d: "Medium" },
    { id: "m16", name: "Application of Derivatives", w: "High", d: "Medium" },
    { id: "m17", name: "Indefinite Integration", w: "High", d: "Hard" },
    { id: "m18", name: "Definite Integration", w: "High", d: "Hard" },
    { id: "m19", name: "Area Under Curves", w: "Medium", d: "Medium" },
    { id: "m20", name: "Differential Equations", w: "Medium", d: "Medium" },
    { id: "m21", name: "Vectors (Maths)", w: "Medium", d: "Medium" },
    { id: "m22", name: "3D Geometry", w: "High", d: "Medium" },
    { id: "m23", name: "Probability", w: "High", d: "Medium" },
    { id: "m24", name: "Statistics", w: "Low", d: "Easy" },
    { id: "m25", name: "Trigonometric Ratios and Identities", w: "Medium", d: "Easy" },
    { id: "m26", name: "Trigonometric Equations", w: "Medium", d: "Medium" },
    { id: "m27", name: "Inverse Trigonometric Functions", w: "Medium", d: "Medium" },
    { id: "m28", name: "Height and Distance", w: "Low", d: "Easy" },
    { id: "m29", name: "Mathematical Reasoning", w: "Low", d: "Easy" },
    { id: "m30", name: "Mathematical Induction", w: "Low", d: "Easy" },
  ],
};

const SUBJECT_KEYS = Object.keys(SUBJECT_META);

// Geometry for the new brand mark: a broken progress-ring with a
// checkmark and a trail of motion ticks (mirrors the uploaded logo).
const LOGO_TICKS = Array.from({ length: 5 }, (_, i) => {
  const angle = ((40 + i * 13) * Math.PI) / 180;
  const rIn = 40;
  const len = 4 + i * 2.6;
  return {
    x1: 50 + Math.cos(angle) * rIn,
    y1: 48 + Math.sin(angle) * rIn,
    x2: 50 + Math.cos(angle) * (rIn + len),
    y2: 48 + Math.sin(angle) * (rIn + len),
  };
});

const W_COLORS = {
  High: { bg: "rgba(255,105,97,0.16)", text: "#ff6961", border: "rgba(255,105,97,0.4)" },
  Medium: { bg: "rgba(255,203,77,0.14)", text: "#ffcb4d", border: "rgba(255,203,77,0.4)" },
  Low: { bg: "rgba(172,167,192,0.14)", text: "#aca7c0", border: "rgba(172,167,192,0.35)" },
};
const D_COLORS = {
  Easy: { bg: "rgba(62,207,148,0.14)", text: "#3ecf94", border: "rgba(62,207,148,0.4)" },
  Medium: { bg: "rgba(94,177,240,0.14)", text: "#5eb1f0", border: "rgba(94,177,240,0.4)" },
  Hard: { bg: "rgba(255,105,97,0.14)", text: "#ff6961", border: "rgba(255,105,97,0.4)" },
};

// IMPORTANT: same key as before — this is what keeps every existing user's
// progress intact across this upgrade. Never change this string.
const STORAGE_KEY = "jee-tracker-data-v1";
const MOCK_CUTOFF_STR = "2027-01-10";
const EXAM_STR = "2027-01-20";

const BADGES = [
  { id: "first_step", label: "1 Chapter", icon: "🌱", desc: "Complete your first chapter", check: (d) => d.done >= 1 },
  { id: "ten_down", label: "10 Chapters", icon: "⚡", desc: "Finish 10 chapters", check: (d) => d.done >= 10 },
  { id: "quarter", label: "25% Done", icon: "🎯", desc: "25% of the syllabus done", check: (d) => d.pct >= 25 },
  { id: "half", label: "50% Done", icon: "🚀", desc: "50% of the syllabus done", check: (d) => d.pct >= 50 },
  { id: "three_q", label: "75% Done", icon: "🔥", desc: "75% of the syllabus done", check: (d) => d.pct >= 75 },
  { id: "full", label: "100% Done", icon: "🏆", desc: "All chapters completed", check: (d) => d.pct >= 100 },
  { id: "dpp_50", label: "50 DPPs", icon: "✍️", desc: "Clear 50 DPP sets", check: (d) => d.dppDone >= 50 },
  { id: "pyq_50", label: "50 PYQ Sets", icon: "📚", desc: "Clear 50 PYQ sets", check: (d) => d.pyqDone >= 50 },
  { id: "revise_25", label: "25 Revised", icon: "🔁", desc: "Revise 25 chapters", check: (d) => d.revisedDone >= 25 },
  { id: "streak_7", label: "7 Day Streak", icon: "🗓️", desc: "Study 7 days in a row", check: (d) => d.streak >= 7 },
  { id: "streak_30", label: "30 Day Streak", icon: "🌟", desc: "Study 30 days in a row", check: (d) => d.streak >= 30 },
  { id: "hours_100", label: "100 Hours", icon: "⏳", desc: "Log 100 total study hours", check: (d) => d.totalHours >= 100 },
  { id: "physics_done", label: "Physics Done", icon: "🧲", desc: "Complete all of Physics", check: (d) => d.subjectDone.physics },
  { id: "chem_done", label: "Chemistry Done", icon: "⚗️", desc: "Complete all of Chemistry", check: (d) => d.subjectDone.chem },
  { id: "maths_done", label: "Maths Done", icon: "📐", desc: "Complete all of Maths", check: (d) => d.subjectDone.maths },
];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function daysUntil(dateStr) {
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - nowMid) / 86400000);
}
function formatNiceDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function formatShortDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
function levelForXp(xp) {
  // gently increasing thresholds
  let level = 1, need = 100, total = 0;
  while (xp >= total + need) {
    total += need;
    level += 1;
    need = Math.round(need * 1.18);
  }
  return { level, into: xp - total, span: need, next: total + need };
}

/* ---------------- scroll-linked reveal hook ----------------
   Instead of firing a fixed-duration transition once a threshold is
   crossed (which feels like a "pop" mid-scroll), this ties opacity/
   transform directly to how far the element has travelled through a
   reveal band in the viewport — so it moves in lockstep with the
   scroll itself, frame by frame. Progress is monotonic (never reverses
   once revealed) so scrolling back up doesn't cause flicker. */
function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const maxProgress = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    let ticking = false;
    const compute = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const bandStart = vh * 0.94;
      const bandEnd = vh * 0.6;
      const raw = (bandStart - rect.top) / (bandStart - bandEnd);
      const clamped = Math.max(0, Math.min(1, raw));
      if (clamped > maxProgress.current) {
        maxProgress.current = clamped;
        setProgress(clamped);
      }
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(compute); }
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return [ref, progress];
}

/* ---------------- lightweight confetti burst (canvas, no deps) ---------------- */
function fireConfetti(originEl) {
  try {
    const rect = originEl?.getBoundingClientRect?.();
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 3;
    const colors = ["#7d7aff", "#34d6c4", "#ffcb4d", "#3ecf94", "#5eb1f0"];
    const particles = Array.from({ length: 46 }, () => ({
      x: cx, y: cy,
      vx: (Math.random() - 0.5) * 9,
      vy: -Math.random() * 8 - 3,
      g: 0.28 + Math.random() * 0.12,
      size: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      life: 0,
    }));
    let frame = 0;
    function tick() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
        const opacity = Math.max(0, 1 - p.life / 70);
        if (opacity > 0 && p.y < canvas.height + 20) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      }
      if (alive && frame < 90) requestAnimationFrame(tick);
      else document.body.removeChild(canvas);
    }
    requestAnimationFrame(tick);
  } catch (e) {
    // canvas unsupported — silently skip, never block the UI for this
  }
}

export default function App() {
  const [chapterState, setChapterState] = useState({});
  const [hoursLog, setHoursLog] = useState({});
  const [mockTests, setMockTests] = useState([]);
  const [focusList, setFocusList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [savedPulse, setSavedPulse] = useState(false);

  const [activeSubject, setActiveSubject] = useState("physics");
  const [search, setSearch] = useState("");
  const [wFilter, setWFilter] = useState("All");
  const [dFilter, setDFilter] = useState("All");
  const [pendingOnly, setPendingOnly] = useState(false);
  const [openNotesId, setOpenNotesId] = useState(null);
  const [chartView, setChartView] = useState("bars"); // 'bars' | 'heatmap'

  const [logDate, setLogDate] = useState(todayStr());
  const [lectureH, setLectureH] = useState("");
  const [selfH, setSelfH] = useState("");
  const [formMsg, setFormMsg] = useState("");

  const [addingFocus, setAddingFocus] = useState(false);
  const [focusSearch, setFocusSearch] = useState("");

  const [mtName, setMtName] = useState("");
  const [mtDate, setMtDate] = useState(todayStr());
  const [mtScore, setMtScore] = useState("");
  const [mtMax, setMtMax] = useState("300");
  const [mtMsg, setMtMsg] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState(null); // { icon, title, sub }
  const fileInputRef = useRef(null);
  const checklistRef = useRef(null);
  const tabsWrapRef = useRef(null);
  const tabRefs = useRef({});
  const [tabIndicator, setTabIndicator] = useState({ left: 0, top: 0, width: 0, height: 0, ready: false });
  const seenBadgesRef = useRef(null); // null until first computed, so first load never toasts
  const xpBarRef = useRef(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [ringAnimated, setRingAnimated] = useState(false);

  const [dashRef, dashProgress] = useScrollProgress();
  const [focusRef, focusProgress] = useScrollProgress();
  const [hoursRef, hoursProgress] = useScrollProgress();
  const [mockRef, mockProgress] = useScrollProgress();
  const [checklistRevealRef, checklistProgress] = useScrollProgress();

  const goToSubject = useCallback((key) => {
    setActiveSubject(key);
    checklistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const showToast = useCallback((t) => {
    setToast(t);
    setTimeout(() => setToast(null), 3600);
  }, []);

  /* ---------------- sliding tab indicator ---------------- */
  useEffect(() => {
    const measure = () => {
      const el = tabRefs.current[activeSubject];
      if (el) setTabIndicator({ left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight, ready: true });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeSubject]);

  /* ---------------- load from localStorage on mount ----------------
     Backward-compatible: every new field defaults safely if missing,
     so upgrading the app NEVER erases anyone's existing progress. */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.chapterState) setChapterState(parsed.chapterState);
        if (parsed.hoursLog) setHoursLog(parsed.hoursLog);
        if (Array.isArray(parsed.mockTests)) setMockTests(parsed.mockTests);
        if (Array.isArray(parsed.focusList)) setFocusList(parsed.focusList);
      }
    } catch (e) {
      // no saved data yet, or storage unavailable — start fresh, never throw
    }
    setLoaded(true);
    requestAnimationFrame(() => setTimeout(() => setRingAnimated(true), 120));
  }, []);

  /* ---------------- debounced auto-save ---------------- */
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ chapterState, hoursLog, mockTests, focusList }));
        setSavedPulse(true);
        setTimeout(() => setSavedPulse(false), 1200);
      } catch (e) {
        // storage full or unavailable — ignore, next successful save will catch up
      }
    }, 450);
    return () => clearTimeout(t);
  }, [chapterState, hoursLog, mockTests, focusList, loaded]);

  const toggleField = useCallback((chapterId, field, evt) => {
    setChapterState((prev) => {
      const wasOn = !!prev[chapterId]?.[field];
      if (field === "completed" && !wasOn && evt?.currentTarget) {
        fireConfetti(evt.currentTarget);
      }
      return { ...prev, [chapterId]: { ...prev[chapterId], [field]: !wasOn } };
    });
  }, []);

  const setNotes = useCallback((chapterId, text) => {
    setChapterState((prev) => ({ ...prev, [chapterId]: { ...prev[chapterId], notes: text } }));
  }, []);

  /* ---------------- derived stats ---------------- */
  const allFlat = useMemo(
    () => SUBJECT_KEYS.flatMap((k) => CHAPTERS[k].map((c) => ({ ...c, subject: k }))),
    []
  );

  const subjectStats = useMemo(() => {
    const stats = {};
    SUBJECT_KEYS.forEach((k) => {
      const chapters = CHAPTERS[k];
      const done = chapters.filter((c) => chapterState[c.id]?.completed).length;
      stats[k] = { done, total: chapters.length };
    });
    return stats;
  }, [chapterState]);

  const overall = useMemo(() => {
    const total = allFlat.length;
    const done = allFlat.filter((c) => chapterState[c.id]?.completed).length;
    const dppDone = allFlat.filter((c) => chapterState[c.id]?.dpp).length;
    const pyqDone = allFlat.filter((c) => chapterState[c.id]?.pyq).length;
    const revisedDone = allFlat.filter((c) => chapterState[c.id]?.revised).length;
    return { total, done, dppDone, pyqDone, revisedDone };
  }, [allFlat, chapterState]);

  const chemistryStats = useMemo(() => {
    const keys = ["pc", "ioc", "oc"];
    const total = keys.reduce((s, k) => s + subjectStats[k].total, 0);
    const done = keys.reduce((s, k) => s + subjectStats[k].done, 0);
    return { total, done };
  }, [subjectStats]);

  const filteredChapters = useMemo(() => {
    return CHAPTERS[activeSubject].filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (wFilter !== "All" && c.w !== wFilter) return false;
      if (dFilter !== "All" && c.d !== dFilter) return false;
      if (pendingOnly && chapterState[c.id]?.completed) return false;
      return true;
    });
  }, [activeSubject, search, wFilter, dFilter, pendingOnly, chapterState]);

  /* ---------------- study hours ---------------- */
  const sortedHoursEntries = useMemo(() => {
    return Object.entries(hoursLog)
      .map(([date, v]) => ({ date, lecture: Number(v.lecture) || 0, self: Number(v.self) || 0 }))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [hoursLog]);

  const last14 = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      const v = hoursLog[key];
      days.push({ date: key, lecture: v ? Number(v.lecture) || 0 : 0, self: v ? Number(v.self) || 0 : 0 });
    }
    return days;
  }, [hoursLog]);

  const heatmapWeeks = useMemo(() => {
    // 18 weeks (~126 days) ending today, Sun-start columns, GitHub-style
    const totalDays = 126;
    const end = new Date();
    const endDow = end.getDay();
    end.setDate(end.getDate() + (6 - endDow)); // extend to end of this week (Sat)
    const cells = [];
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      const v = hoursLog[key];
      const total = v ? (Number(v.lecture) || 0) + (Number(v.self) || 0) : 0;
      cells.push({ date: key, total, future: d > new Date() });
    }
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  }, [hoursLog]);

  const totalHoursAllTime = useMemo(
    () => sortedHoursEntries.reduce((s, e) => s + e.lecture + e.self, 0),
    [sortedHoursEntries]
  );
  const last7Total = useMemo(() => last14.slice(7).reduce((s, e) => s + e.lecture + e.self, 0), [last14]);
  const maxDayTotal = useMemo(() => Math.max(1, ...last14.map((e) => e.lecture + e.self)), [last14]);

  const streak = useMemo(() => {
    let count = 0;
    let d = new Date();
    let key = todayStr();
    if (!hoursLog[key]) {
      d.setDate(d.getDate() - 1);
      key = dateKey(d);
    }
    while (hoursLog[key] && (Number(hoursLog[key].lecture) || 0) + (Number(hoursLog[key].self) || 0) > 0) {
      count++;
      d.setDate(d.getDate() - 1);
      key = dateKey(d);
    }
    return count;
  }, [hoursLog]);

  const handleSaveHours = () => {
    const l = parseFloat(lectureH) || 0;
    const s = parseFloat(selfH) || 0;
    if (!logDate) { setFormMsg("Pick a date first."); return; }
    if (l === 0 && s === 0) { setFormMsg("Enter at least one hour value."); return; }
    if (l < 0 || s < 0 || l > 24 || s > 24) { setFormMsg("Hours must be between 0 and 24."); return; }
    setHoursLog((prev) => ({ ...prev, [logDate]: { lecture: l, self: s } }));
    setFormMsg("Saved for " + formatNiceDate(logDate) + ".");
    setLectureH("");
    setSelfH("");
    setTimeout(() => setFormMsg(""), 2500);
  };

  const handleDeleteHours = (date) => {
    setHoursLog((prev) => {
      const next = { ...prev };
      delete next[date];
      return next;
    });
  };

  /* ---------------- mock tests ---------------- */
  const sortedMocks = useMemo(
    () => [...mockTests].sort((a, b) => (a.date < b.date ? -1 : 1)),
    [mockTests]
  );
  const mockMaxObserved = useMemo(
    () => Math.max(300, ...mockTests.map((m) => Number(m.maxScore) || 0)),
    [mockTests]
  );
  const bestMock = useMemo(
    () => mockTests.reduce((best, m) => {
      const pct = (Number(m.score) / Math.max(1, Number(m.maxScore))) * 100;
      return !best || pct > best.pct ? { ...m, pct } : best;
    }, null),
    [mockTests]
  );
  const avgMockPct = useMemo(() => {
    if (!mockTests.length) return 0;
    const total = mockTests.reduce((s, m) => s + (Number(m.score) / Math.max(1, Number(m.maxScore))) * 100, 0);
    return Math.round(total / mockTests.length);
  }, [mockTests]);

  const handleAddMock = () => {
    const score = parseFloat(mtScore);
    const max = parseFloat(mtMax);
    if (!mtName.trim()) { setMtMsg("Give the test a name."); return; }
    if (isNaN(score) || isNaN(max) || max <= 0) { setMtMsg("Enter a valid score and max marks."); return; }
    if (score < 0 || score > max) { setMtMsg("Score can't exceed max marks."); return; }
    setMockTests((prev) => [...prev, { id: `mt_${Date.now()}`, name: mtName.trim(), date: mtDate, score, maxScore: max }]);
    setMtMsg(`Logged "${mtName.trim()}".`);
    setMtName(""); setMtScore("");
    setTimeout(() => setMtMsg(""), 2500);
  };
  const handleDeleteMock = (id) => setMockTests((prev) => prev.filter((m) => m.id !== id));

  /* ---------------- XP / level / achievements (derived only — nothing new to store) ---------------- */
  const xp = useMemo(() => {
    return overall.done * 12 + overall.dppDone * 4 + overall.pyqDone * 4 + overall.revisedDone * 3 + Math.round(totalHoursAllTime * 1.5);
  }, [overall, totalHoursAllTime]);
  const levelInfo = useMemo(() => levelForXp(xp), [xp]);

  const badgeData = useMemo(() => {
    const pct = overall.total ? (overall.done / overall.total) * 100 : 0;
    return {
      done: overall.done, pct, dppDone: overall.dppDone, pyqDone: overall.pyqDone,
      revisedDone: overall.revisedDone, streak, totalHours: totalHoursAllTime,
      subjectDone: {
        physics: subjectStats.physics.done === subjectStats.physics.total,
        chem: chemistryStats.done === chemistryStats.total,
        maths: subjectStats.maths.done === subjectStats.maths.total,
      },
    };
  }, [overall, streak, totalHoursAllTime, subjectStats, chemistryStats]);

  const unlockedBadges = useMemo(() => BADGES.filter((b) => b.check(badgeData)), [badgeData]);

  useEffect(() => {
    if (!loaded) return;
    if (seenBadgesRef.current === null) {
      // first computation after load — just record, no toast (avoids
      // spamming toasts for badges the user already earned before)
      seenBadgesRef.current = new Set(unlockedBadges.map((b) => b.id));
      return;
    }
    const newly = unlockedBadges.filter((b) => !seenBadgesRef.current.has(b.id));
    if (newly.length) {
      unlockedBadges.forEach((b) => seenBadgesRef.current.add(b.id));
      const b = newly[0];
      showToast({ icon: b.icon, title: `Badge unlocked: ${b.label}`, sub: b.desc });
      if (xpBarRef.current) fireConfetti(xpBarRef.current);
    }
  }, [unlockedBadges, loaded, showToast]);

  /* ---------------- focus mode: user picks chapters manually ---------------- */
  const focusChapters = useMemo(
    () => focusList.map((id) => allFlat.find((c) => c.id === id)).filter(Boolean),
    [focusList, allFlat]
  );
  const focusPickerResults = useMemo(() => {
    const q = focusSearch.trim().toLowerCase();
    return allFlat
      .filter((c) => !focusList.includes(c.id))
      .filter((c) => !q || c.name.toLowerCase().includes(q))
      .slice(0, 40);
  }, [allFlat, focusList, focusSearch]);
  const addToFocus = useCallback((id) => {
    setFocusList((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);
  const removeFromFocus = useCallback((id) => {
    setFocusList((prev) => prev.filter((x) => x !== id));
  }, []);

  /* ---------------- countdown ---------------- */
  const daysToMock = Math.max(0, daysUntil(MOCK_CUTOFF_STR));
  const daysToExam = Math.max(0, daysUntil(EXAM_STR));

  /* ---------------- export / import ---------------- */
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ chapterState, hoursLog, mockTests, focusList }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jee-tracker-backup-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (parsed.chapterState) setChapterState(parsed.chapterState);
        if (parsed.hoursLog) setHoursLog(parsed.hoursLog);
        if (Array.isArray(parsed.mockTests)) setMockTests(parsed.mockTests);
        if (Array.isArray(parsed.focusList)) setFocusList(parsed.focusList);
        setErrorMsg("");
      } catch (err) {
        setErrorMsg("Couldn't read that file — make sure it's a valid backup JSON.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const resetAllProgress = () => {
    setChapterState({});
    setShowResetConfirm(false);
  };

  /* ---------------- shareable progress card ---------------- */
  const shareProgressCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080; canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
    grad.addColorStop(0, "#000000");
    grad.addColorStop(0.5, "#060608");
    grad.addColorStop(1, "#000000");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 1080, 1350);

    ctx.fillStyle = "rgba(125,122,255,0.18)";
    ctx.beginPath(); ctx.arc(900, 180, 260, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(52,214,196,0.13)";
    ctx.beginPath(); ctx.arc(120, 1200, 260, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#ffcb4d";
    ctx.font = "700 30px Segoe UI, sans-serif";
    ctx.fillText("JEE PREP TRACKER", 70, 120);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 150px Segoe UI, sans-serif";
    const pct = overall.total ? Math.round((overall.done / overall.total) * 100) : 0;
    ctx.fillText(`${pct}%`, 70, 320);

    ctx.fillStyle = "#d0d0d8";
    ctx.font = "600 32px Segoe UI, sans-serif";
    ctx.fillText(`${overall.done} / ${overall.total} chapters complete`, 70, 380);

    const rows = [
      ["Level", `${levelInfo.level}  (${xp} XP)`],
      ["Streak", `${streak} days`],
      ["DPPs cleared", `${overall.dppDone}`],
      ["PYQ sets cleared", `${overall.pyqDone}`],
      ["Total hours logged", `${totalHoursAllTime.toFixed(0)}h`],
      ["Badges earned", `${unlockedBadges.length} / ${BADGES.length}`],
      ["Days to JEE Mains", `${daysToExam}`],
    ];
    let y = 470;
    rows.forEach(([k, v]) => {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(70, y - 40, 940, 66);
      ctx.fillStyle = "#d0d0d8"; ctx.font = "600 26px Segoe UI, sans-serif";
      ctx.fillText(k, 100, y);
      ctx.fillStyle = "#ffffff"; ctx.font = "800 28px Segoe UI, sans-serif";
      ctx.fillText(v, 700, y);
      y += 92;
    });

    SUBJECT_KEYS.forEach((k, i) => {
      const s = subjectStats[k];
      const p = s.total ? s.done / s.total : 0;
      const barY = y + i * 60;
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(70, barY, 940, 34);
      ctx.fillStyle = SUBJECT_META[k].color;
      ctx.fillRect(70, barY, 940 * p, 34);
      ctx.fillStyle = "#fff"; ctx.font = "700 20px Segoe UI, sans-serif";
      ctx.fillText(`${SUBJECT_META[k].short}  ${s.done}/${s.total}`, 84, barY + 24);
    });

    ctx.fillStyle = "#8e8e93"; ctx.font = "600 22px Segoe UI, sans-serif";
    ctx.fillText(`Generated ${formatNiceDate(todayStr())} · Target 240–250/300 · OBC-NCL`, 70, 1300);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `jee-progress-${todayStr()}.png`; a.click();
      URL.revokeObjectURL(url);
    });
  };

  const overallPct = overall.total ? Math.round((overall.done / overall.total) * 100) : 0;
  const maxHeatVal = useMemo(() => Math.max(1, ...heatmapWeeks.flat().map((c) => c.total)), [heatmapWeeks]);
  const heatColor = (v) => {
    if (v <= 0) return "rgba(255,255,255,0.05)";
    const t = Math.min(1, v / maxHeatVal);
    if (t < 0.25) return "rgba(125,122,255,0.25)";
    if (t < 0.5) return "rgba(125,122,255,0.45)";
    if (t < 0.75) return "rgba(125,122,255,0.7)";
    return "#7d7aff";
  };

  return (
    <div className="jt-root">
      <style>{`
        * { box-sizing: border-box; }
        .jt-root {
          --bg-void: #000000;
          --bg-panel: rgba(255,255,255,0.045);
          --bg-panel-hover: rgba(255,255,255,0.075);
          --border-soft: rgba(125,122,255,0.18);
          --purple-1: #5e5ce6;
          --purple-2: #7d7aff;
          --pink: #34d6c4;
          --gold: #ffcb4d;
          --text: #ffffff;
          --text-dim: #d0d0d8;
          --text-faint: #8e8e93;
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif;
          background:
            radial-gradient(ellipse 80% 50% at 20% -10%, rgba(94,92,230,0.25), transparent),
            radial-gradient(ellipse 60% 50% at 100% 0%, rgba(52,214,196,0.15), transparent),
            radial-gradient(ellipse 80% 60% at 50% 120%, rgba(94,92,230,0.15), transparent),
            var(--bg-void);
          color: var(--text);
          min-height: 100svh;
          width: 100%;
          flex: 1;
          text-align: left;
          padding: 20px 16px 60px;
          position: relative;
          overflow-x: hidden;
          box-sizing: border-box;
        }
        .jt-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0);
          background-size: 26px 26px;
          pointer-events: none;
          z-index: 0;
        }
        .jt-shell { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(14px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes floatGlow { 0%,100% { transform: translateY(0px);} 50% { transform: translateY(-6px);} }
        @keyframes pulseDot { 0%,100% { opacity: 1; transform: scale(1);} 50% { opacity: 0.4; transform: scale(0.8);} }
        @keyframes shimmer { 0% { background-position: -200% 0;} 100% { background-position: 200% 0;} }
        @keyframes popIn { from { opacity: 0; transform: scale(0.85);} to { opacity: 1; transform: scale(1);} }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes slideInDown { from { opacity: 0; transform: translateY(-18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-48px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(48px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInUpFade { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes barShimmer { 0% { transform: translateX(-120%); } 100% { transform: translateX(260%); } }
        @keyframes badgePop { 0% { opacity: 0; transform: scale(0.5) rotate(-8deg);} 60% { opacity: 1; transform: scale(1.08) rotate(3deg);} 100% { transform: scale(1) rotate(0);} }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, -18px) scale(0.92); } to { opacity: 1; transform: translate(-50%, 0) scale(1); } }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 18px var(--card-glow, rgba(125,122,255,0.35)); } 50% { box-shadow: 0 0 32px var(--card-glow, rgba(125,122,255,0.55)); } }
        @keyframes xpFill { from { width: 0%; } }
        @keyframes ringSpin { from { stroke-dashoffset: 226; } }
        @keyframes float3 { 0%,100% { transform: translateY(0) rotate(0deg);} 50% { transform: translateY(-4px) rotate(1deg);} }
        @keyframes logoRingDraw { from { stroke-dashoffset: 226; } to { stroke-dashoffset: 0; } }
        @keyframes logoCheckDraw { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
        @keyframes logoTickIn { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }
        @keyframes logoSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes glassSheen {
          0%, 12% { left: -70%; }
          45% { left: 130%; }
          100% { left: 130%; }
        }

        .fade-in { animation: fadeInUp 0.5s ease both; }
        .slide-down { animation: slideInDown 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .slide-left { animation: slideInLeft 0.65s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .slide-up-1 { animation: slideInUpFade 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: 0.05s; }
        .slide-up-2 { animation: slideInUpFade 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: 0.12s; }
        .slide-up-3 { animation: slideInUpFade 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: 0.19s; }
        .slide-up-4 { animation: slideInUpFade 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: 0.26s; }
        .slide-up-5 { animation: slideInUpFade 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: 0.33s; }
        .slide-right-stagger { animation: slideInRight 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }

        /* ---------- scroll-triggered reveal (late, smooth, one-time) ---------- */
        .jt-reveal {
          will-change: opacity, transform;
          transition: opacity 0.12s linear, transform 0.12s linear;
        }
        .jt-reveal-child { transform: translateY(22px); transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }
        .jt-reveal-child.revealed { transform: translateY(0); }

        /* ---------- toast ---------- */
        .jt-toast {
          position: fixed; top: 18px; left: 50%; z-index: 200;
          display: flex; align-items: center; gap: 12px;
          background: linear-gradient(120deg, rgba(94,92,230,0.92), rgba(52,214,196,0.88));
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 18px; padding: 12px 18px;
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 12px 40px rgba(94,92,230,0.5);
          animation: toastIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
          max-width: 92vw;
        }
        .jt-toast .icon { font-size: 26px; animation: float3 1.6s ease-in-out infinite; }
        .jt-toast .title { font-size: 13.5px; font-weight: 800; color: #fff; }
        .jt-toast .sub { font-size: 11.5px; color: rgba(255,255,255,0.85); }

        /* ---------- top bar ---------- */
        .jt-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
        .jt-brand { display: flex; align-items: center; gap: 10px; }
        .jt-brand-badge {
          width: 40px; height: 40px; border-radius: 12px;
          background: #000;
          border: 1px solid rgba(255,255,255,0.16);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 1px rgba(125,122,255,0.22), 0 0 26px rgba(125,122,255,0.4);
          animation: floatGlow 4s ease-in-out infinite;
          position: relative; overflow: hidden; flex-shrink: 0;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease;
        }
        .jt-brand-badge::before {
          content: ''; position: absolute; inset: -60%;
          background: conic-gradient(from 0deg, transparent 0%, rgba(125,122,255,0.55) 12%, transparent 26%);
          animation: logoSpin 5.5s linear infinite;
          z-index: 0;
        }
        .jt-brand:hover .jt-brand-badge { transform: scale(1.07); box-shadow: 0 0 0 1px rgba(125,122,255,0.4), 0 0 34px rgba(125,122,255,0.6); }
        .jt-logo-svg { position: relative; z-index: 1; }
        .jt-logo-ring { stroke-dashoffset: 226; animation: logoRingDraw 1s cubic-bezier(0.65,0,0.35,1) 0.1s both; }
        .jt-logo-tick { opacity: 0; transform-origin: 50px 48px; animation: logoTickIn 0.35s ease both; }
        .jt-logo-check { stroke-dasharray: 100; stroke-dashoffset: 100; animation: logoCheckDraw 0.45s ease 0.85s both; }
        .jt-brand-title { font-size: 19px; font-weight: 800; letter-spacing: 0.3px; }
        .jt-brand-sub { font-size: 11.5px; color: var(--text-faint); margin-top: 1px; }
        .jt-save-indicator { display:flex; align-items:center; gap:6px; font-size: 11.5px; color: var(--text-faint); }
        .jt-save-dot { width: 7px; height: 7px; border-radius: 50%; background: #3ecf94; box-shadow: 0 0 8px #3ecf94; }
        .jt-save-dot.pulsing { animation: pulseDot 1s ease; }
        .jt-icon-btn {
          display:flex; align-items:center; gap:6px;
          background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
          color: var(--text-dim); padding: 7px 13px; border-radius: 12px;
          font-size: 12.5px; cursor: pointer; transition: all 0.2s;
        }
        .jt-icon-btn:hover { background: rgba(255,255,255,0.09); color: var(--text); border-color: rgba(125,122,255,0.45); transform: translateY(-1px); }

        /* ---------- XP bar ---------- */
        .jt-xp-wrap { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(16px) saturate(160%); -webkit-backdrop-filter: blur(16px) saturate(160%); border-radius: 999px; padding: 6px 14px 6px 8px; }
        .jt-xp-badge { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), #d9a300); display: flex; align-items: center; justify-content: center; font-size: 12.5px; font-weight: 900; color: #2b1e02; flex-shrink: 0; }
        .jt-xp-track { width: 120px; height: 7px; border-radius: 6px; background: rgba(255,255,255,0.1); overflow: hidden; }
        .jt-xp-fill { height: 100%; border-radius: 6px; background: linear-gradient(90deg, var(--gold), var(--pink)); animation: xpFill 1s cubic-bezier(0.22,1,0.36,1) both; }
        .jt-xp-text { font-size: 10.5px; color: var(--text-faint); white-space: nowrap; }

        /* ---------- countdown hero ---------- */
        .jt-hero {
          position: relative;
          border-radius: 26px;
          padding: 30px 28px;
          margin-bottom: 22px;
          background: linear-gradient(120deg, rgba(94,92,230,0.35), rgba(52,214,196,0.22), rgba(94,92,230,0.35));
          background-size: 200% 200%;
          animation: gradientShift 10s ease infinite;
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 0 60px rgba(94,92,230,0.25), inset 0 0 60px rgba(94,92,230,0.06);
          overflow: hidden;
        }
        .jt-hero::after {
          content: ''; position: absolute; top: -40%; right: -10%; width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(52,214,196,0.35), transparent 70%);
          filter: blur(10px); pointer-events: none;
        }
        .jt-hero::before {
          content: '';
          position: absolute; top: -20%; left: -70%; width: 40%; height: 140%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.14), transparent);
          transform: skewX(-16deg);
          animation: glassSheen 12s ease-in-out infinite 1.5s;
          pointer-events: none;
        }
        .jt-hero-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; position: relative; z-index: 1; }
        .jt-hero-label { display:flex; align-items:center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--gold); letter-spacing: 1.5px; text-transform: uppercase; }
        .jt-hero-number {
          font-size: clamp(56px, 9vw, 92px); font-weight: 900; line-height: 1;
          background: linear-gradient(90deg, #fff, #e8e6f5 40%, var(--gold));
          -webkit-background-clip: text; background-clip: text; color: transparent;
          margin: 6px 0 2px; letter-spacing: -2px;
        }
        .jt-hero-caption { font-size: 14px; color: var(--text-dim); }
        .jt-hero-dates { display: flex; gap: 22px; flex-wrap: wrap; }
        .jt-hero-date-card {
          background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; padding: 12px 18px; min-width: 150px;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .jt-hero-date-card:hover { transform: translateY(-3px); border-color: rgba(125,122,255,0.5); }
        .jt-hero-date-card .k { font-size: 10.5px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-faint); margin-bottom: 4px; }
        .jt-hero-date-card .v { font-size: 16.5px; font-weight: 700; }
        .jt-hero-date-card .v2 { font-size: 11.5px; color: var(--text-dim); margin-top: 2px; }

        /* ---------- generic panel (liquid glass) ---------- */
        .jt-panel {
          background: linear-gradient(165deg, rgba(255,255,255,0.075), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 24px;
          padding: 20px;
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 0 0 32px rgba(255,255,255,0.02),
            0 10px 34px rgba(0,0,0,0.4);
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }
        .jt-panel::before {
          content: '';
          position: absolute; top: -20%; left: -70%; width: 45%; height: 140%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.10), transparent);
          transform: skewX(-16deg);
          animation: glassSheen 10s ease-in-out infinite;
          pointer-events: none;
        }
        .jt-panel:hover {
          border-color: rgba(255,255,255,0.22);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.24),
            inset 0 0 32px rgba(255,255,255,0.03),
            0 14px 40px rgba(0,0,0,0.48);
        }
        .jt-panel-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; margin-bottom: 4px; }
        .jt-panel-sub { font-size: 12px; color: var(--text-faint); margin-bottom: 16px; }
        .jt-panel-head-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }

        /* ---------- dashboard cards ---------- */
        .jt-stat-grid { display: grid; grid-template-columns: 1.3fr repeat(3, 1fr); gap: 14px; margin-bottom: 14px; }
        @media (max-width: 900px) { .jt-stat-grid { grid-template-columns: 1fr 1fr; } }
        .jt-ring-card {
          background: linear-gradient(145deg, rgba(94,92,230,0.18), rgba(52,214,196,0.10));
          border: 1px solid rgba(125,122,255,0.3);
          border-radius: 16px; padding: 18px; display: flex; align-items: center; gap: 16px;
        }
        .jt-ring { position: relative; width: 84px; height: 84px; flex-shrink: 0; }
        .jt-ring svg { transform: rotate(-90deg); }
        .jt-ring-label { position: absolute; inset: 0; display:flex; align-items:center; justify-content:center; font-size: 17px; font-weight: 800; }
        .jt-ring-card .info .t1 { font-size: 12px; color: var(--text-dim); }
        .jt-ring-card .info .t2 { font-size: 20px; font-weight: 800; margin: 2px 0; }
        .jt-ring-card .info .t3 { font-size: 11px; color: var(--text-faint); }

        .jt-mini-card {
          background: linear-gradient(165deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025));
          border: 1px solid rgba(255,255,255,0.13); border-radius: 18px; padding: 14px 16px;
          backdrop-filter: blur(18px) saturate(170%);
          -webkit-backdrop-filter: blur(18px) saturate(170%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.14);
          display: flex; flex-direction: column; gap: 8px; cursor: pointer; transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        .jt-mini-card:hover { background: linear-gradient(165deg, rgba(255,255,255,0.1), rgba(255,255,255,0.035)); border-color: rgba(255,255,255,0.2); transform: translateY(-3px) scale(1.015); }
        .jt-mini-card.active { border-color: var(--card-color, var(--purple-2)); animation: glowPulse 2.4s ease-in-out infinite; }
        .jt-mini-card .top { display: flex; align-items: center; justify-content: space-between; }
        .jt-mini-card .name { font-size: 12.5px; font-weight: 700; color: var(--text-dim); }
        .jt-mini-card .count { font-size: 11.5px; color: var(--text-faint); }
        .jt-bar-track { height: 7px; border-radius: 6px; background: rgba(255,255,255,0.08); overflow: hidden; }
        .jt-bar-fill { position: relative; height: 100%; border-radius: 6px; background: linear-gradient(90deg, var(--card-color, var(--purple-2)), var(--pink)); transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1); overflow: hidden; }
        .jt-bar-fill::after {
          content: ''; position: absolute; top: 0; left: 0; height: 100%; width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
          animation: barShimmer 2.4s ease-in-out infinite;
        }

        .jt-substat-row { display:flex; gap: 10px; margin-top: 4px; flex-wrap: wrap; }
        .jt-pill { font-size: 11px; padding: 5px 10px; border-radius: 999px; background: rgba(255,255,255,0.06); color: var(--text-dim); display:flex; gap:5px; align-items:center; }

        /* ---------- badges ---------- */
        .jt-badge-strip { display: flex; gap: 10px; overflow-x: auto; padding: 4px 2px 8px; margin-top: 14px; }
        .jt-badge {
          flex-shrink: 0; width: 96px; display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 12px 8px; border-radius: 14px; text-align: center;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          opacity: 0.35; filter: grayscale(1); transition: all 0.3s ease;
        }
        .jt-badge.earned { opacity: 1; filter: none; background: rgba(255,203,77,0.08); border-color: rgba(255,203,77,0.35); animation: badgePop 0.5s ease both; }
        .jt-badge .emoji { font-size: 26px; }
        .jt-badge .label { font-size: 10.5px; font-weight: 700; }
        .jt-badge .desc { font-size: 9px; color: var(--text-faint); line-height: 1.3; }

        /* ---------- focus mode ---------- */
        .jt-focus-list { display: flex; flex-direction: column; gap: 8px; }
        .jt-focus-row {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 10px 14px; transition: background 0.2s;
        }
        .jt-focus-row:hover { background: rgba(255,255,255,0.06); }
        .jt-focus-left { display: flex; align-items: center; gap: 10px; }
        .jt-focus-rank { width: 24px; height: 24px; border-radius: 8px; display:flex; align-items:center; justify-content:center; font-size: 11px; font-weight: 800; background: rgba(125,122,255,0.2); color: var(--purple-2); flex-shrink: 0; }
        .jt-focus-name { font-size: 13px; font-weight: 600; }
        .jt-focus-sub { font-size: 10.5px; color: var(--text-faint); }
        .jt-focus-btn { display: flex; align-items: center; gap: 5px; background: rgba(62,207,148,0.14); border: 1px solid rgba(62,207,148,0.4); color: #3ecf94; padding: 6px 11px; border-radius: 8px; font-size: 11.5px; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .jt-focus-btn:hover { background: rgba(62,207,148,0.25); transform: translateY(-1px); }
        .jt-focus-picker-list { display: flex; flex-direction: column; gap: 4px; max-height: 260px; overflow-y: auto; }
        .jt-focus-pick-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 12px; border-radius: 10px; cursor: pointer; transition: background 0.15s; border: 1px solid transparent; }
        .jt-focus-pick-row:hover { background: rgba(125,122,255,0.12); border-color: rgba(125,122,255,0.3); }

        /* ---------- study hours ---------- */
        .jt-hours-form { display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end; margin-bottom: 10px; }
        .jt-field { display: flex; flex-direction: column; gap: 5px; }
        .jt-field label { font-size: 11px; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.5px; }
        .jt-input {
          background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.14); color: var(--text);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          padding: 9px 12px; border-radius: 12px; font-size: 13.5px; outline: none; transition: border 0.2s, background 0.2s;
          width: 140px; max-width: 100%;
        }
        .jt-input:focus { border-color: var(--purple-2); background: rgba(255,255,255,0.08); box-shadow: 0 0 0 3px rgba(125,122,255,0.15); }
        textarea.jt-input { width: 100%; resize: vertical; min-height: 60px; font-family: inherit; }
        .jt-btn-primary {
          background: linear-gradient(135deg, var(--purple-1), var(--pink));
          color: white; border: none; padding: 10px 18px; border-radius: 12px; font-size: 13.5px; font-weight: 700;
          cursor: pointer; box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 16px rgba(125,122,255,0.35); transition: transform 0.15s, box-shadow 0.15s;
        }
        .jt-btn-primary:hover { transform: translateY(-1px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), 0 6px 20px rgba(125,122,255,0.5); }
        .jt-form-msg { font-size: 12px; color: var(--gold); margin-left: 4px; }

        .jt-view-toggle { display: flex; gap: 4px; background: rgba(0,0,0,0.25); border: 1px solid var(--border-soft); border-radius: 9px; padding: 3px; }
        .jt-view-toggle button { display:flex; align-items:center; gap:5px; background: transparent; border: none; color: var(--text-faint); padding: 6px 10px; border-radius: 7px; font-size: 11.5px; cursor: pointer; transition: all 0.2s; }
        .jt-view-toggle button.on { background: linear-gradient(135deg, var(--purple-1), var(--pink)); color: #fff; }

        .jt-analytics-top { display: flex; gap: 14px; margin: 16px 0; flex-wrap: wrap; }
        .jt-analytics-stat { background: rgba(0,0,0,0.25); border: 1px solid var(--border-soft); border-radius: 12px; padding: 10px 16px; flex: 1; min-width: 130px; transition: transform 0.2s; }
        .jt-analytics-stat:hover { transform: translateY(-2px); }
        .jt-analytics-stat .n { font-size: 21px; font-weight: 800; }
        .jt-analytics-stat .l { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

        .jt-chart { display: flex; align-items: flex-end; gap: 6px; height: 140px; padding: 10px 4px 0; overflow-x: auto; }
        .jt-chart-col { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 34px; flex: 1; }
        .jt-chart-bar-wrap { width: 100%; height: 100px; display: flex; flex-direction: column-reverse; border-radius: 6px 6px 3px 3px; overflow: hidden; background: rgba(255,255,255,0.04); }
        .jt-chart-seg-lecture { background: linear-gradient(180deg, var(--purple-2), var(--purple-1)); width: 100%; transition: height 0.4s ease; }
        .jt-chart-seg-self { background: linear-gradient(180deg, var(--pink), #1fa69a); width: 100%; transition: height 0.4s ease; }
        .jt-chart-date { font-size: 9.5px; color: var(--text-faint); }
        .jt-chart-total { font-size: 9.5px; color: var(--text-dim); font-weight: 700; }

        .jt-heatmap { display: flex; gap: 3px; overflow-x: auto; padding: 8px 2px; }
        .jt-heat-col { display: flex; flex-direction: column; gap: 3px; }
        .jt-heat-cell { width: 12px; height: 12px; border-radius: 3px; transition: transform 0.15s; }
        .jt-heat-cell:hover { transform: scale(1.4); }

        .jt-legend { display: flex; gap: 16px; font-size: 11.5px; color: var(--text-dim); margin-top: 10px; flex-wrap: wrap; }
        .jt-legend span { display: flex; align-items: center; gap: 6px; }
        .jt-legend .dot { width: 9px; height: 9px; border-radius: 3px; }

        .jt-log-list { margin-top: 14px; max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
        .jt-log-row { display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 9px; padding: 8px 12px; font-size: 12.5px; }
        .jt-log-row .d { color: var(--text-dim); font-weight: 600; width: 90px; }
        .jt-log-row .h { color: var(--text-faint); flex: 1; }
        .jt-log-row .total { font-weight: 700; color: var(--gold); margin-right: 10px; }
        .jt-log-del { background: none; border: none; color: var(--text-faint); cursor: pointer; padding: 3px; border-radius: 6px; }
        .jt-log-del:hover { color: #ff6961; background: rgba(255,105,97,0.12); }

        /* ---------- mock tests ---------- */
        .jt-mock-summary { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 16px; }
        .jt-mock-trend { display: flex; align-items: flex-end; gap: 8px; height: 90px; margin: 14px 0; padding: 0 2px; overflow-x: auto; }
        .jt-mock-bar-wrap { display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 30px; flex: 1; }
        .jt-mock-bar { width: 100%; border-radius: 5px 5px 2px 2px; background: linear-gradient(180deg, var(--gold), #d9a300); transition: height 0.5s cubic-bezier(0.22,1,0.36,1); }
        .jt-mock-list { display: flex; flex-direction: column; gap: 6px; max-height: 220px; overflow-y: auto; }
        .jt-mock-row { display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 9px; padding: 8px 12px; font-size: 12.5px; gap: 10px; }
        .jt-mock-row .name { font-weight: 700; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .jt-mock-row .score { color: var(--gold); font-weight: 800; white-space: nowrap; }

        /* ---------- subject tabs ---------- */
        .jt-tabs {
          display: flex; gap: 8px; margin-bottom: 16px; position: relative;
          flex-wrap: nowrap; overflow-x: auto; padding-bottom: 6px; -webkit-overflow-scrolling: touch;
        }
        .jt-tabs::-webkit-scrollbar { height: 6px; }
        .jt-tab-indicator {
          position: absolute; top: 0; left: 0;
          border-radius: 11px;
          background: linear-gradient(120deg, rgba(125,122,255,0.28), rgba(52,214,196,0.2));
          border: 1px solid rgba(125,122,255,0.5);
          box-shadow: 0 0 20px rgba(125,122,255,0.35);
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), width 0.35s cubic-bezier(0.22, 1, 0.36, 1), height 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none; z-index: 0;
        }
        .jt-tab {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 7px; flex-shrink: 0;
          background: var(--bg-panel); border: 1px solid var(--border-soft); color: var(--text-dim);
          padding: 9px 15px; border-radius: 11px; font-size: 13px; font-weight: 600; cursor: pointer; transition: color 0.2s; white-space: nowrap;
        }
        .jt-tab .badge { font-size: 10.5px; background: rgba(255,255,255,0.08); padding: 2px 7px; border-radius: 999px; }
        .jt-tab.active { color: white; }

        /* ---------- filters ---------- */
        .jt-filters { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 16px; }
        .jt-search-wrap { position: relative; flex: 1; min-width: 200px; }
        .jt-search-wrap input { width: 100%; padding-left: 34px; }
        .jt-search-wrap .icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--text-faint); }
        .jt-select {
          background: rgba(0,0,0,0.3); border: 1px solid var(--border-soft); color: var(--text-dim);
          padding: 9px 12px; border-radius: 9px; font-size: 12.5px; cursor: pointer; outline: none;
        }
        .jt-toggle { display: flex; align-items: center; gap: 7px; font-size: 12.5px; color: var(--text-dim); cursor: pointer; user-select: none; }
        .jt-toggle input { accent-color: var(--purple-2); width: 15px; height: 15px; cursor: pointer; }

        .jt-legend-row { display: flex; gap: 18px; flex-wrap: wrap; margin-bottom: 14px; font-size: 11px; color: var(--text-faint); }
        .jt-legend-group { display: flex; align-items: center; gap: 8px; }
        .jt-tag { padding: 2px 8px; border-radius: 999px; font-size: 10.5px; font-weight: 700; border: 1px solid; }

        /* ---------- chapter list ---------- */
        .jt-chapter-list { display: flex; flex-direction: column; gap: 8px; }
        .jt-chapter-row {
          display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-left: 3px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 12px 16px; animation: slideInRight 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; transition: border-color 0.3s, background 0.2s;
        }
        .jt-chapter-row:hover { background: rgba(255,255,255,0.045); }
        .jt-chapter-row.complete { border-left-color: #3ecf94; background: rgba(62,207,148,0.05); }
        .jt-chapter-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 220px; }
        .jt-chapter-name { font-size: 13.5px; font-weight: 600; }
        .jt-chapter-tags { display: flex; gap: 6px; margin-top: 5px; }
        .jt-chapter-checks { display: flex; gap: 14px; align-items: center; }
        .jt-check { display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; font-size: 11.5px; color: var(--text-dim); }
        .jt-check:focus-visible { outline: 2px solid var(--purple-2); outline-offset: 3px; border-radius: 6px; }
        .jt-tab:focus-visible, .jt-icon-btn:focus-visible, .jt-btn-primary:focus-visible { outline: 2px solid var(--purple-2); outline-offset: 2px; }
        .jt-check-box {
          width: 19px; height: 19px; border-radius: 6px; border: 1.5px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center; transition: all 0.2s; background: rgba(0,0,0,0.2);
        }
        .jt-check-box.on { background: linear-gradient(135deg, var(--purple-1), var(--pink)); border-color: transparent; animation: popIn 0.25s ease; }
        .jt-check-box.on.revised-on { background: linear-gradient(135deg, #5eb1f0, #3ecf94); }
        .jt-notes-btn { background: none; border: none; color: var(--text-faint); cursor: pointer; padding: 5px; border-radius: 6px; display: flex; align-items: center; transition: all 0.2s; }
        .jt-notes-btn:hover { color: var(--purple-2); background: rgba(125,122,255,0.12); }
        .jt-notes-btn.has-notes { color: var(--gold); }
        .jt-notes-box { width: 100%; margin-top: 8px; animation: slideInUpFade 0.25s ease both; }
        .jt-chapter-progress-dot { display: flex; gap: 3px; }
        .jt-chapter-progress-dot span { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.15); }
        .jt-chapter-progress-dot span.on { background: #3ecf94; box-shadow: 0 0 6px #3ecf94; }

        .jt-empty { text-align: center; padding: 40px 20px; color: var(--text-faint); font-size: 13px; }

        /* ---------- footer / modal ---------- */
        .jt-footer { text-align: center; font-size: 11.5px; color: var(--text-faint); margin-top: 26px; }
        .jt-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 20px; }
        .jt-modal {
          background: linear-gradient(165deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03)), #050506;
          border: 1px solid rgba(255,255,255,0.16); border-radius: 22px; padding: 24px; max-width: 360px;
          backdrop-filter: blur(30px) saturate(180%);
          -webkit-backdrop-filter: blur(30px) saturate(180%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.16), 0 20px 60px rgba(0,0,0,0.6);
        }
        .jt-modal h3 { margin: 0 0 8px; font-size: 16px; }
        .jt-modal p { font-size: 13px; color: var(--text-dim); margin: 0 0 18px; }
        .jt-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
        .jt-btn-ghost { background: transparent; border: 1px solid var(--border-soft); color: var(--text-dim); padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 12.5px; }
        .jt-btn-danger { background: linear-gradient(135deg, #ff6961, #c22e2e); color: white; border: none; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 12.5px; font-weight: 700; }
        .jt-error-banner { background: rgba(255,105,97,0.12); border: 1px solid rgba(255,105,97,0.35); color: #ffb3ad; padding: 10px 14px; border-radius: 10px; font-size: 12.5px; margin-bottom: 14px; display:flex; align-items:center; justify-content: space-between; gap: 10px; }

        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: rgba(125,122,255,0.35); border-radius: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }

        @media (prefers-reduced-motion: reduce) {
          .jt-root *, .jt-root *::before, .jt-root *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }

        /* ============================================================
           MOBILE
           ============================================================ */
        @media (max-width: 900px) {
          .jt-stat-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 640px) {
          .jt-root { padding: 14px 10px 40px; }
          .jt-topbar { flex-direction: column; align-items: flex-start; gap: 12px; }
          .jt-topbar > div:last-child { width: 100%; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
          .jt-save-indicator { order: 4; width: 100%; }
          .jt-xp-wrap { order: 1; width: 100%; justify-content: space-between; }
          .jt-icon-btn { padding: 8px 10px; font-size: 11.5px; flex: 1; justify-content: center; }

          .jt-hero { padding: 22px 16px; border-radius: 18px; }
          .jt-hero-inner { flex-direction: column; align-items: flex-start; gap: 18px; }
          .jt-hero-number { font-size: 64px; }
          .jt-hero-dates { width: 100%; gap: 10px; }
          .jt-hero-date-card { flex: 1 1 45%; min-width: 130px; padding: 10px 12px; }
          .jt-hero-date-card .v { font-size: 14.5px; }

          .jt-panel { padding: 15px; border-radius: 14px; }
          .jt-panel-title { font-size: 14px; }

          .jt-stat-grid { grid-template-columns: 1fr; gap: 10px; }
          .jt-ring-card { padding: 14px; }
          .jt-badge-strip { padding-bottom: 10px; }

          .jt-hours-form { flex-direction: column; align-items: stretch; gap: 10px; }
          .jt-field { width: 100%; }
          .jt-input { width: 100%; }
          .jt-btn-primary { width: 100%; text-align: center; }
          .jt-form-msg { margin-left: 0; }

          .jt-analytics-top { flex-direction: column; }
          .jt-analytics-stat { min-width: 0; }
          .jt-mock-summary { flex-direction: column; }

          .jt-chart { gap: 4px; }
          .jt-chart-col { min-width: 22px; }
          .jt-chart-date { font-size: 8px; }
          .jt-chart-total { font-size: 8px; }

          .jt-log-row { flex-wrap: wrap; gap: 4px 10px; }
          .jt-log-row .d { width: auto; }

          .jt-legend-row { flex-direction: column; gap: 8px; }

          .jt-filters { flex-direction: column; align-items: stretch; }
          .jt-search-wrap { min-width: 0; }
          .jt-select { width: 100%; }
          .jt-toggle { justify-content: flex-start; }

          .jt-chapter-row { flex-direction: column; align-items: stretch; gap: 10px; padding: 12px; }
          .jt-chapter-left { min-width: 0; }
          .jt-chapter-checks { justify-content: space-between; width: 100%; gap: 6px; flex-wrap: wrap; }
          .jt-check { flex-direction: column; gap: 4px; font-size: 10px; }

          .jt-modal { padding: 18px; }
        }

        @media (max-width: 380px) {
          .jt-hero-number { font-size: 52px; }
          .jt-hero-date-card { flex: 1 1 100%; }
          .jt-brand-title { font-size: 16.5px; }
        }
      `}</style>

      {toast && (
        <div className="jt-toast">
          <span className="icon">{toast.icon}</span>
          <div>
            <div className="title">{toast.title}</div>
            {toast.sub && <div className="sub">{toast.sub}</div>}
          </div>
        </div>
      )}

      <div className="jt-shell">
        {/* ---------------- top bar ---------------- */}
        <div className="jt-topbar slide-down">
          <div className="jt-brand">
            <div className="jt-brand-badge">
            <svg viewBox="0 0 100 100" width="24" height="24" className="jt-logo-svg">
              <circle
                cx="50" cy="48" r="36" fill="none" stroke="#fff" strokeWidth="9"
                strokeLinecap="round" strokeDasharray="182 44"
                transform="rotate(18 50 48)" className="jt-logo-ring"
              />
              {LOGO_TICKS.map((t, i) => (
                <line
                  key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                  stroke="#fff" strokeWidth="7" strokeLinecap="round"
                  className="jt-logo-tick" style={{ animationDelay: `${0.55 + i * 0.07}s` }}
                />
              ))}
              <polyline
                points="28,54 44,70 76,32" fill="none" stroke="#fff" strokeWidth="9"
                strokeLinecap="round" strokeLinejoin="round" className="jt-logo-check"
              />
            </svg>
          </div>
            <div>
              <div className="jt-brand-title">JEE Prep Tracker</div>
              <div className="jt-brand-sub">Physics · Chemistry · Maths — full syllabus checklist</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div className="jt-xp-wrap" ref={xpBarRef} title={`${levelInfo.into} / ${levelInfo.span} XP to level ${levelInfo.level + 1}`}>
              <div className="jt-xp-badge">L{levelInfo.level}</div>
              <div>
                <div className="jt-xp-track"><div className="jt-xp-fill" style={{ width: `${Math.min(100, (levelInfo.into / levelInfo.span) * 100)}%` }} /></div>
                <div className="jt-xp-text">{xp} XP</div>
              </div>
            </div>
            <div className="jt-save-indicator">
              <span className={`jt-save-dot ${savedPulse ? "pulsing" : ""}`} />
              Saved in your browser
            </div>
            <button className="jt-icon-btn" onClick={shareProgressCard}><Share2 size={13} /> Share card</button>
            <button className="jt-icon-btn" onClick={exportData}><Download size={13} /> Backup</button>
            <button className="jt-icon-btn" onClick={() => fileInputRef.current?.click()}><Upload size={13} /> Restore</button>
            <input ref={fileInputRef} type="file" accept="application/json" style={{ display: "none" }} onChange={importData} />
          </div>
        </div>

        {errorMsg && (
          <div className="jt-error-banner fade-in">
            <span>{errorMsg}</span>
            <button className="jt-icon-btn" onClick={() => setErrorMsg("")}><X size={12} /></button>
          </div>
        )}

        {/* ---------------- countdown hero ---------------- */}
        <div className="jt-hero slide-left">
          <div className="jt-hero-inner">
            <div>
              <div className="jt-hero-label"><Zap size={14} /> Days left for mock-test phase</div>
              <div className="jt-hero-number">{daysToMock}</div>
              <div className="jt-hero-caption">
                From today, {formatNiceDate(todayStr())} — after this you switch fully into mock-test mode.
              </div>
            </div>
            <div className="jt-hero-dates">
              <div className="jt-hero-date-card">
                <div className="k">Mock phase starts</div>
                <div className="v">{formatNiceDate(MOCK_CUTOFF_STR)}</div>
                <div className="v2">10-day buffer before the exam</div>
              </div>
              <div className="jt-hero-date-card">
                <div className="k">JEE Mains (target)</div>
                <div className="v">{formatNiceDate(EXAM_STR)}</div>
                <div className="v2">{daysToExam} days away</div>
              </div>
              <div className="jt-hero-date-card">
                <div className="k">Attempt</div>
                <div className="v">3rd attempt</div>
                <div className="v2">Target: 240–250 / 300 · OBC-NCL</div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- dashboard ---------------- */}
        <div
          className="jt-panel jt-reveal"
          ref={dashRef}
          style={{ opacity: dashProgress, transform: `translateY(${(1 - dashProgress) * 42}px)` }}
        >
          <div className="jt-panel-title"><Award size={16} color="var(--gold)" /> Dashboard</div>
          <div className="jt-panel-sub">Overall syllabus progress, subject-wise</div>

          <div className="jt-stat-grid">
            <div className="jt-ring-card slide-right-stagger" style={{ animationDelay: "0.05s" }}>
              <div className="jt-ring">
                <svg width="84" height="84">
                  <circle cx="42" cy="42" r="36" stroke="rgba(255,255,255,0.08)" strokeWidth="9" fill="none" />
                  <circle
                    cx="42" cy="42" r="36" stroke="url(#gradRing)" strokeWidth="9" fill="none"
                    strokeDasharray={2 * Math.PI * 36}
                    strokeDashoffset={ringAnimated ? 2 * Math.PI * 36 * (1 - overallPct / 100) : 2 * Math.PI * 36}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" }}
                  />
                  <defs>
                    <linearGradient id="gradRing" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7d7aff" />
                      <stop offset="100%" stopColor="#34d6c4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="jt-ring-label">{overallPct}%</div>
              </div>
              <div className="info">
                <div className="t1">Chapters completed</div>
                <div className="t2">{overall.done} / {overall.total}</div>
                <div className="t3">{overall.dppDone} DPPs · {overall.pyqDone} PYQ · {overall.revisedDone} revised</div>
              </div>
            </div>

            {["physics", null, "maths"].map((key, idx) => {
              if (key === null) {
                const s = chemistryStats;
                const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
                return (
                  <div
                    key="chem"
                    className="jt-mini-card slide-right-stagger"
                    style={{ "--card-color": "#e0a0c2", "--card-glow": "rgba(224,160,194,0.35)", animationDelay: "0.15s" }}
                    onClick={() => goToSubject("pc")}
                  >
                    <div className="top"><span className="name">Chemistry (P+I+O)</span><span className="count">{s.done}/{s.total}</span></div>
                    <div className="jt-bar-track"><div className="jt-bar-fill" style={{ width: pct + "%" }} /></div>
                    <div className="jt-substat-row">
                      {["pc", "ioc", "oc"].map((k) => (
                        <span
                          key={k}
                          className="jt-pill"
                          style={{ color: SUBJECT_META[k].color, cursor: "pointer" }}
                          onClick={(e) => { e.stopPropagation(); goToSubject(k); }}
                        >
                          {SUBJECT_META[k].short} {subjectStats[k].done}/{subjectStats[k].total}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }
              const s = subjectStats[key];
              const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
              const meta = SUBJECT_META[key];
              return (
                <div
                  key={key}
                  className="jt-mini-card slide-right-stagger"
                  style={{ "--card-color": meta.color, "--card-glow": meta.glow, animationDelay: `${0.05 + idx * 0.1}s` }}
                  onClick={() => goToSubject(key)}
                >
                  <div className="top"><span className="name">{meta.label}</span><span className="count">{s.done}/{s.total}</span></div>
                  <div className="jt-bar-track"><div className="jt-bar-fill" style={{ width: pct + "%" }} /></div>
                  <div className="jt-substat-row"><span className="jt-pill">{pct}% done</span></div>
                </div>
              );
            })}
          </div>

          <div className="jt-panel-head-row" style={{ marginTop: 6 }}>
            <div style={{ fontSize: 12.5, color: "var(--text-dim)", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <Trophy size={14} color="var(--gold)" /> Badges — {unlockedBadges.length}/{BADGES.length} earned
            </div>
          </div>
          <div className="jt-badge-strip">
            {BADGES.map((b, bi) => {
              const earned = unlockedBadges.some((u) => u.id === b.id);
              return (
                <div
                  key={b.id}
                  className={`jt-badge jt-reveal-child ${dashProgress > 0.45 ? "revealed" : ""} ${earned ? "earned" : ""}`}
                  style={{ transitionDelay: `${0.08 + bi * 0.035}s` }}
                  title={b.desc}
                >
                  <span className="emoji">{b.icon}</span>
                  <span className="label">{b.label}</span>
                  <span className="desc">{b.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------- focus mode ---------------- */}
        <div
          className="jt-panel jt-reveal"
          ref={focusRef}
          style={{ opacity: focusProgress, transform: `translateY(${(1 - focusProgress) * 42}px)` }}
        >
          <div className="jt-panel-head-row">
            <div>
              <div className="jt-panel-title"><Compass size={16} color="var(--purple-2)" /> Focus Mode — what to study next</div>
              <div className="jt-panel-sub" style={{ marginBottom: 0 }}>Your own shortlist — add the chapters you're prioritizing right now</div>
            </div>
            <button className="jt-icon-btn" onClick={() => { setAddingFocus((v) => !v); setFocusSearch(""); }}>
              <Plus size={13} /> {addingFocus ? "Close" : "Add chapter"}
            </button>
          </div>

          {addingFocus && (
            <div className="jt-notes-box" style={{ marginTop: 14, marginBottom: 6 }}>
              <div className="jt-search-wrap" style={{ marginBottom: 10 }}>
                <Search size={14} className="icon" />
                <input
                  className="jt-input"
                  style={{ width: "100%" }}
                  placeholder="Search any chapter across all subjects..."
                  value={focusSearch}
                  onChange={(e) => setFocusSearch(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="jt-focus-picker-list">
                {focusPickerResults.length === 0 && (
                  <div className="jt-empty" style={{ padding: "16px 10px" }}>
                    {focusList.length === allFlat.length ? "Every chapter is already in your focus list." : "No chapters match that search."}
                  </div>
                )}
                {focusPickerResults.map((c) => {
                  const meta = SUBJECT_META[c.subject];
                  return (
                    <div
                      key={c.id}
                      className="jt-focus-pick-row"
                      onClick={() => addToFocus(c.id)}
                    >
                      <div>
                        <div className="jt-focus-name">{c.name}</div>
                        <div className="jt-focus-sub" style={{ color: meta.color }}>{meta.label}</div>
                      </div>
                      <Plus size={15} color="var(--text-faint)" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {focusChapters.length === 0 ? (
            <div className="jt-empty">No chapters added yet — tap "Add chapter" and build your own shortlist.</div>
          ) : (
            <div className="jt-focus-list" style={{ marginTop: addingFocus ? 14 : 6 }}>
              {focusChapters.map((c) => {
                const wc = W_COLORS[c.w];
                const state = chapterState[c.id] || {};
                return (
                  <div className="jt-focus-row" key={c.id}>
                    <div className="jt-focus-left">
                      <span
                        className={`jt-check-box ${state.completed ? "on" : ""}`}
                        style={{ cursor: "pointer", flexShrink: 0 }}
                        onClick={(e) => toggleField(c.id, "completed", e)}
                        title="Toggle complete"
                      >
                        {state.completed && <CheckCircle2 size={13} color="#fff" />}
                      </span>
                      <div>
                        <div className="jt-focus-name" style={{ textDecoration: state.completed ? "line-through" : "none", opacity: state.completed ? 0.6 : 1 }}>{c.name}</div>
                        <div className="jt-focus-sub">{SUBJECT_META[c.subject].label} · <span style={{ color: wc.text }}>{c.w} weightage</span> · {c.d}</div>
                      </div>
                    </div>
                    <button className="jt-log-del" onClick={() => removeFromFocus(c.id)} title="Remove from focus list">
                      <X size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ---------------- study hours logger ---------------- */}
        <div
          className="jt-panel jt-reveal"
          ref={hoursRef}
          style={{ opacity: hoursProgress, transform: `translateY(${(1 - hoursProgress) * 42}px)` }}
        >
          <div className="jt-panel-title"><Clock size={16} color="var(--purple-2)" /> Study Hours Log</div>
          <div className="jt-panel-sub">Log lecture-watching and self-study hours for any date</div>

          <div className="jt-hours-form">
            <div className="jt-field">
              <label>Date</label>
              <input className="jt-input" type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} />
            </div>
            <div className="jt-field">
              <label>Lecture hours</label>
              <input className="jt-input" type="number" min="0" max="24" step="0.5" placeholder="e.g. 6" value={lectureH} onChange={(e) => setLectureH(e.target.value)} />
            </div>
            <div className="jt-field">
              <label>Self-study hours</label>
              <input className="jt-input" type="number" min="0" max="24" step="0.5" placeholder="e.g. 4" value={selfH} onChange={(e) => setSelfH(e.target.value)} />
            </div>
            <button className="jt-btn-primary" onClick={handleSaveHours}>Save entry</button>
            {formMsg && <span className="jt-form-msg">{formMsg}</span>}
          </div>

          <div className="jt-analytics-top">
            <div className="jt-analytics-stat"><div className="n">{totalHoursAllTime.toFixed(1)}h</div><div className="l">Total logged (all time)</div></div>
            <div className="jt-analytics-stat"><div className="n">{last7Total.toFixed(1)}h</div><div className="l">Last 7 days</div></div>
            <div className="jt-analytics-stat"><div className="n" style={{ display: "flex", alignItems: "center", gap: 6 }}><Flame size={16} color="var(--gold)" />{streak}</div><div className="l">Day streak</div></div>
            <div className="jt-analytics-stat"><div className="n">{(totalHoursAllTime / Math.max(1, sortedHoursEntries.length)).toFixed(1)}h</div><div className="l">Avg / logged day</div></div>
          </div>

          <div className="jt-panel-head-row" style={{ marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-dim)" }}>
              <TrendingUp size={14} /> {chartView === "bars" ? "Last 14 days" : "Last ~18 weeks"}
            </div>
            <div className="jt-view-toggle">
              <button className={chartView === "bars" ? "on" : ""} onClick={() => setChartView("bars")}><BarChart3 size={12} /> Bars</button>
              <button className={chartView === "heatmap" ? "on" : ""} onClick={() => setChartView("heatmap")}><Grid3x3 size={12} /> Heatmap</button>
            </div>
          </div>

          {chartView === "bars" ? (
            <>
              <div className="jt-chart">
                {last14.map((e) => {
                  const total = e.lecture + e.self;
                  const lecturePct = (e.lecture / maxDayTotal) * 100;
                  const selfPct = (e.self / maxDayTotal) * 100;
                  return (
                    <div className="jt-chart-col" key={e.date}>
                      <div className="jt-chart-total">{total > 0 ? total.toFixed(1) : ""}</div>
                      <div className="jt-chart-bar-wrap">
                        <div className="jt-chart-seg-lecture" style={{ height: lecturePct + "%" }} title={`Lecture: ${e.lecture}h`} />
                        <div className="jt-chart-seg-self" style={{ height: selfPct + "%" }} title={`Self-study: ${e.self}h`} />
                      </div>
                      <div className="jt-chart-date">{formatShortDate(e.date)}</div>
                    </div>
                  );
                })}
              </div>
              <div className="jt-legend">
                <span><span className="dot" style={{ background: "var(--purple-2)" }} /> Lecture watching</span>
                <span><span className="dot" style={{ background: "var(--pink)" }} /> Self study</span>
              </div>
            </>
          ) : (
            <>
              <div className="jt-heatmap">
                {heatmapWeeks.map((week, wi) => (
                  <div className="jt-heat-col" key={wi}>
                    {week.map((cell) => (
                      <div
                        key={cell.date}
                        className="jt-heat-cell"
                        style={{ background: cell.future ? "transparent" : heatColor(cell.total) }}
                        title={cell.future ? "" : `${formatNiceDate(cell.date)} · ${cell.total.toFixed(1)}h`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="jt-legend">
                <span>Less</span>
                <span className="dot" style={{ background: "rgba(255,255,255,0.05)" }} />
                <span className="dot" style={{ background: "rgba(125,122,255,0.25)" }} />
                <span className="dot" style={{ background: "rgba(125,122,255,0.45)" }} />
                <span className="dot" style={{ background: "rgba(125,122,255,0.7)" }} />
                <span className="dot" style={{ background: "#7d7aff" }} />
                <span>More</span>
              </div>
            </>
          )}

          {sortedHoursEntries.length > 0 && (
            <div className="jt-log-list">
              {sortedHoursEntries.map((e) => (
                <div className="jt-log-row" key={e.date}>
                  <span className="d">{formatNiceDate(e.date)}</span>
                  <span className="h">Lecture {e.lecture}h · Self {e.self}h</span>
                  <span className="total">{(e.lecture + e.self).toFixed(1)}h</span>
                  <button className="jt-log-del" onClick={() => handleDeleteHours(e.date)}><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---------------- mock test tracker ---------------- */}
        <div
          className="jt-panel jt-reveal"
          ref={mockRef}
          style={{ opacity: mockProgress, transform: `translateY(${(1 - mockProgress) * 42}px)` }}
        >
          <div className="jt-panel-title"><Rocket size={16} color="var(--gold)" /> Mock Test Tracker</div>
          <div className="jt-panel-sub">Log every full mock so you can see the score trend, not just the last number</div>

          <div className="jt-hours-form">
            <div className="jt-field" style={{ minWidth: 180 }}>
              <label>Test name</label>
              <input className="jt-input" style={{ width: "100%" }} placeholder="e.g. Allen Mock 7" value={mtName} onChange={(e) => setMtName(e.target.value)} />
            </div>
            <div className="jt-field">
              <label>Date</label>
              <input className="jt-input" type="date" value={mtDate} onChange={(e) => setMtDate(e.target.value)} />
            </div>
            <div className="jt-field">
              <label>Score</label>
              <input className="jt-input" style={{ width: 100 }} type="number" placeholder="e.g. 182" value={mtScore} onChange={(e) => setMtScore(e.target.value)} />
            </div>
            <div className="jt-field">
              <label>Max marks</label>
              <input className="jt-input" style={{ width: 100 }} type="number" placeholder="300" value={mtMax} onChange={(e) => setMtMax(e.target.value)} />
            </div>
            <button className="jt-btn-primary" onClick={handleAddMock}><Plus size={14} style={{ marginRight: 4, verticalAlign: -2 }} />Log test</button>
            {mtMsg && <span className="jt-form-msg">{mtMsg}</span>}
          </div>

          {mockTests.length > 0 && (
            <>
              <div className="jt-mock-summary">
                <div className="jt-analytics-stat"><div className="n">{mockTests.length}</div><div className="l">Mocks logged</div></div>
                <div className="jt-analytics-stat"><div className="n">{avgMockPct}%</div><div className="l">Average score</div></div>
                <div className="jt-analytics-stat"><div className="n" style={{ display: "flex", alignItems: "center", gap: 6 }}><Star size={16} color="var(--gold)" />{bestMock ? Math.round(bestMock.pct) : 0}%</div><div className="l">Best: {bestMock?.name}</div></div>
              </div>
              <div className="jt-mock-trend">
                {sortedMocks.slice(-14).map((m) => {
                  const pct = (m.score / m.maxScore) * 100;
                  return (
                    <div className="jt-mock-bar-wrap" key={m.id}>
                      <div className="jt-chart-total">{m.score}</div>
                      <div className="jt-mock-bar" style={{ height: `${Math.max(4, pct)}%` }} title={`${m.name}: ${m.score}/${m.maxScore}`} />
                      <div className="jt-chart-date">{formatShortDate(m.date)}</div>
                    </div>
                  );
                })}
              </div>
              <div className="jt-mock-list">
                {[...sortedMocks].reverse().map((m) => (
                  <div className="jt-mock-row" key={m.id}>
                    <span className="name">{m.name}</span>
                    <span style={{ color: "var(--text-faint)", whiteSpace: "nowrap" }}>{formatNiceDate(m.date)}</span>
                    <span className="score">{m.score}/{m.maxScore}</span>
                    <button className="jt-log-del" onClick={() => handleDeleteMock(m.id)}><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            </>
          )}
          {mockTests.length === 0 && <div className="jt-empty">No mocks logged yet — add your first one above once you sit one.</div>}
        </div>

        {/* ---------------- chapter checklist ---------------- */}
        <div
          className="jt-panel jt-reveal"
          ref={(el) => { checklistRef.current = el; checklistRevealRef.current = el; }}
          style={{ opacity: checklistProgress, transform: `translateY(${(1 - checklistProgress) * 42}px)` }}
        >
          <div className="jt-panel-title"><BookOpen size={16} color="var(--purple-2)" /> Chapter Checklist</div>
          <div className="jt-panel-sub">Track chapter completion, DPPs, PYQs and revision — chapter by chapter</div>

          <div className="jt-tabs" ref={tabsWrapRef}>
            {tabIndicator.ready && (
              <div
                className="jt-tab-indicator"
                style={{
                  transform: `translate(${tabIndicator.left}px, ${tabIndicator.top}px)`,
                  width: tabIndicator.width,
                  height: tabIndicator.height,
                }}
              />
            )}
            {SUBJECT_KEYS.map((k) => {
              const meta = SUBJECT_META[k];
              const s = subjectStats[k];
              return (
                <div
                  key={k}
                  ref={(el) => { tabRefs.current[k] = el; }}
                  role="tab"
                  tabIndex={0}
                  aria-selected={activeSubject === k}
                  className={`jt-tab ${activeSubject === k ? "active" : ""}`}
                  style={{ "--tab-color": meta.color }}
                  onClick={() => setActiveSubject(k)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveSubject(k); } }}
                >
                  {meta.label} <span className="badge">{s.done}/{s.total}</span>
                </div>
              );
            })}
          </div>

          <div className="jt-legend-row">
            <div className="jt-legend-group">
              Weightage:
              {Object.entries(W_COLORS).map(([k, c]) => (
                <span key={k} className="jt-tag" style={{ color: c.text, borderColor: c.border, background: c.bg }}>{k}</span>
              ))}
            </div>
            <div className="jt-legend-group">
              Difficulty:
              {Object.entries(D_COLORS).map(([k, c]) => (
                <span key={k} className="jt-tag" style={{ color: c.text, borderColor: c.border, background: c.bg }}>{k}</span>
              ))}
            </div>
          </div>

          <div className="jt-filters">
            <div className="jt-search-wrap">
              <Search size={14} className="icon" />
              <input className="jt-input" style={{ width: "100%" }} placeholder="Search chapters..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="jt-select" value={wFilter} onChange={(e) => setWFilter(e.target.value)}>
              <option value="All">All weightage</option>
              <option value="High">High weightage</option>
              <option value="Medium">Medium weightage</option>
              <option value="Low">Low weightage</option>
            </select>
            <select className="jt-select" value={dFilter} onChange={(e) => setDFilter(e.target.value)}>
              <option value="All">All difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <label className="jt-toggle">
              <input type="checkbox" checked={pendingOnly} onChange={(e) => setPendingOnly(e.target.checked)} />
              Pending only
            </label>
          </div>

          <div className="jt-chapter-list" key={activeSubject}>
            {filteredChapters.length === 0 && <div className="jt-empty">No chapters match these filters.</div>}
            {filteredChapters.map((c, i) => {
              const state = chapterState[c.id] || {};
              const wc = W_COLORS[c.w];
              const dc = D_COLORS[c.d];
              const notesOpen = openNotesId === c.id;
              return (
                <div
                  className={`jt-chapter-row ${state.completed ? "complete" : ""}`}
                  key={activeSubject + "-" + c.id}
                  style={{ animationDelay: `${Math.min(i, 14) * 0.03}s` }}
                >
                  <div className="jt-chapter-left">
                    <div className="jt-chapter-progress-dot">
                      <span className={state.completed ? "on" : ""} />
                      <span className={state.dpp ? "on" : ""} />
                      <span className={state.pyq ? "on" : ""} />
                      <span className={state.revised ? "on" : ""} />
                    </div>
                    <div>
                      <div className="jt-chapter-name">{c.name}</div>
                      <div className="jt-chapter-tags">
                        <span className="jt-tag" style={{ color: wc.text, borderColor: wc.border, background: wc.bg }}>{c.w}</span>
                        <span className="jt-tag" style={{ color: dc.text, borderColor: dc.border, background: dc.bg }}>{c.d}</span>
                      </div>
                    </div>
                  </div>
                  <div className="jt-chapter-checks">
                    <label
                      className="jt-check"
                      role="checkbox"
                      aria-checked={!!state.completed}
                      tabIndex={0}
                      onClick={(e) => toggleField(c.id, "completed", e)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleField(c.id, "completed", e); } }}
                    >
                      <span className={`jt-check-box ${state.completed ? "on" : ""}`}>{state.completed && <CheckCircle2 size={13} color="#fff" />}</span>
                      Chapter
                    </label>
                    <label
                      className="jt-check"
                      role="checkbox"
                      aria-checked={!!state.dpp}
                      tabIndex={0}
                      onClick={(e) => toggleField(c.id, "dpp", e)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleField(c.id, "dpp", e); } }}
                    >
                      <span className={`jt-check-box ${state.dpp ? "on" : ""}`}>{state.dpp && <CheckCircle2 size={13} color="#fff" />}</span>
                      DPP
                    </label>
                    <label
                      className="jt-check"
                      role="checkbox"
                      aria-checked={!!state.pyq}
                      tabIndex={0}
                      onClick={(e) => toggleField(c.id, "pyq", e)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleField(c.id, "pyq", e); } }}
                    >
                      <span className={`jt-check-box ${state.pyq ? "on" : ""}`}>{state.pyq && <CheckCircle2 size={13} color="#fff" />}</span>
                      PYQ
                    </label>
                    <label
                      className="jt-check"
                      role="checkbox"
                      aria-checked={!!state.revised}
                      tabIndex={0}
                      onClick={(e) => toggleField(c.id, "revised", e)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleField(c.id, "revised", e); } }}
                    >
                      <span className={`jt-check-box ${state.revised ? "on revised-on" : ""}`}>{state.revised && <Repeat size={12} color="#fff" />}</span>
                      Revised
                    </label>
                    <button
                      className={`jt-notes-btn ${state.notes ? "has-notes" : ""}`}
                      title={state.notes ? "Edit note" : "Add a note"}
                      onClick={() => setOpenNotesId(notesOpen ? null : c.id)}
                    >
                      <PenLine size={14} />
                    </button>
                  </div>
                  {notesOpen && (
                    <div className="jt-notes-box">
                      <textarea
                        className="jt-input"
                        placeholder="Doubt to revisit, formula to remember, weak sub-topic..."
                        value={state.notes || ""}
                        onChange={(e) => setNotes(c.id, e.target.value)}
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <button className="jt-icon-btn" onClick={() => setShowResetConfirm(true)}><RotateCcw size={13} /> Reset chapter progress</button>
        </div>

        <div className="jt-footer">Data is saved automatically to this browser's local storage — it stays even after a refresh or an app update, but is tied to this browser/device. Use Backup to keep a portable copy, Restore to bring it back or move it to another device.</div>
      </div>

      {showResetConfirm && (
        <div className="jt-modal-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="jt-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Reset all chapter progress?</h3>
            <p>This clears every chapter/DPP/PYQ/revised checkbox and notes. Your study-hours log and mock tests stay untouched. This can't be undone.</p>
            <div className="jt-modal-actions">
              <button className="jt-btn-ghost" onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button className="jt-btn-danger" onClick={resetAllProgress}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}