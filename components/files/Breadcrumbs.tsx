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
        <div className="flex items-center gap-2 text-sm text-slate-400 bg-white p-4 rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
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
                    {index > 0 && <ChevronRight size={14} />}
                    <button
                        onClick={() => onNavigate(index + 1)} // Offset by 1 to match original index
                        className={cn(
                            "hover:text-primary transition font-semibold",
                            index === visibleItems.length - 1 && "text-slate-800"
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
            className="p-1 text-slate-300 hover:text-primary transition-colors"
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
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
        >
            <FolderPlus size={18} className="text-primary" />
            <span>{BUTTONS.newFolder}</span>
        </button>
    );
}
