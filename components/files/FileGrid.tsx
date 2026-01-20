'use client';

import { Folder, File, MoreVertical, Edit3, Download, Trash2, FileText, Image, Film, Music } from 'lucide-react';
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
            <div className="lg:hidden space-y-2">
                {files.map((file, index) => (
                    <FileListItem
                        key={file.id}
                        file={file}
                        showMenu={activeMenu === file.id}
                        onToggleMenu={() => setActiveMenu(activeMenu === file.id ? null : file.id)}
                        onClick={() => onFileClick(file)}
                        onRename={() => { onRename(file); setActiveMenu(null); }}
                        onDelete={() => { onDelete(file); setActiveMenu(null); }}
                        delay={index * 0.04}
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
                        delay={index * 0.04}
                    />
                ))}
            </div>
        </>
    );
}

// Get file icon and color based on mime type
function getFileIcon(file: DriveFile) {
    const type = file.mimeType || '';

    if (isFolder(file)) {
        return { icon: Folder, color: 'text-amber-400', bg: 'from-amber-500/20 to-orange-500/10' };
    }
    if (type.includes('image')) {
        return { icon: Image, color: 'text-cyan-400', bg: 'from-cyan-500/20 to-blue-500/10' };
    }
    if (type.includes('video')) {
        return { icon: Film, color: 'text-violet-400', bg: 'from-violet-500/20 to-purple-500/10' };
    }
    if (type.includes('audio')) {
        return { icon: Music, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-green-500/10' };
    }
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
        return { icon: FileText, color: 'text-rose-400', bg: 'from-rose-500/20 to-pink-500/10' };
    }
    return { icon: File, color: 'text-zinc-400', bg: 'from-zinc-600/20 to-zinc-500/10' };
}

function LoadingState() {
    return (
        <div className="h-64 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-sm text-zinc-500">กำลังโหลด...</p>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="h-64 flex flex-col items-center justify-center text-zinc-500 space-y-4 glass-card-static">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                <Folder size={36} className="text-zinc-600" />
            </div>
            <div className="text-center">
                <p className="font-semibold text-white mb-1">{MESSAGES.noItemsFound}</p>
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
    const { icon: Icon, color, bg } = getFileIcon(file);

    return (
        <div
            className="flex items-center gap-3 p-3 glass-card group animate-slide-up opacity-0"
            style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
        >
            <div
                onClick={onClick}
                className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br cursor-pointer",
                    bg
                )}
            >
                {file.thumbnailLink && !folder ? (
                    <img src={file.thumbnailLink} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : (
                    <Icon size={22} className={color} />
                )}
            </div>

            <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
                <p className="font-medium text-white text-sm truncate group-hover:text-indigo-300 transition-colors">{file.name}</p>
                <p className="text-xs text-zinc-500">
                    {folder ? LABELS.folder : formatSize(file.size)} • {formatDate(file.modifiedTime)}
                </p>
            </div>

            <div className="relative">
                <button onClick={onToggleMenu} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                    <MoreVertical size={18} />
                </button>
                {showMenu && <DropdownMenu file={file} onRename={onRename} onDelete={onDelete} onClose={onToggleMenu} />}
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
    const { icon: Icon, color, bg } = getFileIcon(file);

    return (
        <div
            className="file-card group animate-slide-up opacity-0"
            style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={cn(
                    "file-icon bg-gradient-to-br",
                    bg
                )}>
                    {file.thumbnailLink && !folder ? (
                        <img src={file.thumbnailLink} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                        <Icon size={24} className={color} />
                    )}
                </div>
                <div className="relative">
                    <button
                        onClick={onToggleMenu}
                        className="p-1.5 text-zinc-600 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <MoreVertical size={16} />
                    </button>
                    {showMenu && <DropdownMenu file={file} onRename={onRename} onDelete={onDelete} onClose={onToggleMenu} />}
                </div>
            </div>
            <div className="cursor-pointer" onClick={onClick}>
                <p className="font-medium text-white text-sm truncate mb-1 group-hover:text-indigo-300 transition-colors">
                    {file.name}
                </p>
                <p className="text-xs text-zinc-500">
                    {folder ? LABELS.folder : formatSize(file.size)} • {formatDate(file.modifiedTime)}
                </p>
            </div>
        </div>
    );
}

// Dropdown Menu
function DropdownMenu({ file, onRename, onDelete, onClose }: { file: DriveFile; onRename: () => void; onDelete: () => void; onClose: () => void }) {
    return (
        <>
            <div className="fixed inset-0 z-10" onClick={onClose} />
            <div className="absolute right-0 top-10 w-48 bg-zinc-900 border border-zinc-700/50 rounded-xl py-1.5 z-20 shadow-xl animate-fade-in">
                <button
                    onClick={onRename}
                    className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-zinc-800/50 flex items-center gap-3 transition-colors"
                >
                    <Edit3 size={16} className="text-zinc-500" />
                    {BUTTONS.rename}
                </button>
                {file.webContentLink && (
                    <a
                        href={file.webContentLink}
                        className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-zinc-800/50 flex items-center gap-3 transition-colors"
                    >
                        <Download size={16} className="text-zinc-500" />
                        {BUTTONS.download}
                    </a>
                )}
                <div className="my-1 border-t border-zinc-800" />
                <button
                    onClick={onDelete}
                    className="w-full px-4 py-2.5 text-left text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-3 transition-colors"
                >
                    <Trash2 size={16} />
                    {BUTTONS.delete}
                </button>
            </div>
        </>
    );
}
