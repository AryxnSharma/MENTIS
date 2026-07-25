import { useState, useEffect, useRef, useCallback } from "react";
import { Brain, Sparkles, RotateCcw, Check, X, Loader2, HelpCircle } from "lucide-react";

const CATEGORIES = [
  { id: "anything", label: "Anything", desc: "a person, character, animal, or object" },
  { id: "character", label: "Character", desc: "a fictional or real person / character" },
  { id: "animal", label: "Animal", desc: "an animal species or specific famous animal" },
  { id: "object", label: "Object", desc: "an object, item, or thing" },
];

const ANSWERS = [
  { v: "Yes", key: "y" },
  { v: "Probably", key: "py" },
  { v: "Don't know", key: "d" },
  { v: "Probably not", key: "pn" },
  { v: "No", key: "n" },
];

const MAX_QUESTIONS = 20;
const MIN_QUESTIONS = 5;

function lerp(a, b, t) { return a + (b - a) * t; }
function lerpColor(c1, c2, t) {
  return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
}
function confidenceColor(conf) {
  const cyan = [76, 243, 255];
  const violet = [157, 92, 255];
  const amber = [255, 184, 76];
  const t = Math.max(0, Math.min(1, conf / 100));
  const rgb = t < 0.5 ? lerpColor(cyan, violet, t / 0.5) : lerpColor(violet, amber, (t - 0.5) / 0.5);
  return `rgb(${rgb[0] | 0}, ${rgb[1] | 0}, ${rgb[2] | 0})`;
}

function stripFences(s) {
  return s.replace(/```json/gi, "").replace(/```/g, "").trim();
}

async function storageGetArray(key) {
  try {
    const r = await window.storage.get(key, true);
    if (r && r.value) return JSON.parse(r.value);
    return [];
  } catch (e) {
    return [];
  }
}

async function storageAppendArray(key, item, cap = 500) {
  const current = await storageGetArray(key);
  const next = [...current, item].slice(-cap);
  try {
    await window.storage.set(key, JSON.stringify(next), true);
  } catch (e) {}
  return next;
}

