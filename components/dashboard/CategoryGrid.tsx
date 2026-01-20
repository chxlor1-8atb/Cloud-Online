'use client';

import { FileText, Image as ImageIcon, Film, MoreHorizontal, ChevronRight } from 'lucide-react';
import type { TabType, FileStats } from '@/lib/types';
import { formatSize, cn } from '@/lib/utils';

interface CategoryGridProps {
    stats: FileStats;
    onCategoryClick: (category: TabType) => void;
}

const CATEGORIES = [
    {
        id: 'documents' as TabType,
        label: 'เอกสาร',
        icon: FileText,
        gradient: 'from-rose-500 to-pink-600',
        bgGradient: 'from-rose-500/20 to-pink-600/10',
    },
    {
        id: 'images' as TabType,
        label: 'รูปภาพ',
        icon: ImageIcon,
        gradient: 'from-cyan-500 to-blue-600',
        bgGradient: 'from-cyan-500/20 to-blue-600/10',
    },
    {
        id: 'media' as TabType,
        label: 'มีเดีย',
        icon: Film,
        gradient: 'from-violet-500 to-purple-600',
        bgGradient: 'from-violet-500/20 to-purple-600/10',
    },
    {
        id: 'others' as TabType,
        label: 'อื่นๆ',
        icon: MoreHorizontal,
        gradient: 'from-amber-500 to-orange-600',
        bgGradient: 'from-amber-500/20 to-orange-600/10',
    },
];

export function CategoryGrid({ stats, onCategoryClick }: CategoryGridProps) {
    const getCategoryData = (id: TabType): { size: number; count: number } => {
        switch (id) {
            case 'documents': return { size: stats.documents, count: 0 };
            case 'images': return { size: stats.images, count: 0 };
            case 'media': return { size: stats.media, count: 0 };
            case 'others': return { size: Math.max(0, stats.total - (stats.documents + stats.images + stats.media)), count: 0 };
            default: return { size: 0, count: 0 };
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((category, index) => {
                const data = getCategoryData(category.id);
                return (
                    <CategoryCard
                        key={category.id}
                        {...category}
                        size={data.size}
                        onClick={() => onCategoryClick(category.id)}
                        delay={index * 0.08}
                    />
                );
            })}
        </div>
    );
}

interface CategoryCardProps {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    gradient: string;
    bgGradient: string;
    size: number;
    onClick: () => void;
    delay: number;
}

function CategoryCard({ id, label, icon: Icon, gradient, bgGradient, size, onClick, delay }: CategoryCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "category-card text-left group animate-slide-up opacity-0",
                id === 'documents' && 'documents',
                id === 'images' && 'images',
                id === 'media' && 'media',
                id === 'others' && 'others',
            )}
            style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
        >
            {/* Icon */}
            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
                bgGradient
            )}>
                <Icon size={24} className="text-white" />
            </div>

            {/* Content */}
            <div className="flex items-end justify-between">
                <div>
                    <h4 className="text-base font-semibold text-white mb-1">{label}</h4>
                    <p className="text-sm text-zinc-500">{formatSize(size)}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={16} className="text-zinc-400" />
                </div>
            </div>
        </button>
    );
}
