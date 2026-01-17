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
        <div className="fixed inset-0 bg-black/80 z-[110] flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-sm animate-fade-in">
                <h3 className="text-lg font-semibold text-white mb-4">{MODAL_TITLES.upload}</h3>

                <div className="bg-zinc-800 rounded-lg p-4 flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-zinc-700 rounded-lg flex items-center justify-center">
                        <File size={20} className="text-zinc-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{file.name}</p>
                        <p className="text-xs text-zinc-500">{formatSize(file.size)}</p>
                    </div>
                    <button onClick={onCancel} className="p-1 text-zinc-500 hover:text-white">
                        <X size={16} />
                    </button>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 text-sm font-medium text-zinc-400 hover:text-white border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                        {BUTTONS.cancel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={uploading}
                        className="flex-1 py-2.5 text-sm font-medium bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                        {uploading ? 'กำลังอัปโหลด...' : BUTTONS.confirm}
                    </button>
                </div>
            </div>
        </div>
    );
}