function Orb({ confidence, phase, size = 240 }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const confRef = useRef(confidence);
  const phaseRef = useRef(phase);
  const collapseTRef = useRef(0);

  useEffect(() => { confRef.current = confidence; }, [confidence]);
  useEffect(() => { phaseRef.current = phase; collapseTRef.current = 0; }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const px = 300;
    canvas.width = px * dpr;
    canvas.height = px * dpr;
    ctx.scale(dpr, dpr);

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (particlesRef.current.length === 0) {
      const N = 100;
      particlesRef.current = Array.from({ length: N }, () => ({
        angle: Math.random() * Math.PI * 2,
        baseRadius: 60 + Math.random() * 60,
        speed: (Math.random() * 0.4 + 0.15) * (Math.random() < 0.5 ? 1 : -1),
        size: Math.random() * 2 + 0.8,
        wobble: Math.random() * Math.PI * 2,
      }));
    }

    const cx = px / 2, cy = px / 2;

    function draw() {
      ctx.clearRect(0, 0, px, px);
      const conf = confRef.current;
      const ph = phaseRef.current;
      const color = confidenceColor(conf);
      const spread = ph === "reveal" ? Math.max(0, 1 - collapseTRef.current) : 1 - conf / 130;

      // core glow
      const coreR = ph === "reveal" ? 14 + collapseTRef.current * 22 : 16 + (conf / 100) * 10;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3.2);
      grad.addColorStop(0, color.replace("rgb", "rgba").replace(")", ",0.55)"));
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // particles
      particlesRef.current.forEach((p) => {
        if (!reduceMotion) {
          p.angle += p.speed * 0.02 * (ph === "thinking" ? 2.4 : 1);
          p.wobble += 0.03;
        }
        const r = p.baseRadius * spread + Math.sin(p.wobble) * 4 * spread;
        const x = cx + Math.cos(p.angle) * r;
        const y = cy + Math.sin(p.angle) * r * 0.94;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color.replace("rgb", "rgba").replace(")", `,${0.35 + (1 - spread) * 0.5})`);
        ctx.fill();
      });

      if (ph === "reveal" && collapseTRef.current < 1) {
        collapseTRef.current = Math.min(1, collapseTRef.current + (reduceMotion ? 1 : 0.018));
      }

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

export default function Mentis() {
  const [phase, setPhase] = useState("landing"); // landing, thinking, playing, reveal, wrong-input, done
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [history, setHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [guess, setGuess] = useState(null);
  const [error, setError] = useState(null);
  const [wrongText, setWrongText] = useState("");
  const [doneStatus, setDoneStatus] = useState(null);
  const [stats, setStats] = useState({ totalGames: 0, correctGuesses: 0 });
  const [factsCount, setFactsCount] = useState(0);
  const [showTeach, setShowTeach] = useState(false);
  const [teachEntity, setTeachEntity] = useState("");
  const [teachFact, setTeachFact] = useState("");
  const [teachSaved, setTeachSaved] = useState(false);
  const lastCallRef = useRef(null);
  const knowledgeRef = useRef({ facts: [], misses: [] });

  useEffect(() => {
    const link1 = document.createElement("link");
    link1.rel = "stylesheet";
    link1.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link1);
    return () => { document.head.removeChild(link1); };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("stats:global", true);
        if (r && r.value) setStats(JSON.parse(r.value));
      } catch (e) {
        try { await window.storage.set("stats:global", JSON.stringify({ totalGames: 0, correctGuesses: 0 }), true); } catch (e2) {}
      }
    })();
    (async () => {
      const [facts, misses] = await Promise.all([storageGetArray("facts:library"), storageGetArray("misses:library")]);
      knowledgeRef.current = { facts, misses };
      setFactsCount(facts.length);
    })();
  }, []);

  const updateStats = useCallback(async (correct) => {
    setStats((prev) => {
      const next = { totalGames: prev.totalGames + 1, correctGuesses: prev.correctGuesses + (correct ? 1 : 0) };
      window.storage.set("stats:global", JSON.stringify(next), true).catch(() => {});
      return next;
    });
  }, []);

  const callMentis = useCallback(async (cat, hist) => {
    const { facts, misses } = knowledgeRef.current;
    const relevantFacts = facts.filter((f) => !f.category || f.category === cat.label).slice(-15);
    const relevantMisses = misses.filter((m) => !m.category || m.category === cat.label).slice(-10);

    const knowledgeBlock = `${relevantFacts.length ? `
Community-taught facts (players before you shared these — weigh them if relevant, but always trust the current player's actual answers over this):
${relevantFacts.map((f) => `- ${f.entity}: ${f.fact}`).join("\n")}` : ""}${relevantMisses.length ? `
Past misses to learn from (these guesses turned out wrong in earlier games — don't blindly avoid them, but don't repeat the same reasoning error either):
${relevantMisses.map((m) => `- Guessed "${m.guessed}", was actually "${m.actual}"`).join("\n")}` : ""}`;

    const system = `You are MENTIS, a hyper-perceptive reasoning engine playing a mind-reading guessing game, in the spirit of Akinator but far sharper. The player is silently thinking of a specific, real, well-known ${cat.desc}. Your job is to ask sharp, non-redundant yes/no-style questions that roughly bisect the remaining possibility space each time, using genuine information-theoretic reasoning, until you can confidently name the exact thing. Vary the angle of attack across questions: broad category, physical traits, function or role, era, fame, origin, associations, emotional tone. Never repeat a question that tests the same distinction as an earlier one.
${knowledgeBlock}

Respond with ONLY a single minified JSON object, no markdown fences, no commentary, no explanation, matching exactly one of these two shapes:

Asking a question: {"action":"question","question":"<next question, phrased naturally, answerable with yes/no/probably/probably not/don't know>","confidence":<integer 0-100, your certainty in a hypothetical best guess right now>}

Making a guess: {"action":"guess","guess":"<the specific, exact name of the person, character, animal, or object>","confidence":<integer 0-100>,"description":"<2-3 vivid, specific sentences revealing and describing the guess>","funFact":"<one short, surprising, true fact about it>"}

Rules:
- Ask at least ${MIN_QUESTIONS} questions before guessing, unless your confidence would genuinely exceed 95.
- If the question count so far is ${MAX_QUESTIONS - 1} or more, you MUST respond with action "guess" using your single best current hypothesis, no matter how uncertain.
- Confidence should climb realistically and non-linearly as answers narrow the space — do not start high.
- Be decisive, clever, and specific. You reason live; you are not a static decision tree.`;

    const userMsg = `Category: ${cat.label} — ${cat.desc}
Question count so far: ${hist.length}
History (question -> answer):
${hist.length ? hist.map((h, i) => `${i + 1}. ${h.question} -> ${h.answer}`).join("\n") : "(none yet — ask your strongest opening question)"}

Respond with the JSON object for your next action now.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: userMsg }],
      }),
    });
    const data = await response.json();
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    const parsed = JSON.parse(stripFences(text));
    return parsed;
  }, []);

  const fetchNext = useCallback(async (cat, hist) => {
    lastCallRef.current = { cat, hist };
    setError(null);
    setPhase("thinking");
    try {
      const result = await callMentis(cat, hist);
      if (result.action === "guess") {
        setGuess({
          name: result.guess,
          description: result.description,
          funFact: result.funFact,
          confidence: result.confidence ?? 90,
        });
        setConfidence(result.confidence ?? 90);
        setPhase("reveal");
      } else {
        setCurrentQuestion(result.question);
        setConfidence(result.confidence ?? 0);
        setPhase("playing");
      }
    } catch (e) {
      setError("MENTIS lost its train of thought for a moment.");
    }
  }, [callMentis]);

  const startGame = async (cat) => {
    setCategory(cat);
    setHistory([]);
    setGuess(null);
    setDoneStatus(null);
    const [facts, misses] = await Promise.all([storageGetArray("facts:library"), storageGetArray("misses:library")]);
    knowledgeRef.current = { facts, misses };
    setFactsCount(facts.length);
    fetchNext(cat, []);
  };

  const answer = (ans) => {
    const newHist = [...history, { question: currentQuestion, answer: ans }];
    setHistory(newHist);
    fetchNext(category, newHist);
  };

  const retry = () => {
    if (lastCallRef.current) fetchNext(lastCallRef.current.cat, lastCallRef.current.hist);
  };

  const handleCorrect = () => {
    updateStats(true);
    setDoneStatus("correct");
    setPhase("done");
  };
  const handleIncorrect = () => {
    setPhase("wrong-input");
  };
  const submitWrong = async () => {
    updateStats(false);
    const record = { category: category.label, guessed: guess ? guess.name : "", actual: wrongText.trim(), questionCount: history.length, ts: Date.now() };
    const next = await storageAppendArray("misses:library", record, 800);
    knowledgeRef.current = { ...knowledgeRef.current, misses: next };
    setDoneStatus("wrong");
    setPhase("done");
  };

  const submitFact = async () => {
    if (!teachEntity.trim() || !teachFact.trim()) return;
    const record = { entity: teachEntity.trim(), fact: teachFact.trim(), category: category.label, addedAt: Date.now() };
    const next = await storageAppendArray("facts:library", record, 1000);
    knowledgeRef.current = { ...knowledgeRef.current, facts: next };
    setFactsCount(next.length);
    setTeachEntity("");
    setTeachFact("");
    setTeachSaved(true);
    setTimeout(() => setTeachSaved(false), 2400);
  };

  const playAgain = () => {
    setPhase("landing");
    setHistory([]);
    setGuess(null);
    setCurrentQuestion("");
    setConfidence(0);
    setWrongText("");
    setError(null);
  };

  const accuracy = stats.totalGames > 0 ? Math.round((stats.correctGuesses / stats.totalGames) * 100) : null;

  return (
    <div className="mentis-root">
      <style>{`
        .mentis-root {
          min-height: 100vh;
          width: 100%;
          background: radial-gradient(ellipse 120% 80% at 50% -10%, #1a0f3d 0%, #06040F 55%), #06040F;
          color: #EDEBFF;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 16px 40px;
          position: relative;
          overflow-x: hidden;
        }
        .mentis-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(1px 1px at 20% 30%, rgba(157,92,255,0.35), transparent),
            radial-gradient(1px 1px at 70% 60%, rgba(76,243,255,0.3), transparent),
            radial-gradient(1.5px 1.5px at 40% 80%, rgba(255,184,76,0.2), transparent),
            radial-gradient(1px 1px at 85% 15%, rgba(157,92,255,0.3), transparent),
            radial-gradient(1px 1px at 10% 90%, rgba(76,243,255,0.25), transparent);
          pointer-events: none;
          z-index: 0;
        }
        .mentis-inner { position: relative; z-index: 1; width: 100%; max-width: 640px; display: flex; flex-direction: column; align-items: center; }
        .display-font { font-family: 'Space Grotesk', sans-serif; }
        .mono-font { font-family: 'JetBrains Mono', monospace; }
        .fade-in { animation: fadeInUp 0.5s ease both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .fade-in { animation: none; } }

        .brand-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .brand-title {
          font-size: 44px; font-weight: 700; letter-spacing: 0.08em;
          background: linear-gradient(120deg, #4CF3FF 0%, #9D5CFF 55%, #FFB84C 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .tagline { color: #8B85B8; text-align: center; font-size: 15px; max-width: 380px; line-height: 1.5; margin-top: 6px; }

        .cat-row { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 28px 0 18px; }
        .cat-pill {
          padding: 9px 18px; border-radius: 999px; border: 1px solid rgba(157,92,255,0.3);
          background: rgba(157,92,255,0.06); color: #C9C4F2; font-size: 14px; cursor: pointer;
          transition: all 0.2s ease; font-family: 'Inter', sans-serif;
        }
        .cat-pill:hover { border-color: rgba(76,243,255,0.5); background: rgba(76,243,255,0.08); }
        .cat-pill.active { background: linear-gradient(120deg, rgba(76,243,255,0.18), rgba(157,92,255,0.18)); border-color: #4CF3FF; color: #fff; box-shadow: 0 0 18px rgba(76,243,255,0.15); }
        .cat-pill:focus-visible { outline: 2px solid #4CF3FF; outline-offset: 2px; }

        .start-btn {
          margin-top: 6px; padding: 14px 36px; border-radius: 999px; border: none; cursor: pointer;
          background: linear-gradient(120deg, #4CF3FF, #9D5CFF); color: #06040F; font-weight: 600;
          font-size: 15px; letter-spacing: 0.03em; display: flex; align-items: center; gap: 8px;
          transition: transform 0.15s ease, box-shadow 0.2s ease; box-shadow: 0 0 24px rgba(157,92,255,0.35);
          font-family: 'Space Grotesk', sans-serif;
        }
        .start-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 30px rgba(76,243,255,0.4); }
        .start-btn:active { transform: translateY(0) scale(0.98); }
        .start-btn:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

        .stat-line { margin-top: 34px; color: #6C6693; font-size: 12.5px; letter-spacing: 0.04em; text-align: center; }
        .stat-line b { color: #A79EE0; }

        .topbar { display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 8px; }
        .badge { font-size: 11.5px; padding: 4px 11px; border-radius: 999px; border: 1px solid rgba(157,92,255,0.35); color: #B7AEF0; letter-spacing: 0.05em; }
        .qcount { color: #6C6693; font-size: 12px; letter-spacing: 0.06em; }

        .meter-wrap { width: 100%; max-width: 340px; margin: 6px 0 4px; }
        .meter-label { display: flex; justify-content: space-between; font-size: 11px; color: #6C6693; margin-bottom: 5px; letter-spacing: 0.06em; }
        .meter-track { height: 5px; border-radius: 4px; background: rgba(255,255,255,0.06); overflow: hidden; }
        .meter-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease, background 0.6s ease; }

        .status-text { color: #8B85B8; font-size: 13.5px; letter-spacing: 0.03em; margin-top: 10px; min-height: 18px; }
        .dots::after { content: ''; animation: dots 1.4s steps(4, end) infinite; }
        @keyframes dots { 0% { content: ''; } 25% { content: '.'; } 50% { content: '..'; } 75%, 100% { content: '...'; } }

        .question-text { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 500; text-align: center; line-height: 1.4; margin: 22px 0 26px; max-width: 480px; }

        .ans-row { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-width: 480px; }
        .ans-btn {
          padding: 11px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03); color: #EDEBFF; font-size: 14px; cursor: pointer;
          transition: all 0.15s ease; font-family: 'Inter', sans-serif; font-weight: 500;
        }
        .ans-btn:hover { border-color: rgba(76,243,255,0.5); background: rgba(76,243,255,0.08); transform: translateY(-1px); }
        .ans-btn:active { transform: scale(0.97); }
        .ans-btn:focus-visible { outline: 2px solid #4CF3FF; outline-offset: 2px; }
        .ans-btn.yes { border-color: rgba(76,243,255,0.25); }
        .ans-btn.no { border-color: rgba(255,79,90,0.25); }

        .reveal-card {
          background: linear-gradient(160deg, rgba(157,92,255,0.08), rgba(76,243,255,0.03));
          border: 1px solid rgba(157,92,255,0.25); border-radius: 20px; padding: 30px 28px;
          width: 100%; max-width: 460px; text-align: center; margin-top: 8px;
        }
        .reveal-eyebrow { color: #8B85B8; font-size: 12.5px; letter-spacing: 0.1em; text-transform: uppercase; }
        .reveal-name { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; margin: 10px 0 14px; background: linear-gradient(120deg, #FFB84C, #9D5CFF); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .reveal-desc { color: #D8D4F5; font-size: 15px; line-height: 1.6; margin-bottom: 14px; }
        .reveal-fact { color: #8B85B8; font-size: 13px; line-height: 1.5; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px; }
        .conf-badge { display: inline-block; margin-top: 16px; padding: 5px 14px; border-radius: 999px; font-size: 12px; font-family: 'JetBrains Mono', monospace; border: 1px solid rgba(255,184,76,0.35); color: #FFB84C; }

        .feedback-row { display: flex; gap: 12px; margin-top: 24px; }
        .fb-btn { padding: 11px 22px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); color: #EDEBFF; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 7px; font-weight: 500; transition: all 0.15s ease; }
        .fb-btn:hover { transform: translateY(-1px); }
        .fb-btn.correct:hover { border-color: #4CF3FF; background: rgba(76,243,255,0.08); }
        .fb-btn.incorrect:hover { border-color: #FF6B6B; background: rgba(255,107,107,0.08); }
        .fb-btn:focus-visible { outline: 2px solid #4CF3FF; outline-offset: 2px; }

        .wrong-input {
          width: 100%; max-width: 380px; padding: 13px 16px; border-radius: 12px;
          border: 1px solid rgba(157,92,255,0.3); background: rgba(255,255,255,0.03); color: #EDEBFF;
          font-size: 14px; font-family: 'Inter', sans-serif; margin-top: 18px;
        }
        .wrong-input:focus { outline: none; border-color: #4CF3FF; }
        .wrong-input::placeholder { color: #6C6693; }

        .done-title { font-family: 'Space Grotesk', sans-serif; font-size: 26px; font-weight: 600; margin-top: 18px; text-align: center; }
        .done-sub { color: #8B85B8; font-size: 14px; margin-top: 8px; text-align: center; max-width: 360px; line-height: 1.5; }

        .again-btn { margin-top: 26px; padding: 12px 28px; border-radius: 999px; border: 1px solid rgba(157,92,255,0.35); background: rgba(157,92,255,0.08); color: #EDEBFF; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; transition: all 0.15s ease; }
        .again-btn:hover { border-color: #4CF3FF; background: rgba(76,243,255,0.08); }
        .again-btn:focus-visible { outline: 2px solid #4CF3FF; outline-offset: 2px; }

        .error-box { color: #FF9B9B; font-size: 13px; margin-top: 14px; text-align: center; }
        .retry-link { color: #4CF3FF; cursor: pointer; text-decoration: underline; margin-left: 6px; }

        .teach-toggle { margin-top: 18px; background: none; border: none; color: #6C6693; font-size: 12.5px; cursor: pointer; letter-spacing: 0.03em; text-decoration: underline; text-underline-offset: 3px; }
        .teach-toggle:hover { color: #A79EE0; }
        .teach-toggle:focus-visible { outline: 2px solid #4CF3FF; outline-offset: 2px; }
        .teach-panel { margin-top: 16px; width: 100%; max-width: 340px; padding: 20px; border-radius: 16px; border: 1px solid rgba(157,92,255,0.25); background: rgba(157,92,255,0.05); display: flex; flex-direction: column; align-items: stretch; }
        .teach-label { font-size: 11px; color: #6C6693; letter-spacing: 0.06em; margin-bottom: 6px; text-transform: uppercase; }
        .teach-saved { margin-top: 12px; color: #4CF3FF; font-size: 12.5px; text-align: center; }
      `}</style>

      <div className="mentis-inner">
        {phase === "landing" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Orb confidence={0} phase="idle" size={220} />
            <div className="brand-row" style={{ marginTop: -10 }}>
              <span className="brand-title">MENTIS</span>
            </div>
            <p className="tagline">
              The mind-reading engine that thinks in real time. Think of a person, character, animal, or object —
              MENTIS reasons live, question by question. No static database. No script. Just inference.
            </p>
            <div className="cat-row">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className={`cat-pill ${category.id === c.id ? "active" : ""}`}
                  onClick={() => setCategory(c)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <button className="start-btn" onClick={() => startGame(category)}>
              <Sparkles size={17} /> Begin the Read
            </button>
            <div className="stat-line">
              {stats.totalGames > 0 ? (
                <>MENTIS has read <b>{stats.totalGames.toLocaleString()}</b> minds{accuracy !== null ? <> · <b>{accuracy}%</b> accuracy</> : null}{factsCount > 0 ? <> · <b>{factsCount.toLocaleString()}</b> facts taught</> : null}</>
              ) : (
                <>Be the first mind MENTIS reads.</>
              )}
            </div>

            <button className="teach-toggle" onClick={() => setShowTeach((s) => !s)}>
              {showTeach ? "Close" : "+ Teach MENTIS something"}
            </button>

            {showTeach && (
              <div className="teach-panel fade-in">
                <div className="teach-label">Entity</div>
                <input
                  className="wrong-input"
                  placeholder="e.g. Naruto Uzumaki"
                  value={teachEntity}
                  onChange={(e) => setTeachEntity(e.target.value)}
                />
                <div className="teach-label" style={{ marginTop: 12 }}>Fact or hint</div>
                <input
                  className="wrong-input"
                  placeholder="e.g. Has whisker marks on his cheeks"
                  value={teachFact}
                  onChange={(e) => setTeachFact(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") submitFact(); }}
                />
                <button className="again-btn" style={{ marginTop: 14 }} onClick={submitFact} disabled={!teachEntity.trim() || !teachFact.trim()}>
                  <Sparkles size={14} /> Add to the collective
                </button>
                {teachSaved && <div className="teach-saved">Learned. MENTIS will remember this.</div>}
              </div>
            )}
          </div>
        )}

        {(phase === "thinking" || phase === "playing") && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <div className="topbar">
              <span className="badge">{category.label.toUpperCase()}</span>
              <span className="qcount mono-font">Q {history.length + 1} / {MAX_QUESTIONS}</span>
            </div>
            <Orb confidence={confidence} phase={phase === "thinking" ? "thinking" : "playing"} size={170} />
            <div className="meter-wrap">
              <div className="meter-label">
                <span>CONFIDENCE</span>
                <span className="mono-font">{confidence}%</span>
              </div>
              <div className="meter-track">
                <div className="meter-fill" style={{ width: `${confidence}%`, background: confidenceColor(confidence) }} />
              </div>
            </div>

            {phase === "thinking" && (
              <div className="status-text dots">MENTIS is reading the signal</div>
            )}

            {phase === "playing" && (
              <>
                <div className="question-text">{currentQuestion}</div>
                <div className="ans-row">
                  {ANSWERS.map((a) => (
                    <button
                      key={a.key}
                      className={`ans-btn ${a.v === "Yes" ? "yes" : a.v === "No" ? "no" : ""}`}
                      onClick={() => answer(a.v)}
                    >
                      {a.v}
                    </button>
                  ))}
                </div>
              </>
            )}

            {error && (
              <div className="error-box">
                {error}
                <span className="retry-link" onClick={retry}>Retry</span>
              </div>
            )}
          </div>
        )}

        {phase === "reveal" && guess && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Orb confidence={guess.confidence} phase="reveal" size={170} />
            <div className="reveal-card">
              <div className="reveal-eyebrow">MENTIS is sensing</div>
              <div className="reveal-name">{guess.name}</div>
              <div className="reveal-desc">{guess.description}</div>
              {guess.funFact && <div className="reveal-fact">✦ {guess.funFact}</div>}
              <div className="conf-badge mono-font">{guess.confidence}% CERTAIN</div>
            </div>
            <div className="feedback-row">
              <button className="fb-btn correct" onClick={handleCorrect}><Check size={16} /> Nailed it</button>
              <button className="fb-btn incorrect" onClick={handleIncorrect}><X size={16} /> Not quite</button>
            </div>
          </div>
        )}

        {phase === "wrong-input" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Orb confidence={20} phase="idle" size={140} />
            <div className="done-title">What were you thinking of?</div>
            <div className="done-sub">MENTIS grows sharper with every mind it fails to read.</div>
            <input
              className="wrong-input"
              placeholder="Type the answer…"
              value={wrongText}
              onChange={(e) => setWrongText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && wrongText.trim()) submitWrong(); }}
            />
            <button className="start-btn" style={{ marginTop: 16 }} onClick={submitWrong} disabled={!wrongText.trim()}>
              <HelpCircle size={16} /> Teach MENTIS
            </button>
          </div>
        )}

        {phase === "done" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Orb confidence={doneStatus === "correct" ? 100 : 15} phase="idle" size={170} />
            <div className="done-title">{doneStatus === "correct" ? "Mind: read." : "Noted."}</div>
            <div className="done-sub">
              {doneStatus === "correct"
                ? "Another thought successfully decoded."
                : `Filed away — "${wrongText}" — for next time.`}
            </div>
            <div className="stat-line" style={{ marginTop: 20 }}>
              {stats.totalGames.toLocaleString()} minds read{accuracy !== null ? <> · {accuracy}% accuracy</> : null}
            </div>
            <button className="again-btn" onClick={playAgain}>
              <RotateCcw size={15} /> Read another mind
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
