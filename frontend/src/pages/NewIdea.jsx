import { useNavigate } from "react-router-dom";
import { ArrowRight, LayoutDashboard, LogOut, PlusCircle, Clock, TrendingUp, Briefcase, ArrowLeftRight, Zap, Lightbulb, Presentation, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function NewIdea() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

    const [formData, setFormData] = useState({
        startupName: "",
        description: "",
        industry: "",
        businessModel: "",
        targetAudience: "",
        keyFeatures: ""
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        navigate("/");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch("http://localhost:5000/api/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    name: formData.startupName,
                    description: formData.description,
                    industry: formData.industry,
                    businessModel: formData.businessModel,
                    targetAudience: formData.targetAudience,
                    keyFeatures: formData.keyFeatures
                })
            });

            if (!response.ok) throw new Error("Analysis failed");

            const report = await response.json();
            navigate(`/reports/${report._id}`);
        } catch (error) {
            console.error(error);
            alert("Analysis failed. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-mesh font-inter text-slate-900 pb-16">
            {/* ═══════ NAVBAR ═══════ */}
            <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="text-xl font-extrabold text-slate-900 tracking-tight cursor-pointer" onClick={() => navigate("/")}>
                            VentureAI.
                        </div>

                        <div className="hidden md:flex items-center gap-1">
                            <button
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                onClick={() => navigate("/dashboard")}
                            >
                                <LayoutDashboard size={16} />
                                Dashboard
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-700">
                                <PlusCircle size={16} />
                                New Idea
                            </button>
                            <button
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                onClick={() => navigate("/history")}
                            >
                                <Clock size={16} />
                                History
                            </button>
                            <button
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                onClick={() => navigate("/compare")}
                            >
                                <ArrowLeftRight size={16} />
                                Compare
                            </button>
                            <button
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                onClick={() => navigate("/pitch-deck")}
                            >
                                <Presentation size={16} />
                                Pitch Deck
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm font-semibold text-slate-900 hidden sm:block">
                            {userName || "User"}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ═══════ MAIN FORM AREA ═══════ */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 mt-12">
                <header className="mb-10 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">Validate New Idea</h1>
                    <p className="text-slate-500 leading-relaxed max-w-xl">
                        Fill in the details about your startup idea. Our AI will analyze it across four key dimensions.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="premium-card p-8 sm:p-10 space-y-8">

                    {/* Startup Name */}
                    <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-2 tracking-widest uppercase">
                            Startup Name *
                        </label>
                        <input
                            type="text"
                            name="startupName"
                            required
                            value={formData.startupName}
                            onChange={handleChange}
                            placeholder="e.g., NutriTrack"
                            className="premium-input w-full px-4 py-3.5 text-sm"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-2 tracking-widest uppercase">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            required
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your startup idea in detail. What problem does it solve? How does it work?"
                            className="premium-input w-full px-4 py-3.5 text-sm resize-y"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Industry */}
                        <div>
                            <label className="text-[11px] font-bold text-slate-500 block mb-2 tracking-widest uppercase">
                                Industry *
                            </label>
                            <select
                                name="industry"
                                required
                                value={formData.industry}
                                onChange={handleChange}
                                className="premium-input w-full px-4 py-3.5 text-sm appearance-none bg-white cursor-pointer"
                            >
                                <option value="">Select industry</option>
                                <option value="SaaS">SaaS</option>
                                <option value="E-commerce">E-commerce</option>
                                <option value="Fintech">Fintech</option>
                                <option value="Healthtech">Healthtech</option>
                                <option value="Edtech">Edtech</option>
                            </select>
                        </div>

                        {/* Business Model */}
                        <div>
                            <label className="text-[11px] font-bold text-slate-500 block mb-2 tracking-widest uppercase">
                                Business Model *
                            </label>
                            <select
                                name="businessModel"
                                required
                                value={formData.businessModel}
                                onChange={handleChange}
                                className="premium-input w-full px-4 py-3.5 text-sm appearance-none bg-white cursor-pointer"
                            >
                                <option value="">Select model</option>
                                <option value="B2B Subscription">B2B Subscription</option>
                                <option value="B2C Subscription">B2C Subscription</option>
                                <option value="Marketplace">Marketplace</option>
                                <option value="One-time Purchase">One-time Purchase</option>
                                <option value="Freemium">Freemium</option>
                            </select>
                        </div>
                    </div>

                    {/* Target Audience */}
                    <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-2 tracking-widest uppercase">
                            Target Audience *
                        </label>
                        <input
                            type="text"
                            name="targetAudience"
                            required
                            value={formData.targetAudience}
                            onChange={handleChange}
                            placeholder="e.g., Health-conscious millennials aged 25-35"
                            className="premium-input w-full px-4 py-3.5 text-sm"
                        />
                    </div>

                    {/* Key Features */}
                    <div>
                        <label className="text-[11px] font-bold text-slate-500 block mb-2 tracking-widest uppercase">
                            Key Features
                        </label>
                        <textarea
                            name="keyFeatures"
                            rows="3"
                            value={formData.keyFeatures}
                            onChange={handleChange}
                            placeholder="List the main features of your product (optional)"
                            className="premium-input w-full px-4 py-3.5 text-sm resize-y"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="premium-btn w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    ANALYZING...
                                </>
                            ) : (
                                <>
                                    VALIDATE IDEA
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </main>

            {/* LOADING OVERLAY */}
            {submitting && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl flex flex-col items-center">
                        <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 relative">
                            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                            <div className="absolute inset-0 border-4 border-emerald-600/20 rounded-2xl animate-ping opacity-20"></div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Analyzing Your Idea</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Our AI is assessing market demand, competitors, and revenue models. This usually takes about 10-20 seconds.
                        </p>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full animate-progress-fast"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
