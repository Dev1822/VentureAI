import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, BarChart3, TrendingUp, Shield } from "lucide-react";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

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
        localStorage.setItem("userName", data.user.name);
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        navigate("/dashboard");
      } else {
        alert(data.message || "Google Login failed");
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Google Login failed");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-auth-mesh" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ═══════ LEFT SIDE — BRANDING PANEL ═══════ */}
      <div className="hidden lg:flex w-1/2 relative bg-emerald-50 overflow-hidden flex-col justify-between p-12 border-r border-slate-200/60">
        {/* Soft abstract shapes in the background */}
        <div className="absolute top-0 left-0 w-125 h-500px bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-100 h-400px bg-emerald-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top logo */}
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight cursor-pointer" onClick={() => navigate("/")}>
            VentureAI.
          </div>

          {/* Middle abstract / stats */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-6 max-w-sm soft-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-200">
                  <BarChart3 size={24} className="text-emerald-700" />
                </div>
                <div>
                  <div className="text-slate-900 font-bold text-sm">Market Analysis</div>
                  <div className="text-slate-500 text-xs">Real-time insights</div>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full w-[82%]" />
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-6 max-w-sm ml-8 soft-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <TrendingUp size={24} className="text-blue-600" />
                </div>
                <div>
                  <div className="text-slate-900 font-bold text-sm">Growth Score</div>
                  <div className="text-slate-500 text-xs">AI-powered tracking</div>
                </div>
              </div>
              <div className="flex items-end gap-1.5 h-12">
                {[30, 45, 35, 60, 50, 75, 65, 85, 80, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-slate-200 rounded-sm hover:bg-blue-400 transition-colors"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom text */}
          <div className="mt-12">
            <h2 className="text-slate-900 text-3xl font-extrabold mb-4 tracking-tight leading-tight">
              Welcome back.
            </h2>
            <p className="text-slate-900 text-base leading-relaxed max-w-sm">
              Sign in to access your validation reports and continue analyzing startup ideas.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════ RIGHT SIDE — FORM ═══════ */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md premium-card p-10">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <span className="font-extrabold text-2xl text-slate-900 tracking-tight cursor-pointer" onClick={() => navigate("/")}>VentureAI.</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold mb-3 text-slate-900 tracking-tight">Sign In</h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Enter your credentials deeply embedded inside your memory.
          </p>

          {/* Email */}
          <div className="mb-6">
            <label className="text-[11px] font-bold text-slate-500 block mb-2 tracking-widest uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-input w-full pl-12 pr-4 py-3.5 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-[11px] font-bold text-slate-500 block mb-2 tracking-widest uppercase">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="premium-input w-full pl-12 pr-4 py-3.5 text-sm"
              />
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right mb-8">
            <span className="text-xs text-slate-500 font-medium cursor-pointer hover:text-emerald-600 transition-colors">
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button
            className="premium-btn w-full py-3.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 mb-8"
            onClick={handleLogin}
          >
            Sign In
            <ArrowRight size={16} />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google Auth Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google Login Failed")}
              useOneTap
              theme="outline"
              shape="rectangular"
              width="320"
            />
          </div>

          {/* Footer */}
          <p className="text-sm text-slate-500 mt-10 text-center">
            Don't have an account?{" "}
            <span
              className="text-slate-900 font-bold cursor-pointer hover:text-emerald-600 transition-colors"
              onClick={() => navigate("/signup")}
            >
              Configure yours
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
