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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <div className="glass rounded-2xl p-6 lg:p-8 w-full max-w-md shadow-2xl animate-scale-in border border-white/10 text-center">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-6">{MODAL_TITLES.upload}</h3>
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
        <div className="glass-light rounded-xl p-4 flex items-center gap-4 mb-6 overflow-hidden">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                <File size={28} />
            </div>
            <div className="flex-1 min-w-0 text-left">
                <p className="font-bold text-white truncate">{file.name}</p>
                <p className="text-sm text-slate-400">{formatSize(file.size)}</p>
            </div>
            <button onClick={onRemove} className="p-2 text-slate-400 hover:text-white transition-colors">
                <X size={18} />
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
        <div className="flex gap-3">
            <button
                onClick={onCancel}
                className="flex-1 py-3.5 font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
                {BUTTONS.cancel}
            </button>
            <button
                onClick={onConfirm}
                disabled={disabled}
                className="flex-1 py-3.5 gradient-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 hover:shadow-primary/50"
            >
                {confirmLabel}
            </button>
        </div>
    );
}
