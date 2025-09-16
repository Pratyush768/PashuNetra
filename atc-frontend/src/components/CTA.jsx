export default function CTA() {
    return (
        <section
            className="relative px-6 md:px-16 lg:px-24 xl:px-32 py-20
                       bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')]
                       bg-cover bg-center bg-no-repeat"
        >
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

            <div className="relative max-w-3xl mx-auto text-center bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-lg border border-green-100">
                {/* Decorative Glow */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-40"></div>

                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-green-600 bg-clip-text text-transparent">
                    Ready to accelerate PT & PS evaluations?
                </h2>
                <p className="mt-4 text-gray-600">
                    Start an evaluation now or integrate with BPA for seamless field operations.
                </p>

                <div className="flex justify-center gap-4 mt-8">
                    <button className="px-8 py-3 rounded-md bg-gradient-to-r from-orange-500 to-green-600 hover:opacity-90 text-white font-medium active:scale-95 transition-all">
                        Start Evaluation
                    </button>
                    <button className="px-6 py-3 rounded-md bg-white text-green-700 border border-green-400 hover:bg-green-50 active:scale-95 transition-all font-medium">
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    );
}
