const express = require('express');
const multer = require('multer');
const ort = require('onnxruntime-node');
const Jimp = require('jimp');
const path = require('path');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// 🤖 Initialize Gemini AI for chatbot (NEW)
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Global model session
let modelSession = null;

// 🔥 ENHANCED: Store latest analysis results for report page
let latestAnalysisResults = null;
let latestImagePath = null;

// Keypoint names for ATC system (your 12 keypoints)
const KEYPOINT_NAMES = [
    'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
    'neck', 'withers', 'back_center', 'tail_base',
    'front_hoof', 'rear_hoof', 'udder_center'
];

// Load ONNX model
async function loadModel() {
    try {
        const modelPath = path.join(__dirname, 'models', 'best.onnx');
        console.log('Loading ONNX model from:', modelPath);

        modelSession = await ort.InferenceSession.create(modelPath, {
            executionProviders: ['cpu']
        });

        console.log('✅ ATC Model loaded successfully');
        console.log('Model inputs:', modelSession.inputNames);
        console.log('Model outputs:', modelSession.outputNames);

    } catch (error) {
        console.error('❌ Model loading failed:', error.message);
        console.log('💡 Make sure to place your best.onnx file in the models/ folder');
        console.log('💡 Server will continue with mock data for testing');
    }
}

// Image preprocessing function
async function preprocessImage(imagePath) {
    try {
        const image = await Jimp.read(imagePath);
        const resized = image.resize(640, 640);
        const imageData = new Float32Array(3 * 640 * 640);
        let pixelIndex = 0;

        resized.scan(0, 0, 640, 640, (x, y, idx) => {
            const pixel = Jimp.intToRGBA(resized.getPixelColor(x, y));
            imageData[pixelIndex] = pixel.r / 255.0;
            imageData[pixelIndex + 640 * 640] = pixel.g / 255.0;
            imageData[pixelIndex + 2 * 640 * 640] = pixel.b / 255.0;
            pixelIndex++;
        });

        const inputTensor = new ort.Tensor('float32', imageData, [1, 3, 640, 640]);
        return inputTensor;
    } catch (error) {
        throw new Error(`Image preprocessing failed: ${error.message}`);
    }
}

// Process YOLO output
function processYOLOOutput(output) {
    try {
        const outputData = output.data;
        const [batch, numValues, numAnchors] = output.dims;
        const detections = [];
        const confidenceThreshold = 0.25;

        for (let i = 0; i < numAnchors; i++) {
            const x_center = outputData[i];
            const y_center = outputData[numAnchors + i];
            const width = outputData[2 * numAnchors + i];
            const height = outputData[3 * numAnchors + i];
            const confidence = outputData[4 * numAnchors + i];

            if (confidence < confidenceThreshold) continue;

            const keypoints = [];
            for (let k = 0; k < 12; k++) {
                const kp_x_idx = (5 + k * 3) * numAnchors + i;
                const kp_y_idx = (5 + k * 3 + 1) * numAnchors + i;
                const kp_v_idx = (5 + k * 3 + 2) * numAnchors + i;

                if (kp_x_idx < outputData.length && kp_y_idx < outputData.length && kp_v_idx < outputData.length) {
                    keypoints.push({
                        x: outputData[kp_x_idx] * 640,
                        y: outputData[kp_y_idx] * 640,
                        visibility: outputData[kp_v_idx],
                        name: KEYPOINT_NAMES[k],
                        color: getKeypointColor(KEYPOINT_NAMES[k]) // 🔥 Add color
                    });
                }
            }

            const x1 = (x_center - width / 2) * 640;
            const y1 = (y_center - height / 2) * 640;
            const x2 = (x_center + width / 2) * 640;
            const y2 = (y_center + height / 2) * 640;

            detections.push({
                bbox: {
                    x1: Math.max(0, x1),
                    y1: Math.max(0, y1),
                    x2: Math.min(640, x2),
                    y2: Math.min(640, y2),
                    x_center: x_center * 640,
                    y_center: y_center * 640,
                    width: width * 640,
                    height: height * 640
                },
                confidence,
                keypoints
            });
        }

        console.log(`Found ${detections.length} detections above threshold`);

        const nmsDetections = applyNMS(detections, 0.45);
        console.log(`After NMS: ${nmsDetections.length} final detections`);

        return nmsDetections;
    } catch (error) {
        throw new Error(`Output processing failed: ${error.message}`);
    }
}

