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
            {/* Mobile: Simple List View */}
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
                        delay={index * 0.05}
                    />
                ))}
            </div>

            {/* Desktop: Card Grid View */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {files.map((file, index) => (
                    <FileCard
                        key={file.id}
                        file={file}
                        showMenu={activeMenu === file.id}
                        onToggleMenu={() => setActiveMenu(activeMenu === file.id ? null : file.id)}
                        onClick={() => onFileClick(file)}
                        onRename={() => { onRename(file); setActiveMenu(null); }}
                        onDelete={() => { onDelete(file); setActiveMenu(null); }}
                        delay={index * 0.05}
                    />
                ))}
            </div>
        </>
    );
}

function LoadingState() {
    return (
        <div className="h-[200px] lg:h-[400px] flex items-center justify-center">
            <div className="w-10 h-10 lg:w-12 lg:h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );
}

function EmptyState() {
    return (
        <div className="h-[200px] lg:h-[400px] flex flex-col items-center justify-center text-slate-400 space-y-3 lg:space-y-4 glass-light rounded-xl lg:rounded-2xl animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
                <Folder size={32} className="text-amber-400" />
            </div>
            <div className="text-center">
                <p className="text-base lg:text-lg font-bold text-white">{MESSAGES.noItemsFound}</p>
                <p className="text-xs lg:text-sm text-slate-400">{MESSAGES.noItemsHint}</p>
            </div>
        </div>
    );
}

// Mobile: List Item Component
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
            className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-all active:bg-white/10 animate-slide-in"
            style={{ animationDelay: `${delay}s` }}
        >
            {/* Icon */}
            <div
                onClick={onClick}
                className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform hover:scale-105",
                    folder
                        ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400"
                        : "bg-white/5 text-slate-400 overflow-hidden"
                )}
            >
                {folder ? (
                    <Folder size={22} />
                ) : file.thumbnailLink ? (
                    <img src={file.thumbnailLink} alt="" className="w-full h-full object-cover" />
                ) : (
                    <File size={22} />
                )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
                <h4 className="font-medium text-white text-sm truncate">{file.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{folder ? LABELS.folder : formatSize(file.size)}</span>
                    <span>•</span>
                    <span>{formatDate(file.modifiedTime)}</span>
                </div>
            </div>

            {/* Menu Button */}
            <div className="relative">
                <button onClick={onToggleMenu} className="p-2 text-slate-500 hover:text-white transition-colors">
                    <MoreHorizontal size={18} />
                </button>
                {showMenu && (
                    <div className="absolute right-0 top-10 w-44 glass rounded-xl py-1.5 z-20 animate-scale-in border border-white/10">
                        <button
                            onClick={onRename}
                            className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/5 flex items-center gap-2"
                        >
                            <Edit3 size={14} className="text-primary" /> {BUTTONS.rename}
                        </button>
                        {file.webContentLink && (
                            <a
                                href={file.webContentLink}
                                className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/5 flex items-center gap-2"
                            >
                                <Download size={14} className="text-purple-400" /> {BUTTONS.download}
                            </a>
                        )}
                        <button
                            onClick={onDelete}
                            className="w-full px-3 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                        >
                            <Trash2 size={14} /> {BUTTONS.delete}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Desktop: Card Component
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
            className="premium-card rounded-2xl p-5 group relative animate-scale-in"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="flex items-start justify-between mb-4">
                <FileIcon file={file} isFolder={folder} />
                <FileMenu
                    file={file}
                    showMenu={showMenu}
                    onToggleMenu={onToggleMenu}
                    onRename={onRename}
                    onDelete={onDelete}
                />
            </div>
            <div className="cursor-pointer" onClick={onClick}>
                <h4 className="font-bold text-white truncate mb-1" title={file.name}>
                    {file.name}
                </h4>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                        {folder ? LABELS.folder : formatSize(file.size)}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                        {formatDate(file.modifiedTime)}
                    </span>
                </div>
            </div>
        </div>
    );
}

interface FileIconProps {
    file: DriveFile;
    isFolder: boolean;
}

function FileIcon({ file, isFolder }: FileIconProps) {
    return (
        <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
            isFolder
                ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 shadow-lg shadow-amber-500/10"
                : "bg-white/5 text-slate-400 overflow-hidden"
        )}>
            {isFolder ? (
                <Folder size={26} />
            ) : file.thumbnailLink ? (
                <img src={file.thumbnailLink} alt="" className="w-full h-full object-cover" />
            ) : (
                <File size={26} />
            )}
        </div>
    );
}

interface FileMenuProps {
    file: DriveFile;
    showMenu: boolean;
    onToggleMenu: () => void;
    onRename: () => void;
    onDelete: () => void;
}

function FileMenu({ file, showMenu, onToggleMenu, onRename, onDelete }: FileMenuProps) {
    return (
        <div className="relative">
            <button onClick={onToggleMenu} className="p-2 text-slate-500 hover:text-white transition-colors">
                <MoreHorizontal size={18} />
            </button>
            {showMenu && (
                <div className="absolute right-0 top-10 w-48 glass rounded-xl py-2 z-20 animate-scale-in border border-white/10">
                    <button
                        onClick={onRename}
                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-white/5 flex items-center gap-3"
                    >
                        <Edit3 size={16} className="text-primary" /> {BUTTONS.rename}
                    </button>
                    {file.webContentLink && (
                        <a
                            href={file.webContentLink}
                            className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-white/5 flex items-center gap-3"
                        >
                            <Download size={16} className="text-purple-400" /> {BUTTONS.download}
                        </a>
                    )}
                    <button
                        onClick={onDelete}
                        className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-3"
                    >
                        <Trash2 size={16} /> {BUTTONS.delete}
                    </button>
                </div>
            )}
        </div>
    );
}
