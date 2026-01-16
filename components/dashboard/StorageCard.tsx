'use client';

import { formatSize } from '@/lib/utils';
import { STORAGE_LIMIT_BYTES, STORAGE_LIMIT_TB, LABELS } from '@/lib/constants';

interface StorageCardProps {
    usedBytes: number;
}

export function StorageCard({ usedBytes }: StorageCardProps) {
    const usagePercentage = Math.min((usedBytes / STORAGE_LIMIT_BYTES) * 100, 100);
    const strokeDashoffset = 364 * (1 - usagePercentage / 100);

    return (
        <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
            <BackgroundDecoration />
            <div className="relative z-10 flex items-center justify-between">
                <StorageInfo usedBytes={usedBytes} />
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
    );
}

interface StorageInfoProps {
    usedBytes: number;
}

function StorageInfo({ usedBytes }: StorageInfoProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-white/80">{LABELS.storageUsage}</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{formatSize(usedBytes)}</span>
                <span className="text-xl text-white/60">/ {STORAGE_LIMIT_TB} TB</span>
            </div>
        </div>
    );
}

interface CircularProgressProps {
    percentage: number;
    strokeDashoffset: number;
}

function CircularProgress({ percentage, strokeDashoffset }: CircularProgressProps) {
    return (
        <div className="w-32 h-32 relative">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="64" cy="64" r="58"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-white/20"
                />
                <circle
                    cx="64" cy="64" r="58"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={364}
                    strokeDashoffset={strokeDashoffset}
                    className="text-white"
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold">
                {Math.round(percentage)}%
            </div>
        </div>
    );
}
