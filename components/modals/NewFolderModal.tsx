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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <div className="glass rounded-2xl p-6 lg:p-8 w-full max-w-md shadow-2xl animate-scale-in border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                        <FolderPlus size={24} className="text-amber-400" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-white">{MODAL_TITLES.newFolder}</h3>
                </div>

                <div className="space-y-2 mb-6">
                    <label className="text-sm font-medium text-slate-400">{LABELS.folderName}</label>
                    <input
                        type="text"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={MESSAGES.folderNamePlaceholder}
                        className="w-full px-4 py-3.5 glass-light rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
                        autoFocus
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3.5 font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        {BUTTONS.cancel}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!folderName.trim()}
                        className="flex-1 py-3.5 gradient-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 hover:shadow-primary/50"
                    >
                        {BUTTONS.create}
                    </button>
                </div>
            </div>
        </div>
    );
}
