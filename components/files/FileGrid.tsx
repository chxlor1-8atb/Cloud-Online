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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map(file => (
                <FileCard
                    key={file.id}
                    file={file}
                    showMenu={activeMenu === file.id}
                    onToggleMenu={() => setActiveMenu(activeMenu === file.id ? null : file.id)}
                    onClick={() => onFileClick(file)}
                    onRename={() => { onRename(file); setActiveMenu(null); }}
                    onDelete={() => { onDelete(file); setActiveMenu(null); }}
                />
            ))}
        </div>
    );
}

function LoadingState() {
    return (
        <div className="h-[400px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );
}

function EmptyState() {
    return (
        <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 space-y-4 premium-card rounded-2xl">
            <Folder size={64} strokeWidth={1} />
            <div className="text-center">
                <p className="text-lg font-bold text-slate-800">{MESSAGES.noItemsFound}</p>
                <p className="text-sm">{MESSAGES.noItemsHint}</p>
            </div>
        </div>
    );
}

interface FileCardProps {
    file: DriveFile;
    showMenu: boolean;
    onToggleMenu: () => void;
    onClick: () => void;
    onRename: () => void;
    onDelete: () => void;
}

function FileCard({ file, showMenu, onToggleMenu, onClick, onRename, onDelete }: FileCardProps) {
    const folder = isFolder(file);

    return (
        <div className="premium-card rounded-3xl p-6 group relative">
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
                <h4 className="font-bold text-slate-800 truncate mb-1" title={file.name}>
                    {file.name}
                </h4>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                        {folder ? LABELS.folder : formatSize(file.size)}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">
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
    const iconClass = cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm",
        isFolder ? "bg-amber-100 text-amber-500" : "bg-slate-100 text-slate-500 overflow-hidden"
    );

    return (
        <div className={iconClass}>
            {isFolder ? (
                <Folder size={32} />
            ) : file.thumbnailLink ? (
                <img src={file.thumbnailLink} alt="" className="w-full h-full object-cover" />
            ) : (
                <File size={32} />
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
            <button onClick={onToggleMenu} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                <MoreHorizontal size={20} />
            </button>
            {showMenu && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-20 animate-fade-in">
                    <button
                        onClick={onRename}
                        className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                    >
                        <Edit3 size={16} className="text-primary" /> {BUTTONS.rename}
                    </button>
                    {file.webContentLink && (
                        <a
                            href={file.webContentLink}
                            className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                        >
                            <Download size={16} className="text-accent-purple" /> {BUTTONS.download}
                        </a>
                    )}
                    <button
                        onClick={onDelete}
                        className="w-full px-4 py-2 text-left text-sm text-rose-500 hover:bg-rose-50 flex items-center gap-3"
                    >
                        <Trash2 size={16} /> {BUTTONS.delete}
                    </button>
                </div>
            )}
        </div>
    );
}
