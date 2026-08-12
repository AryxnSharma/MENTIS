import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Clock, BookOpen, CheckCircle2, Circle, Flame, TrendingUp, Calendar,
  Download, Upload, Search, X, Target, Zap, Award, ChevronDown, RotateCcw,
} from "lucide-react";

/* ============================================================
   SYLLABUS DATA — JEE Main + Advanced, chapter-wise
   w = weightage (High / Medium / Low)
   d = difficulty (Easy / Medium / Hard)
   ============================================================ */

const SUBJECT_META = {
  physics: { label: "Physics", short: "PHY", color: "#8b5cf6", glow: "rgba(139,92,246,0.45)" },
  pc: { label: "Physical Chemistry", short: "P.Chem", color: "#f472b6", glow: "rgba(244,114,182,0.45)" },
  ioc: { label: "Inorganic Chemistry", short: "I.Chem", color: "#fb923c", glow: "rgba(251,146,60,0.45)" },
  oc: { label: "Organic Chemistry", short: "O.Chem", color: "#34d399", glow: "rgba(52,211,153,0.45)" },
  maths: { label: "Mathematics", short: "MATH", color: "#60a5fa", glow: "rgba(96,165,250,0.45)" },
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

const W_COLORS = {
  High: { bg: "rgba(244,63,94,0.16)", text: "#fb7185", border: "rgba(244,63,94,0.4)" },
  Medium: { bg: "rgba(251,191,36,0.14)", text: "#fbbf24", border: "rgba(251,191,36,0.4)" },
  Low: { bg: "rgba(148,163,184,0.14)", text: "#94a3b8", border: "rgba(148,163,184,0.35)" },
};
const D_COLORS = {
  Easy: { bg: "rgba(52,211,153,0.14)", text: "#34d399", border: "rgba(52,211,153,0.4)" },
  Medium: { bg: "rgba(96,165,250,0.14)", text: "#60a5fa", border: "rgba(96,165,250,0.4)" },
  Hard: { bg: "rgba(244,63,94,0.14)", text: "#fb7185", border: "rgba(244,63,94,0.4)" },
};

const STORAGE_KEY = "jee-tracker-data-v1";
const MOCK_CUTOFF_STR = "2027-01-10"; // 10-day buffer before actual exam, for mock-test practice
const EXAM_STR = "2027-01-20"; // approx JEE Main Jan 2027 window start

function todayStr() {
  const d = new Date();
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

export default function App() {
  const [chapterState, setChapterState] = useState({});
  const [hoursLog, setHoursLog] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [savedPulse, setSavedPulse] = useState(false);

  const [activeSubject, setActiveSubject] = useState("physics");
  const [search, setSearch] = useState("");
  const [wFilter, setWFilter] = useState("All");
  const [dFilter, setDFilter] = useState("All");
  const [pendingOnly, setPendingOnly] = useState(false);

  const [logDate, setLogDate] = useState(todayStr());
  const [lectureH, setLectureH] = useState("");
  const [selfH, setSelfH] = useState("");
  const [formMsg, setFormMsg] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);
  const checklistRef = useRef(null);
  const tabsWrapRef = useRef(null);
  const tabRefs = useRef({});
  const [tabIndicator, setTabIndicator] = useState({ left: 0, width: 0, ready: false });

  const goToSubject = useCallback((key) => {
    setActiveSubject(key);
    checklistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /* ---------------- sliding tab indicator ---------------- */
  useEffect(() => {
    const measure = () => {
      const el = tabRefs.current[activeSubject];
      if (el) setTabIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeSubject]);

  /* ---------------- load from localStorage on mount ---------------- */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.chapterState) setChapterState(parsed.chapterState);
        if (parsed.hoursLog) setHoursLog(parsed.hoursLog);
      }
    } catch (e) {
      // no saved data yet, or storage unavailable — start fresh
    }
    setLoaded(true);
  }, []);

  /* ---------------- debounced auto-save ---------------- */
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ chapterState, hoursLog }));
        setSavedPulse(true);
        setTimeout(() => setSavedPulse(false), 1200);
      } catch (e) {
        // storage full or unavailable — ignore, next successful save will catch up
      }
    }, 450);
    return () => clearTimeout(t);
  }, [chapterState, hoursLog, loaded]);

  const toggleField = useCallback((chapterId, field) => {
    setChapterState((prev) => ({
      ...prev,
      [chapterId]: { ...prev[chapterId], [field]: !prev[chapterId]?.[field] },
    }));
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
    return { total, done, dppDone, pyqDone };
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
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const v = hoursLog[key];
      days.push({ date: key, lecture: v ? Number(v.lecture) || 0 : 0, self: v ? Number(v.self) || 0 : 0 });
    }
    return days;
  }, [hoursLog]);

  const totalHoursAllTime = useMemo(
    () => sortedHoursEntries.reduce((s, e) => s + e.lecture + e.self, 0),
    [sortedHoursEntries]
  );
  const last7Total = useMemo(
    () => last14.slice(7).reduce((s, e) => s + e.lecture + e.self, 0),
    [last14]
  );
  const maxDayTotal = useMemo(
    () => Math.max(1, ...last14.map((e) => e.lecture + e.self)),
    [last14]
  );

  const streak = useMemo(() => {
    let count = 0;
    let d = new Date();
    // if today has no entry yet, streak still counts from yesterday backward
    let key = todayStr();
    if (!hoursLog[key]) {
      d.setDate(d.getDate() - 1);
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }
    while (hoursLog[key] && (Number(hoursLog[key].lecture) || 0) + (Number(hoursLog[key].self) || 0) > 0) {
      count++;
      d.setDate(d.getDate() - 1);
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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

  /* ---------------- countdown ---------------- */
  const daysToMock = Math.max(0, daysUntil(MOCK_CUTOFF_STR));
  const daysToExam = Math.max(0, daysUntil(EXAM_STR));

  /* ---------------- export / import ---------------- */
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ chapterState, hoursLog }, null, 2)], { type: "application/json" });
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const overallPct = overall.total ? Math.round((overall.done / overall.total) * 100) : 0;

  return (
    <div className="jt-root">
      <style>{`
        * { box-sizing: border-box; }
        .jt-root {
          --bg-void: #0a0510;
          --bg-panel: rgba(255,255,255,0.035);
          --bg-panel-hover: rgba(255,255,255,0.06);
          --border-soft: rgba(168,85,247,0.18);
          --purple-1: #7c3aed;
          --purple-2: #a855f7;
          --pink: #ec4899;
          --gold: #fbbf24;
          --text: #f3ecff;
          --text-dim: #b8a6d9;
          --text-faint: #7a6a97;
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Inter', system-ui, sans-serif;
          background:
            radial-gradient(ellipse 80% 50% at 20% -10%, rgba(124,58,237,0.25), transparent),
            radial-gradient(ellipse 60% 50% at 100% 0%, rgba(236,72,153,0.15), transparent),
            radial-gradient(ellipse 80% 60% at 50% 120%, rgba(124,58,237,0.15), transparent),
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

        .fade-in { animation: fadeInUp 0.5s ease both; }
        .slide-down { animation: slideInDown 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .slide-left { animation: slideInLeft 0.65s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .slide-up-1 { animation: slideInUpFade 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: 0.05s; }
        .slide-up-2 { animation: slideInUpFade 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: 0.15s; }
        .slide-up-3 { animation: slideInUpFade 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: 0.25s; }
        .slide-right-stagger { animation: slideInRight 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }

        /* ---------- top bar ---------- */
        .jt-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
        .jt-brand { display: flex; align-items: center; gap: 10px; }
        .jt-brand-badge {
          width: 38px; height: 38px; border-radius: 11px;
          background: linear-gradient(135deg, var(--purple-1), var(--pink));
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 24px rgba(168,85,247,0.5);
          animation: floatGlow 4s ease-in-out infinite;
        }
        .jt-brand-title { font-size: 19px; font-weight: 800; letter-spacing: 0.3px; }
        .jt-brand-sub { font-size: 11.5px; color: var(--text-faint); margin-top: 1px; }
        .jt-save-indicator { display:flex; align-items:center; gap:6px; font-size: 11.5px; color: var(--text-faint); }
        .jt-save-dot { width: 7px; height: 7px; border-radius: 50%; background: #34d399; box-shadow: 0 0 8px #34d399; }
        .jt-save-dot.pulsing { animation: pulseDot 1s ease; }
        .jt-icon-btn {
          display:flex; align-items:center; gap:6px;
          background: var(--bg-panel); border: 1px solid var(--border-soft);
          color: var(--text-dim); padding: 7px 12px; border-radius: 9px;
          font-size: 12.5px; cursor: pointer; transition: all 0.2s;
        }
        .jt-icon-btn:hover { background: var(--bg-panel-hover); color: var(--text); border-color: rgba(168,85,247,0.4); }

        /* ---------- countdown hero ---------- */
        .jt-hero {
          position: relative;
          border-radius: 22px;
          padding: 30px 28px;
          margin-bottom: 22px;
          background: linear-gradient(120deg, rgba(124,58,237,0.35), rgba(236,72,153,0.22), rgba(124,58,237,0.35));
          background-size: 200% 200%;
          animation: gradientShift 10s ease infinite;
          border: 1px solid rgba(168,85,247,0.35);
          box-shadow: 0 0 60px rgba(124,58,237,0.25), inset 0 0 60px rgba(124,58,237,0.06);
          overflow: hidden;
        }
        .jt-hero::after {
          content: ''; position: absolute; top: -40%; right: -10%; width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(236,72,153,0.35), transparent 70%);
          filter: blur(10px); pointer-events: none;
        }
        .jt-hero-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; position: relative; z-index: 1; }
        .jt-hero-label { display:flex; align-items:center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--gold); letter-spacing: 1.5px; text-transform: uppercase; }
        .jt-hero-number {
          font-size: clamp(56px, 9vw, 92px); font-weight: 900; line-height: 1;
          background: linear-gradient(90deg, #fff, #e9d5ff 40%, var(--gold));
          -webkit-background-clip: text; background-clip: text; color: transparent;
          margin: 6px 0 2px; letter-spacing: -2px;
        }
        .jt-hero-caption { font-size: 14px; color: var(--text-dim); }
        .jt-hero-dates { display: flex; gap: 22px; flex-wrap: wrap; }
        .jt-hero-date-card {
          background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; padding: 12px 18px; min-width: 150px;
        }
        .jt-hero-date-card .k { font-size: 10.5px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-faint); margin-bottom: 4px; }
        .jt-hero-date-card .v { font-size: 16.5px; font-weight: 700; }
        .jt-hero-date-card .v2 { font-size: 11.5px; color: var(--text-dim); margin-top: 2px; }

        /* ---------- generic panel ---------- */
        .jt-panel {
          background: var(--bg-panel);
          border: 1px solid var(--border-soft);
          border-radius: 18px;
          padding: 20px;
          backdrop-filter: blur(14px);
          margin-bottom: 20px;
        }
        .jt-panel-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; margin-bottom: 4px; }
        .jt-panel-sub { font-size: 12px; color: var(--text-faint); margin-bottom: 16px; }

        /* ---------- dashboard cards ---------- */
        .jt-stat-grid { display: grid; grid-template-columns: 1.3fr repeat(3, 1fr); gap: 14px; margin-bottom: 14px; }
        @media (max-width: 900px) { .jt-stat-grid { grid-template-columns: 1fr 1fr; } }
        .jt-ring-card {
          background: linear-gradient(145deg, rgba(124,58,237,0.18), rgba(236,72,153,0.10));
          border: 1px solid rgba(168,85,247,0.3);
          border-radius: 16px; padding: 18px; display: flex; align-items: center; gap: 16px;
        }
        .jt-ring { position: relative; width: 84px; height: 84px; flex-shrink: 0; }
        .jt-ring svg { transform: rotate(-90deg); }
        .jt-ring-label { position: absolute; inset: 0; display:flex; align-items:center; justify-content:center; font-size: 17px; font-weight: 800; }
        .jt-ring-card .info .t1 { font-size: 12px; color: var(--text-dim); }
        .jt-ring-card .info .t2 { font-size: 20px; font-weight: 800; margin: 2px 0; }
        .jt-ring-card .info .t3 { font-size: 11px; color: var(--text-faint); }

        .jt-mini-card {
          background: var(--bg-panel); border: 1px solid var(--border-soft); border-radius: 16px; padding: 14px 16px;
          display: flex; flex-direction: column; gap: 8px; cursor: pointer; transition: all 0.2s;
        }
        .jt-mini-card:hover { background: var(--bg-panel-hover); transform: translateY(-2px); }
        .jt-mini-card.active { border-color: var(--card-color, var(--purple-2)); box-shadow: 0 0 20px var(--card-glow, rgba(168,85,247,0.35)); }
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

        /* ---------- study hours ---------- */
        .jt-hours-form { display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end; margin-bottom: 10px; }
        .jt-field { display: flex; flex-direction: column; gap: 5px; }
        .jt-field label { font-size: 11px; color: var(--text-faint); text-transform: uppercase; letter-spacing: 0.5px; }
        .jt-input {
          background: rgba(0,0,0,0.3); border: 1px solid var(--border-soft); color: var(--text);
          padding: 9px 12px; border-radius: 9px; font-size: 13.5px; outline: none; transition: border 0.2s;
          width: 140px; max-width: 100%;
        }
        .jt-input:focus { border-color: var(--purple-2); box-shadow: 0 0 0 3px rgba(168,85,247,0.15); }
        .jt-btn-primary {
          background: linear-gradient(135deg, var(--purple-1), var(--pink));
          color: white; border: none; padding: 10px 18px; border-radius: 9px; font-size: 13.5px; font-weight: 700;
          cursor: pointer; box-shadow: 0 4px 16px rgba(168,85,247,0.35); transition: transform 0.15s, box-shadow 0.15s;
        }
        .jt-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(168,85,247,0.5); }
        .jt-form-msg { font-size: 12px; color: var(--gold); margin-left: 4px; }

        .jt-analytics-top { display: flex; gap: 14px; margin: 16px 0; flex-wrap: wrap; }
        .jt-analytics-stat { background: rgba(0,0,0,0.25); border: 1px solid var(--border-soft); border-radius: 12px; padding: 10px 16px; flex: 1; min-width: 130px; }
        .jt-analytics-stat .n { font-size: 21px; font-weight: 800; }
        .jt-analytics-stat .l { font-size: 11px; color: var(--text-faint); margin-top: 2px; }

        .jt-chart { display: flex; align-items: flex-end; gap: 6px; height: 140px; padding: 10px 4px 0; overflow-x: auto; }
        .jt-chart-col { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 34px; flex: 1; }
        .jt-chart-bar-wrap { width: 100%; height: 100px; display: flex; flex-direction: column-reverse; border-radius: 6px 6px 3px 3px; overflow: hidden; background: rgba(255,255,255,0.04); }
        .jt-chart-seg-lecture { background: linear-gradient(180deg, var(--purple-2), var(--purple-1)); width: 100%; transition: height 0.4s ease; }
        .jt-chart-seg-self { background: linear-gradient(180deg, var(--pink), #be185d); width: 100%; transition: height 0.4s ease; }
        .jt-chart-date { font-size: 9.5px; color: var(--text-faint); }
        .jt-chart-total { font-size: 9.5px; color: var(--text-dim); font-weight: 700; }

        .jt-legend { display: flex; gap: 16px; font-size: 11.5px; color: var(--text-dim); margin-top: 10px; }
        .jt-legend span { display: flex; align-items: center; gap: 6px; }
        .jt-legend .dot { width: 9px; height: 9px; border-radius: 3px; }

        .jt-log-list { margin-top: 14px; max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
        .jt-log-row { display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 9px; padding: 8px 12px; font-size: 12.5px; }
        .jt-log-row .d { color: var(--text-dim); font-weight: 600; width: 90px; }
        .jt-log-row .h { color: var(--text-faint); flex: 1; }
        .jt-log-row .total { font-weight: 700; color: var(--gold); margin-right: 10px; }
        .jt-log-del { background: none; border: none; color: var(--text-faint); cursor: pointer; padding: 3px; border-radius: 6px; }
        .jt-log-del:hover { color: #fb7185; background: rgba(244,63,94,0.12); }

        /* ---------- subject tabs ---------- */
        .jt-tabs { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; position: relative; }
        .jt-tab-indicator {
          position: absolute; top: 0; left: 0; height: 100%;
          border-radius: 11px;
          background: linear-gradient(120deg, rgba(168,85,247,0.28), rgba(236,72,153,0.2));
          border: 1px solid rgba(168,85,247,0.5);
          box-shadow: 0 0 20px rgba(168,85,247,0.35);
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none; z-index: 0;
        }
        .jt-tab {
          position: relative; z-index: 1;
          display: flex; align-items: center; gap: 7px;
          background: var(--bg-panel); border: 1px solid var(--border-soft); color: var(--text-dim);
          padding: 9px 15px; border-radius: 11px; font-size: 13px; font-weight: 600; cursor: pointer; transition: color 0.2s;
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
        .jt-chapter-row.complete { border-left-color: #34d399; background: rgba(52,211,153,0.05); }
        .jt-chapter-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 220px; }
        .jt-chapter-name { font-size: 13.5px; font-weight: 600; }
        .jt-chapter-tags { display: flex; gap: 6px; margin-top: 5px; }
        .jt-chapter-checks { display: flex; gap: 16px; align-items: center; }
        .jt-check { display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; font-size: 11.5px; color: var(--text-dim); }
        .jt-check:focus-visible { outline: 2px solid var(--purple-2); outline-offset: 3px; border-radius: 6px; }
        .jt-tab:focus-visible, .jt-icon-btn:focus-visible, .jt-btn-primary:focus-visible { outline: 2px solid var(--purple-2); outline-offset: 2px; }
        .jt-check-box {
          width: 19px; height: 19px; border-radius: 6px; border: 1.5px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center; transition: all 0.2s; background: rgba(0,0,0,0.2);
        }
        .jt-check-box.on { background: linear-gradient(135deg, var(--purple-1), var(--pink)); border-color: transparent; animation: popIn 0.25s ease; }
        .jt-chapter-progress-dot { display: flex; gap: 3px; }
        .jt-chapter-progress-dot span { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.15); }
        .jt-chapter-progress-dot span.on { background: #34d399; box-shadow: 0 0 6px #34d399; }

        .jt-empty { text-align: center; padding: 40px 20px; color: var(--text-faint); font-size: 13px; }

        /* ---------- footer / modal ---------- */
        .jt-footer { text-align: center; font-size: 11.5px; color: var(--text-faint); margin-top: 26px; }
        .jt-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 20px; }
        .jt-modal { background: #150b22; border: 1px solid var(--border-soft); border-radius: 16px; padding: 24px; max-width: 360px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
        .jt-modal h3 { margin: 0 0 8px; font-size: 16px; }
        .jt-modal p { font-size: 13px; color: var(--text-dim); margin: 0 0 18px; }
        .jt-modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
        .jt-btn-ghost { background: transparent; border: 1px solid var(--border-soft); color: var(--text-dim); padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 12.5px; }
        .jt-btn-danger { background: linear-gradient(135deg, #f43f5e, #be123c); color: white; border: none; padding: 8px 14px; border-radius: 8px; cursor: pointer; font-size: 12.5px; font-weight: 700; }
        .jt-error-banner { background: rgba(244,63,94,0.12); border: 1px solid rgba(244,63,94,0.35); color: #fca5a5; padding: 10px 14px; border-radius: 10px; font-size: 12.5px; margin-bottom: 14px; display:flex; align-items:center; justify-content: space-between; gap: 10px; }

        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.35); border-radius: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }

        /* ============================================================
           MOBILE
           ============================================================ */
        @media (max-width: 900px) {
          .jt-stat-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 640px) {
          .jt-root { padding: 14px 10px 40px; }

          /* topbar */
          .jt-topbar { flex-direction: column; align-items: flex-start; gap: 12px; }
          .jt-topbar > div:last-child { width: 100%; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
          .jt-save-indicator { order: 3; width: 100%; }
          .jt-icon-btn { padding: 8px 10px; font-size: 11.5px; flex: 1; justify-content: center; }

          /* hero */
          .jt-hero { padding: 22px 16px; border-radius: 18px; }
          .jt-hero-inner { flex-direction: column; align-items: flex-start; gap: 18px; }
          .jt-hero-number { font-size: 64px; }
          .jt-hero-dates { width: 100%; gap: 10px; }
          .jt-hero-date-card { flex: 1 1 45%; min-width: 130px; padding: 10px 12px; }
          .jt-hero-date-card .v { font-size: 14.5px; }

          /* panels */
          .jt-panel { padding: 15px; border-radius: 14px; }
          .jt-panel-title { font-size: 14px; }

          /* dashboard */
          .jt-stat-grid { grid-template-columns: 1fr; gap: 10px; }
          .jt-ring-card { padding: 14px; }

          /* study hours form */
          .jt-hours-form { flex-direction: column; align-items: stretch; gap: 10px; }
          .jt-field { width: 100%; }
          .jt-input { width: 100%; }
          .jt-btn-primary { width: 100%; text-align: center; }
          .jt-form-msg { margin-left: 0; }

          .jt-analytics-top { flex-direction: column; }
          .jt-analytics-stat { min-width: 0; }

          .jt-chart { gap: 4px; }
          .jt-chart-col { min-width: 22px; }
          .jt-chart-date { font-size: 8px; }
          .jt-chart-total { font-size: 8px; }

          .jt-log-row { flex-wrap: wrap; gap: 4px 10px; }
          .jt-log-row .d { width: auto; }

          /* tabs — horizontal scroll instead of wrap, so labels stay full-size */
          .jt-tabs { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 6px; -webkit-overflow-scrolling: touch; }
          .jt-tab { flex-shrink: 0; }

          .jt-legend-row { flex-direction: column; gap: 8px; }

          /* filters */
          .jt-filters { flex-direction: column; align-items: stretch; }
          .jt-search-wrap { min-width: 0; }
          .jt-select { width: 100%; }
          .jt-toggle { justify-content: flex-start; }

          /* chapter rows */
          .jt-chapter-row { flex-direction: column; align-items: stretch; gap: 10px; padding: 12px; }
          .jt-chapter-left { min-width: 0; }
          .jt-chapter-checks { justify-content: space-between; width: 100%; gap: 8px; }
          .jt-check { flex-direction: column; gap: 4px; font-size: 10.5px; }

          .jt-modal { padding: 18px; }
        }

        @media (max-width: 380px) {
          .jt-hero-number { font-size: 52px; }
          .jt-hero-date-card { flex: 1 1 100%; }
          .jt-brand-title { font-size: 16.5px; }
        }
      `}</style>

      <div className="jt-shell">
        {/* ---------------- top bar ---------------- */}
        <div className="jt-topbar slide-down">
          <div className="jt-brand">
            <div className="jt-brand-badge"><Target size={19} color="#fff" /></div>
            <div>
              <div className="jt-brand-title">JEE Prep Tracker</div>
              <div className="jt-brand-sub">Physics · Chemistry · Maths — full syllabus checklist</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="jt-save-indicator">
              <span className={`jt-save-dot ${savedPulse ? "pulsing" : ""}`} />
              Saved in your browser
            </div>
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
        <div className="jt-panel slide-up-1">
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
                    strokeDashoffset={2 * Math.PI * 36 * (1 - overallPct / 100)}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.6s ease" }}
                  />
                  <defs>
                    <linearGradient id="gradRing" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="jt-ring-label">{overallPct}%</div>
              </div>
              <div className="info">
                <div className="t1">Chapters completed</div>
                <div className="t2">{overall.done} / {overall.total}</div>
                <div className="t3">{overall.dppDone} DPPs · {overall.pyqDone} PYQ sets cleared</div>
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
                    style={{ "--card-color": "#f472b6", "--card-glow": "rgba(244,114,182,0.35)", animationDelay: "0.15s" }}
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
        </div>

        {/* ---------------- study hours logger ---------------- */}
        <div className="jt-panel slide-up-2">
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

          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-dim)", marginBottom: 4 }}>
            <TrendingUp size={14} /> Last 14 days
          </div>
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

        {/* ---------------- chapter checklist ---------------- */}
        <div className="jt-panel slide-up-3" ref={checklistRef}>
          <div className="jt-panel-title"><BookOpen size={16} color="var(--purple-2)" /> Chapter Checklist</div>
          <div className="jt-panel-sub">Track chapter completion, DPPs and PYQs — chapter by chapter</div>

          <div className="jt-tabs" ref={tabsWrapRef}>
            {tabIndicator.ready && (
              <div
                className="jt-tab-indicator"
                style={{ transform: `translateX(${tabIndicator.left}px)`, width: tabIndicator.width }}
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
                      onClick={() => toggleField(c.id, "completed")}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleField(c.id, "completed"); } }}
                    >
                      <span className={`jt-check-box ${state.completed ? "on" : ""}`}>{state.completed && <CheckCircle2 size={13} color="#fff" />}</span>
                      Chapter
                    </label>
                    <label
                      className="jt-check"
                      role="checkbox"
                      aria-checked={!!state.dpp}
                      tabIndex={0}
                      onClick={() => toggleField(c.id, "dpp")}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleField(c.id, "dpp"); } }}
                    >
                      <span className={`jt-check-box ${state.dpp ? "on" : ""}`}>{state.dpp && <CheckCircle2 size={13} color="#fff" />}</span>
                      DPP
                    </label>
                    <label
                      className="jt-check"
                      role="checkbox"
                      aria-checked={!!state.pyq}
                      tabIndex={0}
                      onClick={() => toggleField(c.id, "pyq")}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleField(c.id, "pyq"); } }}
                    >
                      <span className={`jt-check-box ${state.pyq ? "on" : ""}`}>{state.pyq && <CheckCircle2 size={13} color="#fff" />}</span>
                      PYQ
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
          <button className="jt-icon-btn" onClick={() => setShowResetConfirm(true)}><RotateCcw size={13} /> Reset chapter progress</button>
        </div>

        <div className="jt-footer">Data is saved automatically to this browser's local storage — it stays even after a refresh, but is tied to this browser/device. Use Backup to keep a portable copy, Restore to bring it back or move it to another device.</div>
      </div>

      {showResetConfirm && (
        <div className="jt-modal-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="jt-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Reset all chapter progress?</h3>
            <p>This clears every chapter/DPP/PYQ checkbox. Your study-hours log stays untouched. This can't be undone.</p>
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