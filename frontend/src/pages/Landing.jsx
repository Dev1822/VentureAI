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
    <div className="bg-[#f7f9fc] text-slate-900 font-inter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* NAVBAR */}
        <nav className="flex justify-between items-center py-4 sm:py-6">
          <div className="text-xl sm:text-2xl font-extrabold bg-linear-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            VentureAI
          </div>

          <div className="flex items-center gap-3 sm:gap-6">

            {/* Hidden only on small screens */}
            <div className="hidden md:flex items-center gap-6">
              {["Features", "Use Cases"].map((item) => (
                <span
                  key={item}
                  className="text-slate-600 hover:text-black cursor-pointer text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* ALWAYS VISIBLE */}
            <span className="text-slate-600 cursor-pointer text-sm whitespace-nowrap" onClick={() => navigate("/login")}>
              Log in
            </span>

            <button className="px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-md bg-linear-to-r from-green-500 to-emerald-500 text-white shadow whitespace-nowrap" onClick={() => navigate("/signup")}>
              Get Started
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">

            {/* LEFT */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
                Validate your startup idea with AI in minutes.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Stop guessing. Intelligence uses real-time market data,
                competitor analysis, and AI to score your venture.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-linear-to-r from-green-500 to-emerald-500 text-white shadow w-full sm:w-auto" onClick={() => navigate("/signup")}>
                  Start Free Validation
                </button>

                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-slate-300 w-full sm:w-auto">
                  View Example
                </button>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="flex-1 w-full max-w-md lg:max-w-xl bg-white border rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8">

              {/* SCORE */}
              <div className="flex-1 flex flex-col items-center sm:border-r sm:pr-6">
                <h3 className="font-bold mb-4">Venture Score</h3>

                <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                  <svg viewBox="0 0 160 160" className="w-full h-full">
                    <circle cx="80" cy="80" r="68" stroke="#e2e8f0" strokeWidth="12" fill="none" />
                    <circle
                      cx="80"
                      cy="80"
                      r="68"
                      stroke="url(#grad)"
                      strokeWidth="12"
                      strokeDasharray="427"
                      strokeDashoffset="76"
                      strokeLinecap="round"
                      transform="rotate(-90 80 80)"
                      fill="none"
                    />
                    <defs>
                      <linearGradient id="grad">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <span className="absolute text-2xl sm:text-3xl font-extrabold">
                    82
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 mt-3 font-semibold text-center">
                  High Viability Potential
                </p>
              </div>

              {/* GRAPH */}
              <div className="flex-[1.5] flex flex-col justify-center">
                <h3 className="font-bold mb-4 sm:mb-6 text-center sm:text-left">
                  Market Growth Projection
                </h3>

                <div className="flex justify-between items-end h-32 sm:h-40">
                  {[35, 48, 65, 82, 100].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 sm:gap-2 w-6 sm:w-8 h-full">
                      <div className="flex-1 flex items-end w-full">
                        <div
                          className={`w-full rounded-t-md ${i === 2
                            ? "bg-linear-to-t from-green-500 to-emerald-500"
                            : "bg-slate-300"
                            }`}
                          style={{ height: `${h}%` }}
                        />
                      </div>
                      <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">
                        {2023 + i}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FEATURES */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4">
              Everything you need to launch
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
              Replace weeks of research with instant AI insights.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <PieChart />,
                title: "Market Analysis",
                desc: "Quickly find out the total market size and how it will grow.",
              },
              {
                icon: <Crosshair />,
                title: "Competitor Intelligence",
                desc: "Find competitors and identify gaps.",
              },
              {
                icon: <Map />,
                title: "Actionable Roadmaps",
                desc: "Get AI-powered startup strategies.",
              },
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 sm:p-8 rounded-xl border shadow-sm">
                <div className="mb-4 text-green-500">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm sm:text-base">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-2xl py-12 sm:py-16 lg:py-20 px-6 sm:px-10 text-center my-12 sm:my-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4">
            Ready to validate your idea?
          </h2>
          <p className="mb-6 sm:mb-8 opacity-90 text-sm sm:text-base">
            Join founders building what users actually want.
          </p>

          <button className="bg-white text-green-600 px-6 py-3 rounded-md font-semibold flex items-center gap-2 mx-auto" onClick={() => navigate("signup")}>
            Generate Report <Zap size={18} />
          </button>
        </section>

        {/* FOOTER */}
        <footer className="py-8 sm:py-10 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="font-bold text-black">VentureAI</div>
          <div>©2026 VentureAI</div>
        </footer>

      </div>
    </div>
  );
}