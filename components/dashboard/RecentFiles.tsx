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
        <div className="bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col min-h-[400px] animate-slide-up shadow-lg">
            <RecentFilesHeader loading={loading} onRefresh={onRefresh} />
            <RecentFilesList
                files={files}
                onRename={onRename}
                onDelete={onDelete}
            />
        </div>
    );
}

interface RecentFilesHeaderProps {
    loading: boolean;
    onRefresh: () => void;
}

function RecentFilesHeader({ loading, onRefresh }: RecentFilesHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">{LABELS.recentFiles}</h3>
            <button
                onClick={onRefresh}
                className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-white/5"
            >
                <RefreshCw size={18} className={cn(loading && "animate-spin")} />
            </button>
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
        return <EmptyState />;
    }

    return (
        <div className="space-y-2 flex-1">
            {files.slice(0, 6).map((file, index) => (
                <FileRow
                    key={file.id}
                    file={file}
                    showMenu={activeMenu === file.id}
                    onToggleMenu={() => setActiveMenu(activeMenu === file.id ? null : file.id)}
                    onRename={() => { onRename(file); setActiveMenu(null); }}
                    onDelete={() => { onDelete(file); setActiveMenu(null); }}
                    delay={index * 0.05}
                />
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                <File size={24} />
            </div>
            <p className="text-sm font-medium">ยังไม่มีไฟล์</p>
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
            className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all animate-slide-in"
            style={{ animationDelay: `${delay}s` }}
        >
            <FileThumbnail file={file} />
            <FileInfo file={file} />
            <FileActions
                file={file}
                showMenu={showMenu}
                onToggleMenu={onToggleMenu}
                onRename={onRename}
                onDelete={onDelete}
            />
        </div>
    );
}

function FileThumbnail({ file }: { file: DriveFile }) {
    return (
        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden shrink-0 transition-transform group-hover:scale-105">
            {file.thumbnailLink ? (
                <img src={file.thumbnailLink} alt="" className="w-full h-full object-cover" />
            ) : (
                <File size={18} />
            )}
        </div>
    );
}

function FileInfo({ file }: { file: DriveFile }) {
    return (
        <div className="flex-1 min-w-0">
            <p className="font-medium text-white text-sm truncate">{file.name}</p>
            <p className="text-xs text-slate-500">{formatDate(file.modifiedTime)}</p>
        </div>
    );
}

interface FileActionsProps {
    file: DriveFile;
    showMenu: boolean;
    onToggleMenu: () => void;
    onRename: () => void;
    onDelete: () => void;
}

function FileActions({ file, showMenu, onToggleMenu, onRename, onDelete }: FileActionsProps) {
    return (
        <div className="relative">
            <button onClick={onToggleMenu} className="p-2 text-slate-500 hover:text-white transition-colors">
                <MoreHorizontal size={16} />
            </button>
            {showMenu && (
                <ActionMenu
                    file={file}
                    onRename={onRename}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
}

interface ActionMenuProps {
    file: DriveFile;
    onRename: () => void;
    onDelete: () => void;
}

function ActionMenu({ file, onRename, onDelete }: ActionMenuProps) {
    return (
        <div className="absolute right-0 top-10 w-44 glass rounded-xl py-2 z-20 animate-scale-in border border-white/10">
            <button
                onClick={onRename}
                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-white/5 flex items-center gap-3"
            >
                <Edit3 size={14} className="text-primary" /> {BUTTONS.rename}
            </button>
            {file.webContentLink && (
                <a
                    href={file.webContentLink}
                    className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-white/5 flex items-center gap-3"
                >
                    <Download size={14} className="text-purple-400" /> {BUTTONS.download}
                </a>
            )}
            <button
                onClick={onDelete}
                className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-3"
            >
                <Trash2 size={14} /> {BUTTONS.delete}
            </button>
        </div>
    );
}
