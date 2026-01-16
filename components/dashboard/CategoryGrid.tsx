'use client';

import { FileText, Image as ImageIcon, Video, MoreHorizontal } from 'lucide-react';
import type { TabType, FileStats } from '@/lib/types';
import { formatSize, cn } from '@/lib/utils';

interface CategoryGridProps {
    stats: FileStats;
    onCategoryClick: (category: TabType) => void;
}

const CATEGORIES = [
    { id: 'documents' as TabType, label: 'เอกสาร', icon: FileText, color: 'bg-rose-100 text-rose-500' },
    { id: 'images' as TabType, label: 'รูปภาพ', icon: ImageIcon, color: 'bg-blue-100 text-blue-500' },
    { id: 'media' as TabType, label: 'มีเดีย', icon: Video, color: 'bg-emerald-100 text-emerald-500' },
    { id: 'others' as TabType, label: 'อื่นๆ', icon: MoreHorizontal, color: 'bg-purple-100 text-purple-500' },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CATEGORIES.map((category) => (
                <CategoryCard
                    key={category.id}
                    {...category}
                    size={getCategorySize(category.id)}
                    totalSize={stats.total}
                    onClick={() => onCategoryClick(category.id)}
                />
            ))}
        </div>
    );
}

interface CategoryCardProps {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    color: string;
    size: number;
    totalSize: number;
    onClick: () => void;
}

function CategoryCard({ label, icon: Icon, color, size, totalSize, onClick }: CategoryCardProps) {
    const percentage = Math.min((size / Math.max(totalSize, 1)) * 100, 100);

    return (
        <div
            onClick={onClick}
            className="premium-card rounded-2xl p-6 cursor-pointer flex flex-col gap-4 group"
        >
            <div className="flex items-start justify-between">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", color)}>
                    <Icon size={24} />
                </div>
                <span className="text-sm font-bold text-slate-800">{formatSize(size)}</span>
            </div>
            <div className="space-y-1">
                <h4 className="font-bold text-slate-800">{label}</h4>
                <ProgressBar percentage={percentage} color={color} />
            </div>
        </div>
    );
}

interface ProgressBarProps {
    percentage: number;
    color: string;
}

function ProgressBar({ percentage, color }: ProgressBarProps) {
    const bgColor = color.split(' ')[0];

    return (
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
                className={cn("h-full transition-all duration-1000", bgColor)}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
