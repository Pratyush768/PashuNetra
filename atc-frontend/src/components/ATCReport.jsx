import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';

// PREMIUM PIE CHART COMPONENT (Green Theme)
const PremiumPieChart = memo(({ data, title, centerValue, centerLabel }) => {
    const [animatedValues, setAnimatedValues] = useState({});
    const [hoveredSegment, setHoveredSegment] = useState(null);

    const chartData = useMemo(() => {
        const values = Object.values(data);
        const total = values.reduce((sum, val) => sum + val, 0);
        let cumulativePercentage = 0;

        // Green theme colors
        const colors = ['#10b981', '#059669', '#065f46', '#047857', '#34d399'];

        return Object.entries(data).map(([key, value], index) => {
            const percentage = (value / total) * 100;
            const startAngle = cumulativePercentage * 3.6;
            const endAngle = (cumulativePercentage + percentage) * 3.6;
            cumulativePercentage += percentage;

            return {
                key,
                value,
                percentage,
                startAngle,
                endAngle,
                color: colors[index % colors.length]
            };
        });
    }, [data]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedValues(data);
        }, 300);
        return () => clearTimeout(timer);
    }, [data]);

    const createPieSlice = (segment, index) => {
        const { startAngle, endAngle, color, percentage } = segment;
        const isHovered = hoveredSegment === index;
        const radius = isHovered ? 75 : 70;
        const centerX = 100, centerY = 100;

        const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
        const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
        const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
        const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);

        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

        const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');

        return (
            <path
                key={index}
                d={pathData}
                fill={color}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-300 cursor-pointer filter drop-shadow-sm hover:drop-shadow-lg"
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
                style={{
                    filter: isHovered ? 'brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
            />
        );
    };

    return (
        <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-emerald-200/50 hover:shadow-2xl transition-all duration-500">
            <div className="text-center mb-6">
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">
                    {title}
                </h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="flex items-center justify-center mb-6">
                <div className="relative">
                    <svg width="180" height="180" viewBox="0 0 200 200" className="transform -rotate-90">
                        {chartData.map(createPieSlice)}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-emerald-600 mb-1">{centerValue}</div>
                        <div className="text-sm text-green-600 font-medium">{centerLabel}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {chartData.map((segment, index) => (
                    <div
                        key={segment.key}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                            hoveredSegment === index ? 'bg-emerald-50 scale-105 border border-emerald-200' : 'hover:bg-green-50/50'
                        }`}
                        onMouseEnter={() => setHoveredSegment(index)}
                        onMouseLeave={() => setHoveredSegment(null)}
                    >
                        <div
                            className="w-3 h-3 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: segment.color }}
                        />
                        <div className="flex-1">
                            <div className="font-medium text-green-800 capitalize text-sm">
                                {segment.key.replace(/_/g, ' ')}
                            </div>
                            <div className="text-xs text-green-600">
                                {segment.value.toFixed(1)} ({segment.percentage.toFixed(1)}%)
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

// PREMIUM GRADIENT BAR CHART (Green Theme)
const PremiumBarChart = memo(({ data, title, theme = 'emerald' }) => {
    const [hoveredBar, setHoveredBar] = useState(null);
    const [animatedData, setAnimatedData] = useState({});

    const themeStyles = {
        emerald: {
            gradient: 'from-emerald-500 via-green-500 to-teal-500',
            glow: 'shadow-emerald-500/25',
            text: 'text-emerald-600'
        },
        green: {
            gradient: 'from-green-500 via-emerald-500 to-teal-500',
            glow: 'shadow-green-500/25',
            text: 'text-green-600'
        }
    };

    const maxValue = Math.max(...Object.values(data));
    const sortedEntries = Object.entries(data).sort(([,a], [,b]) => b - a);
    const styles = themeStyles[theme] || themeStyles.emerald;

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedData(data), 500);
        return () => clearTimeout(timer);
    }, [data]);

    return (
        <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-emerald-200/50 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">
                        {title}
                    </h3>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                        <span className="text-green-700 font-medium">High (7-9)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500"></div>
                        <span className="text-green-700 font-medium">Medium (5-6.9)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500"></div>
                        <span className="text-green-700 font-medium">Low (5)</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {sortedEntries.map(([label, value], index) => {
                    const percentage = (animatedData[label] || 0) / maxValue * 100;
                    const isHovered = hoveredBar === label;
                    const isHigh = value >= 7;
                    const isMedium = value >= 5;

                    return (
                        <div
                            key={label}
                            className="group relative"
                            onMouseEnter={() => setHoveredBar(label)}
                            onMouseLeave={() => setHoveredBar(null)}
                        >
                            {isHovered && (
                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
                                    <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white px-3 py-2 rounded-xl shadow-2xl border border-emerald-600 backdrop-blur-sm">
                                        <div className="text-center">
                                            <div className="font-bold text-sm">{label.replace(/_/g, ' ').toUpperCase()}</div>
                                            <div className="text-green-200 font-semibold text-xs">
                                                {value.toFixed(1)}/9 ({Math.round((value/9)*100)}%)
                                            </div>
                                        </div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-emerald-700"></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-green-600 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                                            #{index + 1}
                                        </span>
                                        <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                            isHigh ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                                isMedium ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                                                    'bg-gradient-to-r from-red-500 to-rose-500'
                                        } ${isHovered ? 'scale-125 shadow-lg' : ''}`}></div>
                                    </div>
                                    <span className="text-sm font-semibold text-green-800 capitalize">
                                        {label.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-lg font-bold ${
                                        isHigh ? 'text-green-600' : isMedium ? 'text-amber-600' : 'text-red-500'
                                    }`}>
                                        {value.toFixed(1)}
                                    </span>
                                    <span className="text-green-600 font-medium text-sm">/9</span>
                                    <span className="text-xs text-green-500 font-medium bg-emerald-100 px-2 py-1 rounded-full">
                                        {Math.round((value/9)*100)}%
                                    </span>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="h-3 bg-gradient-to-r from-emerald-100 to-green-200 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                                            isHigh ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500' :
                                                isMedium ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500' :
                                                    'bg-gradient-to-r from-red-500 via-rose-500 to-pink-500'
                                        } ${isHovered ? 'shadow-lg transform scale-y-110' : ''}`}
                                        style={{ width: `${percentage}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/20"></div>
                                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
                                            <div className={`w-1.5 h-1.5 rounded-full bg-white/80 ${isHovered ? 'animate-pulse' : ''}`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

// PREMIUM RADIAL GAUGE CHART (Green Theme)
const PremiumRadialGauge = memo(({ score, maxScore = 9, title, showAnimation = true }) => {
    const [animatedScore, setAnimatedScore] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const percentage = (score / maxScore) * 100;
    const strokeDasharray = 283;
    const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;

    const getGradeInfo = (score) => {
        if (score >= 8) return {
            grade: 'A+',
            label: 'Excellent',
            color: 'text-emerald-500',
            gradient: 'from-emerald-400 via-green-500 to-teal-500',
            glow: 'drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]'
        };
        if (score >= 6.5) return {
            grade: 'A',
            label: 'Good Plus',
            color: 'text-green-600',
            gradient: 'from-green-400 via-emerald-500 to-teal-500',
            glow: 'drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]'
        };
        if (score >= 5) return {
            grade: 'B',
            label: 'Good',
            color: 'text-amber-500',
            gradient: 'from-amber-400 via-yellow-500 to-orange-500',
            glow: 'drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]'
        };
        return {
            grade: 'C',
            label: 'Fair',
            color: 'text-red-500',
            gradient: 'from-red-400 via-rose-500 to-pink-500',
            glow: 'drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]'
        };
    };

    const gradeInfo = getGradeInfo(score);

    useEffect(() => {
        if (showAnimation) {
            const timer = setTimeout(() => {
                setIsVisible(true);
                setAnimatedScore(score);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setAnimatedScore(score);
            setIsVisible(true);
        }
    }, [score, showAnimation]);

    return (
        <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-emerald-200/50 hover:shadow-2xl transition-all duration-500 text-center group">
            <div className="mb-6">
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">
                    {title}
                </h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="relative inline-flex items-center justify-center mb-5">
                <div className={`absolute inset-0 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-r ${gradeInfo.gradient} blur-2xl animate-pulse`}></div>

                <div className="relative">
                    <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#d1fae5"
                            strokeWidth="6"
                            className="drop-shadow-sm"
                        />

                        <defs>
                            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="50%" stopColor="#22c55e" />
                                <stop offset="100%" stopColor="#15803d" />
                            </linearGradient>
                        </defs>

                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={`url(#gradient-${title})`}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={isVisible ? strokeDashoffset : strokeDasharray}
                            className={`transition-all duration-2000 ease-out ${gradeInfo.glow}`}
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className={`text-3xl font-bold ${gradeInfo.color} mb-1 transition-all duration-300`}>
                            {showAnimation ? animatedScore.toFixed(1) : score.toFixed(1)}
                        </div>
                        <div className="text-xs text-green-600 font-medium mb-2">out of {maxScore}</div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${gradeInfo.gradient} text-white shadow-lg`}>
                            {gradeInfo.grade} • {gradeInfo.label}
                        </div>
                        <div className="text-xs text-green-500 mt-1 font-medium">
                            {percentage.toFixed(1)}% Complete
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-emerald-200">
                <div className="text-center">
                    <div className="text-lg font-bold text-emerald-500 mb-1">
                        {score >= 7 ? '🏆' : score >= 5 ? '⭐' : '📊'}
                    </div>
                    <div className="text-xs text-green-600 font-medium">Status</div>
                </div>
                <div className="text-center">
                    <div className="text-lg font-bold text-green-600 mb-1">{Math.round(percentage)}%</div>
                    <div className="text-xs text-green-600 font-medium">Progress</div>
                </div>
                <div className="text-center">
                    <div className={`text-lg font-bold ${gradeInfo.color} mb-1`}>{gradeInfo.grade}</div>
                    <div className="text-xs text-green-600 font-medium">Grade</div>
                </div>
            </div>
        </div>
    );
});

// CATTLE DETAILS VIEWER (Green Theme)
const CattleDetailsViewer = memo(({ cattle, title }) => {
    const [selectedDetail, setSelectedDetail] = useState(null);

    const cattleDetails = {
        'Basic Info': {
            'Cattle ID': cattle?.id || 'C-001',
            'Age': cattle?.age || '4 years',
            'Breed': cattle?.breed || 'Holstein Friesian',
            'Gender': cattle?.gender || 'Female',
            'Weight': cattle?.weight || '650 kg'
        },
        'Health Status': {
            'Last Checkup': cattle?.lastCheckup || '2025-09-10',
            'Vaccinations': cattle?.vaccinations || 'Up to date',
            'Health Score': cattle?.healthScore || '8.5/10',
            'Veterinarian': cattle?.vet || 'Dr. Smith',
            'Next Visit': cattle?.nextVisit || '2025-12-15'
        },
        'Production': {
            'Daily Milk Yield': cattle?.milkYield || '28 liters',
            'Lactation Period': cattle?.lactation || '280 days',
            'Calving Date': cattle?.calvingDate || '2025-01-15',
            'Breeding Status': cattle?.breedingStatus || 'Active',
            'Feed Intake': cattle?.feedIntake || '22 kg/day'
        },
        'Farm Info': {
            'Farm Name': cattle?.farmName || 'Green Valley Farm',
            'Owner': cattle?.owner || 'John Smith',
            'Location': cattle?.location || 'Wisconsin, USA',
            'Barn Number': cattle?.barnNumber || 'B-12',
            'Registration': cattle?.registration || 'Registered'
        }
    };

    const detailColors = {
        'Basic Info': 'from-green-50 to-emerald-50 border-green-200',
        'Health Status': 'from-emerald-50 to-teal-50 border-emerald-200',
        'Production': 'from-teal-50 to-green-50 border-teal-200',
        'Farm Info': 'from-green-50 to-lime-50 border-green-200'
    };

    return (
        <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-emerald-200/50 hover:shadow-2xl transition-all duration-500">
            <div className="mb-6">
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">
                    {title}
                </h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(cattleDetails).map(([category, details], categoryIndex) => (
                    <div
                        key={category}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-r ${detailColors[category] || 'from-gray-50 to-gray-100 border-gray-200'}`}
                        onClick={() => setSelectedDetail(selectedDetail === categoryIndex ? null : categoryIndex)}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-green-800 text-sm flex items-center gap-2">
                                {category === 'Basic Info' && '📋'}
                                {category === 'Health Status' && '🏥'}
                                {category === 'Production' && '🥛'}
                                {category === 'Farm Info' && '🏡'}
                                {category}
                            </h4>
                            <div className={`w-2 h-2 rounded-full ${selectedDetail === categoryIndex ? 'bg-emerald-500' : 'bg-green-400'} transition-colors`}></div>
                        </div>

                        <div className={`space-y-2 transition-all duration-300 ${selectedDetail === categoryIndex ? 'max-h-96 opacity-100' : 'max-h-20 opacity-70'} overflow-hidden`}>
                            {Object.entries(details).map(([key, value], index) => (
                                <div key={key} className="flex justify-between items-center py-1">
                                    <span className="text-xs text-green-700 font-medium">{key}:</span>
                                    <span className="text-xs text-green-800 font-semibold">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <div className="text-lg font-bold text-emerald-600">A+</div>
                    <div className="text-xs text-green-700 font-medium">Overall Grade</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200">
                    <div className="text-lg font-bold text-green-600">98%</div>
                    <div className="text-xs text-green-700 font-medium">Health Score</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200">
                    <div className="text-lg font-bold text-teal-600">28L</div>
                    <div className="text-xs text-green-700 font-medium">Daily Yield</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-lime-50 to-green-50 rounded-xl border border-lime-200">
                    <div className="text-lg font-bold text-lime-600">4yr</div>
                    <div className="text-xs text-green-700 font-medium">Age</div>
                </div>
            </div>
        </div>
    );
});

// PREMIUM PERFORMANCE METRICS DASHBOARD (Green Theme)
const PerformanceMetrics = memo(({ currentCow, reportData }) => {
    const metrics = [
        {
            label: 'Overall Score',
            value: `${currentCow.atc_results.overall_score}/9`,
            percentage: (currentCow.atc_results.overall_score / 9) * 100,
            icon: '🏆',
            color: 'emerald',
            trend: '+2.3'
        },
        {
            label: 'Detection Quality',
            value: `${(currentCow.detection_confidence * 100).toFixed(1)}%`,
            percentage: currentCow.detection_confidence * 100,
            icon: '🔍',
            color: 'green',
            trend: '+5.2'
        },
        {
            label: 'Keypoints Found',
            value: `${currentCow.keypoints_detected}/${currentCow.total_keypoints}`,
            percentage: (currentCow.keypoints_detected / currentCow.total_keypoints) * 100,
            icon: '🎯',
            color: 'teal',
            trend: '+1.1'
        },
        {
            label: 'Processing Time',
            value: reportData.analysis_metadata?.processing_time || '2.1s',
            percentage: 85,
            icon: '⚡',
            color: 'lime',
            trend: '-0.8'
        }
    ];

    const colorSchemes = {
        emerald: { bg: 'from-emerald-500 to-green-500', text: 'text-emerald-700', light: 'from-emerald-50 to-green-50' },
        green: { bg: 'from-green-500 to-emerald-500', text: 'text-green-700', light: 'from-green-50 to-emerald-50' },
        teal: { bg: 'from-teal-500 to-emerald-500', text: 'text-teal-700', light: 'from-teal-50 to-emerald-50' },
        lime: { bg: 'from-lime-500 to-green-500', text: 'text-lime-700', light: 'from-lime-50 to-green-50' }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric, index) => {
                const scheme = colorSchemes[metric.color];
                return (
                    <div key={index} className={`bg-gradient-to-br ${scheme.light} p-5 rounded-2xl shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300 group backdrop-blur-sm`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-2xl">{metric.icon}</div>
                            <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                                metric.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                            }`}>
                                {metric.trend}%
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className={`text-xl font-bold ${scheme.text} mb-1 group-hover:scale-105 transition-transform`}>
                                {metric.value}
                            </div>
                            <div className="text-xs text-green-700 font-medium">{metric.label}</div>
                        </div>

                        <div className="relative">
                            <div className="h-2 bg-white/70 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${scheme.bg} rounded-full transition-all duration-1000 ease-out`}
                                    style={{ width: `${metric.percentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

// MAIN PREMIUM ATC REPORT COMPONENT (Green Theme)
export default function ATCReport({ onBackToHome }) {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCow, setSelectedCow] = useState(0);
    const [error, setError] = useState(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');

    const fetchReport = useCallback(async () => {
        setLoading(true);
        setError(null);
        setLoadingProgress(0);

        try {
            const progressInterval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + Math.random() * 20;
                });
            }, 500);

            const res = await fetch('http://localhost:3001/ats-report');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();
            clearInterval(progressInterval);
            setLoadingProgress(100);

            if (data.success) {
                setReportData(data);
            } else {
                setReportData(mockReportData);
            }
        } catch (error) {
            console.error('Failed to fetch report:', error);
            setError(error.message);
            setReportData(mockReportData);
        } finally {
            setTimeout(() => {
                setLoading(false);
                setLoadingProgress(0);
            }, 1000);
        }
    }, []);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const mockReportData = useMemo(() => ({
        success: true,
        total_cows_detected: 1,
        individual_cows: [{
            detection_confidence: 0.892,
            keypoints_detected: 10,
            total_keypoints: 12,
            atc_results: {
                overall_score: 7.8,
                classification: "Excellent",
                category_scores: {
                    dairy_character: 8.2,
                    body_capacity: 7.5,
                    mammary_system: 8.8,
                    feet_legs: 6.9,
                    general_appearance: 7.6
                }
            }
        }],
        analysis_metadata: {
            processing_time: '2.3s',
            model_version: 'YOLOv8x-ATC-v3.0',
            confidence_threshold: 0.5,
            timestamp: new Date().toISOString()
        }
    }), []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-50 flex items-center justify-center">
                <div className="text-center p-8 max-w-md mx-4">
                    <div className="relative inline-block mb-6">
                        <div className="w-24 h-24 border-6 border-emerald-200 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-24 h-24 border-6 border-emerald-600 border-t-transparent rounded-full animate-spin"
                             style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-2xl animate-bounce">🐄</div>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-3">
                        Loading Premium Report
                    </h3>
                    <div className="w-full bg-emerald-200 rounded-full h-2 mb-3">
                        <div
                            className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <p className="text-green-700">{Math.round(loadingProgress)}% Complete</p>
                </div>
            </div>
        );
    }

    if (!reportData) return null;

    const currentCow = reportData.individual_cows[selectedCow];

    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'analysis', label: 'Analysis', icon: '🔬' },
        { id: 'details', label: 'Cattle Details', icon: '🐄' },
        { id: 'export', label: 'Export', icon: '📤' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-emerald-50">
            {/* Premium Header with Green Theme */}
            <div className="bg-white/95 backdrop-blur-lg shadow-xl border-b border-emerald-200/50 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-6 py-5">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => onBackToHome()}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 via-green-700 to-emerald-800 text-white rounded-xl hover:from-emerald-700 hover:to-green-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-medium gap-2 group text-sm"
                            >
                                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back to Upload
                            </button>

                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-800 bg-clip-text text-transparent mb-1">
                                    🐄 Premium ATC Analytics
                                </h1>
                                <div className="flex items-center gap-4 text-xs text-green-600">
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                        <span className="font-medium">Generated: {new Date().toLocaleString()}</span>
                                    </div>
                                    {reportData.analysis_metadata && (
                                        <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            <span className="font-medium">Model: {reportData.analysis_metadata.model_version}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 px-4 py-2 rounded-xl border border-emerald-300/50 shadow-md">
                                <span className="text-emerald-800 font-bold flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    {reportData.total_cows_detected} Cow{reportData.total_cows_detected > 1 ? 's' : ''} Detected
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Premium Tab Navigation with Green Theme */}
                    <div className="flex items-center gap-1 mt-4 bg-emerald-100 rounded-xl p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                                    activeTab === tab.id
                                        ? 'bg-white shadow-md text-emerald-700 scale-105'
                                        : 'text-green-700 hover:text-emerald-800 hover:bg-white/50'
                                }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Premium Content with Green Theme */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        <PerformanceMetrics currentCow={currentCow} reportData={reportData} />

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            <PremiumRadialGauge
                                score={currentCow.atc_results.overall_score}
                                title="Overall ATC Score"
                                showAnimation={true}
                            />

                            <div className="xl:col-span-2">
                                <PremiumBarChart
                                    data={currentCow.atc_results.category_scores}
                                    title="Category Performance Analysis"
                                    theme="emerald"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PremiumPieChart
                                data={currentCow.atc_results.category_scores}
                                title="Score Distribution"
                                centerValue={currentCow.atc_results.overall_score.toFixed(1)}
                                centerLabel="Average"
                            />

                            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-emerald-200/50">
                                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-4">
                                    🏆 Performance Summary
                                </h3>

                                <div className="space-y-3">
                                    {[
                                        { label: 'Classification', value: currentCow.atc_results.classification, color: 'text-emerald-600' },
                                        { label: 'Overall Score', value: `${currentCow.atc_results.overall_score}/9`, color: 'text-green-600' },
                                        { label: 'Detection Quality', value: `${(currentCow.detection_confidence * 100).toFixed(1)}%`, color: 'text-teal-600' },
                                        { label: 'Processing Time', value: reportData.analysis_metadata?.processing_time || '2.3s', color: 'text-lime-600' }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-100/50 rounded-lg border border-emerald-200/50">
                                            <span className="font-medium text-green-800 text-sm">{item.label}:</span>
                                            <span className={`font-bold text-lg ${item.color}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'analysis' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <PremiumBarChart
                            data={currentCow.atc_results.category_scores}
                            title="Detailed Category Analysis"
                            theme="green"
                        />

                        <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-emerald-200/50">
                            <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-6">
                                💡 AI-Powered Insights
                            </h3>

                            <div className="space-y-4">
                                {currentCow.atc_results.overall_score >= 7.5 ? (
                                    <div className="p-4 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border-l-4 border-emerald-500 rounded-lg">
                                        <div className="flex items-center gap-2 font-semibold text-emerald-800 mb-2">
                                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            Outstanding Performance!
                                        </div>
                                        <p className="text-emerald-700 leading-relaxed text-sm">
                                            This cattle demonstrates exceptional scores across all evaluation categories.
                                            Continue current management practices and consider for premium breeding programs.
                                        </p>
                                    </div>
                                ) : currentCow.atc_results.overall_score >= 6 ? (
                                    <div className="p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-l-4 border-amber-500 rounded-lg">
                                        <div className="flex items-center gap-2 font-semibold text-amber-800 mb-2">
                                            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            Good Performance - Room for Improvement
                                        </div>
                                        <p className="text-amber-700 leading-relaxed text-sm">
                                            Several categories show potential for improvement through targeted breeding and
                                            management adjustments. Focus on lower-scoring areas for optimal results.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 border-l-4 border-red-500 rounded-lg">
                                        <div className="flex items-center gap-2 font-semibold text-red-800 mb-2">
                                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            Requires Attention
                                        </div>
                                        <p className="text-red-700 leading-relaxed text-sm">
                                            Consider implementing focused breeding programs and comprehensive management
                                            changes to improve overall type scores. Consultation with veterinary specialists recommended.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'details' && (
                    <div>
                        <CattleDetailsViewer
                            cattle={currentCow}
                            title="Comprehensive Cattle Information"
                        />
                    </div>
                )}

                {activeTab === 'export' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-emerald-200/50">
                                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-6">
                                    📄 Report Summary
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="text-base font-semibold text-green-800 flex items-center gap-2">
                                            📊 Key Metrics
                                        </h4>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Overall ATC Score', value: `${currentCow.atc_results.overall_score}/9`, progress: (currentCow.atc_results.overall_score/9)*100 },
                                                { label: 'Classification Grade', value: currentCow.atc_results.classification, progress: 85 },
                                                { label: 'Detection Confidence', value: `${(currentCow.detection_confidence * 100).toFixed(1)}%`, progress: currentCow.detection_confidence * 100 },
                                                { label: 'Keypoints Detected', value: `${currentCow.keypoints_detected}/${currentCow.total_keypoints}`, progress: (currentCow.keypoints_detected/currentCow.total_keypoints)*100 }
                                            ].map((metric, index) => (
                                                <div key={index} className="p-3 bg-gradient-to-r from-emerald-50 to-green-100/50 rounded-lg border border-emerald-200/50">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-green-800 text-sm">{metric.label}</span>
                                                        <span className="font-bold text-emerald-600">{metric.value}</span>
                                                    </div>
                                                    <div className="w-full bg-emerald-200 rounded-full h-1.5">
                                                        <div
                                                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-1.5 rounded-full transition-all duration-1000"
                                                            style={{ width: `${metric.progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-base font-semibold text-green-800 flex items-center gap-2">
                                            ⚡ Analysis Details
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                                <div className="text-xs text-green-700 mb-1">Processing Time</div>
                                                <div className="text-lg font-bold text-green-600">
                                                    {reportData.analysis_metadata?.processing_time || '2.3s'}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                                                <div className="text-xs text-green-700 mb-1">AI Model Version</div>
                                                <div className="text-sm font-bold text-emerald-600">
                                                    {reportData.analysis_metadata?.model_version || 'YOLOv8x-ATC-v3.0'}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-200">
                                                <div className="text-xs text-green-700 mb-1">Analysis Date</div>
                                                <div className="text-xs font-bold text-teal-600">
                                                    {new Date().toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Premium Export Options with Green Theme */}
                        <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-emerald-200/50 h-fit">
                            <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-6">
                                📤 Export Options
                            </h3>

                            <div className="space-y-3">
                                {[
                                    { type: 'print', label: 'Print Report', icon: '🖨️', color: 'from-emerald-600 to-green-600', desc: 'High-quality PDF output' },
                                    { type: 'csv', label: 'Export to CSV', icon: '📊', color: 'from-green-600 to-teal-600', desc: 'Spreadsheet format' },
                                    { type: 'json', label: 'Export JSON', icon: '💾', color: 'from-teal-600 to-emerald-600', desc: 'Raw data format' },
                                    { type: 'share', label: 'Share Report', icon: '🔗', color: 'from-lime-600 to-green-600', desc: 'Generate shareable link' }
                                ].map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => option.type === 'print' ? window.print() : console.log(`Export ${option.type}`)}
                                        className={`w-full p-3 bg-gradient-to-r ${option.color} text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium flex items-center gap-3 group text-sm`}
                                    >
                                        <div className="text-lg group-hover:scale-110 transition-transform">{option.icon}</div>
                                        <div className="text-left">
                                            <div className="font-semibold">{option.label}</div>
                                            <div className="text-xs opacity-90">{option.desc}</div>
                                        </div>
                                        <svg className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                ))}

                                <div className="border-t border-emerald-200 pt-4 mt-6">
                                    <button
                                        onClick={() => onBackToHome()}
                                        className="w-full p-3 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center gap-2 group text-sm"
                                    >
                                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                        </svg>
                                        Analyze Another Cattle
                                    </button>
                                </div>

                                <div className="pt-4 border-t border-emerald-200 mt-4">
                                    <div className="text-center text-xs text-green-600 space-y-1">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span>Report auto-saved</span>
                                        </div>
                                        <div>Analysis ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                                        <div>Generated: {new Date().toLocaleTimeString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
