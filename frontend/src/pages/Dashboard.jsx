import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    PlusCircle,
    Clock,
    ArrowLeftRight,
    LogOut,
    FolderOpen
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Dashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

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

    return (
        <div className="min-h-screen bg-mesh font-inter text-slate-900 pb-12">

            {/* ═══════ NAVBAR ═══════ */}
            <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="text-xl font-extrabold text-slate-900 tracking-tight cursor-pointer" onClick={() => navigate("/")}>
                            VentureAI.
                        </div>

                        <div className="hidden md:flex items-center gap-1">
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-700">
                                <LayoutDashboard size={16} />
                                Dashboard
                            </button>
                            <button
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                onClick={() => navigate("/new-idea")}
                            >
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">

                {/* ═══════ HEADER ═══════ */}
                <header className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Dashboard</h1>
                        <p className="text-slate-500">Your startup validation overview.</p>
                    </div>
                    <button
                        className="premium-btn px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm"
                        onClick={() => navigate("/new-idea")}
                    >
                        <PlusCircle size={18} />
                        New Idea
                    </button>
                </header>

                {/* ═══════ STATS ROW ═══════ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                    {[
                        { label: "TOTAL IDEAS", value: "0" },
                        { label: "COMPLETED", value: "0" },
                        { label: "AVG SCORE", value: "0" },
                        { label: "SUCCESS RATE", value: "0%", highlight: true }
                    ].map((stat, i) => (
                        <div key={i} className="premium-card p-5 sm:p-6 flex flex-col justify-between h-32">
                            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                                {stat.label}
                            </span>
                            <div className={`text-4xl font-black tracking-tight ${stat.highlight ? 'text-blue-600' : 'text-slate-900'}`}>
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ═══════ RECENT ANALYSES (MAIN PANEL) ═══════ */}
                <div className="premium-card p-6 sm:p-8 min-h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                            RECENT ANALYSES
                        </h2>
                        <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                            View All
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                        {/* Empty State Illustration using soft colors */}
                        <div className="w-24 h-24 mb-6 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                            <FolderOpen size={48} className="text-emerald-300" strokeWidth={1.5} />
                        </div>

                        <p className="text-slate-500 mb-6 font-medium">
                            No analyses yet. Start by validating your first idea.
                        </p>

                        <button
                            className="premium-btn px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm shadow-sm transition-all hover:-translate-y-0.5"
                            onClick={() => navigate("/new-idea")}
                        >
                            <PlusCircle size={18} />
                            Validate First Idea
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}
