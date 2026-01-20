'use client';

import { File, MoreVertical, RefreshCw, Edit3, Download, Trash2, Clock } from 'lucide-react';
import { useState } from 'react';
import type { DriveFile } from '@/lib/types';
import { formatDate, cn } from '@/lib/utils';
import { LABELS, BUTTONS } from '@/lib/constants';

interface RecentFilesProps {
    files: DriveFile[];
    loading: boolean;
    onRefresh: () => void;
    onRename: (file: DriveFile) => void;
    onDelete: (file: DriveFile) => void;
}

export function RecentFiles({ files, loading, onRefresh, onRename, onDelete }: RecentFilesProps) {
    return (
        <div className="glass-card-static p-5 flex flex-col h-full animate-slide-up">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <Clock size={18} className="text-indigo-400" />
                    <h3 className="font-semibold text-white">{LABELS.recentFiles}</h3>
                </div>
                <button
                    onClick={onRefresh}
                    className="btn-icon btn-ghost"
                >
                    <RefreshCw size={16} className={cn(loading && "animate-spin")} />
                </button>
            </div>

            <RecentFilesList files={files} onRename={onRename} onDelete={onDelete} />
        </div>
    );
}

interface RecentFilesListProps {
    files: DriveFile[];
    onRename: (file: DriveFile) => void;
    onDelete: (file: DriveFile) => void;
}

function RecentFilesList({ files, onRename, onDelete }: RecentFilesListProps) {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    if (files.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 space-y-3 py-8">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center">
                    <File size={28} className="text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-500">ยังไม่มีไฟล์ล่าสุด</p>
            </div>
        );
    }

    return (
        <div className="space-y-1 flex-1 overflow-y-auto">
            {files.slice(0, 8).map((file, index) => (
                <FileRow
                    key={file.id}
                    file={file}
                    showMenu={activeMenu === file.id}
                    onToggleMenu={() => setActiveMenu(activeMenu === file.id ? null : file.id)}
                    onRename={() => { onRename(file); setActiveMenu(null); }}
                    onDelete={() => { onDelete(file); setActiveMenu(null); }}
                    delay={index * 0.04}
                />
            ))}
        </div>
    );
}

interface FileRowProps {
    file: DriveFile;
    showMenu: boolean;
    onToggleMenu: () => void;
    onRename: () => void;
    onDelete: () => void;
    delay: number;
}

function FileRow({ file, showMenu, onToggleMenu, onRename, onDelete, delay }: FileRowProps) {
    return (
        <div
            className="flex items-center gap-3 p-2.5 hover:bg-zinc-800/30 rounded-xl transition-all duration-200 group animate-slide-in opacity-0"
            style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
        >
            {/* Thumbnail */}
            <div className="w-10 h-10 rounded-xl bg-zinc-800/50 flex items-center justify-center overflow-hidden shrink-0 border border-zinc-700/30">
                {file.thumbnailLink ? (
                    <img src={file.thumbnailLink} alt="" className="w-full h-full object-cover" />
                ) : (
                    <File size={18} className="text-zinc-500" />
                )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
                    {file.name}
                </p>
                <p className="text-xs text-zinc-500">{formatDate(file.modifiedTime)}</p>
            </div>

            {/* Actions Menu */}
            <div className="relative">
                <button
                    onClick={onToggleMenu}
                    className="p-1.5 text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    <MoreVertical size={16} />
                </button>

                {showMenu && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={onToggleMenu} />
                        <div className="absolute right-0 top-9 w-44 bg-zinc-900 border border-zinc-700/50 rounded-xl py-1.5 z-20 shadow-xl animate-fade-in">
                            <button
                                onClick={onRename}
                                className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800/50 flex items-center gap-3 transition-colors"
                            >
                                <Edit3 size={14} className="text-zinc-500" />
                                {BUTTONS.rename}
                            </button>
                            {file.webContentLink && (
                                <a
                                    href={file.webContentLink}
                                    className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800/50 flex items-center gap-3 transition-colors"
                                >
                                    <Download size={14} className="text-zinc-500" />
                                    {BUTTONS.download}
                                </a>
                            )}
                            <div className="my-1 border-t border-zinc-800" />
                            <button
                                onClick={onDelete}
                                className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-3 transition-colors"
                            >
                                <Trash2 size={14} />
                                {BUTTONS.delete}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
