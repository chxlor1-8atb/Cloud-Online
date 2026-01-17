'use client';

import { ChevronRight, RefreshCw, FolderPlus } from 'lucide-react';
import type { BreadcrumbItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { BUTTONS } from '@/lib/constants';

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    loading: boolean;
    onNavigate: (index: number) => void;
    onRefresh: () => void;
    onNewFolder: () => void;
}

export function Breadcrumbs({ items, loading, onNavigate, onRefresh, onNewFolder }: BreadcrumbsProps) {
    const visibleItems = items.slice(1);

    return (
        <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg overflow-x-auto">
            {visibleItems.map((crumb, index) => (
                <div key={crumb.id} className="flex items-center gap-2 shrink-0">
                    {index > 0 && <ChevronRight size={14} className="text-zinc-600" />}
                    <button
                        onClick={() => onNavigate(index + 1)}
                        className={cn(
                            "hover:text-white transition-colors font-medium",
                            index === visibleItems.length - 1 && "text-white"
                        )}
                    >
                        {crumb.name}
                    </button>
                </div>
            ))}

            <div className="ml-auto flex items-center gap-1">
                <button
                    onClick={onRefresh}
                    className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-md hover:bg-zinc-800"
                >
                    <RefreshCw size={14} className={cn(loading && "animate-spin")} />
                </button>
            </div>
        </div>
    );
}

interface NewFolderButtonProps {
    onClick: () => void;
}

export function NewFolderButton({ onClick }: NewFolderButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
        >
            <FolderPlus size={16} className="text-amber-400" />
            <span className="hidden sm:inline">{BUTTONS.newFolder}</span>
        </button>
    );
}
