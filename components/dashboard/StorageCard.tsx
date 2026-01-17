'use client';

import { formatSize } from '@/lib/utils';

interface StorageCardProps {
    usedBytes: number;
    quotaBytes: number;
    quotaGB: number;
}

export function StorageCard({ usedBytes, quotaBytes, quotaGB }: StorageCardProps) {
    const usagePercentage = quotaBytes > 0 ? Math.min((usedBytes / quotaBytes) * 100, 100) : 0;
    const strokeDashoffset = 364 * (1 - usagePercentage / 100);

    return (
        <div className="relative rounded-2xl lg:rounded-3xl p-5 lg:p-8 overflow-hidden animate-slide-up">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient" style={{ backgroundSize: '200% 200%' }} />

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Decorative elements */}
            <BackgroundDecoration />

            <div className="relative z-10 flex items-center justify-between">
                <StorageInfo usedBytes={usedBytes} quotaGB={quotaGB} />
                <CircularProgress
                    percentage={usagePercentage}
                    strokeDashoffset={strokeDashoffset}
                />
            </div>
        </div>
    );
}

function BackgroundDecoration() {
    return (
        <>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-float" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-pink-400/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl" />
        </>
    );
}

interface StorageInfoProps {
    usedBytes: number;
    quotaGB: number;
}

function StorageInfo({ usedBytes, quotaGB }: StorageInfoProps) {
    return (
        <div className="space-y-2 lg:space-y-3">
            <h3 className="text-sm lg:text-base font-medium text-white/70">พื้นที่จัดเก็บ</h3>
            <div className="flex items-baseline gap-1 lg:gap-2">
                <span className="text-2xl lg:text-4xl font-bold text-white drop-shadow-lg">{formatSize(usedBytes)}</span>
                <span className="text-sm lg:text-lg text-white/60">/ {quotaGB} GB</span>
            </div>
            <p className="text-xs text-white/50">เหลือพื้นที่อีก {quotaGB} GB</p>
        </div>
    );
}

interface CircularProgressProps {
    percentage: number;
    strokeDashoffset: number;
}

function CircularProgress({ percentage, strokeDashoffset }: CircularProgressProps) {
    return (
        <div className="w-20 h-20 lg:w-28 lg:h-28 relative">
            {/* Glow behind circle */}
            <div className="absolute inset-0 rounded-full bg-white/10 blur-xl animate-pulse-glow" />

            <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 128 128">
                <circle
                    cx="64" cy="64" r="58"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-white/20"
                />
                <circle
                    cx="64" cy="64" r="58"
                    stroke="url(#progressGradient)"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={364}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#f0abfc" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm lg:text-lg font-bold text-white drop-shadow-lg">
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    );
}
