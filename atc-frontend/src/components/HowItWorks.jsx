import React, { useState, useEffect } from 'react'

export default function HowItWorks() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeStep, setActiveStep] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const section = document.getElementById('how-it-works-section');
        if (section) observer.observe(section);

        return () => observer.disconnect();
    }, []);

    const steps = [
        {
            num: 1,
            title: "Capture & Upload",
            desc: "Field personnel capture clear side-profile images and upload instantly via mobile or desktop application with real-time validation.",
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15.5A3.5 3.5 0 018.5 12A3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0014 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97L2.46 14.6c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.39 1.06.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.25 1.17-.59 1.69-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.63Z"/>
                </svg>
            ),
            color: "from-blue-500 to-cyan-500",
            bgColor: "from-blue-50 to-cyan-50"
        },
        {
            num: 2,
            title: "Analyze & Score",
            desc: "Advanced AI algorithms extract precise body parameters and generate consistent, standardized ATC scores in seconds with 98.5% accuracy.",
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9,2A7,7 0 0,0 2,9A7,7 0 0,0 9,16A7,7 0 0,0 16,9A7,7 0 0,0 9,2M12.5,2C13,2.09 13.5,2.23 14,2.4L12.5,4.5L15,7L17.4,5.5C17.77,6 17.91,6.5 18,7H15.5L15,10H18C17.91,10.5 17.77,11 17.4,11.5L15,10L12.5,12.5L14,14.6C13.5,14.77 13,14.91 12.5,15H10L7,12L4.6,14.4C4.23,14 4.09,13.5 4,13H6.5L7,10H4C4.09,9.5 4.23,9 4.6,8.5L7,10L9.5,7.5L8,5.4C8.5,5.23 9,5.09 9.5,5H12L15,8L17.4,5.6C17.77,6 17.91,6.5 18,7V2.5C17,2.18 15.78,2 14.5,2H12.5Z"/>
                </svg>
            ),
            color: "from-emerald-500 to-green-500",
            bgColor: "from-emerald-50 to-green-50"
        },
        {
            num: 3,
            title: "Auto-Record to BPA",
            desc: "Scores and images are automatically saved in structured format and seamlessly synced to the Bharat Pashudhan App for comprehensive record keeping.",
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17,12C17,14.42 15.28,16.44 13,16.9V21H11V16.9C8.72,16.44 7,14.42 7,12C7,9.58 8.72,7.56 11,7.1V3H13V7.1C15.28,7.56 17,9.58 17,12M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/>
                </svg>
            ),
            color: "from-purple-500 to-pink-500",
            bgColor: "from-purple-50 to-pink-50"
        },
    ];

    return (
        <section
            id="how-it-works-section"
            className="relative min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50/40"
        >
            {/* Clean Minimal Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Simple background circles */}
                <div className="absolute top-32 left-16 w-64 h-64 bg-gradient-to-br from-emerald-100/20 to-green-200/15 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-bl from-green-100/15 to-teal-200/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 px-4 md:px-8 lg:px-16 xl:px-24 py-20">

                {/* Clean Header */}
                <div className={`text-center mb-20 transform transition-all duration-1000 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <span className="inline-flex items-center text-base text-emerald-700 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-emerald-200/60 mb-8 font-semibold shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300">
                        <svg className="w-5 h-5 mr-3 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
                        </svg>
                        Step-by-Step Process
                    </span>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-slate-800 via-emerald-700 to-green-800 bg-clip-text text-transparent font-serif mb-6">
                        How It Works
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
                        Our revolutionary AI-powered cattle evaluation system transforms traditional assessment
                        into a streamlined, accurate, and efficient digital process
                    </p>
                </div>

                {/* Enhanced Steps */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
                    {steps.map((step, index) => (
                        <div
                            key={step.num}
                            className={`group relative transform transition-all duration-700 hover:scale-105 ${
                                isVisible ? `animate-fade-in-up` : 'opacity-0'
                            }`}
                            style={{ animationDelay: `${index * 300}ms` }}
                            onMouseEnter={() => setActiveStep(step.num)}
                            onMouseLeave={() => setActiveStep(null)}
                        >
                            {/* Connection Line (Desktop) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-16 -right-6 w-12 h-0.5 bg-gradient-to-r from-emerald-300 to-green-400 z-0">
                                    <div className="absolute top-1/2 right-0 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-emerald-400 border-y-2 border-y-transparent"></div>
                                </div>
                            )}

                            <div className={`relative bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/60 hover:shadow-2xl hover:bg-white/95 transition-all duration-500 overflow-hidden ${
                                activeStep === step.num ? 'ring-2 ring-emerald-400/50' : ''
                            }`}>

                                {/* Premium Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${step.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>

                                <div className="relative z-10">
                                    {/* Enhanced Number Badge */}
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} shadow-xl mb-6 text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300`}>
                                        <span className="relative z-10">{step.num}</span>
                                        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} text-white mb-6 ml-4 group-hover:rotate-12 transition-transform duration-300`}>
                                        {step.icon}
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-bold text-2xl lg:text-3xl text-gray-800 mb-4 font-serif group-hover:text-emerald-700 transition-colors duration-300">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 text-lg leading-relaxed font-light">
                                        {step.desc}
                                    </p>

                                    {/* Progress Indicator */}
                                    <div className="mt-6 flex items-center gap-2">
                                        {steps.map((_, i) => (
                                            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${
                                                i <= index ? 'bg-emerald-400 w-8' : 'bg-gray-200 w-4'
                                            }`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out forwards;
                }
            `}</style>
        </section>
    );
}
