import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Zap,
  TrendingUp,
  Target,
  Map,
  Brain,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";

/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Hero Visual ─── */
function HeroVisual() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 300); return () => clearTimeout(t); }, []);

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (animate ? 0.82 : 0) * circumference;

  return (
    <div className="hero-visual-wrap animate-float-slow">
      {/* Main card */}
      <div className="hero-main-card">
        {/* Top row */}
        <div className="hv-top">
          <div>
            <p className="hv-idea-label">Analyzing idea</p>
            <p className="hv-idea-name">🌿 Eco Delivery App</p>
          </div>
          <span className="hv-badge">✓ High Viability</span>
        </div>

        {/* Score + bars */}
        <div className="hv-middle">
          {/* Ring */}
          <div className="hv-ring-wrap">
            <svg viewBox="0 0 116 116" width="116" height="116">
              <circle cx="58" cy="58" r="52" stroke="#e2e8f0" strokeWidth="8" fill="none" />
              <circle
                cx="58" cy="58" r="52"
                stroke="url(#hg)" strokeWidth="8"
                strokeLinecap="round" fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 58 58)"
                style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)" }}
              />
              <defs>
                <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="hv-score-inner">
              <span className="hv-score-num">82</span>
              <span className="hv-score-label">/ 100</span>
            </div>
          </div>

          {/* Progress bars */}
          <div className="hv-bars">
            {[
              { label: "Market Demand", pct: 88 },
              { label: "Differentiation", pct: 75 },
              { label: "Scalability", pct: 91 },
              { label: "Growth Rate", pct: 79 },
            ].map((b) => (
              <div key={b.label} className="hv-bar-row">
                <span className="hv-bar-label">{b.label}</span>
                <div className="hv-bar-track">
                  <div
                    className="hv-bar-fill"
                    style={{ width: animate ? `${b.pct}%` : "0%" }}
                  />
                </div>
                <span className="hv-bar-pct">{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Landing ─── */
export default function Landing() {
  const navigate = useNavigate();

  const [heroRef, heroIn] = useInView(0.08);
  const [featRef, featIn] = useInView(0.1);
  const [howRef, howIn] = useInView(0.1);
  const [ctaRef, ctaIn] = useInView(0.1);

  const features = [
    {
      icon: <Brain size={20} />,
      color: "icon-emerald",
      title: "AI Viability Score",
      desc: "Get a precise 0–100 score powered by 200+ live market signals — in seconds.",
    },
    {
      icon: <TrendingUp size={20} />,
      color: "icon-cyan",
      title: "Growth Forecast",
      desc: "See 5-year revenue projections and market size estimates backed by real data.",
    },
    {
      icon: <Target size={20} />,
      color: "icon-violet",
      title: "Competitor Map",
      desc: "Instantly surface key players, market gaps, and where you have the edge.",
    },
    {
      icon: <Map size={20} />,
      color: "icon-amber",
      title: "Execution Roadmap",
      desc: "A step-by-step go-to-market strategy tailored to your idea and niche.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Describe Your Idea",
      desc: "Enter your startup concept in plain language — no technical jargon needed.",
    },
    {
      num: "02",
      title: "AI Runs Analysis",
      desc: "Our engine processes market size, competitors, trends, and risk in real-time.",
    },
    {
      num: "03",
      title: "Get Your Report",
      desc: "Receive a comprehensive, actionable report with a clear path forward.",
    },
  ];

  return (
    <div className="bg-mesh min-h-screen text-slate-900 overflow-x-hidden">

      {/* ─── NAVBAR ─── */}
      <nav className="sticky-nav">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex justify-between items-center h-16">
          <div
            className="text-xl font-extrabold tracking-tight cursor-pointer select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="gradient-text-green">Venture</span>
            <span className="text-slate-900">AI</span>
            <span className="text-emerald-600">.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="text-slate-900 hover:text-slate-900 font-medium text-sm px-4 py-2 transition-colors"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="premium-btn px-5 py-2 text-sm rounded-xl"
              onClick={() => navigate("/signup")}
            >
              Get Started →
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-5 sm:px-8">

        {/* ─── HERO ─── */}
        <section
          ref={heroRef}
          className={`pt-16 pb-20 transition-all duration-700 ${heroIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="flex flex-col lg:flex-row items-center gap-14">

            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              <div className="section-badge mb-6 inline-flex">
                <Sparkles size={12} /> AI Startup Validator
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] text-slate-900 mb-5 tracking-tight">
                Validate your{" "}
                <span className="gradient-text">startup idea</span>
                <br className="hidden lg:block" />
                before you build it.
              </h1>

              <p className="text-lg text-slate-500 mb-9 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                VentureAI scores your idea using real market data, competitor analysis, and growth forecasts — in under 60 seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <button
                  className="premium-btn flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold"
                  onClick={() => navigate("/signup")}
                >
                  Validate My Idea <Zap size={15} className="fill-white" />
                </button>
                <button
                  className="premium-btn-secondary flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base"
                  onClick={() => navigate("/login")}
                >
                  Sign In <ArrowRight size={15} />
                </button>
              </div>

              {/* Simple social proof line */}
              <div className="flex items-center gap-2 justify-center lg:justify-start text-sm text-slate-500">
                <CheckCircle size={14} className="text-emerald-600" />
                Free to use · Results in 60 seconds · No credit card
              </div>
            </div>

            {/* Right: Visual */}
            <div className="flex-1 w-full max-w-md lg:max-w-none">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section
          id="features"
          ref={featRef}
          className={`pb-24 transition-all duration-700 ${featIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Everything you need, nothing you don't
            </h2>
            <p className="text-slate-500 max-w-md mx-auto text-base">
              Replace weeks of research with instant, actionable intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <div key={i} className="premium-card p-7 group cursor-default">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section
          id="how-it-works"
          ref={howRef}
          className={`pb-24 transition-all duration-700 ${howIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              How it works
            </h2>
            <p className="text-slate-500 max-w-sm mx-auto text-base">
              Three steps from idea to validated report.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((s, i) => (
              <div key={i} className="premium-card p-8 text-center group">
                <div className="text-4xl font-extrabold gradient-text mb-4 leading-none">{s.num}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 tracking-tight">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ─── CTA ─── */}
      <section ref={ctaRef} className="px-5 sm:px-8 pb-20">
        <div className={`max-w-5xl mx-auto cta-band transition-all duration-700 ${ctaIn ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full blur-[100px] opacity-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />
          <div className="relative z-10 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              Stop guessing.<br />Start building what works.
            </h2>
            <p className="text-slate-500 mb-8 text-base max-w-md mx-auto">
              Join founders who validated their ideas before burning time and capital.
            </p>
            <button
              className="glow-btn px-8 py-3.5 rounded-xl text-base font-bold flex items-center gap-2 mx-auto"
              onClick={() => navigate("/signup")}
            >
              Validate My Idea Free <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-200 py-8 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-extrabold text-slate-900 text-base tracking-tight">
            <span className="gradient-text-green">Venture</span>AI<span className="text-emerald-600">.</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          </div>
          <div className="text-sm text-slate-500">© 2026 VentureAI</div>
        </div>
      </footer>

    </div>
  );
}
