import React, { useState } from 'react';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import ATCReport from "./components/ATCReport";
import Chatbot from "./components/Chatbot"; // ✅ Add this import
import Support from "./components/Support.jsx";

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
            case 'report':
                return <ATCReport onBackToHome={() => setCurrentPage('home')} />;
            case 'about':
                return (
                    <div className="min-h-screen bg-gray-50 py-16">
                        <div className="max-w-4xl mx-auto px-4">
                            <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
                                🐄 About ATC System
                            </h1>
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                    Our AI-powered Animal Type Classification (ATC) system revolutionizes cattle evaluation
                                    using advanced computer vision technology and machine learning algorithms.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• 98.5% accuracy in cattle evaluation</li>
                                            <li>• Real-time keypoint detection</li>
                                            <li>• Comprehensive ATC scoring</li>
                                            <li>• Professional reporting</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Technology</h3>
                                        <ul className="space-y-2 text-gray-700">
                                            <li>• YOLO-based pose estimation</li>
                                            <li>• Advanced neural networks</li>
                                            <li>• Computer vision algorithms</li>
                                            <li>• Cloud-based processing</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => setCurrentPage('home')}
                                        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        Try the System
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'support':
                return <Support onBackToHome={() => setCurrentPage('home')} />;
            case 'contact':
                return (
                    <div className="min-h-screen bg-gray-50 py-16">
                        <div className="max-w-4xl mx-auto px-4">
                            <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
                                📞 Contact Us
                            </h1>
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h3>
                                        <div className="space-y-4 text-gray-700">
                                            <div className="flex items-center gap-3">
                                                <span>📧</span>
                                                <span>support@atc-system.com</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span>📱</span>
                                                <span>+1 (555) 123-4567</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span>🏢</span>
                                                <span>123 Tech Street, AI Valley, CA 94000</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span>⏰</span>
                                                <span>Mon-Fri 9:00 AM - 6:00 PM PST</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Help</h3>
                                        <p className="text-gray-700 mb-4">
                                            Need instant assistance? Try our AI chatbot! It can help with:
                                        </p>
                                        <ul className="space-y-2 text-gray-700 text-sm">
                                            <li>• ATC scoring explanations</li>
                                            <li>• Technical troubleshooting</li>
                                            <li>• Breeding recommendations</li>
                                            <li>• System usage guidance</li>
                                        </ul>
                                        <p className="text-emerald-600 font-medium mt-4 text-sm">
                                            💬 Look for the chatbot in the bottom-right corner!
                                        </p>
                                    </div>
                                </div>
                            </div>
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
