import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    ArrowLeft,
    Download,
    Share2,
    Zap,
    Target,
    Users,
    TrendingUp,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const Typewriter = ({ text, delay = 15 }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        if (!text) return;
        let i = 0;
        setDisplayedText("");
        const interval = setInterval(() => {
            setDisplayedText((prev) => text.substring(0, prev.length + 1));
            i++;
            if (i >= text.length) clearInterval(interval);
        }, delay);
        return () => clearInterval(interval);
    }, [text, delay]);

    return <span>{displayedText}</span>;
};

export default function ReportDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [animatedScore, setAnimatedScore] = useState(0);
    const [copied, setCopied] = useState(false);

    const generatePDFDocument = async () => {
        const reportElement = document.getElementById("pdf-report");
        if (!reportElement) {
            throw new Error("Report element not found");
        }

        // Scroll to top to ensure capturing everything correctly bounds
        window.scrollTo(0, 0);

        // Force desktop layout for perfect Tailwind alignment regardless of user's screen
        const originalStyle = reportElement.getAttribute('style');
        reportElement.style.width = '1024px';
        reportElement.style.maxWidth = '1024px';
        reportElement.style.margin = '0 auto';

        try {
            const imgData = await toPng(reportElement, {
                pixelRatio: 2,
                backgroundColor: "#f8fafc",
                width: 1024,
                height: reportElement.scrollHeight
            });

            // Restore original styles
            if (originalStyle) {
                reportElement.setAttribute('style', originalStyle);
            } else {
                reportElement.removeAttribute('style');
            }

            const elementWidth = 1024;
            const elementHeight = reportElement.scrollHeight;

            const margin = 12; // Beautiful 12mm print margins
            const pdfPageWidth = 210; // Standard A4 width in mm
            const availableWidth = pdfPageWidth - (margin * 2);

            const pdfImageHeight = (elementHeight * availableWidth) / elementWidth;

            // Generate a continuous, single-page PDF that dynamically expands to fit all vertical content
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [pdfPageWidth, pdfImageHeight + (margin * 2)]
            });

            pdf.addImage(imgData, "PNG", margin, margin, availableWidth, pdfImageHeight);
            return pdf;
        } catch (err) {
            // Restore original styles in case of error
            if (originalStyle) {
                reportElement.setAttribute('style', originalStyle);
            } else {
                reportElement.removeAttribute('style');
            }
            throw err;
        }
    };

    const handleDownloadPDF = async () => {
        setDownloading(true);
        try {
            const pdf = await generatePDFDocument();
            const safeName = report?.name ? report.name.replace(/[^a-zA-Z0-9 -]/g, "") : "project";
            pdf.save(`${safeName} report.pdf`);
        } catch (err) {
            console.error("Error generating PDF:", err);
            alert(`Failed to generate PDF: ${err.message || "Unknown error"}. Please try again.`);
        } finally {
            setDownloading(false);
        }
    };

    const handleShare = async () => {
        try {
            const safeName = report?.name ? report.name.replace(/[^a-zA-Z0-9 -]/g, "") : "project";

            // Check if Web Share API with files is supported
            if (navigator.share && navigator.canShare) {
                setSharing(true);
                try {
                    const pdf = await generatePDFDocument();
                    const pdfBlob = pdf.output("blob");
                    const file = new File([pdfBlob], `${safeName} report.pdf`, { type: "application/pdf" });

                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            files: [file],
                            title: `${report.name} - VentureAI Report`,
                            text: `Check out the startup idea analysis for ${report.name} by VentureAI!`,
                        });
                        setSharing(false);
                        return; // Successfully shared
                    }
                } catch (shareErr) {
                    console.error("Web Share failed:", shareErr);
                    // Continue to clipboard fallback
                } finally {
                    setSharing(false);
                }
            }

            // Fallback: Priority 1 — Modern Clipboard API
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Clipboard API failed, attempting fallback:", err);
            // Priority 2: Traditional Selection Fallback
            try {
                const textArea = document.createElement("textarea");
                textArea.value = window.location.href;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (fallbackErr) {
                alert("Failed to copy link. Please copy the URL from your browser address bar.");
            }
        }
    };

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/reports/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await response.json();
                setReport(data);
            } catch (error) {
                console.error("Error fetching report:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    useEffect(() => {
        if (report && report.analysis?.overallScore) {
            const finalScore = report.analysis.overallScore;
            let current = 0;
            const step = Math.ceil(finalScore / 60) || 1;
            const interval = setInterval(() => {
                current += step;
                if (current >= finalScore) {
                    setAnimatedScore(finalScore);
                    clearInterval(interval);
                } else {
                    setAnimatedScore(current);
                }
            }, 20);
            return () => clearInterval(interval);
        }
    }, [report]);

    if (loading) {
        return (
            <div className="min-h-screen bg-mesh flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Loading Analysis...</p>
                </div>
            </div>
        );
    }

    if (!report) return <div>Report not found</div>;

    const analysis = report.analysis || {};

    return (
        <div className="min-h-screen bg-mesh font-inter text-slate-900 pb-20">
            {/* NAVBAR */}
            <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="text-xl font-extrabold text-slate-900 tracking-tight cursor-pointer" onClick={() => navigate("/")}>
                            VentureAI.
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 ${copied ? "text-emerald-600 bg-emerald-50" : "text-slate-900 hover:bg-slate-50"
                                }`}
                            onClick={handleShare}
                            disabled={sharing}
                        >
                            {sharing ? (
                                <Loader2 size={16} className="animate-spin text-emerald-600" />
                            ) : copied ? (
                                <CheckCircle2 size={16} className="text-emerald-600" />
                            ) : (
                                <Share2 size={16} />
                            )}
                            {sharing ? "Preparing..." : copied ? "Copied!" : "Share PDF"}
                        </button>
                        <button
                            className="premium-btn flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-sm disabled:opacity-50"
                            onClick={handleDownloadPDF}
                            disabled={downloading}
                        >
                            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                            {downloading ? "Exporting..." : "Export PDF"}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-12 pb-12">
                <div
                    id="pdf-report"
                    className="bg-white rounded-[28px] shadow-sm border border-slate-200 p-8 sm:p-10"
                >
                    {/* Header Top: Title & Description */}
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wider uppercase mb-6 border border-emerald-100">
                            <Zap size={12} className="fill-emerald-700" />
                            Validation Complete
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                            {report.name}
                        </h1>
                        <p className="text-lg text-slate-500 leading-relaxed max-w-3xl min-h-[60px]">
                            <Typewriter text={report.description} delay={10} />
                        </p>
                    </div>

                    {/* VISUAL DASHBOARD: GAUGE & RADAR */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        {/* LEFT: VIABILITY SCORE GAUGE */}
                        <div className="premium-card p-8 flex flex-col items-center justify-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-500 text-[10px] uppercase tracking-[0.2em] mb-8">Viability Matrix</h3>
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                                    <circle cx="80" cy="80" r="70" stroke="#e2e8f0" strokeWidth="12" fill="none" />
                                    <circle
                                        cx="80"
                                        cy="80"
                                        r="70"
                                        stroke={animatedScore > 70 ? "#10b981" : animatedScore > 40 ? "#f59e0b" : "#ef4444"}
                                        strokeWidth="12"
                                        strokeDasharray="440"
                                        strokeDashoffset={440 - (440 * (animatedScore || 0)) / 100}
                                        strokeLinecap="round"
                                        fill="none"
                                        className="transition-all duration-[30ms] ease-linear"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <div className="flex items-baseline">
                                        <span className="text-6xl font-black text-slate-900 tracking-tighter">{animatedScore || 0}</span>
                                        <span className="text-xl font-bold text-slate-400 font-inter">%</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Founders Score</span>
                                </div>
                            </div>
                            <div className={`mt-8 px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${analysis.verdict === 'high' ? 'bg-emerald-600 text-white shadow-emerald-200' :
                                analysis.verdict === 'medium' ? 'bg-amber-500 text-white shadow-amber-200' :
                                    'bg-red-500 text-white shadow-red-200'
                                }`}>
                                {analysis.verdict || "Low"} Conviction
                            </div>
                        </div>

                        {/* RIGHT: DIMENSION RADAR CHART */}
                        <div className="premium-card p-6 flex flex-col items-center justify-center min-h-[320px]">
                            <h3 className="font-bold text-slate-500 text-[10px] uppercase tracking-[0.2em] mb-4">Dimension breakdown</h3>
                            <div className="w-full h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
                                        { subject: 'Demand', A: analysis.marketDemand?.score || 0, fullMark: 100 },
                                        { subject: 'Edges', A: analysis.competitorAssessment?.score || 0, fullMark: 100 },
                                        { subject: 'Users', A: analysis.userDemographics?.score || 0, fullMark: 100 },
                                        { subject: 'Revenue', A: analysis.revenueOptions?.score || 0, fullMark: 100 },
                                    ]}>
                                        <PolarGrid stroke="#e2e8f0" strokeWidth={1} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} />
                                        <Radar
                                            name="Idea"
                                            dataKey="A"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            fill="#10b981"
                                            fillOpacity={0.15}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* SCORE COMPARISON BAR CHART SECTION */}
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-px flex-1 bg-slate-100" />
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">Metric analysis</h3>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>
                        <div className="premium-card p-8 bg-slate-50/30">
                            <div className="w-full h-48 sm:h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={[
                                            { name: 'Market', value: analysis.marketDemand?.score || 0, color: '#3b82f6' },
                                            { name: 'Competition', value: analysis.competitorAssessment?.score || 0, color: '#8b5cf6' },
                                            { name: 'Demographics', value: analysis.userDemographics?.score || 0, color: '#10b981' },
                                            { name: 'Monetization', value: analysis.revenueOptions?.score || 0, color: '#f59e0b' },
                                        ]}
                                        margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dx={-5} domain={[0, 100]} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                                            {
                                                [
                                                    { name: 'Market', value: analysis.marketDemand?.score || 0, color: '#3b82f6' },
                                                    { name: 'Competition', value: analysis.competitorAssessment?.score || 0, color: '#8b5cf6' },
                                                    { name: 'Demographics', value: analysis.userDemographics?.score || 0, color: '#10b981' },
                                                    { name: 'Monetization', value: analysis.revenueOptions?.score || 0, color: '#f59e0b' },
                                                ].map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* ANALYSIS PILLARS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* Market Demand */}
                        <div className="premium-card p-8 group hover:border-emerald-200 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100 group-hover:scale-110 transition-transform">
                                <TrendingUp size={24} />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-slate-900">Market Demand</h3>
                                <span className="text-sm font-black text-blue-600">{analysis.marketDemand?.score}%</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed text-sm min-h-[80px]">
                                <Typewriter text={analysis.marketDemand?.analysis} delay={15} />
                            </p>
                        </div>

                        {/* Competitor Assessment */}
                        <div className="premium-card p-8 group hover:border-emerald-200 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 border border-purple-100 group-hover:scale-110 transition-transform">
                                <Target size={24} />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-slate-900">Competitive Edge</h3>
                                <span className="text-sm font-black text-purple-600">{analysis.competitorAssessment?.score}%</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed text-sm mb-4 min-h-[80px]">
                                <Typewriter text={analysis.competitorAssessment?.analysis} delay={15} />
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {analysis.competitorAssessment?.keyCompetitors?.map((comp, i) => (
                                    <span key={i} className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 text-slate-900 uppercase">
                                        {comp}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* User Persona */}
                        <div className="premium-card p-8 group hover:border-emerald-200 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-slate-900">User Demographics</h3>
                                <span className="text-sm font-black text-emerald-600">{analysis.userDemographics?.score}%</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed text-sm mb-4">
                                <span className="font-bold text-slate-900">Target:</span> {analysis.userDemographics?.targetPersona}
                            </p>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                <span className="font-bold text-slate-900">Behavior:</span> {analysis.userDemographics?.behavior}
                            </p>
                        </div>

                        {/* Revenue Options */}
                        <div className="premium-card p-8 group hover:border-emerald-200 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 border border-orange-100 group-hover:scale-110 transition-transform">
                                <Zap size={24} />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-slate-900">Monetization</h3>
                                <span className="text-sm font-black text-orange-600">{analysis.revenueOptions?.score}%</span>
                            </div>
                            <div className="space-y-3">
                                {analysis.revenueOptions?.strategies?.map((strat, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                                        <span className="text-slate-500 text-sm">{strat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* NEXT STEPS */}
                    <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 -m-20 w-64 h-64 bg-emerald-600 rounded-full blur-[100px] opacity-20"></div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-8 relative z-10">Recommended Next Steps</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                            {analysis.nextSteps?.map((step, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
                                    <div className="text-emerald-600 font-black text-2xl mb-4">0{i + 1}</div>
                                    <p className="text-slate-500 leading-relaxed">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