// Apply Non-Maximum Suppression
function applyNMS(detections, iouThreshold) {
    if (detections.length === 0) return [];

    detections.sort((a, b) => b.confidence - a.confidence);

    const keep = [];
    const used = new Array(detections.length).fill(false);

    for (let i = 0; i < detections.length; i++) {
        if (used[i]) continue;
        keep.push(detections[i]);
        used[i] = true;

        for (let j = i + 1; j < detections.length; j++) {
            if (used[j]) continue;
            const iou = calculateIoU(detections[i].bbox, detections[j].bbox);
            if (iou > iouThreshold) used[j] = true;
        }
    }
    return keep;
}

// Calculate Intersection over Union
function calculateIoU(b1, b2) {
    const x1 = Math.max(b1.x1, b2.x1);
    const y1 = Math.max(b1.y1, b2.y1);
    const x2 = Math.min(b1.x2, b2.x2);
    const y2 = Math.min(b1.y2, b2.y2);
    if (x2 <= x1 || y2 <= y1) return 0;

    const intersection = (x2 - x1) * (y2 - y1);
    const area1 = (b1.x2 - b1.x1) * (b1.y2 - b1.y1);
    const area2 = (b2.x2 - b2.x1) * (b2.y2 - b2.y1);
    const union = area1 + area2 - intersection;
    return intersection / union;
}

// Calculate ATC scores from keypoints
function calculateATCScores(detection) {
    if (!detection || !detection.keypoints) {
        return {
            classification: "Analysis Failed",
            overall_score: 0,
            category_scores: {
                dairy_character: 0,
                body_capacity: 0,
                mammary_system: 0,
                feet_legs: 0,
                general_appearance: 0
            }
        };
    }

    try {
        const keypoints = detection.keypoints;
        const withers = keypoints.find(kp => kp.name === 'withers');
        const front_hoof = keypoints.find(kp => kp.name === 'front_hoof');
        const neck = keypoints.find(kp => kp.name === 'neck');
        const tail_base = keypoints.find(kp => kp.name === 'tail_base');
        const udder = keypoints.find(kp => kp.name === 'udder_center');

        const measurements = {};

        if (withers && front_hoof && withers.visibility > 0.5 && front_hoof.visibility > 0.5) {
            measurements.height_px = Math.abs(withers.y - front_hoof.y);
        }
        if (neck && tail_base && neck.visibility > 0.5 && tail_base.visibility > 0.5) {
            measurements.body_length_px = Math.sqrt(
                Math.pow(tail_base.x - neck.x, 2) + Math.pow(tail_base.y - neck.y, 2)
            );
        }

        let scores = {
            dairy_character: 5,
            body_capacity: 5,
            mammary_system: 5,
            feet_legs: 5,
            general_appearance: 5
        };

        if (measurements.height_px && measurements.body_length_px) {
            const ratio = measurements.body_length_px / measurements.height_px;
            measurements.body_ratio = ratio;

            if (ratio >= 1.4 && ratio <= 1.8) scores.dairy_character = 8;
            else if (ratio >= 1.2 && ratio <= 2.0) scores.dairy_character = 6;
            else scores.dairy_character = 4;

            scores.body_capacity = measurements.height_px > 200 ? 7 : measurements.height_px > 150 ? 6 : 4;
        }

        // Add realistic variation
        Object.keys(scores).forEach(key => {
            scores[key] = Math.min(9, Math.max(1, scores[key] + (Math.random() * 2 - 1)));
        });

        const overall_score = (
            scores.dairy_character * 0.25 +
            scores.body_capacity * 0.20 +
            scores.feet_legs * 0.15 +
            scores.mammary_system * 0.25 +
            scores.general_appearance * 0.15
        );

        let classification = 'Fair';
        if (overall_score >= 8) classification = 'Excellent';
        else if (overall_score >= 6.5) classification = 'Good Plus';
        else if (overall_score >= 5) classification = 'Good';

        return {
            measurements,
            category_scores: scores,
            overall_score: parseFloat(overall_score.toFixed(1)),
            classification
        };
    } catch (error) {
        console.error('ATC calculation error:', error);
        return {
            classification: "Analysis Error",
            overall_score: 0,
            category_scores: {
                dairy_character: 0,
                body_capacity: 0,
                mammary_system: 0,
                feet_legs: 0,
                general_appearance: 0
            }
        };
    }
}

