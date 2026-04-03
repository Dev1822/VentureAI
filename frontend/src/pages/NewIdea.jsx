import { useNavigate } from "react-router-dom";
import { ArrowRight, LayoutDashboard, LogOut, PlusCircle, Clock, ArrowLeftRight } from "lucide-react";
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate validation process
        alert("Analyzing your idea...");
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
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                                <Clock size={16} />
                                History
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                                <ArrowLeftRight size={16} />
                                Compare
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm font-semibold text-slate-700 hidden sm:block">
                            {userName || "User"}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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
                            className="premium-btn w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:-translate-y-0.5"
                        >
                            VALIDATE IDEA
                            <ArrowRight size={18} />
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}
