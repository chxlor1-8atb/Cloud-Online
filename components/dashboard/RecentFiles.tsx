'use client';

import { File, MoreHorizontal, RefreshCw, Edit3, Download, Trash2 } from 'lucide-react';
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
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col min-h-[360px] animate-slide-up">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">{LABELS.recentFiles}</h3>
                <button
                    onClick={onRefresh}
                    className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-md hover:bg-zinc-800"
                >
                    <RefreshCw size={14} className={cn(loading && "animate-spin")} />
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
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 space-y-2">
                <File size={24} />
                <p className="text-sm">ยังไม่มีไฟล์</p>
            </div>
        );
    }

    return (
        <div className="space-y-1 flex-1">
            {files.slice(0, 6).map((file, index) => (
                <FileRow
                    key={file.id}
                    file={file}
                    showMenu={activeMenu === file.id}
                    onToggleMenu={() => setActiveMenu(activeMenu === file.id ? null : file.id)}
                    onRename={() => { onRename(file); setActiveMenu(null); }}
                    onDelete={() => { onDelete(file); setActiveMenu(null); }}
                    delay={index * 0.03}
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
            className="flex items-center gap-3 p-2 hover:bg-zinc-800/50 rounded-lg transition-colors animate-slide-in opacity-0"
            style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
        >
            <div className="w-8 h-8 bg-zinc-800 rounded-md flex items-center justify-center text-zinc-500 overflow-hidden shrink-0">
                {file.thumbnailLink ? (
                    <img src={file.thumbnailLink} alt="" className="w-full h-full object-cover" />
                ) : (
                    <File size={14} />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{file.name}</p>
                <p className="text-xs text-zinc-500">{formatDate(file.modifiedTime)}</p>
            </div>
            <div className="relative">
                <button onClick={onToggleMenu} className="p-1 text-zinc-500 hover:text-white">
                    <MoreHorizontal size={14} />
                </button>
                {showMenu && (
                    <div className="absolute right-0 top-7 w-36 bg-zinc-900 border border-zinc-800 rounded-lg py-1 z-20 animate-fade-in">
                        <button
                            onClick={onRename}
                            className="w-full px-3 py-1.5 text-left text-xs text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
                        >
                            <Edit3 size={12} /> {BUTTONS.rename}
                        </button>
                        {file.webContentLink && (
                            <a
                                href={file.webContentLink}
                                className="w-full px-3 py-1.5 text-left text-xs text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
                            >
                                <Download size={12} /> {BUTTONS.download}
                            </a>
                        )}
                        <button
                            onClick={onDelete}
                            className="w-full px-3 py-1.5 text-left text-xs text-red-400 hover:bg-zinc-800 flex items-center gap-2"
                        >
                            <Trash2 size={12} /> {BUTTONS.delete}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