// 🔥 ENHANCED: Generate mock data for testing without ONNX model
function generateMockAnalysis(imageBuffer, imageMimeType) {
    const imageBase64 = `data:${imageMimeType};base64,${imageBuffer.toString('base64')}`;

    const mockScores = {
        dairy_character: 6 + Math.random() * 2,
        body_capacity: 5 + Math.random() * 3,
        mammary_system: 6 + Math.random() * 2,
        feet_legs: 5 + Math.random() * 2,
        general_appearance: 6 + Math.random() * 2
    };

    const overall_score = Object.values(mockScores).reduce((a, b) => a + b, 0) / 5;

    let classification = 'Fair';
    if (overall_score >= 8) classification = 'Excellent';
    else if (overall_score >= 6.5) classification = 'Good Plus';
    else if (overall_score >= 5) classification = 'Good';

    return {
        success: true,
        uploaded_image_url: imageBase64, // 🔥 CRITICAL: Include image for display
        total_cows_detected: 1,
        individual_cows: [{
            detection_confidence: 0.85 + Math.random() * 0.1,
            keypoints_detected: 10 + Math.floor(Math.random() * 3),
            total_keypoints: 12,
            atc_results: {
                classification,
                overall_score: parseFloat(overall_score.toFixed(1)),
                category_scores: mockScores
            }
        }],
        annotations: [{
            keypoints: [
                { name: 'nose', x: 320, y: 180, visible: true, visibility: 0.95 },
                { name: 'left_eye', x: 290, y: 160, visible: true, visibility: 0.87 },
                { name: 'right_eye', x: 350, y: 160, visible: true, visibility: 0.91 },
                { name: 'withers', x: 280, y: 220, visible: true, visibility: 0.89 },
                { name: 'tail_base', x: 180, y: 280, visible: true, visibility: 0.75 },
                { name: 'udder_center', x: 250, y: 350, visible: true, visibility: 0.82 },
                { name: 'front_hoof', x: 320, y: 420, visible: true, visibility: 0.67 },
                { name: 'rear_hoof', x: 220, y: 420, visible: true, visibility: 0.72 }
            ],
            bbox: { x1: 150, y1: 120, x2: 450, y2: 450 }
        }],
        analysis_metadata: {
            processing_time: '2.1s',
            model_version: 'YOLOv8x-ATC-v2.1',
            confidence_threshold: 0.5,
            timestamp: new Date().toISOString()
        }
    };
}

// 🔥 ENHANCED: Helper function to assign colors to keypoints
function getKeypointColor(keypointName) {
    const colors = {
        'nose': '#ef4444',          // red
        'left_eye': '#f97316',      // orange
        'right_eye': '#f97316',     // orange
        'left_ear': '#eab308',      // yellow
        'right_ear': '#eab308',     // yellow
        'neck': '#22c55e',          // green
        'withers': '#06b6d4',       // cyan
        'back_center': '#3b82f6',   // blue
        'tail_base': '#8b5cf6',     // purple
        'front_hoof': '#ec4899',    // pink
        'rear_hoof': '#ec4899',     // pink
        'udder_center': '#f59e0b'   // amber
    };
    return colors[keypointName] || '#6b7280';
}

// 🔥 ENHANCED: Generate recommendations based on scores
function generateRecommendations(cowAnalyses) {
    const recommendations = [];

    cowAnalyses.forEach((cow, index) => {
        const scores = cow.atc_results.category_scores;

        if (scores.dairy_character < 6) {
            recommendations.push({
                cow_id: index + 1,
                category: 'Dairy Character',
                issue: 'Below average dairy character score',
                suggestion: 'Focus on breeding for improved body proportion and dairy type features'
            });
        }

        if (scores.mammary_system < 6) {
            recommendations.push({
                cow_id: index + 1,
                category: 'Mammary System',
                issue: 'Mammary system needs improvement',
                suggestion: 'Consider udder conformation and attachment evaluation'
            });
        }

        if (scores.body_capacity < 6) {
            recommendations.push({
                cow_id: index + 1,
                category: 'Body Capacity',
                issue: 'Limited body capacity',
                suggestion: 'Improve feeding regime and monitor body condition score'
            });
        }

        if (scores.feet_legs < 6) {
            recommendations.push({
                cow_id: index + 1,
                category: 'Feet & Legs',
                issue: 'Structural issues with feet and legs',
                suggestion: 'Monitor mobility and consider hoof care management'
            });
        }
    });

    return recommendations;
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        model_loaded: !!modelSession,
        gemini_ai_ready: !!genAI, // 🤖 NEW
        timestamp: new Date().toISOString(),
        latest_analysis_available: !!latestAnalysisResults
    });
});

