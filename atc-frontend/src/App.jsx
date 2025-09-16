import React, { useState } from 'react';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import ATCReport from "./components/ATCReport";
import Chatbot from "./components/Chatbot";
import Support from "./components/Support.jsx";

// INLINED FUTURE FEATURES COMPONENT
function FutureFeatures({ onBackToHome }) {
    const [activeFeature, setActiveFeature] = useState(null);

    const features = [
        {
            id: 1,
            title: "Generative AI Veterinary Assistant",
            icon: "🤖",
            color: "emerald",
            description: "AI-powered veterinary consultation and diagnosis system",
            details: [
                "AI chatbot trained on veterinary data for instant diagnosis suggestions",
                "Symptom analysis from farmer descriptions or image uploads",
                "Treatment recommendations and medication scheduling",
                "Multi-language support for global accessibility",
                "Integration with local veterinary databases"
            ],
            implementation: "Fine-tune LLM models (Llama 2/GPT) on veterinary datasets with RAG architecture",
            timeline: "Phase 2 - 3-4 months",
            tech: ["OpenAI GPT-4", "Llama 2", "Veterinary Knowledge Base", "React Chat UI"]
        },
        {
            id: 2,
            title: "Real-Time Disease Prediction System",
            icon: "🔬",
            color: "green",
            description: "Advanced computer vision for early disease detection",
            details: [
                "Computer vision analysis of cattle facial patterns, gait, and posture changes",
                "Early detection algorithms for diseases like mastitis, lameness, and respiratory issues",
                "Behavioral anomaly detection using movement patterns and feeding habits",
                "Real-time health monitoring with instant alerts",
                "Integration with existing ATC classification pipeline"
            ],
            implementation: "Use your existing image processing pipeline + behavioral analysis models",
            timeline: "Phase 2 - 4-5 months",
            tech: ["Computer Vision", "YOLO Models", "Behavioral Analysis", "Real-time Processing"]
        },
        {
            id: 3,
            title: "Predictive Analytics Dashboard",
            icon: "📊",
            color: "teal",
            description: "Advanced forecasting for optimal farm management",
            details: [
                "Breeding cycle optimization - predict optimal mating times",
                "Milk yield forecasting using health and environmental data",
                "Calving date predictions with 95% accuracy",
                "Feed intake optimization based on individual cattle needs",
                "Economic impact analysis and ROI predictions"
            ],
            implementation: "Add time-series forecasting models to your existing system",
            timeline: "Phase 3 - 2-3 months",
            tech: ["Time-series Analysis", "Machine Learning", "Data Analytics", "Predictive Models"]
        }
    ];

    const colorSchemes = {
        emerald: {
            bg: 'from-emerald-600 via-green-600 to-teal-600',
            light: 'from-emerald-50 to-green-100',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
            accent: 'text-emerald-600'
        },
        green: {
            bg: 'from-green-600 via-emerald-600 to-teal-600',
            light: 'from-green-50 to-emerald-100',
            border: 'border-green-200',
            text: 'text-green-700',
            accent: 'text-green-600'
        },
        teal: {
            bg: 'from-teal-600 via-green-600 to-emerald-600',
            light: 'from-teal-50 to-green-100',
            border: 'border-teal-200',
            text: 'text-teal-700',
            accent: 'text-teal-600'
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-200/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => onBackToHome()}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white rounded-2xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-110 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/50 font-bold gap-3 group text-base"
                        >
                            <svg className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to Dashboard
                        </button>

                        <div className="text-center">
                            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 bg-clip-text text-transparent drop-shadow-lg">
                                🚀 Future Innovation Hub
                            </h1>
                            <p className="text-green-600 font-semibold mt-2">Next-Generation ATC Cattle Management Features</p>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 px-6 py-3 rounded-2xl border border-emerald-300/50 shadow-xl">
                            <span className="text-emerald-800 font-bold flex items-center gap-3 text-lg">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                                Coming Soon
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-12">
                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {features.map((feature) => {
                        const scheme = colorSchemes[feature.color];
                        const isActive = activeFeature === feature.id;

                        return (
                            <div
                                key={feature.id}
                                className={`bg-gradient-to-br ${scheme.light} backdrop-blur-xl p-8 rounded-3xl shadow-2xl border ${scheme.border} hover:shadow-3xl hover:shadow-emerald-500/20 transition-all duration-700 cursor-pointer transform hover:scale-105 ${isActive ? 'ring-4 ring-emerald-500/50 scale-105' : ''}`}
                                onClick={() => setActiveFeature(isActive ? null : feature.id)}
                            >
                                <div className="text-center mb-6">
                                    <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className={`text-2xl font-serif font-bold ${scheme.text} mb-3 hover:animate-pulse`}>
                                        {feature.title}
                                    </h3>
                                    <p className={`${scheme.accent} font-semibold text-base`}>
                                        {feature.description}
                                    </p>
                                </div>
                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className={`text-center p-3 bg-white/70 rounded-2xl border ${scheme.border}`}>
                                        <div className={`text-2xl font-bold ${scheme.accent} drop-shadow-lg`}>
                                            {feature.tech.length}+
                                        </div>
                                        <div className={`text-sm ${scheme.text} font-semibold`}>Technologies</div>
                                    </div>
                                    <div className={`text-center p-3 bg-white/70 rounded-2xl border ${scheme.border}`}>
                                        <div className={`text-2xl font-bold ${scheme.accent} drop-shadow-lg`}>
                                            {feature.details.length}
                                        </div>
                                        <div className={`text-sm ${scheme.text} font-semibold`}>Features</div>
                                    </div>
                                </div>
                                <button className={`w-full py-3 bg-gradient-to-r ${scheme.bg} text-white rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg`}>
                                    {isActive ? 'Collapse Details' : 'Explore Feature'}
                                </button>
                                {isActive && (
                                    <div className="mt-8 space-y-6 animate-fade-in">
                                        {/* Feature Details */}
                                        <div>
                                            <h4 className={`text-xl font-bold ${scheme.text} mb-4 flex items-center gap-2`}>
                                                📋 Key Features
                                            </h4>
                                            <ul className="space-y-3">
                                                {feature.details.map((detail, index) => (
                                                    <li key={index} className={`flex items-start gap-3 ${scheme.text}`}>
                                                        <div className={`w-2 h-2 ${scheme.bg} rounded-full mt-2 shadow-lg`}></div>
                                                        <span className="font-medium">{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        {/* Implementation */}
                                        <div className={`p-4 bg-white/70 rounded-2xl border ${scheme.border}`}>
                                            <h4 className={`text-lg font-bold ${scheme.text} mb-2 flex items-center gap-2`}>
                                                ⚙️ Implementation Plan
                                            </h4>
                                            <p className={`${scheme.accent} font-medium`}>{feature.implementation}</p>
                                        </div>
                                        {/* Timeline & Tech Stack */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className={`p-4 bg-white/70 rounded-2xl border ${scheme.border}`}>
                                                <h4 className={`text-lg font-bold ${scheme.text} mb-2`}>⏱️ Timeline</h4>
                                                <p className={`${scheme.accent} font-semibold`}>{feature.timeline}</p>
                                            </div>
                                            <div className={`p-4 bg-white/70 rounded-2xl border ${scheme.border}`}>
                                                <h4 className={`text-lg font-bold ${scheme.text} mb-2`}>🛠️ Tech Stack</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {feature.tech.map((tech, index) => (
                                                        <span key={index} className={`px-3 py-1 bg-gradient-to-r ${scheme.bg} text-white text-xs font-bold rounded-full shadow-lg`}>
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                {/* Development Roadmap */}
                <div className="bg-gradient-to-br from-white via-emerald-50/30 to-green-50/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-emerald-200/50 mb-8">
                    <h2 className="text-3xl font-serif font-bold text-center bg-gradient-to-r from-emerald-700 via-green-600 to-teal-500 bg-clip-text text-transparent mb-8 hover:animate-pulse">
                        🗺️ ATC Development Roadmap
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl border border-emerald-200 shadow-lg">
                            <div className="text-4xl font-bold text-emerald-600 mb-2">Phase 1</div>
                            <div className="text-emerald-700 font-semibold mb-3">Foundation (Current)</div>
                            <ul className="text-sm text-emerald-600 space-y-1">
                                <li>✅ ATC Classification System</li>
                                <li>✅ Premium Dashboard UI</li>
                                <li>✅ Report Generation</li>
                                <li>✅ Computer Vision Pipeline</li>
                            </ul>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl border border-green-200 shadow-lg">
                            <div className="text-4xl font-bold text-green-600 mb-2">Phase 2</div>
                            <div className="text-green-700 font-semibold mb-3">AI Integration (Next)</div>
                            <ul className="text-sm text-green-600 space-y-1">
                                <li>🔄 Veterinary AI Assistant</li>
                                <li>🔄 Disease Prediction System</li>
                                <li>🔄 Advanced Analytics</li>
                                <li>🔄 Health Monitoring</li>
                            </ul>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-2xl border border-teal-200 shadow-lg">
                            <div className="text-4xl font-bold text-teal-600 mb-2">Phase 3</div>
                            <div className="text-teal-700 font-semibold mb-3">Advanced Features</div>
                            <ul className="text-sm text-teal-600 space-y-1">
                                <li>⏳ Predictive Dashboard</li>
                                <li>⏳ Farm Optimization</li>
                                <li>⏳ Multi-Farm Network</li>
                                <li>⏳ Mobile Integration</li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Call to Action */}
                <div className="text-center bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-8 rounded-3xl shadow-2xl text-white">
                    <h3 className="text-3xl font-bold mb-4">🎯 Ready to Revolutionize Cattle Management?</h3>
                    <p className="text-xl mb-6 opacity-90">
                        Join us in building the future of AI-powered ATC evaluation and cattle health monitoring
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-white text-emerald-600 rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                            📧 Get Development Updates
                        </button>
                        <button className="px-8 py-4 bg-emerald-800 text-white rounded-2xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                            🚀 Start Implementation
                        </button>
                    </div>
                </div>
            </div>
            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return (
                    <>
                        <Hero onViewReport={() => setCurrentPage('report')} />
                        <Features />
                        <HowItWorks />
                        <CTA />
                    </>
                );
            case "FutureFeatures":
                return <FutureFeatures onBackToHome={() => setCurrentPage("home")} />;
            case 'report':
                return <ATCReport onBackToHome={() => setCurrentPage('home')} />;
            case 'about':
                return (
                    <div className="min-h-screen bg-gray-50 py-16">
                        <div className="max-w-4xl mx-auto px-4">
                            {/* ... your about code ... */}
                        </div>
                    </div>
                );
            case 'support':
                return <Support onBackToHome={() => setCurrentPage('home')} />;
            case 'contact':
                return (
                    <div className="min-h-screen bg-gray-50 py-16">
                        <div className="max-w-4xl mx-auto px-4">
                            {/* ... your contact code ... */}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                            <button
                                onClick={() => setCurrentPage('home')}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                );
        }
    };
    return (
        <div className="font-sans">
            <Navbar
                currentPage={currentPage}
                onNavigate={setCurrentPage}
            />
            {renderPage()}
            <Footer />
            {/* ✅ Floating AI Chatbot - appears on all pages */}
            <Chatbot />
        </div>
    );
}
