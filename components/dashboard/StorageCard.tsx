'use client';

import { HardDrive, TrendingUp } from 'lucide-react';
import { formatSize } from '@/lib/utils';

interface StorageCardProps {
    usedBytes: number;
    quotaBytes: number;
    quotaGB: number;
}

export function StorageCard({ usedBytes, quotaBytes, quotaGB }: StorageCardProps) {
    const usagePercentage = quotaBytes > 0 ? Math.min((usedBytes / quotaBytes) * 100, 100) : 0;
    const isLow = usagePercentage < 50;
    const isMedium = usagePercentage >= 50 && usagePercentage < 80;
    const isHigh = usagePercentage >= 80;

    return (
        <div className="glass-card-static p-6 animate-slide-up">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">พื้นที่จัดเก็บ</h3>
                    <p className="text-sm text-zinc-500">
                        ใช้งานไปแล้ว {Math.round(usagePercentage)}%
                    </p>
                </div>
                <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center
                    ${isLow ? 'bg-emerald-500/20' : isMedium ? 'bg-amber-500/20' : 'bg-rose-500/20'}
                `}>
                    <HardDrive size={24} className={`
                        ${isLow ? 'text-emerald-400' : isMedium ? 'text-amber-400' : 'text-rose-400'}
                    `} />
                </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar mb-4">
                <div
                    className="progress-fill"
                    style={{
                        width: `${usagePercentage}%`,
                        background: isLow
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : isMedium
                                ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                : 'linear-gradient(90deg, #f43f5e, #fb7185)'
                    }}
                />
            </div>

            {/* Stats */}
            <div className="flex items-end justify-between">
                <div>
                    <span className="text-3xl font-bold text-white">{formatSize(usedBytes)}</span>
                    <span className="text-zinc-500 ml-2">/ {quotaGB} GB</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                    <TrendingUp size={14} />
                    <span>{formatSize(quotaBytes - usedBytes)} เหลือ</span>
                </div>
            </div>
        </div>
    );
}
