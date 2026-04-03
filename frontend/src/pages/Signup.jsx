import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, CheckCircle, Target, Check } from "lucide-react";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

const benefits = [
  { icon: <Check size={18} className="text-emerald-600" />, text: "Instant AI validation generation" },
  { icon: <Check size={18} className="text-blue-600" />, text: "Real competitive gap analysis" },
  { icon: <Check size={18} className="text-violet-600" />, text: "Free forever, no card needed" },
];

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
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
      alert("Error signing up");
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
      <div className="hidden lg:flex w-1/2 relative bg-slate-50 overflow-hidden flex-col justify-between p-12 border-r border-slate-200/60">

        {/* Soft geometric backgrounds */}
        <div className="absolute top-1/4 right-0 w-100 h-100px bg-blue-100/40 rounded-full mix-blend-multiply blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-75px h-75px bg-emerald-100/40 rounded-full mix-blend-multiply blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Top logo */}
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight cursor-pointer" onClick={() => navigate("/")}>
            VentureAI.
          </div>

          {/* Center content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-slate-900 text-4xl font-extrabold mb-4 leading-tight tracking-tight">
                Design your future <br /> with clarity.
              </h2>
              <p className="text-slate-900 text-base leading-relaxed max-w-sm">
                Join thousands of founders launching products people actually want. Stop building in the dark.
              </p>
            </div>

            {/* Benefits list */}
            <div className="space-y-4">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/80 backdrop-blur-md border border-slate-200/70 rounded-xl px-5 py-4 max-w-sm soft-shadow">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                    {b.icon}
                  </div>
                  <span className="text-slate-900 font-medium text-sm">{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Trust markers */}
          <div className="flex items-center gap-4 mt-12 bg-white/60 p-4 rounded-2xl border border-slate-200/50 w-max soft-shadow">
            <div className="flex -space-x-3">
              {[
                "https://api.dicebear.com/7.x/notionists/svg?seed=Felix",
                "https://api.dicebear.com/7.x/notionists/svg?seed=Mia",
                "https://api.dicebear.com/7.x/notionists/svg?seed=Max",
                "https://api.dicebear.com/7.x/notionists/svg?seed=Lily",
              ].map((src, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center overflow-hidden"
                >
                  <img src={src} alt="avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div>
              <div className="text-slate-900 font-bold text-sm tracking-tight">20,000+ reports ran</div>
              <div className="text-slate-500 text-xs mt-0.5">Highly trusted community</div>
            </div>
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
          <h1 className="text-3xl font-extrabold mb-3 text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Get started right away. No credit card ever required.
          </p>

          {/* Google Auth Button */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
               onSuccess={handleGoogleSuccess}
               onError={() => alert("Google Login Failed")}
               useOneTap
               theme="outline"
               shape="rectangular"
               width="320"
               text="signup_with"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">or sign up with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Name */}
          <div className="mb-5">
            <label className="text-[11px] font-bold text-slate-500 block mb-2 tracking-widest uppercase">
              Full Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="premium-input w-full pl-12 pr-4 py-3.5 text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-5">
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
          <div className="mb-5">
            <label className="text-[11px] font-bold text-slate-500 block mb-2 tracking-widest uppercase">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="premium-input w-full pl-12 pr-4 py-3.5 text-sm"
              />
            </div>
          </div>

          {/* Button */}
          <button
            className="premium-btn w-full py-3.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 mb-6"
            onClick={handleSignup}
          >
            Create Account
            <ArrowRight size={16} />
          </button>

          {/* Terms */}
          <p className="text-[11px] text-slate-500 text-center leading-relaxed mb-6">
            By creating an account, you agree to our{" "}
            <span className="text-slate-900 font-medium cursor-pointer hover:underline border-b border-transparent">Terms of Service</span> and{" "}
            <span className="text-slate-900 font-medium cursor-pointer hover:underline border-b border-transparent">Privacy Policy</span>.
          </p>

          {/* Footer */}
          <p className="text-sm text-slate-500 text-center">
            Already have an account?{" "}
            <span
              className="text-slate-900 font-bold cursor-pointer hover:text-emerald-600 transition-colors"
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