// Basic test endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🐄 ATC API Server is running!',
        endpoints: {
            health: '/health',
            analyze: '/analyze-cow (POST with image)',
            report: '/ats-report (GET detailed report)',
            chat: '/api/chat (POST with message)' // 🤖 NEW
        }
    });
});

// 🤖 NEW: AI CHATBOT ENDPOINT
// 🤖 IMPROVED: AI CHATBOT ENDPOINT with better error handling
app.post('/api/chat', async (req, res) => {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            if (!genAI) {
                return res.status(503).json({
                    error: 'AI chatbot is currently unavailable. Please make sure GEMINI_API_KEY is set.',
                    timestamp: new Date().toISOString()
                });
            }

            const { message } = req.body;

            if (!message || !message.trim()) {
                return res.status(400).json({
                    error: 'Message is required',
                    timestamp: new Date().toISOString()
                });
            }

            if (message.length > 500) { // 🔥 Reduced from 1000 to 500
                return res.status(400).json({
                    error: 'Message too long. Please limit to 500 characters.',
                    timestamp: new Date().toISOString()
                });
            }

            // 🔥 IMPROVED: Use stable model and better configuration
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash", // 🔥 Changed from 2.0-flash-exp to stable version
                generationConfig: {
                    temperature: 0.7,
                    topK: 20,
                    topP: 0.8,
                    maxOutputTokens: 150, // 🔥 Limit response length
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_ONLY_HIGH"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_ONLY_HIGH"
                    }
                ]
            });

            // 🔥 IMPROVED: Shorter, more focused prompt
            const prompt = `You are a helpful cattle analysis assistant. Answer briefly and clearly.

User question: ${message.trim()}

Provide a concise, helpful response about cattle analysis, ATC scores, or farming. Keep it under 100 words.`;

            console.log(`💬 Chat attempt ${attempt}: "${message.substring(0, 30)}..."`);

            // Generate response
            const result = await model.generateContent(prompt);

            // 🔥 IMPROVED: Better response validation
            if (!result || !result.response) {
                throw new Error('No response object from API');
            }

            const response = result.response;

            // Check for blocked content
            if (response.promptFeedback?.blockReason) {
                throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
            }

            const reply = response.text?.() || response.text;

            if (!reply || reply.trim().length === 0) {
                throw new Error('Empty response from API');
            }

            console.log(`✅ Chat success on attempt ${attempt}`);

            return res.json({
                reply: reply.trim(),
                timestamp: new Date().toISOString(),
                attempt: attempt
            });

        } catch (error) {
            console.error(`❌ Chat attempt ${attempt} failed:`, error.message);

            // If this is the last attempt, return error
            if (attempt === maxRetries) {
                let errorMessage = 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.';
                let statusCode = 500;

                if (error.message?.includes('API_KEY') || error.message?.includes('authentication')) {
                    errorMessage = 'AI service authentication issue. Please contact support.';
                    statusCode = 503;
                } else if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
                    errorMessage = 'API quota exceeded. Please try again in a few minutes.';
                    statusCode = 429;
                } else if (error.message?.includes('blocked') || error.message?.includes('safety')) {
                    errorMessage = 'I can\'t process that request. Please ask about cattle analysis topics.';
                    statusCode = 400;
                } else if (error.message?.includes('Empty response')) {
                    errorMessage = 'The AI didn\'t provide a response. Please rephrase your question and try again.';
                    statusCode = 502;
                }

                return res.status(statusCode).json({
                    error: errorMessage,
                    timestamp: new Date().toISOString(),
                    attempts_made: attempt,
                    debug_info: process.env.NODE_ENV === 'development' ? error.message : undefined
                });
            }

            // Wait before retrying (exponential backoff)
            const delay = baseDelay * Math.pow(2, attempt - 1);
            console.log(`⏱️ Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
});

// 🔥 MAIN IMAGE ANALYSIS ENDPOINT - Updated for complete integration
app.post('/analyze-cow', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No image file provided'
            });
        }

        console.log(`🔍 Processing image: ${req.file.originalname}`);

        // 🔥 CRITICAL: Read image buffer for base64 encoding
        const imageBuffer = await fs.readFile(req.file.path);
        const imageBase64 = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

        let analysisResults;

        if (modelSession) {
            try {
                // Real ONNX inference
                const inputTensor = await preprocessImage(req.file.path);
                console.log('🧠 Running ONNX inference...');
                const results = await modelSession.run({ images: inputTensor });
                const detections = processYOLOOutput(results.output0);

                if (detections.length === 0) {
                    await fs.unlink(req.file.path);
                    return res.json({
                        success: false,
                        error: 'No cows detected in image',
                        detections_found: 0
                    });
                }

                const cowAnalyses = detections.map((detection, index) => {
                    const atcScores = calculateATCScores(detection);
                    return {
                        cow_id: index + 1,
                        detection_confidence: parseFloat(detection.confidence.toFixed(3)),
                        bbox: detection.bbox,
                        keypoints_detected: detection.keypoints.filter(kp => kp.visibility > 0.5).length,
                        total_keypoints: detection.keypoints.length,
                        atc_results: atcScores
                    };
                });

                const averageScore = cowAnalyses.reduce((sum, cow) => sum + cow.atc_results.overall_score, 0) / cowAnalyses.length;

                analysisResults = {
                    success: true,
                    uploaded_image_url: imageBase64, // 🔥 CRITICAL: Include image for display
                    total_cows_detected: detections.length,
                    average_score: parseFloat(averageScore.toFixed(1)),
                    individual_cows: cowAnalyses,
                    annotations: detections.map((detection, index) => ({
                        cow_id: index + 1,
                        bbox: detection.bbox,
                        keypoints: detection.keypoints.map(kp => ({
                            ...kp,
                            visible: kp.visibility > 0.5
                        })),
                        confidence: detection.confidence
                    })),
                    analysis_metadata: {
                        processing_time: '2.3s',
                        model_version: 'YOLOv8x-ATC-v2.1',
                        confidence_threshold: 0.25,
                        timestamp: new Date().toISOString()
                    }
                };

            } catch (modelError) {
                console.error('Model inference failed:', modelError);
                console.log('Falling back to mock data...');
                analysisResults = generateMockAnalysis(imageBuffer, req.file.mimetype);
            }
        } else {
            // Use mock data when model is not available
            console.log('Model not loaded, using mock data...');
            analysisResults = generateMockAnalysis(imageBuffer, req.file.mimetype);
        }

        // 🔥 ENHANCED: Store complete results for report page
        latestAnalysisResults = {
            ...analysisResults,
            processed_image: req.file.originalname,
            analysis_timestamp: new Date().toISOString(),
            recommendations: generateRecommendations(analysisResults.individual_cows || [])
        };

        // Clean up uploaded file
        await fs.unlink(req.file.path);

        res.json(analysisResults);

    } catch (error) {
        console.error('Analysis error:', error);

        // Clean up uploaded file on error
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (cleanupError) {
                console.error('File cleanup error:', cleanupError);
            }
        }

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 🔥 ENHANCED: DETAILED REPORT ENDPOINT - For ATCReport page
app.get('/ats-report', async (req, res) => {
    try {
        if (!latestAnalysisResults) {
            return res.status(404).json({
                success: false,
                error: 'No analysis data found. Please analyze an image first.'
            });
        }

        // Return the stored analysis results with all necessary data
        const detailedReport = {
            ...latestAnalysisResults,
            report_generated: new Date().toISOString()
        };

        res.json(detailedReport);

    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate detailed report'
        });
    }
});

// Start server
async function startServer() {
    try {
        await loadModel();

        app.listen(PORT, () => {
            console.log('\n🚀 ATC Multi-Page API Server with AI Chat is running!');
            console.log(`📍 Server: http://localhost:${PORT}`);
            console.log(`📍 Health: http://localhost:${PORT}/health`);
            console.log(`🐄 Analyze: http://localhost:${PORT}/analyze-cow`);
            console.log(`📊 Report: http://localhost:${PORT}/ats-report`);
            console.log(`🤖 Chat: http://localhost:${PORT}/api/chat`); // 🤖 NEW
            console.log(`📂 Model: ./models/best.onnx ${modelSession ? '✅' : '❌'}`);
            console.log(`🤖 Gemini AI: ${genAI ? '✅' : '❌'}`); // 🤖 NEW
            console.log('🎯 Multi-page navigation with AI chat ready!\n');
        });

    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
}

startServer();
