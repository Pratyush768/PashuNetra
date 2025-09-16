// Enhanced Upload Component with Preview
import { useState } from 'react';

function CowImageUpload({ onAnalysisComplete }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) return;

        setAnalyzing(true);

        try {
            const formData = new FormData();
            formData.append('image', selectedImage);

           const response = await fetch('../api/analyze-cow', {
    method: 'POST',
    body: formData
});

            const result = await response.json();

            if (result.success) {
                // Pass the results to parent component
                onAnalysisComplete(result);
            }
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors">
                {imagePreview ? (
                    <div className="space-y-4">
                        <img
                            src={imagePreview}
                            alt="Selected cow"
                            className="max-h-64 mx-auto rounded-lg shadow-lg"
                        />
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => {
                                    setSelectedImage(null);
                                    setImagePreview(null);
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Change Image
                            </button>
                            <button
                                onClick={handleAnalyze}
                                disabled={analyzing}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {analyzing ? 'Analyzing...' : 'Analyze Cow 🐄'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-xl font-semibold text-gray-700 mb-2">Upload Cow Image</p>
                        <p className="text-gray-500 mb-4">Drag & drop or click to select</p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            id="cow-image-input"
                        />
                        <label
                            htmlFor="cow-image-input"
                            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg cursor-pointer hover:bg-emerald-700 transition-colors"
                        >
                            Choose Image
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
}
