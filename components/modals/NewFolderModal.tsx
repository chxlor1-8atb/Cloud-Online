'use client';

import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { MODAL_TITLES, BUTTONS, LABELS, MESSAGES } from '@/lib/constants';

interface NewFolderModalProps {
    onSubmit: (name: string) => void;
    onCancel: () => void;
}

export function NewFolderModal({ onSubmit, onCancel }: NewFolderModalProps) {
    const [folderName, setFolderName] = useState('');

    const handleSubmit = () => {
        if (folderName.trim()) {
            onSubmit(folderName.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[110] flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-sm animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-400/10 rounded-lg flex items-center justify-center">
                        <FolderPlus size={20} className="text-amber-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{MODAL_TITLES.newFolder}</h3>
                </div>

                <div className="mb-6">
                    <label className="text-xs font-medium text-zinc-500 mb-2 block">{LABELS.folderName}</label>
                    <input
                        type="text"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={MESSAGES.folderNamePlaceholder}
                        className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                        autoFocus
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 text-sm font-medium text-zinc-400 hover:text-white border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                        {BUTTONS.cancel}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!folderName.trim()}
                        className="flex-1 py-2.5 text-sm font-medium bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                        {BUTTONS.create}
                    </button>
                </div>
            </div>
        </div>
    );
}
