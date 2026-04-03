import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, BarChart3, TrendingUp, Shield } from "lucide-react";
import { useState } from "react";

export default function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      navigate("/"); // or dashboard
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Login failed");
  }
};

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ═══════ LEFT SIDE — BRANDING PANEL ═══════ */}
      <div className="hidden lg:flex w-1/2 relative bg-linear-to-br from-green-600 via-emerald-500 to-green-400 overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Top logo */}
          <div className="text-2xl font-extrabold text-white cursor-pointer" onClick={() => navigate("/")}>
            VentureAI
          </div>

          {/* Middle stats */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <BarChart3 size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Market Analysis</div>
                  <div className="text-white/60 text-xs">Real-time insights</div>
                </div>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: "82%" }} />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-sm ml-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Growth Score</div>
                  <div className="text-white/60 text-xs">AI-powered prediction</div>
                </div>
              </div>
              <div className="flex items-end gap-1 h-10">
                {[30, 45, 35, 60, 50, 75, 65, 85, 80, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-white/40 rounded-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Risk Level: Low</div>
                  <div className="text-white/60 text-xs">3 risks identified & mitigated</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom text */}
          <div>
            <h2 className="text-white text-3xl font-bold mb-3 leading-tight">
              Welcome back.
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Sign in to access your validation reports and continue analyzing startup ideas with AI.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════ RIGHT SIDE — FORM ═══════ */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 sm:px-10 bg-[#f7f9fc]">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="font-extrabold text-xl text-gradient cursor-pointer" onClick={() => navigate("/")}>VentureAI</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold mb-2 text-slate-900 tracking-tight">Sign In</h1>
          <p className="text-slate-500 text-sm mb-8">
            Enter your credentials to access your dashboard.
          </p>

          {/* Email */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-slate-500 block mb-2 tracking-wide">
              EMAIL
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
<input
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
            </div>
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="text-xs font-semibold text-slate-500 block mb-2 tracking-wide">
              PASSWORD
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
<input
  type="password"
  placeholder="Enter your password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right mb-6">
            <span className="text-xs text-green-600 font-semibold cursor-pointer hover:text-green-700 transition-colors">
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button className="btn-shine w-full py-3.5 rounded-lg text-white font-semibold text-sm bg-linear-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/20 flex items-center justify-center gap-2" onClick={handleLogin}>
            Sign In
            <ArrowRight size={16} />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google-style button (static) */}
          <button className="w-full py-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-sm text-slate-500 mt-8 text-center">
            Don't have an account?{" "}
            <span
              className="text-green-600 font-semibold cursor-pointer hover:text-green-700 transition-colors"
              onClick={() => navigate("/signup")}
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}