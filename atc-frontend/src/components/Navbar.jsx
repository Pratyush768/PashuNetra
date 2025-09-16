import { useState, useEffect } from "react";
import { UserButton, useUser, SignInButton } from "@clerk/clerk-react";
import logoo from "../assets/logoo.jpg";

// Updated navigation links for multi-page system
const navLinks = [
    { name: "Upload & Analyze", page: "home" },
    { name: "Detailed Report", page: "report" },
    { name: "About ATC", page: "about" },
    { name: "FutureFeatures", page: "FutureFeatures" },

];

// Updated Logo component with navigation
const Logo = ({ onNavigate }) => (
    <div
        onClick={() => onNavigate('home')}
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
    >
        <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-[150px] h-19">
            <img src={logoo} alt="Logo" className="max-h-full object-contain" />
        </div>
        {/* <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
      PashuNetra
    </span> */}
    </div>
);

export default function Navbar({ currentPage, onNavigate }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isSignedIn } = useUser();

    // Effect to close menu on escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const NavLink = ({ link }) => (
        <button
            onClick={() => {
                onNavigate(link.page);
                setIsMenuOpen(false);
            }}
            className={`relative group font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === link.page
                    ? "text-green-600 bg-green-50 dark:text-green-500 dark:bg-green-900/30"
                    : "text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-green-50/50 dark:hover:text-green-500"
            }`}
        >
            {link.name}
            <span
                className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 ease-out
                ${currentPage === link.page ? "w-3/4" : "group-hover:w-1/2"}`}
            />
        </button>
    );


    const AuthButtons = ({ isMobile = false }) => (
        <div className={`flex items-center gap-4 ${isMobile ? "flex-col w-full" : ""}`}>

            <button
                onClick={() => onNavigate("support")}
                className="px-4 py-2 text-sm font-medium transition rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
            >
                Support
            </button>
            {isSignedIn ? (
                <div className="flex items-center gap-3">
                    <UserButton afterSignOutUrl="/" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                        Welcome back!
                    </span>
                </div>
            ) : (
                <SignInButton mode="modal">
                    <button
                        onClick={() => isMobile && setIsMenuOpen(false)}
                        className="px-5 py-2 font-medium text-white transition bg-green-600 rounded-full w-full sm:w-auto hover:bg-green-700 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                        Login / Sign Up
                    </button>
                </SignInButton>
            )}
        </div>
    );

    return (
        <>
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg text-gray-900 dark:text-gray-100 z-50 flex items-center justify-between px-6 py-3 rounded-full shadow-md border border-gray-200/50 dark:border-gray-700/50">
                <Logo onNavigate={onNavigate} />

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center justify-center gap-2 flex-2">
                    {navLinks.map((link) => (
                        <NavLink key={link.name} link={link} />
                    ))}
                </div>

                {/* Desktop Buttons */}
                <div className="hidden md:flex">
                    <AuthButtons />
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    {isSignedIn && <UserButton />}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Open menu"
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-menu"
                        className="p-2 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-700/60 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Slide-In Menu & Overlay */}
            <div
                id="mobile-menu"
                className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            >
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Menu Content */}
                <div
                    className={`fixed top-0 left-0 w-4/5 max-w-sm h-full bg-white dark:bg-gray-900 
                        flex flex-col justify-center gap-8 p-8
                        transition-transform duration-500 ease-in-out shadow-2xl
                        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-5 right-5 text-3xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        &times;
                    </button>

                    {/* Logo in mobile menu */}
                    <div className="absolute top-5 left-5">
                        <Logo onNavigate={onNavigate} />
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col items-center gap-6 text-xl mt-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => {
                                    onNavigate(link.page);
                                    setIsMenuOpen(false);
                                }}
                                className={`py-3 px-6 rounded-lg transition-all duration-200 ${
                                    currentPage === link.page
                                        ? "text-green-600 bg-green-50 dark:text-green-500 dark:bg-green-900/30"
                                        : "text-gray-700 dark:text-gray-300 hover:text-green-600 hover:bg-green-50/50"
                                }`}
                            >
                                {link.name}
                            </button>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="absolute bottom-8 w-full px-8">
                        <AuthButtons isMobile={true} />
                    </div>
                </div>
            </div>

            {/* Page content offset for fixed navbar */}
            <div className="h-20"></div> {/* Spacer for fixed navbar */}
        </>
    );
}
