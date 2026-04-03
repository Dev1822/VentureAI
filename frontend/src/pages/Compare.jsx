import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    PlusCircle,
    Clock,
    ArrowLeftRight,
    LogOut,
    Loader2,
    CheckSquare,
    Square,
    Zap,
    FileText,
    ArrowUpRight,
    Presentation
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Compare() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [viewMode, setViewMode] = useState("select"); // "select" | "compare"

    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        if (storedName) {
            setUserName(storedName);
        }

        const fetchReports = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/reports", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setReports(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                } else {
                    console.error("API Error or unauthorized:", data.message || data);
                }
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        navigate("/");
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(pId => pId !== id);
            } else {
                if (prev.length >= 3) {
                    alert("You can only compare up to 3 ideas at a time.");
                    return prev;
                }
                return [...prev, id];
            }
        });
    };

    const handleCompare = () => {
        if (selectedIds.length < 2) {
            alert("Please select at least 2 ideas to compare.");
            return;
        }
        setViewMode("compare");
    };

    const selectedReports = reports.filter(r => selectedIds.includes(r._id));
    const sortedSelected = selectedReports.sort((a, b) => (b.analysis?.overallScore || 0) - (a.analysis?.overallScore || 0));
    const bestReport = sortedSelected[0];

    return (
        <div className="min-h-screen bg-mesh font-inter text-slate-900 pb-12">
            {/* NAVBAR */}
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
                            <button
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                onClick={() => navigate("/new-idea")}
                            >
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
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-700">
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">

                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Compare Ideas</h1>
                        <p className="text-slate-500">
                            {viewMode === "select"
                                ? "Select 2-3 ideas to see them side-by-side."
                                : "Objective side-by-side comparison of your concepts."}
                        </p>
                    </div>
                    {viewMode === "select" ? (
                        <button
                            onClick={handleCompare}
                            disabled={selectedIds.length < 2}
                            className="premium-btn px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Compare Selected ({selectedIds.length})
                        </button>
                    ) : (
                        <button
                            onClick={() => setViewMode("select")}
                            className="premium-btn-secondary px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center text-sm"
                        >
                            Change Selection
                        </button>
                    )}
                </header>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                    </div>
                ) : reports.length < 2 ? (
                    <div className="premium-card p-12 text-center">
                        <p className="text-slate-500 font-medium mb-4">You need at least 2 ideas to use the compare feature.</p>
                        <button
                            onClick={() => navigate("/new-idea")}
                            className="premium-btn px-6 py-2 rounded-lg font-semibold mx-auto flex items-center gap-2"
                        >
                            <PlusCircle size={16} /> Validate an Idea
                        </button>
                    </div>
                ) : viewMode === "select" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map(report => {
                            const isSelected = selectedIds.includes(report._id);
                            return (
                                <div
                                    key={report._id}
                                    onClick={() => toggleSelect(report._id)}
                                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${isSelected
                                        ? 'border-emerald-600 bg-emerald-50/50 shadow-md shadow-emerald-600/10'
                                        : 'border-slate-200 bg-white hover:border-emerald-300'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                                            {isSelected ? <CheckSquare size={20} className="text-emerald-600" /> : <Square size={20} className="text-slate-500" />}
                                        </div>
                                        <div className={`text-2xl font-black ${(report.analysis?.overallScore || 0) > 70 ? 'text-emerald-600' : 'text-amber-500'
                                            }`}>
                                            {report.analysis?.overallScore || 0}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-2">{report.name}</h3>
                                    <p className="text-slate-500 text-sm line-clamp-3">{report.description}</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Comparison Matrix */}
                        <div className="overflow-x-auto pb-4">
                            <div className="inline-flex gap-6 min-w-full">
                                {sortedSelected.map(report => (
                                    <div key={report._id} className="premium-card p-8 flex-1 min-w-[300px] flex flex-col">

                                        {/* Header */}
                                        <div className="mb-8 border-b border-slate-200 pb-6">
                                            <h3 className="text-2xl font-black text-slate-900 mb-2 truncate" title={report.name}>{report.name}</h3>
                                            <div className="flex items-center gap-3">
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${(report.analysis?.overallScore || 0) > 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}>
                                                    Score: {report.analysis?.overallScore || 0}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Metrics */}
                                        <div className="space-y-6 flex-1">
                                            <div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 text-center">Market</div>
                                                <div className="text-lg font-black text-blue-600 text-center bg-blue-50 py-2 rounded-xl">{report.analysis?.marketDemand?.score || 0}%</div>
                                            </div>

                                            <div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 text-center">Competitors</div>
                                                <div className="text-lg font-black text-purple-600 text-center bg-purple-50 py-2 rounded-xl">{report.analysis?.competitorAssessment?.score || 0}%</div>
                                            </div>

                                            <div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 text-center">Audience</div>
                                                <div className="text-lg font-black text-emerald-600 text-center bg-emerald-50 py-2 rounded-xl">{report.analysis?.userDemographics?.score || 0}%</div>
                                            </div>

                                            <div>
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 text-center">Monetization</div>
                                                <div className="text-lg font-black text-orange-600 text-center bg-orange-50 py-2 rounded-xl">{report.analysis?.revenueOptions?.score || 0}%</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/reports/${report._id}`)}
                                            className="mt-8 w-full border border-slate-200 py-2 rounded-xl text-sm font-semibold text-slate-900 hover:border-emerald-200 hover:text-emerald-700 transition-colors"
                                        >
                                            View Full Report
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Conclusion */}
                        {bestReport && (
                            <div className="bg-emerald-900 rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-8 shadow-xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>

                                <div className="w-20 h-20 shrink-0 bg-emerald-800 rounded-2xl border border-emerald-700 flex items-center justify-center relative z-10 shadow-inner">
                                    <Zap size={32} className="text-emerald-400" />
                                </div>

                                <div className="relative z-10 text-center sm:text-left flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2">VentureAI Conclusion</h3>
                                    <p className="text-emerald-100/90 leading-relaxed max-w-2xl text-sm sm:text-base">
                                        Between these options, <strong className="text-white font-bold">{bestReport.name}</strong> shows the strongest potential with an overall viability score of <strong className="text-white font-bold">{bestReport.analysis?.overallScore || 0}%</strong>. It demonstrates the highest potential for growth and execution compared to the alternatives. Proceed with prioritizing this concept based on the data.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
