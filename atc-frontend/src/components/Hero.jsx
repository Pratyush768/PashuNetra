import React, { useState, useEffect, useCallback, useMemo } from "react";

export default function Hero({ onViewReport }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [localPreviews, setLocalPreviews] = useState([]);
    const [serverPreviews, setServerPreviews] = useState([]);
    const [uploadMessage, setUploadMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [dragActive, setDragActive] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [atcResults, setAtcResults] = useState(null);

    // Animation trigger with performance optimization
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Cleanup URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            localPreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [localPreviews]);

    // File validation function
    const validateFiles = useCallback((files) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxFiles = 1; // Single image for ATC analysis

        if (files.length > maxFiles) {
            setUploadMessage(`❌ Please select only 1 image for ATC analysis`);
            return false;
        }

        for (let file of files) {
            if (!allowedTypes.includes(file.type)) {
                setUploadMessage("❌ Only JPG, PNG, and WebP files are allowed");
                return false;
            }
            if (file.size > maxSize) {
                setUploadMessage("❌ File size must be less than 10MB");
                return false;
            }
        }
        return true;
    }, []);

    const handleFileChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        if (!validateFiles(files)) return;

        setSelectedFiles(files);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setLocalPreviews(newPreviews);
        setUploadMessage("");
        setAtcResults(null);
    }, [validateFiles]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));

        if (!files.length) {
            setUploadMessage("❌ No valid image files found");
            return;
        }

        if (!validateFiles(files)) return;

        setSelectedFiles(files);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setLocalPreviews(newPreviews);
        setUploadMessage("");
        setAtcResults(null);
    }, [validateFiles]);

    // ✨ ENHANCED: Updated upload handler for complete ATC analysis integration
    const handleUpload = useCallback(async () => {
        if (selectedFiles.length === 0) {
            setUploadMessage("⚠️ Please select a cow image for analysis.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFiles[0]);

        try {
            setUploading(true);
            setUploadProgress(0);
            setUploadMessage("🔄 Running AI Analysis...");

            // Realistic progress simulation
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev < 30) return prev + 15;
                    if (prev < 60) return prev + 10;
                    if (prev < 90) return prev + 5;
                    return prev;
                });
            }, 300);

            const res = await fetch("http://localhost:3001/analyze-cow", {
                method: "POST",
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            const data = await res.json();

            if (res.ok && data.success) {
                // ✨ ENHANCED: Extract ATC results properly
                const analysisResults = {
                    overall_score: data.individual_cows?.[0]?.atc_results?.overall_score || data.atc_results?.overall_score || 0,
                    classification: data.individual_cows?.[0]?.atc_results?.classification || data.atc_results?.classification || "Unknown",
                    category_scores: data.individual_cows?.[0]?.atc_results?.category_scores || data.atc_results?.category_scores || {}
                };

                setUploadMessage(`✅ Analysis Complete! Classification: ${analysisResults.classification} (Score: ${analysisResults.overall_score}/9)`);
                setAtcResults(analysisResults);

                // ✨ CRITICAL: Store complete analysis data for report access
                // This makes the data available to the ATCReport component
                window.analysisData = data;

                console.log("Analysis completed:", data);

                // Don't clear files immediately - let user see results first
                setTimeout(() => {
                    setUploadMessage("");
                }, 8000);

            } else {
                setUploadMessage("❌ " + (data.error || "Analysis failed"));
                console.error("Analysis failed:", data);
            }
        } catch (err) {
            console.error("Analysis error:", err);
            setUploadMessage("❌ Network error - please check your connection");
        } finally {
            setUploading(false);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    }, [selectedFiles]);

    const handleDelete = useCallback(async (index, url, isServer) => {
        if (!isServer) {
            URL.revokeObjectURL(url);
            setLocalPreviews((prev) => prev.filter((_, i) => i !== index));
            setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
            setAtcResults(null);
        }
    }, []);

    // Enhanced image preview with keyboard support
    const handleImagePreview = useCallback((url) => {
        setPreviewImage(url);
        setShowPreview(true);
    }, []);

    const closePreview = useCallback(() => {
        setShowPreview(false);
        setPreviewImage(null);
    }, []);

    // Keyboard navigation for preview
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (showPreview && e.key === 'Escape') {
                closePreview();
            }
        };

        if (showPreview) {
            document.addEventListener('keydown', handleKeyPress);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            document.body.style.overflow = 'unset';
        };
    }, [showPreview, closePreview]);

    const allPreviews = useMemo(() =>
            localPreviews.map((url) => ({ url, isServer: false }))
        , [localPreviews]);

    // Enhanced stats with animation counters
    const stats = [
        { value: "98.5%", label: "Accuracy", color: "text-emerald-600", gradient: "from-emerald-400 to-green-500" },
        { value: "1.8s", label: "Processing", color: "text-green-600", gradient: "from-green-400 to-emerald-500" },
        { value: "25K+", label: "Evaluated", color: "text-blue-600", gradient: "from-blue-400 to-green-500" }
    ];

    // ✨ ENHANCED: Reset form function with proper cleanup
    const resetForm = () => {
        // Clean up preview URLs
        localPreviews.forEach((url) => URL.revokeObjectURL(url));

        setAtcResults(null);
        setSelectedFiles([]);
        setLocalPreviews([]);
        setUploadMessage("");
        setUploadProgress(0);
        setUploading(false);

        // Clear analysis data
        window.analysisData = null;
    };

    return (
        <>
            <section className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/50 to-green-100/30 overflow-hidden">
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 opacity-8">
                    <div className="absolute top-40 left-20 w-96 h-96 bg-gradient-to-r from-emerald-200/30 to-green-300/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-60 right-32 w-80 h-80 bg-gradient-to-r from-green-200/25 to-teal-300/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-gradient-to-r from-teal-200/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                {/* Enhanced Pattern Overlay */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20zm20 30c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '80px 80px'
                    }}></div>
                </div>

                {/* Animated Cow Silhouettes */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-10 top-1/2 transform -translate-y-1/2 opacity-8 hover:opacity-15 transition-opacity duration-1000">
                        <svg width="220" height="140" viewBox="0 0 220 140" className="text-green-700 animate-pulse">
                            <path fill="currentColor" d="M44 88c-9 0-16-8-16-16s8-16 16-16c3 0 7 1 9 3V50c0-13 11-24 24-24h66c13 0 24 11 24 24v9c2-2 6-3 9-3c9 0 16 8 16 16s-8 16-16 16c-3 0-7-1-9-3v16c0 9-8 16-16 16h-11v9c0 4-3 8-8 8s-8-4-8-8v-9h-17v9c0 4-3 8-8 8s-8-4-8-8v-9h-17v9c0 4-3 8-8 8s-8-4-8-8v-9H60c-9 0-16-8-16-16V85c-2 2-6 3-9 3z"/>
                            <circle cx="88" cy="44" r="3" fill="currentColor"/>
                            <circle cx="110" cy="44" r="3" fill="currentColor"/>
                        </svg>
                    </div>

                    <div className="absolute right-10 bottom-20 opacity-6 hover:opacity-12 transition-opacity duration-1000">
                        <svg width="180" height="110" viewBox="0 0 180 110" className="text-green-600 animate-pulse delay-1000">
                            <path fill="currentColor" d="M36 70c-7 0-13-6-13-13s6-13 13-13c2 0 5 1 7 2V38c0-10 8-18 18-18h50c10 0 18 8 18 18v7c1-1 4-2 7-2c7 0 13 6 13 13s-6 13-13 13c-2 0-5-1-7-2v13c0 7-6 13-13 13h-8v7c0 3-3 6-6 6s-6-3-6-6v-7h-14v7c0 3-3 6-6 6s-6-3-6-6v-7h-14v7c0 3-3 6-6 6s-6-3-6-6v-7h-8c-7 0-13-6-13-13V68c-2 1-5 2-7 2z"/>
                            <circle cx="72" cy="35" r="2" fill="currentColor"/>
                            <circle cx="88" cy="35" r="2" fill="currentColor"/>
                        </svg>
                    </div>
                </div>

                {/* Enhanced Floating Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute opacity-15"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 3}s`
                            }}
                        >
                            {i % 5 === 0 && (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-green-500 animate-bounce">
                                    <path d="M12 2l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z"/>
                                </svg>
                            )}
                            {i % 5 === 1 && (
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            )}
                            {i % 5 === 2 && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500 animate-spin-slow">
                                    <circle cx="12" cy="12" r="2"/>
                                </svg>
                            )}
                            {i % 5 === 3 && (
                                <div className="w-1 h-4 bg-green-300 rounded animate-sway"></div>
                            )}
                            {i % 5 === 4 && (
                                <div className="w-3 h-1 bg-emerald-400 rounded animate-pulse delay-500"></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="relative z-10 px-6 md:px-16 lg:px-24 xl:px-32 py-16">
                    <div className="flex flex-col-reverse lg:flex-row gap-16 mt-12 md:mt-20 items-center max-w-7xl mx-auto">

                        {/* Enhanced Left Content */}
                        <div className={`max-lg:text-center flex-1 transform transition-all duration-1000 ${
                            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                        }`}>
                            <div className="relative mb-8">
                                <span className="inline-flex items-center text-sm text-emerald-700 bg-white/85 backdrop-blur-md px-5 py-2.5 rounded-full border border-emerald-200/60 hover:bg-white/95 hover:border-emerald-300 transition-all duration-300 shadow-lg hover:shadow-xl">
                                    <svg className="w-4 h-4 mr-3 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z"/>
                                    </svg>
                                    <span className="font-medium">Rashtriya Gokul Mission</span>
                                    <span className="mx-2 text-emerald-600">•</span>
                                    <span className="font-medium">PT & PS Programs</span>
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight bg-gradient-to-r from-slate-800 via-emerald-700 to-green-800 bg-clip-text text-transparent hover:from-emerald-700 hover:via-green-800 hover:to-slate-800 transition-all duration-700 cursor-default">
                                AI-Powered Cattle Evaluation System
                            </h1>

                            <p className="mt-8 text-gray-700 max-w-2xl text-lg lg:text-xl leading-relaxed font-light">
                                Revolutionary <span className="text-emerald-700 font-semibold">computer vision technology</span> for
                                standardized cattle evaluation. Upload high-resolution images from multiple angles to generate precise{' '}
                                <span className="text-green-700 font-semibold">ATC scores</span> and streamline breeding excellence.
                            </p>

                            <div className="flex items-center gap-5 mt-10 max-lg:justify-center flex-wrap">
                                <button
                                    className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 active:scale-95 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                    aria-label="Start cattle evaluation process"
                                >
                                    <span className="relative z-10 flex items-center gap-2.5">
                                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Start Evaluation
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>

                                <button
                                    className="group px-7 py-4 rounded-xl bg-white/90 backdrop-blur-sm text-emerald-800 border-2 border-emerald-400/50 hover:bg-emerald-50 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all duration-300 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                    aria-label="View documentation"
                                >
                                    <span className="group-hover:scale-105 inline-block transition-transform">
                                        Learn More
                                    </span>
                                </button>
                            </div>

                            {/* Enhanced Stats Section */}
                            <div className="flex items-center gap-10 mt-14 max-lg:justify-center">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300">
                                        <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-2`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-600 font-medium mb-2">
                                            {stat.label}
                                        </div>
                                        <div className={`w-12 h-1.5 bg-gradient-to-r ${stat.gradient} mx-auto rounded-full`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Enhanced Upload Card */}
                        <div className={`w-full md:max-w-lg lg:max-w-xl transform transition-all duration-1000 delay-300 ${
                            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                        }`}>
                            <div className="relative bg-white/80 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-2xl p-8 hover:bg-white/85 hover:shadow-3xl transition-all duration-500 group overflow-hidden">

                                {/* Loading Overlay */}
                                {isLoading && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin"></div>
                                            <span className="text-emerald-700 font-medium">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Decorative Background */}
                                <div className="absolute -top-4 -right-4 w-28 h-28 bg-gradient-to-tr from-emerald-400/15 to-green-500/15 rounded-full blur-2xl animate-pulse group-hover:opacity-80 transition-opacity"></div>

                                <div className="relative z-10">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-7">
                                        <div className="flex items-center gap-3.5">
                                            <div className="p-2.5 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl shadow-md">
                                                <svg className="w-6 h-6 text-emerald-700" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h2 className="font-bold text-xl text-gray-800">Upload Image</h2>
                                                <p className="text-base text-gray-600 font-light">ATC Analysis</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-full border border-emerald-200">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className="text-sm text-emerald-800 font-semibold">AI Active</span>
                                        </div>
                                    </div>

                                    {/* Enhanced Upload Area */}
                                    <label
                                        className={`cursor-pointer group/upload relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl min-h-[240px] transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 ${
                                            dragActive
                                                ? 'border-emerald-500 bg-gradient-to-br from-emerald-100/90 to-green-100/90 scale-105'
                                                : 'border-emerald-300 bg-gradient-to-br from-emerald-50/70 to-green-50/70 hover:from-emerald-100/90 hover:to-green-100/90 hover:border-emerald-400'
                                        }`}
                                        onDragEnter={() => setDragActive(true)}
                                        onDragLeave={() => setDragActive(false)}
                                        onDrop={handleDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                    >
                                        <div className="flex flex-col items-center text-gray-600 p-6 relative z-10">
                                            <div className="relative mb-5">
                                                <div className={`p-4 rounded-2xl bg-gradient-to-r from-emerald-200 to-green-200 ${dragActive ? 'scale-125 from-emerald-300 to-green-300' : 'group-hover/upload:scale-110'} transition-all duration-300 shadow-lg`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         className="w-12 h-12 text-emerald-700 group-hover/upload:animate-bounce transition-all duration-300"
                                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
                                                    </svg>
                                                </div>
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-ping"></div>
                                            </div>
                                            <h3 className="text-xl font-bold group-hover/upload:text-emerald-800 transition-colors mb-2 text-center">
                                                {dragActive ? 'Release to Upload' : 'Select Cow Image'}
                                            </h3>
                                            <p className="text-base text-gray-500 mb-3 text-center">
                                                High-resolution JPG, PNG, WebP (max 10MB)
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/70 px-3 py-1.5 rounded-full shadow-sm">
                                                <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 12 12">
                                                    <circle cx="6" cy="6" r="2"/>
                                                </svg>
                                                <span className="font-medium">Single cow • Clear side view optimal</span>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            aria-label="Upload cattle image for ATC analysis"
                                        />
                                    </label>

                                    {/* Enhanced Image Previews */}
                                    {allPreviews.length > 0 && (
                                        <div className="mt-7">
                                            <div className="flex items-center justify-between mb-5">
                                                <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2.5">
                                                    <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                    </svg>
                                                    Selected Image
                                                </h4>
                                                <div className="text-sm text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full font-semibold border border-emerald-200">
                                                    ✓ Ready for ATC Analysis
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                {allPreviews.map(({ url, isServer }, idx) => (
                                                    <div key={idx}
                                                         className="relative group/preview rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-emerald-200">

                                                        <img src={url} alt={`Cattle image for ATC analysis`}
                                                             className="h-48 w-full object-cover group-hover/preview:scale-110 transition-transform duration-500 cursor-pointer"
                                                             onClick={() => handleImagePreview(url)}
                                                             loading="lazy" />

                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300"></div>

                                                        {/* Action Buttons */}
                                                        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleImagePreview(url); }}
                                                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 hover:scale-110 active:scale-95 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                                aria-label="Preview image"
                                                            >
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDelete(idx, url, isServer); }}
                                                                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 hover:scale-110 active:scale-95 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                                                                aria-label="Delete image"
                                                            >
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        </div>

                                                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                                                            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                                Ready for Analysis
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Enhanced Upload Button */}
                                    <button
                                        onClick={handleUpload}
                                        disabled={uploading || allPreviews.length === 0}
                                        className={`relative w-full mt-7 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 text-white font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                                            uploading || allPreviews.length === 0
                                                ? "opacity-60 cursor-not-allowed"
                                                : "hover:scale-105 active:scale-95"
                                        }`}
                                        aria-label="Start ATC evaluation of uploaded image"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        <div className="relative z-10 flex items-center justify-center gap-3">
                                            {uploading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Analyzing... {uploadProgress}%</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Start ATC Analysis</span>
                                                </>
                                            )}
                                        </div>

                                        {uploading && (
                                            <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full overflow-hidden">
                                                <div className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                                                     style={{ width: `${uploadProgress}%` }}></div>
                                            </div>
                                        )}
                                    </button>

                                    {/* Enhanced Message Display */}
                                    {uploadMessage && (
                                        <div className={`mt-5 p-4 rounded-xl text-base font-medium text-center transition-all duration-300 transform ${
                                            uploadMessage.includes("✅")
                                                ? "text-emerald-800 bg-emerald-100/90 border border-emerald-200"
                                                : uploadMessage.includes("⚠️")
                                                    ? "text-amber-800 bg-amber-100/90 border border-amber-200"
                                                    : uploadMessage.includes("🔄")
                                                        ? "text-blue-800 bg-blue-100/90 border border-blue-200"
                                                        : "text-red-800 bg-red-100/90 border border-red-200"
                                        }`}>
                                            <div className="flex items-center justify-center gap-2">
                                                <span>{uploadMessage}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* ✨ ENHANCED: ATC Results Display with Navigation */}
                                    {atcResults && (
                                        <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
                                            <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                                                🏆 ATC Analysis Results
                                            </h3>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="text-center p-3 bg-white/70 rounded-lg">
                                                    <div className="text-2xl font-bold text-emerald-600">
                                                        {atcResults.classification}
                                                    </div>
                                                    <div className="text-sm text-gray-600">Classification</div>
                                                </div>
                                                <div className="text-center p-3 bg-white/70 rounded-lg">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {atcResults.overall_score}/9
                                                    </div>
                                                    <div className="text-sm text-gray-600">Overall Score</div>
                                                </div>
                                            </div>

                                            {atcResults.category_scores && (
                                                <div style={{ marginBottom: '1.5rem' }}>
                                                    <h4 style={{
                                                        fontWeight: '600',
                                                        color: '#374151',
                                                        marginBottom: '0.75rem'
                                                    }}>
                                                        Category Scores:
                                                    </h4>
                                                    {Object.entries(atcResults.category_scores).map(([category, score]) => (
                                                        <div key={category} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            marginBottom: '0.75rem',
                                                            gap: '1.5rem'
                                                        }}>
                <span style={{
                    textTransform: 'capitalize',
                    color: '#4b5563',
                    width: '35%',
                    flexShrink: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {category.replace('_', ' ')}
                </span>
                                                            <div style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '1rem',
                                                                flex: 1,
                                                                justifyContent: 'flex-end'
                                                            }}>
                                                                <div style={{
                                                                    width: '120px',
                                                                    backgroundColor: '#e5e7eb',
                                                                    borderRadius: '9999px',
                                                                    height: '8px',
                                                                    overflow: 'hidden'
                                                                }}>
                                                                    <div style={{
                                                                        backgroundColor: '#10b981',
                                                                        height: '8px',
                                                                        borderRadius: '9999px',
                                                                        transition: 'width 0.5s ease',
                                                                        width: `${(score/9)*100}%`
                                                                    }}></div>
                                                                </div>
                                                                <span style={{
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: '600',
                                                                    color: '#6b7280',
                                                                    width: '50px',
                                                                    textAlign: 'right'
                                                                }}>
                        {typeof score === 'number' ? score.toFixed(1) : score}/9
                    </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* ✨ ENHANCED: Navigation Buttons */}
                                            <div className="space-y-3">
                                                <button
                                                    onClick={() => onViewReport && onViewReport()}
                                                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 group"
                                                >
                                                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h6a2 2 0 002-2V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8 5H8v4h4v-4z" clipRule="evenodd"/>
                                                    </svg>
                                                    View Detailed Report & Analytics
                                                </button>

                                                <button
                                                    onClick={resetForm}
                                                    className="w-full py-3 px-6 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                    </svg>
                                                    Analyze Another Image
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Bottom Wave */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                    <svg className="relative block w-full h-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor" className="text-white"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor" className="text-white"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor" className="text-white"></path>
                    </svg>
                </div>
            </section>

            {/* Enhanced Full Screen Preview Modal */}
            {showPreview && previewImage && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-8 animate-fade-in"
                    onClick={closePreview}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image preview"
                >
                    <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
                        <button
                            onClick={closePreview}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 z-10 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                            aria-label="Close preview"
                        >
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <img
                            src={previewImage}
                            alt="Full resolution cattle image preview"
                            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full">
                            <span className="text-base font-medium">Full Resolution Preview • Press ESC to close</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Custom Animations */}
            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes sway {
                    0%, 100% { transform: rotate(-3deg); }
                    50% { transform: rotate(3deg); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-spin-slow {
                    animation: spin-slow 6s linear infinite;
                }
                .animate-sway {
                    animation: sway 4s ease-in-out infinite;
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
