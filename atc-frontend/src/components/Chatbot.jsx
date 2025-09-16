import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                sender: 'bot',
                text: 'Hi! 👋 I\'m your AI assistant. Ask me about cattle analysis, ATC scores, or technical support!'
            }]);
        }
    }, [isOpen, messages.length]);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { sender: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input.trim() })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            if (!data.reply || data.reply.trim().length === 0) {
                throw new Error('Received empty response');
            }

            const botMessage = {
                sender: 'bot',
                text: data.reply
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error('Chat error:', error);

            let errorMessage = 'Sorry, I\'m having technical issues. Please try again.';

            if (error.message.includes('quota') || error.message.includes('limit')) {
                errorMessage = 'I\'m temporarily unavailable due to high demand. Please try again in a few minutes.';
            } else if (error.message.includes('authentication') || error.message.includes('API_KEY')) {
                errorMessage = 'There\'s a configuration issue. Please contact support.';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            }

            const errorMsg = { sender: 'bot', text: errorMessage };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* Chat Button */}
            <button
                onClick={toggleChat}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: isOpen ? '#ef4444' : '#10b981',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {isOpen ? '✕' : '🤖'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: '70px',
                    right: '0',
                    width: '350px',
                    height: '500px',
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '15px',
                        fontWeight: 'bold',
                        fontSize: '16px'
                    }}>
                        🤖 AI Assistant
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        padding: '15px',
                        overflowY: 'auto',
                        backgroundColor: '#f9fafb'
                    }}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    marginBottom: '12px',
                                    textAlign: msg.sender === 'user' ? 'right' : 'left'
                                }}
                            >
                                <div style={{
                                    display: 'inline-block',
                                    padding: '10px 15px',
                                    borderRadius: '15px',
                                    backgroundColor: msg.sender === 'user' ? '#3b82f6' : '#ffffff',
                                    color: msg.sender === 'user' ? 'white' : '#374151',
                                    fontSize: '14px',
                                    maxWidth: '80%',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div style={{ textAlign: 'left', marginBottom: '12px' }}>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '10px 15px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '15px',
                                    fontSize: '14px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    AI is thinking...
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{
                        padding: '15px',
                        borderTop: '1px solid #e5e7eb',
                        display: 'flex',
                        gap: '10px'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything..."
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                padding: '10px',
                                border: '1px solid #d1d5db',
                                borderRadius: '20px',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isLoading || !input.trim()}
                            style={{
                                padding: '10px 15px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                opacity: isLoading || !input.trim() ? 0.5 : 1
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
