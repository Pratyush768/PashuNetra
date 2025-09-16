import React from 'react';

const ResultsDisplay = ({ results }) => {
    if (!results) return null;

    return (
        <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
            <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                🏆 ATC Analysis Results
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-white/70 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">
                        {results.classification}
                    </div>
                    <div className="text-sm text-gray-600">Classification</div>
                </div>
                <div className="text-center p-3 bg-white/70 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                        {results.overall_score}/9
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                </div>
            </div>

            {results.category_scores && (
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Category Scores:</h4>
                    {Object.entries(results.category_scores).map(([category, score]) => (
                        <div key={category} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">
                                {category.replace('_', ' ')}
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(score/9)*100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-600 w-8">
                                    {score}/9
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResultsDisplay;
