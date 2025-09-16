export default function Footer() {
    return (
        <footer className="relative px-6 md:px-16 lg:px-24 xl:px-32 pt-16 pb-8 bg-gray-50 border-t">
            <div className="flex flex-wrap justify-between gap-12 md:gap-6">
                {/* Logo + Description */}
                <div className="max-w-80">
                    <div className="flex items-center gap-3 mb-4">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="4.706" cy="16" r="4.706" fill="#22c55e" />
                            <circle cx="16.001" cy="4.706" r="4.706" fill="#22c55e" />
                            <circle cx="16.001" cy="27.294" r="4.706" fill="#22c55e" />
                            <circle cx="27.294" cy="16" r="4.706" fill="#22c55e" />
                        </svg>
                        <span className="font-semibold text-lg text-slate-900">VisionEval</span>
                    </div>
                    <p className="text-sm text-gray-600">
                        AI-based Auto Recording of Animal Type Classification for PT & PS under Rashtriya Gokul Mission.
                        Built for accuracy, consistency, and seamless BPA integration.
                    </p>

                    {/* Socials */}
                    <div className="flex items-center gap-4 mt-4 text-gray-500">
                        {/* Instagram */}
                        <svg className="w-6 h-6 hover:text-green-600 transition" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM4.5 7.75A3.25 3.25 0 017.75 4.5h8.5a3.25 3.25 0 013.25 3.25v8.5a3.25 3.25 0 01-3.25 3.25h-8.5a3.25 3.25 0 01-3.25-3.25v-8.5zm9.5 1a4 4 0 11-4 4 4 4 0 014-4z" />
                        </svg>
                        {/* Facebook */}
                        <svg className="w-6 h-6 hover:text-green-600 transition" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M13.5 9H15V6.5h-1.5c-1.933 0-3.5 1.567-3.5 3.5v1.5H8v3h2.5V21h3v-7.5H16l.5-3h-3z" />
                        </svg>
                        {/* Twitter */}
                        <svg className="w-6 h-6 hover:text-green-600 transition" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 5.92a8.2 8.2 0 01-2.36.65A4.1 4.1 0 0021.4 4a8.27 8.27 0 01-2.6 1A4.14 4.14 0 0016 4a4.15 4.15 0 00-4.15 4.15c0 .32.04.64.1.94a11.75 11.75 0 01-8.52-4.32 4.14 4.14 0 001.29 5.54A4.1 4.1 0 013 10v.05a4.15 4.15 0 003.33 4.07 4.12 4.12 0 01-1.87.07 4.16 4.16 0 003.88 2.89A8.33 8.33 0 012 19.56a11.72 11.72 0 006.29 1.84c7.55 0 11.68-6.25 11.68-11.67 0-.18 0-.35-.01-.53A8.18 8.18 0 0022 5.92z" />
                        </svg>
                        {/* LinkedIn */}
                        <svg className="w-6 h-6 hover:text-green-600 transition" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.98 1.98 1.98h.02c1.1 0 1.98-.88 1.98-1.98C6.98 4.38 6.1 3.5 4.98 3.5zM3 8.75h3.96V21H3V8.75zm6.25 0h3.8v1.68h.05c.53-.98 1.82-2.02 3.75-2.02 4.01 0 4.75 2.64 4.75 6.07V21H17v-5.63c0-1.34-.03-3.07-1.88-3.07-1.88 0-2.17 1.47-2.17 2.98V21H9.25V8.75z" />
                        </svg>
                    </div>
                </div>

                {/* Company Links */}
                <div>
                    <p className="text-lg font-semibold text-slate-900">COMPANY</p>
                    <ul className="mt-3 flex flex-col gap-2 text-sm">
                        <li><a href="#">About ATC</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Partners</a></li>
                        <li><a href="#">Press</a></li>
                    </ul>
                </div>

                {/* Support Links */}
                <div>
                    <p className="text-lg font-semibold text-slate-900">SUPPORT</p>
                    <ul className="mt-3 flex flex-col gap-2 text-sm">
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Documentation</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="max-w-80">
                    <p className="text-lg font-semibold text-slate-900">STAY UPDATED</p>
                    <p className="mt-3 text-sm text-gray-600">
                        Subscribe to our newsletter for updates and special offers.
                    </p>
                    <div className="flex items-center mt-4">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="bg-white rounded-l border border-gray-300 h-9 px-3 outline-none text-sm w-full"
                        />
                        <button className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-green-600 h-9 w-10 rounded-r">
                            <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <hr className="border-gray-300 mt-10" />
            <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-6 text-sm text-gray-500">
                <p>© {new Date().getFullYear()} VisionEval. All rights reserved.</p>
                <ul className="flex items-center gap-4">
                    <li><a href="#">Privacy</a></li>
                    <li><a href="#">Terms</a></li>
                    <li><a href="#">Sitemap</a></li>
                </ul>
            </div>
        </footer>
    );
}
