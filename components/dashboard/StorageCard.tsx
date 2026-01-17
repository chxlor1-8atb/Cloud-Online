'use client';

import { formatSize } from '@/lib/utils';

interface StorageCardProps {
    usedBytes: number;
    quotaBytes: number;
    quotaGB: number;
}

export function StorageCard({ usedBytes, quotaBytes, quotaGB }: StorageCardProps) {
    const usagePercentage = quotaBytes > 0 ? Math.min((usedBytes / quotaBytes) * 100, 100) : 0;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-zinc-400">พื้นที่จัดเก็บ</h3>
                <span className="text-xs text-zinc-500">{Math.round(usagePercentage)}% used</span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-4">
                <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${usagePercentage}%` }}
                />
            </div>

            {/* Stats */}
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{formatSize(usedBytes)}</span>
                <span className="text-sm text-zinc-500">/ {quotaGB} GB</span>
            </div>
        </div>
    );
}
