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
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col min-h-[500px]">
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
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">{LABELS.recentFiles}</h3>
            <button
                onClick={onRefresh}
                className="p-2 text-slate-400 hover:text-primary transition-colors"
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
        <div className="space-y-4 flex-1">
            {files.slice(0, 8).map(file => (
                <FileRow
                    key={file.id}
                    file={file}
                    showMenu={activeMenu === file.id}
                    onToggleMenu={() => setActiveMenu(activeMenu === file.id ? null : file.id)}
                    onRename={() => { onRename(file); setActiveMenu(null); }}
                    onDelete={() => { onDelete(file); setActiveMenu(null); }}
                />
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <File size={48} strokeWidth={1} />
            <p className="text-sm font-medium">{LABELS.folder === 'โฟลเดอร์' ? 'ยังไม่มีไฟล์' : 'No files'}</p>
        </div>
    );
}

interface FileRowProps {
    file: DriveFile;
    showMenu: boolean;
    onToggleMenu: () => void;
    onRename: () => void;
    onDelete: () => void;
}

function FileRow({ file, showMenu, onToggleMenu, onRename, onDelete }: FileRowProps) {
    return (
        <div className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
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
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
            {file.thumbnailLink ? (
                <img src={file.thumbnailLink} alt="" className="w-full h-full object-cover" />
            ) : (
                <File size={20} />
            )}
        </div>
    );
}

function FileInfo({ file }: { file: DriveFile }) {
    return (
        <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 text-sm truncate">{file.name}</p>
            <p className="text-xs text-slate-400">{formatDate(file.modifiedTime)}</p>
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
            <button onClick={onToggleMenu} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                <MoreHorizontal size={18} />
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
    );
}
