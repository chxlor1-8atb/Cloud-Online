'use client';

import { Folder, File, MoreHorizontal, Edit3, Download, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { DriveFile } from '@/lib/types';
import { formatSize, formatDate, isFolder, cn } from '@/lib/utils';
import { BUTTONS, LABELS, MESSAGES } from '@/lib/constants';

interface FileGridProps {
    files: DriveFile[];
    loading: boolean;
    onFileClick: (file: DriveFile) => void;
    onRename: (file: DriveFile) => void;
    onDelete: (file: DriveFile) => void;
}

export function FileGrid({ files, loading, onFileClick, onRename, onDelete }: FileGridProps) {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    if (loading) {
        return <LoadingState />;
    }

    if (files.length === 0) {
        return <EmptyState />;
    }

    return (
        <>
            {/* Mobile: List View */}
            <div className="lg:hidden space-y-1">
                {files.map((file, index) => (
                    <FileListItem
                        key={file.id}
                        file={file}
                        showMenu={activeMenu === file.id}
                        onToggleMenu={() => setActiveMenu(activeMenu === file.id ? null : file.id)}
                        onClick={() => onFileClick(file)}
                        onRename={() => { onRename(file); setActiveMenu(null); }}
                        onDelete={() => { onDelete(file); setActiveMenu(null); }}
                        delay={index * 0.03}
                    />
                ))}
            </div>

            {/* Desktop: Grid View */}
            <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {files.map((file, index) => (
                    <FileCard
                        key={file.id}
                        file={file}
                        showMenu={activeMenu === file.id}
                        onToggleMenu={() => setActiveMenu(activeMenu === file.id ? null : file.id)}
                        onClick={() => onFileClick(file)}
                        onRename={() => { onRename(file); setActiveMenu(null); }}
                        onDelete={() => { onDelete(file); setActiveMenu(null); }}
                        delay={index * 0.03}
                    />
                ))}
            </div>
        </>
    );
}

function LoadingState() {
    return (
        <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
        </div>
    );
}

function EmptyState() {
    return (
        <div className="h-64 flex flex-col items-center justify-center text-zinc-500 space-y-3 card">
            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                <Folder size={24} className="text-zinc-500" />
            </div>
            <div className="text-center">
                <p className="font-medium text-white">{MESSAGES.noItemsFound}</p>
                <p className="text-sm text-zinc-500">{MESSAGES.noItemsHint}</p>
            </div>
        </div>
    );
}

// Mobile List Item
interface FileListItemProps {
    file: DriveFile;
    showMenu: boolean;
    onToggleMenu: () => void;
    onClick: () => void;
    onRename: () => void;
    onDelete: () => void;
    delay: number;
}

function FileListItem({ file, showMenu, onToggleMenu, onClick, onRename, onDelete, delay }: FileListItemProps) {
    const folder = isFolder(file);

    return (
        <div
            className="flex items-center gap-3 p-3 hover:bg-zinc-900 rounded-lg transition-colors animate-slide-up opacity-0"
            style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
        >
            <div
                onClick={onClick}
                className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    folder ? "bg-amber-400/10" : "bg-zinc-800"
                )}
            >
                {folder ? (
                    <Folder size={20} className="text-amber-400" />
                ) : file.thumbnailLink ? (
                    <img src={file.thumbnailLink} alt="" className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <File size={20} className="text-zinc-500" />
                )}
            </div>

            <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
                <p className="font-medium text-white text-sm truncate">{file.name}</p>
                <p className="text-xs text-zinc-500">
                    {folder ? LABELS.folder : formatSize(file.size)} • {formatDate(file.modifiedTime)}
                </p>
            </div>

            <div className="relative">
                <button onClick={onToggleMenu} className="p-2 text-zinc-500 hover:text-white">
                    <MoreHorizontal size={16} />
                </button>
                {showMenu && <DropdownMenu file={file} onRename={onRename} onDelete={onDelete} />}
            </div>
        </div>
    );
}

// Desktop Card
interface FileCardProps {
    file: DriveFile;
    showMenu: boolean;
    onToggleMenu: () => void;
    onClick: () => void;
    onRename: () => void;
    onDelete: () => void;
    delay: number;
}

function FileCard({ file, showMenu, onToggleMenu, onClick, onRename, onDelete, delay }: FileCardProps) {
    const folder = isFolder(file);

    return (
        <div
            className="card-interactive p-4 animate-slide-up opacity-0"
            style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
        >
            <div className="flex items-start justify-between mb-3">
                <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    folder ? "bg-amber-400/10" : "bg-zinc-800"
                )}>
                    {folder ? (
                        <Folder size={20} className="text-amber-400" />
                    ) : file.thumbnailLink ? (
                        <img src={file.thumbnailLink} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <File size={20} className="text-zinc-500" />
                    )}
                </div>
                <div className="relative">
                    <button onClick={onToggleMenu} className="p-1 text-zinc-500 hover:text-white">
                        <MoreHorizontal size={16} />
                    </button>
                    {showMenu && <DropdownMenu file={file} onRename={onRename} onDelete={onDelete} />}
                </div>
            </div>
            <div className="cursor-pointer" onClick={onClick}>
                <p className="font-medium text-white text-sm truncate mb-1">{file.name}</p>
                <p className="text-xs text-zinc-500">
                    {folder ? LABELS.folder : formatSize(file.size)} • {formatDate(file.modifiedTime)}
                </p>
            </div>
        </div>
    );
}

// Dropdown Menu
function DropdownMenu({ file, onRename, onDelete }: { file: DriveFile; onRename: () => void; onDelete: () => void }) {
    return (
        <div className="absolute right-0 top-8 w-40 bg-zinc-900 border border-zinc-800 rounded-lg py-1 z-20 animate-fade-in">
            <button
                onClick={onRename}
                className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
            >
                <Edit3 size={14} /> {BUTTONS.rename}
            </button>
            {file.webContentLink && (
                <a
                    href={file.webContentLink}
                    className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
                >
                    <Download size={14} /> {BUTTONS.download}
                </a>
            )}
            <button
                onClick={onDelete}
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-zinc-800 flex items-center gap-2"
            >
                <Trash2 size={14} /> {BUTTONS.delete}
            </button>
        </div>
    );
}
