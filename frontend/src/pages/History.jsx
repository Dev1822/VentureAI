import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    PlusCircle,
    Clock,
    ArrowLeftRight,
    LogOut,
    Loader2,
    Calendar,
    ArrowUpRight,
    Search
} from "lucide-react";
import { useState, useEffect } from "react";

export default function History() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

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
                    // Sort by newest first
                    const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setReports(sorted);
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

    const filteredReports = reports.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-700">
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
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Validation History</h1>
                        <p className="text-slate-500">Every idea you've ever analyzed, exactly as you left it.</p>
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search ideas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="premium-input pl-10 pr-4 py-2.5 w-full sm:w-72 text-sm"
                        />
                    </div>
                </header>

                <div className="premium-card p-6 sm:p-8 min-h-[60vh]">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                        </div>
                    ) : filteredReports.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Startup Idea</th>
                                        <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                        <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Score</th>
                                        <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Verdict</th>
                                        <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReports.map((report) => (
                                        <tr key={report._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-4 px-4 max-w-[250px] sm:max-w-[400px]">
                                                <div className="font-bold text-slate-900 truncate">{report.name}</div>
                                                <div className="text-xs text-slate-500 truncate mt-1">{report.description}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-900">
                                                    <Calendar size={14} className="text-slate-500" />
                                                    {new Date(report.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-black text-sm ${(report.analysis?.overallScore || 0) > 70 ? 'bg-emerald-50 text-emerald-600' :
                                                    (report.analysis?.overallScore || 0) > 40 ? 'bg-amber-50 text-amber-600' :
                                                        'bg-red-50 text-red-600'
                                                    }`}>
                                                    {report.analysis?.overallScore || 0}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${report.analysis?.verdict === 'high' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' :
                                                    report.analysis?.verdict === 'medium' ? 'text-amber-600 bg-amber-50 border border-amber-100' :
                                                        'text-red-600 bg-red-50 border border-red-100'
                                                    }`}>
                                                    {report.analysis?.verdict || "Low"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/reports/${report._id}`)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-900 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                >
                                                    View <ArrowUpRight size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-slate-500 mb-6 font-medium">
                                {searchQuery ? "No ideas match your search." : "No validation history found."}
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
