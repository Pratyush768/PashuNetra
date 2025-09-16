import React, { useState, useEffect } from 'react'
import { featuresData, assets } from '../assets/assets'

const FeaturesSection = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const section = document.getElementById('features-section');
        if (section) observer.observe(section);

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="features-section"
            className='relative min-h-screen overflow-hidden'
            style={{
                background: `
                    linear-gradient(135deg, 
                        #f8fafc 0%, 
                        #f1f5f9 25%, 
                        #ecfdf5 50%, 
                        #f0fdf4 75%, 
                        #f7fee7 100%
                    ),
                    radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 40% 60%, rgba(5, 150, 105, 0.05) 0%, transparent 50%)
                `
            }}
        >
            {/* Premium Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-100/30 to-green-200/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 -right-32 w-96 h-96 bg-gradient-to-bl from-green-100/25 to-teal-200/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-to-tr from-teal-100/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className='relative z-10 flex flex-col items-center px-4 md:px-8 lg:px-[10%] py-20'>

                {/* Enhanced Header */}
                <div className={`flex flex-col md:flex-row items-center justify-between w-full mb-16 transform transition-all duration-1000 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
                        <h2 className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight font-serif mb-4'>
                            Key Features
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl font-light leading-relaxed">
                            Advanced AI technology for comprehensive cattle evaluation and assessment
                        </p>
                    </div>

                    <button className='group relative flex items-center gap-3 font-bold cursor-pointer px-6 md:px-8 py-3 md:py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white text-base md:text-lg shadow-2xl hover:shadow-3xl hover:shadow-emerald-500/30 active:scale-95 transition-all duration-300 overflow-hidden'>
                        <span className="relative z-10">View All</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </div>

                {/* Responsive Feature Cards */}
                <div className='flex flex-col gap-y-6 md:flex-row md:gap-x-4 lg:gap-x-[4%] w-full'>
                    {featuresData.map((item, index) => (
                        <div
                            key={item._id}
                            className={`group relative flex flex-col justify-between rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 w-full md:w-[30%] lg:w-[40%] hover:scale-105 transform ${
                                isVisible ? `animate-fade-in-up` : 'opacity-0'
                            }`}
                            style={{
                                animationDelay: `${index * 200}ms`,
                                minHeight: '400px',
                                aspectRatio: 'auto'
                            }}
                        >
                            {/* Full Background Image */}
                            <div className='absolute inset-0 w-full h-full'>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className='w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110'
                                    loading="lazy"
                                />
                                {/* Professional Dark Overlay */}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20'></div>
                            </div>

                            {/* Content Container */}
                            <div className='relative z-10 flex flex-col justify-between h-full p-6 md:p-7'>

                                {/* Top Badge */}
                                <div className="flex justify-start">
                                    <span className={`inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold text-white ${
                                        index === 0 ? 'bg-green-500' :
                                            index === 1 ? 'bg-red-500' :
                                                'bg-blue-500'
                                    }`}>
                                        {index === 0 && (
                                            <svg className="w-3 md:w-4 h-3 md:h-4 mr-1.5 md:mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                        )}
                                        {index === 1 && (
                                            <svg className="w-3 md:w-4 h-3 md:h-4 mr-1.5 md:mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                                            </svg>
                                        )}
                                        {index === 2 && (
                                            <svg className="w-3 md:w-4 h-3 md:h-4 mr-1.5 md:mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                            </svg>
                                        )}
                                        {index === 0 ? 'ATC SCORE' : index === 1 ? 'AI INTEGRATION' : 'COMPPLETE DATA'}
                                    </span>
                                </div>

                                {/* Bottom Content */}
                                <div className="flex flex-col gap-4 md:gap-5">
                                    <div>
                                        <h3 className='text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg leading-tight'>
                                            {item.title}
                                        </h3>
                                        <p className='text-white/90 text-base md:text-lg leading-relaxed font-light drop-shadow-md'>
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Professional Button */}
                                    <a
                                        href={item.link || "#"}
                                        className='group/btn inline-flex items-center gap-2 md:gap-3 font-semibold text-white hover:text-gray-200 transition-colors duration-300 text-base md:text-lg'
                                    >
                                        <span>Learn More</span>
                                        <svg className='w-4 md:w-5 h-4 md:h-5 group-hover/btn:translate-x-1 transition-transform duration-300' fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Subtle Hover Overlay */}
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Bottom CTA Section */}
                <div className={`mt-16 md:mt-20 text-center transform transition-all duration-1000 delay-800 w-full ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-10 border border-white/60 shadow-2xl max-w-5xl mx-auto">
                        <div className="absolute -top-4 md:-top-6 -right-4 md:-right-6 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-tr from-emerald-400/20 to-green-500/20 rounded-full blur-2xl animate-pulse"></div>

                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 md:mb-6 font-serif">
                            Ready to Transform Your Cattle Evaluation?
                        </h3>
                        <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 font-light max-w-4xl mx-auto leading-relaxed">
                            Join thousands of livestock professionals who trust our AI-powered system for precise,
                            reliable, and efficient cattle assessment and breeding decisions
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
                            <button className="group relative px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold text-base md:text-lg shadow-2xl hover:shadow-3xl hover:shadow-emerald-500/30 active:scale-95 transition-all duration-300 overflow-hidden w-full sm:w-auto">
                                <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
                                    <svg className="w-5 md:w-6 h-5 md:h-6 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Get Started Today
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>

                            <button className="px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl bg-white/90 backdrop-blur-md text-emerald-800 border-2 border-emerald-400/60 hover:bg-emerald-50 hover:border-emerald-500 font-bold text-base md:text-lg transition-all duration-300 hover:shadow-xl active:scale-95 w-full sm:w-auto">
                                Schedule Free Demo
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200/50">
                            <div className="flex items-center gap-2 md:gap-3 text-gray-600">
                                <div className="p-1.5 md:p-2 bg-emerald-100 rounded-full">
                                    <svg className="w-4 md:w-5 h-4 md:h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-sm md:text-base">30-Day Free Trial</span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 text-gray-600">
                                <div className="p-1.5 md:p-2 bg-green-100 rounded-full">
                                    <svg className="w-4 md:w-5 h-4 md:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-sm md:text-base">Bank-Level Security</span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3 text-gray-600">
                                <div className="p-1.5 md:p-2 bg-blue-100 rounded-full">
                                    <svg className="w-4 md:w-5 h-4 md:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="font-semibold text-sm md:text-base">24/7 Expert Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
            `}</style>
        </section>
    )
}

export default FeaturesSection
