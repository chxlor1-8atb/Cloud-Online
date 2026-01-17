'use client';

import { FileText, Image as ImageIcon, Video, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import type { TabType, FileStats } from '@/lib/types';
import { formatSize, cn } from '@/lib/utils';

interface CategoryGridProps {
    stats: FileStats;
    onCategoryClick: (category: TabType) => void;
}

const CATEGORIES = [
    { id: 'documents' as TabType, label: 'เอกสาร', icon: FileText, color: 'text-rose-400', bgColor: 'bg-rose-400/10' },
    { id: 'images' as TabType, label: 'รูปภาพ', icon: ImageIcon, color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
    { id: 'media' as TabType, label: 'มีเดีย', icon: Video, color: 'text-green-400', bgColor: 'bg-green-400/10' },
    { id: 'others' as TabType, label: 'อื่นๆ', icon: MoreHorizontal, color: 'text-purple-400', bgColor: 'bg-purple-400/10' },
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
        <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {CATEGORIES.map((category, index) => (
                <CategoryCard
                    key={category.id}
                    {...category}
                    size={getCategorySize(category.id)}
                    onClick={() => onCategoryClick(category.id)}
                    delay={index * 0.05}
                />
            ))}
        </div>
    );
}

interface CategoryCardProps {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
    bgColor: string;
    size: number;
    onClick: () => void;
    delay: number;
}

function CategoryCard({ label, icon: Icon, color, bgColor, size, onClick, delay }: CategoryCardProps) {
    return (
        <div
            onClick={onClick}
            className="card-interactive p-4 lg:p-5 flex flex-col gap-3 animate-slide-up opacity-0"
            style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
        >
            <div className="flex items-start justify-between">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", bgColor)}>
                    <Icon size={20} className={color} />
                </div>
                <ArrowUpRight size={16} className="text-zinc-600" />
            </div>
            <div>
                <h4 className="text-sm font-semibold text-white mb-1">{label}</h4>
                <p className="text-xs text-zinc-500">{formatSize(size)}</p>
            </div>
        </div>
    );
}
