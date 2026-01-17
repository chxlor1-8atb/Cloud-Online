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
    return (
        <div className="flex items-center gap-2 text-sm text-slate-400 glass-light p-3 lg:p-4 rounded-xl overflow-x-auto animate-slide-in">
            <BreadcrumbItems items={items} onNavigate={onNavigate} />
            <div className="ml-auto flex items-center gap-2">
                <RefreshButton loading={loading} onRefresh={onRefresh} />
            </div>
        </div>
    );
}

interface BreadcrumbItemsProps {
    items: BreadcrumbItem[];
    onNavigate: (index: number) => void;
}

function BreadcrumbItems({ items, onNavigate }: BreadcrumbItemsProps) {
    // Hide the first breadcrumb (root folder name)
    const visibleItems = items.slice(1);

    return (
        <>
            {visibleItems.map((crumb, index) => (
                <div key={crumb.id} className="flex items-center gap-2 shrink-0">
                    {index > 0 && <ChevronRight size={14} className="text-slate-600" />}
                    <button
                        onClick={() => onNavigate(index + 1)}
                        className={cn(
                            "hover:text-primary transition font-medium px-2 py-1 rounded-lg hover:bg-white/5",
                            index === visibleItems.length - 1 && "text-white"
                        )}
                    >
                        {crumb.name}
                    </button>
                </div>
            ))}
        </>
    );
}

interface RefreshButtonProps {
    loading: boolean;
    onRefresh: () => void;
}

function RefreshButton({ loading, onRefresh }: RefreshButtonProps) {
    return (
        <button
            onClick={onRefresh}
            className="p-2 text-slate-500 hover:text-primary transition-colors rounded-lg hover:bg-white/5"
        >
            <RefreshCw size={16} className={cn(loading && "animate-spin")} />
        </button>
    );
}

interface NewFolderButtonProps {
    onClick: () => void;
}

export function NewFolderButton({ onClick }: NewFolderButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 glass-light text-slate-300 font-medium rounded-xl hover:bg-white/10 transition-all border border-white/5 hover:border-white/10"
        >
            <FolderPlus size={18} className="text-amber-400" />
            <span className="hidden sm:inline">{BUTTONS.newFolder}</span>
        </button>
    );
}
