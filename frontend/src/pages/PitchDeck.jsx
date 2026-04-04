import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    PlusCircle,
    Clock,
    ArrowLeftRight,
    LogOut,
    Presentation,
    Loader2,
    Target,
    Zap,
    LineChart,
    DollarSign,
    Shield,
    Rocket,
    CheckCircle2,
    Search,
    Download,
    Sparkles,
    Eye,
    Users,
    Layout,
    Monitor,
    BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

export default function PitchDeck() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [pitchDeck, setPitchDeck] = useState(null);

    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        if (storedName) setUserName(storedName);

        const fetchReports = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reports`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await response.json();
                if (Array.isArray(data)) setReports(data);
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handleGenerate = async (report) => {
        setSelectedReport(report);
        setIsGenerating(true);
        setPitchDeck(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reports/${report._id}/pitch-deck`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            if (data && data.problem) {
                setPitchDeck(data);
            } else {
                throw new Error("Invalid pitch deck format received");
            }
        } catch (error) {
            console.error("Error generating pitch deck:", error);
            alert("Failed to generate pitch deck. The AI response was incomplete or invalid. Please try a different idea or try again later.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        navigate("/");
    };

    const exportToPDF = async () => {
        const deckElement = document.getElementById("pitch-deck-content");
        if (!deckElement) return;

        try {
            // Scroll to top to ensure capturing everything correctly
            window.scrollTo(0, 0);

            // Temporarily set a fixed width for the capture to ensure layout consistency
            const originalStyle = deckElement.getAttribute('style');
            deckElement.style.width = '1080px'; // Slightly wider for better quality
            deckElement.style.maxWidth = '1080px';
            deckElement.style.margin = '0 auto';
            deckElement.style.backgroundColor = '#fff';
            deckElement.style.padding = '40px'; // Add some breathing room

            // Give it time for styles to settle and animations to finish
            await new Promise(r => setTimeout(r, 500));

            const elementHeight = deckElement.scrollHeight;
            const elementWidth = 1080;

            const dataUrl = await toPng(deckElement, { 
                quality: 0.95, 
                backgroundColor: "#fff",
                pixelRatio: 2, // High quality
                width: elementWidth,
                height: elementHeight,
                cacheBust: true,
                // Filter out problematic external links that cause SecurityError
                filter: (node) => {
                    if (node.tagName === 'LINK' && node.href && !node.href.startsWith(window.location.origin)) {
                        return false;
                    }
                    return true;
                }
            });

            // Restore original styles
            if (originalStyle) {
                deckElement.setAttribute('style', originalStyle);
            } else {
                deckElement.removeAttribute('style');
            }

            const margin = 10; // 10mm print margins
            const pdfPageWidth = 210; // Standard A4 width in mm
            const availableWidth = pdfPageWidth - (margin * 2);
            const pdfImageHeight = (elementHeight * availableWidth) / elementWidth;

            // Generate a continuous PDF that dynamically expands to fit all vertical content
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [pdfPageWidth, pdfImageHeight + (margin * 2)]
            });

            pdf.addImage(dataUrl, "PNG", margin, margin, availableWidth, pdfImageHeight);
            pdf.save(`${selectedReport.name}_PitchDeck.pdf`);
        } catch (error) {
            console.error("PDF Export failed:", error);
            // Fallback for subagent/stricter browsers
            alert("PDF Generation encounterted an issue with external assets. Attempting simple capture...");
            try {
                const simpleDataUrl = await toPng(deckElement);
                const pdf = new jsPDF();
                pdf.addImage(simpleDataUrl, "PNG", 0, 0, 210, 297);
                pdf.save(`${selectedReport.name}_PitchDeck_Simple.pdf`);
            } catch (e) {
                alert("Critical error during PDF generation. Please try again or use a different browser.");
            }
        }
    };

    const filteredReports = reports.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const slides = pitchDeck ? [
        { id: "problem", title: "The Problem", icon: <Target className="text-rose-500" />, content: pitchDeck.problem },
        { id: "solution", title: "The Solution", icon: <Zap className="text-amber-500" />, content: pitchDeck.solution },
        { id: "uvp", title: "Unique Value Proposition", icon: <Sparkles className="text-emerald-500" />, content: pitchDeck.uvp },
        { id: "howItWorks", title: "How It Works", icon: <Layout className="text-blue-500" />, content: pitchDeck.howItWorks },
        { id: "market", title: "Market Opportunity", icon: <LineChart className="text-indigo-500" />, content: pitchDeck.marketOpportunity },
        { id: "demo", title: "Product Demo", icon: <Monitor className="text-cyan-500" />, content: pitchDeck.productDemo },
        { id: "model", title: "Business Model", icon: <DollarSign className="text-emerald-500" />, content: pitchDeck.businessModel },
        { id: "competition", title: "Competitive Advantage", icon: <BarChart3 className="text-violet-500" />, content: pitchDeck.competitiveAdvantage },
        { id: "gtm", title: "Go-to-Market", icon: <Rocket className="text-orange-500" />, content: pitchDeck.gtmStrategy },
        { id: "traction", title: "Traction", icon: <Users className="text-sky-500" />, content: pitchDeck.traction },
        { id: "vision", title: "Future Vision", icon: <Eye className="text-purple-500" />, content: pitchDeck.futureVision },
        { id: "closing", title: "Closing Statement", icon: <CheckCircle2 className="text-emerald-600" />, content: pitchDeck.closingStatement },
    ] : [];

    return (
        <div className="min-h-screen bg-mesh font-inter text-slate-900 pb-20">
            {/* NAVBAR */}
            <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="text-xl font-extrabold text-slate-900 tracking-tight cursor-pointer" onClick={() => navigate("/")}>
                            VentureAI.
                        </div>
                        <div className="hidden md:flex items-center gap-1">
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors" onClick={() => navigate("/dashboard")}>
                                <LayoutDashboard size={16} /> Dashboard
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors" onClick={() => navigate("/new-idea")}>
                                <PlusCircle size={16} /> New Idea
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors" onClick={() => navigate("/history")}>
                                <Clock size={16} /> History
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors" onClick={() => navigate("/compare")}>
                                <ArrowLeftRight size={16} /> Compare
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-700">
                                <Presentation size={16} /> Pitch Deck
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-semibold text-slate-900 hidden sm:block">{userName || "User"}</div>
                        <button onClick={handleLogout} className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                {!pitchDeck && !isGenerating ? (
                    <>
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">AI Pitch Deck Generator</h1>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                                Select an idea from your history to generate a professional 12-slide startup pitch deck in seconds.
                            </p>
                        </div>

                        <div className="relative mb-8">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search your startup ideas..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 transition-all text-lg font-medium shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredReports.map((report) => (
                                <div
                                    key={report._id}
                                    className="premium-card p-6 cursor-pointer hover:border-emerald-500 group transition-all"
                                    onClick={() => handleGenerate(report)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                            {report.industry}
                                        </div>
                                        <div className="text-xs text-slate-400">{new Date(report.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{report.name}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 mr-4">{report.description}</p>
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                                            Valid Analysis Found <CheckCircle2 size={14} />
                                        </div>
                                        <button className="text-sm font-bold text-slate-900 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            Generate Deck <PlusCircle size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="relative w-24 h-24 mb-8">
                            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25"></div>
                            <div className="relative bg-white rounded-full p-6 border-2 border-emerald-500 shadow-xl">
                                <Presentation className="w-10 h-10 text-emerald-600 animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-3">AI is Crafting Your Pitch...</h2>
                        <p className="text-slate-500 text-lg">Synthesizing market data and strategic positioning for {selectedReport?.name}.</p>
                        <div className="mt-12 flex gap-4">
                            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in-up">
                        <div className="flex items-center justify-between mb-8">
                            <button
                                onClick={() => { setPitchDeck(null); setSelectedReport(null); }}
                                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                <ArrowLeftRight size={16} className="rotate-180" /> Back to Selection
                            </button>
                            <button
                                onClick={exportToPDF}
                                className="premium-btn px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                            >
                                <Download size={16} /> Export Deck
                            </button>
                        </div>

                        <div id="pitch-deck-content" className="space-y-6">
                            {/* COVER SLIDE */}
                            <div className="premium-card p-12 bg-slate-950 text-white relative overflow-hidden h-[400px] flex flex-col justify-center border-none">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
                                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 inline-block w-fit">
                                    {selectedReport.industry} PITCH DECK
                                </span>
                                <h2 className="text-6xl font-black tracking-tighter mb-4 leading-none">{selectedReport.name}</h2>
                                <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">{selectedReport.description}</p>
                                <div className="mt-12 flex items-center gap-4">
                                    <div className="h-px w-12 bg-emerald-500"></div>
                                    <span className="text-sm font-bold tracking-widest text-slate-500 uppercase">Generated by VentureAI</span>
                                </div>
                            </div>

                            {/* CONTENT SLIDES */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {slides.map((slide) => (
                                    <div key={slide.id} className="premium-card p-8 flex flex-col hover:border-emerald-200 transition-all min-h-[300px]">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                                            {slide.icon}
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-4">{slide.title}</h3>
                                        <p className="text-slate-600 text-base leading-relaxed line-clamp-6">{slide.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
