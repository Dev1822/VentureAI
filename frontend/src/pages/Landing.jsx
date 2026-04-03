import {
  PieChart,
  Crosshair,
  Map,
  Zap,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="bg-mesh min-h-screen text-slate-900 font-inter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* NAVBAR */}
        <nav className="flex justify-between items-center py-6 sm:py-8">
          <div className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight cursor-pointer">
            VentureAI.
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-3">
              <button
                className="text-slate-600 hover:text-slate-900 font-medium text-sm px-3 py-2 transition-colors"
                onClick={() => navigate("/login")}
              >
                Log in
              </button>
              <button
                className="premium-btn px-4 sm:px-5 py-2.5 text-xs sm:text-sm rounded-lg font-medium whitespace-nowrap"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="py-12 sm:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* LEFT */}
            <div className="flex-1 text-center lg:text-left z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-slate-900 mb-6 tracking-tight">
                Validate your startup idea <br className="hidden lg:block" /> in minutes, not months.
              </h1>

              <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Stop guessing and start building. We use real-time market data,
                competitor analysis, and predictive models to score your venture's viability.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="premium-btn flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold shadow-sm w-full sm:w-auto"
                  onClick={() => navigate("/signup")}
                >
                  Start Free Validation
                </button>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="flex-1 w-full max-w-md lg:max-w-xl premium-card p-6 sm:p-8 flex flex-col sm:flex-row gap-8 z-10">

              {/* SCORE */}
              <div className="flex-1 flex flex-col items-center justify-center sm:border-r border-slate-100 sm:pr-8">
                <h3 className="font-semibold text-slate-700 mb-6 text-sm uppercase tracking-wider">Venture Score</h3>

                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="68" stroke="#f1f5f9" strokeWidth="10" fill="none" />
                    <circle
                      cx="80"
                      cy="80"
                      r="68"
                      stroke="#10b981"
                      strokeWidth="10"
                      strokeDasharray="427"
                      strokeLinecap="round"
                      fill="none"
                      className="animate-chart-draw"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-extrabold text-slate-900">82</span>
                    <span className="text-xs font-medium text-emerald-600">/ 100</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-5 font-medium text-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  High Viability
                </p>
              </div>

              {/* GRAPH */}
              <div className="flex-[1.2] flex flex-col justify-center">
                <h3 className="font-semibold text-slate-700 mb-6 text-sm uppercase tracking-wider text-center sm:text-left">
                  Market Growth
                </h3>

                <div className="flex justify-between items-end h-36 gap-2">
                  {[35, 48, 65, 82, 100].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 w-8 h-full group">
                      <div className="flex-1 flex items-end w-full relative">
                        {/* Tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {h}%
                        </div>
                        <div
                          className={`w-full rounded-t-sm transition-all duration-500 ease-out ${i === 4
                            ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                            : "bg-slate-200 hover:bg-slate-300"
                            }`}
                          style={{ height: `${h}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        '{23 + i}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 sm:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Everything you need to launch
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Replace weeks of tedious research with instant, actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <PieChart size={24} />,
                title: "Market Analysis",
                desc: "Discover your total addressable market and forecast growth accurately.",
              },
              {
                icon: <Crosshair size={24} />,
                title: "Competitor Intel",
                desc: "Identify key players, their weaknesses, and find your unique gap.",
              },
              {
                icon: <Map size={24} />,
                title: "Actionable Roadmaps",
                desc: "Receive step-by-step startup strategies tailored to your exact niche.",
              },
            ].map((f, i) => (
              <div key={i} className="premium-card p-8 group">
                <div className="mb-6 h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-3 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white rounded-3xl overflow-hidden py-16 sm:py-20 px-6 sm:px-10 text-center my-16 sm:my-24 relative soft-shadow">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -m-32 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 -m-32 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-5 tracking-tight">
              Ready to validate your idea?
            </h2>
            <p className="mb-10 text-slate-300 text-lg max-w-xl mx-auto">
              Join thousands of founders building what users actually want. Stop wasting time on doomed ventures.
            </p>

            <button
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-colors shadow-[0_4px_14px_rgba(16,185,129,0.4)]"
              onClick={() => navigate("/signup")}
            >
              Generate Free Report <Zap size={18} className="fill-white" />
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-10 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6 mt-10">
          <div className="font-extrabold text-slate-800 text-lg tracking-tight">VentureAI.</div>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Twitter</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
          </div>
          <div className="text-sm text-slate-400">© 2026 VentureAI</div>
        </footer>

      </div>
    </div>
  );
}