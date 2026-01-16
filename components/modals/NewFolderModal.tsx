'use client';

import { useState } from 'react';
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">{MODAL_TITLES.newFolder}</h3>
                <div className="space-y-4 mb-8">
                    <label className="text-sm font-semibold text-slate-500">{LABELS.folderName}</label>
                    <input
                        type="text"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={MESSAGES.folderNamePlaceholder}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                        autoFocus
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        {BUTTONS.cancel}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!folderName.trim()}
                        className="flex-1 py-4 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {BUTTONS.create}
                    </button>
                </div>
            </div>
        </div>
    );
}
