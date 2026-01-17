'use client';

import { FileText, Image as ImageIcon, Video, MoreHorizontal } from 'lucide-react';
import type { TabType, FileStats } from '@/lib/types';
import { formatSize, cn } from '@/lib/utils';

interface CategoryGridProps {
    stats: FileStats;
    onCategoryClick: (category: TabType) => void;
}

const CATEGORIES = [
    { id: 'documents' as TabType, label: 'เอกสาร', icon: FileText, gradient: 'from-rose-500 to-pink-500', glow: 'shadow-rose-500/30' },
    { id: 'images' as TabType, label: 'รูปภาพ', icon: ImageIcon, gradient: 'from-blue-500 to-cyan-400', glow: 'shadow-blue-500/30' },
    { id: 'media' as TabType, label: 'มีเดีย', icon: Video, gradient: 'from-emerald-500 to-teal-400', glow: 'shadow-emerald-500/30' },
    { id: 'others' as TabType, label: 'อื่นๆ', icon: MoreHorizontal, gradient: 'from-violet-500 to-purple-500', glow: 'shadow-violet-500/30' },
];

export function CategoryGrid({ stats, onCategoryClick }: CategoryGridProps) {
    const getCategorySize = (id: TabType): number => {
        switch (id) {
            case 'documents': return stats.documents;
            case 'images': return stats.images;
            case 'media': return stats.media;
            case 'others': return Math.max(0, stats.total - (stats.documents + stats.images + stats.media));
            default: return 0;
        }
    };

    return (
        <div className="grid grid-cols-2 gap-3 lg:gap-5">
            {CATEGORIES.map((category, index) => (
                <CategoryCard
                    key={category.id}
                    {...category}
                    size={getCategorySize(category.id)}
                    totalSize={stats.total}
                    onClick={() => onCategoryClick(category.id)}
                    delay={index * 0.1}
                />
            ))}
        </div>
    );
}

interface CategoryCardProps {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    gradient: string;
    glow: string;
    size: number;
    totalSize: number;
    onClick: () => void;
    delay: number;
}

function CategoryCard({ label, icon: Icon, gradient, glow, size, totalSize, onClick, delay }: CategoryCardProps) {
    const percentage = Math.min((size / Math.max(totalSize, 1)) * 100, 100);

    return (
        <div
            onClick={onClick}
            className="bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-5 cursor-pointer flex flex-col gap-3 lg:gap-4 group animate-scale-in hover:bg-slate-700/80 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 shadow-lg"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="flex items-start justify-between">
                <div className={cn(
                    "w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 shadow-lg bg-gradient-to-br",
                    gradient,
                    glow
                )}>
                    <Icon size={20} />
                </div>
                <span className="text-xs lg:text-sm font-bold text-slate-300">{formatSize(size)}</span>
            </div>
            <div className="space-y-2">
                <h4 className="text-sm lg:text-base font-bold text-white">{label}</h4>
                <ProgressBar percentage={percentage} gradient={gradient} />
            </div>
        </div>
    );
}

interface ProgressBarProps {
    percentage: number;
    gradient: string;
}

function ProgressBar({ percentage, gradient }: ProgressBarProps) {
    return (
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
                className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out", gradient)}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
