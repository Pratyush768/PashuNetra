import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, Phone, MessageCircle, Home } from "lucide-react";


const Support = ({ onBackToHome }) => {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "👋 Hi there! How can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const [faqs, setFaqs] = useState([
        { q: "How to upload cattle images?", a: "Ensure clear lighting, full side profile, and no obstructions.", open: false },
        { q: "How are ATC scores calculated?", a: "Scores are based on AI model analysis of body structure and breed characteristics.", open: false },
        { q: "Can I download reports?", a: "Yes! After analysis, click 'Download Report' on the results page.", open: false },
    ]);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { sender: "user", text: input }]);
        setInput("");
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "🤖 Thanks for your query! Our team will reach out soon." },
            ]);
        }, 1000);
    };

    const toggleFAQ = (index) => {
        setFaqs(faqs.map((f, i) => (i === index ? { ...f, open: !f.open } : f)));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-emerald-700 flex items-center justify-center gap-2">
                    <span className="text-xl mr-2">💬</span> Support Center
                </h1>
                <p className="text-gray-600 mt-2">
                    Find answers, explore FAQs, or chat with our assistant. We’re here to make your ATC experience smooth and reliable.
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto flex items-center gap-2 mb-10">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search help topics..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Search
                </button>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
                {[
                    { icon: "📤", title: "Image Upload", desc: "Tips for uploading clear cattle images for accurate results." },
                    { icon: "📊", title: "ATC Scores", desc: "Learn how to understand and use your ATC classification results." },
                    { icon: "📑", title: "Reports", desc: "Steps to generate, view, and download detailed ATC reports." },
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        className="p-6 bg-white shadow-md rounded-2xl border text-center"
                    >
                        <div className="text-3xl mb-3">{item.icon}</div>
                        <h3 className="font-semibold text-emerald-700 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📌 Frequently Asked Questions</h2>
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white shadow-sm rounded-lg p-4 border">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full text-left flex justify-between items-center"
                            >
                                <span className="font-medium text-gray-800">{faq.q}</span>
                                <span>{faq.open ? "−" : "+"}</span>
                            </button>
                            {faq.open && <p className="text-gray-600 mt-2">{faq.a}</p>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Live Chat */}
            <div className="max-w-3xl mx-auto mb-12">
                <h2 className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-2">
                    <MessageCircle size={20} /> Live Help (Beta)
                </h2>
                <div className="bg-white border rounded-xl shadow-md p-4">
                    <div className="h-60 overflow-y-auto border rounded-lg p-3 mb-3 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`mb-2 flex ${
                                    msg.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`px-3 py-2 rounded-lg inline-block max-w-[70%] break-words ${
                                        msg.sender === "user"
                                            ? "bg-emerald-100 text-right"
                                            : "bg-gray-200 text-left"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>


                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                            onClick={handleSend}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="max-w-3xl mx-auto mb-12 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📞 Contact Us</h2>
                <div className="flex justify-center gap-6 text-gray-700">
                    <div className="flex items-center gap-2"><Mail size={18} /> support@atc-system.com</div>
                    <div className="flex items-center gap-2"><Phone size={18} /> +91 82973 79000</div>
                </div>
            </div>

            {/* Back Button */}
            <div className="text-center">
                <button
                    onClick={onBackToHome}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl flex items-center gap-2 mx-auto hover:bg-emerald-700"
                >
                    <Home size={18} /> Back to Home
                </button>
            </div>
        </div>
    );
};

export default Support;
