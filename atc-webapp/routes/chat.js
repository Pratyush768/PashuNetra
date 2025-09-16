const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Validate API key
if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is not set in environment variables');
    process.exit(1);
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Enhanced system prompt for cattle analysis
const SYSTEM_PROMPT = `You are an expert AI assistant specializing in cattle Animal Type Classification (ATC) analysis and dairy farming. You have extensive knowledge about:

🐄 ATC SCORING SYSTEM (1-9 scale):
- Dairy Character (25%): Angular, wedge-shaped appearance, refined head
- Body Capacity (20%): Depth, width, spring of rib, barrel capacity
- Mammary System (25%): Udder attachment, balance, teat placement
- Feet & Legs (15%): Structural correctness, hoof quality, mobility
- General Appearance (15%): Overall balance, style, breed character

📊 SCORING INTERPRETATION:
- 8-9: Excellent (A+) - Superior breeding animals
- 6.5-7.9: Good Plus (A) - Above average performers
- 5-6.4: Good (B) - Average commercial cattle
- Below 5: Fair (C) - Needs improvement

🧬 BREEDING & GENETICS:
- Heritability of traits and genetic improvement
- Selection strategies and breeding values
- Crossbreeding systems and hybrid vigor

🏥 HEALTH & MANAGEMENT:
- Disease prevention and treatment protocols
- Nutrition requirements and feed management
- Housing systems and animal welfare

🔧 TECHNICAL SUPPORT:
- Image analysis troubleshooting
- System usage and interpretation guidance

RESPONSE GUIDELINES:
- Be helpful, accurate, and professional
- Use appropriate emojis for engagement
- Provide specific, actionable advice
- Include relevant disclaimers for veterinary matters
- Structure responses with bullet points when helpful
- Bold important information using **text**
- Keep responses concise but comprehensive`;

router.post('/chat', async (req, res) => {
    try {
        const { message, timestamp } = req.body;

        // Validate input
        if (!message || !message.trim()) {
            return res.status(400).json({
                error: 'Message is required',
                timestamp: new Date().toISOString()
            });
        }

        if (message.length > 1000) {
            return res.status(400).json({
                error: 'Message too long. Please limit to 1000 characters.',
                timestamp: new Date().toISOString()
            });
        }

        // Get Gemini model with enhanced configuration
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
                stopSequences: [],
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        });

        // Create enhanced prompt with context
        const enhancedPrompt = `${SYSTEM_PROMPT}

USER MESSAGE: ${message.trim()}

Please provide a helpful and informative response about cattle analysis, ATC scoring, or related topics. If the question is outside your expertise area, politely redirect to cattle-related topics.

RESPONSE:`;

        // Generate response
        const result = await model.generateContent(enhancedPrompt);
        const response = await result.response;
        const reply = response.text();

        // Log successful interaction (remove in production)
        if (process.env.NODE_ENV === 'development') {
            console.log(`💬 Chat: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);
            console.log(`🤖 Reply: ${reply.substring(0, 50)}${reply.length > 50 ? '...' : ''}`);
        }

        res.json({
            reply: reply,
            timestamp: new Date().toISOString(),
            model: "gemini-2.0-flash-exp"
        });

    } catch (error) {
        console.error('❌ Gemini API Error:', error);

        // Handle specific API errors
        let errorMessage = 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.';
        let statusCode = 500;

        if (error.message?.includes('API_KEY')) {
            errorMessage = 'AI service configuration issue. Please contact support.';
            statusCode = 503;
        } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
            errorMessage = 'AI service is temporarily unavailable due to high demand. Please try again later.';
            statusCode = 429;
        } else if (error.message?.includes('safety')) {
            errorMessage = 'I can\'t process that request. Please ask about cattle analysis or related topics.';
            statusCode = 400;
        }

        res.status(statusCode).json({
            error: errorMessage,
            timestamp: new Date().toISOString(),
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Test endpoint
router.get('/test', (req, res) => {
    res.json({
        message: 'Chat API is working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

module.exports = router;
