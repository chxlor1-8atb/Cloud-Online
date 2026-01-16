'use client';

import { File, X } from 'lucide-react';
import { formatSize } from '@/lib/utils';
import { MODAL_TITLES, BUTTONS } from '@/lib/constants';

interface UploadModalProps {
    file: File;
    uploading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function UploadModal({ file, uploading, onConfirm, onCancel }: UploadModalProps) {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in text-center">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">{MODAL_TITLES.upload}</h3>
                <FilePreview file={file} onRemove={onCancel} />
                <ModalActions
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                    confirmLabel={uploading ? 'กำลังอัปโหลด...' : BUTTONS.confirm}
                    disabled={uploading}
                />
            </div>
        </div>
    );
}

interface FilePreviewProps {
    file: File;
    onRemove: () => void;
}

function FilePreview({ file, onRemove }: FilePreviewProps) {
    return (
        <div className="bg-slate-50 rounded-2xl p-6 flex items-center gap-4 border border-slate-100 mb-8 overflow-hidden">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-sm shrink-0">
                <File size={32} />
            </div>
            <div className="flex-1 min-w-0 text-left">
                <p className="font-bold text-slate-800 truncate">{file.name}</p>
                <p className="text-sm text-slate-400">{formatSize(file.size)}</p>
            </div>
            <button onClick={onRemove} className="p-2 text-slate-300 hover:text-slate-600">
                <X size={20} />
            </button>
        </div>
    );
}

interface ModalActionsProps {
    onCancel: () => void;
    onConfirm: () => void;
    confirmLabel: string;
    disabled?: boolean;
}

function ModalActions({ onCancel, onConfirm, confirmLabel, disabled }: ModalActionsProps) {
    return (
        <div className="flex gap-4">
            <button
                onClick={onCancel}
                className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
            >
                {BUTTONS.cancel}
            </button>
            <button
                onClick={onConfirm}
                disabled={disabled}
                className="flex-1 py-4 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
            >
                {confirmLabel}
            </button>
        </div>
    );
}
