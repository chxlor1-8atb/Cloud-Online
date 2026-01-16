'use client';

import { useState, useEffect } from 'react';
import { MODAL_TITLES, BUTTONS, LABELS } from '@/lib/constants';

interface RenameModalProps {
    currentName: string;
    onSubmit: (newName: string) => void;
    onCancel: () => void;
}

export function RenameModal({ currentName, onSubmit, onCancel }: RenameModalProps) {
    const [newName, setNewName] = useState(currentName);

    useEffect(() => {
        setNewName(currentName);
    }, [currentName]);

    const handleSubmit = () => {
        if (newName.trim()) {
            onSubmit(newName.trim());
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
                <h3 className="text-2xl font-bold text-slate-800 mb-6">{MODAL_TITLES.rename}</h3>
                <div className="space-y-4 mb-8">
                    <label className="text-sm font-bold text-slate-500">{LABELS.newName}</label>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold"
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
                        disabled={!newName.trim()}
                        className="flex-1 py-4 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {BUTTONS.save}
                    </button>
                </div>
            </div>
        </div>
    );
}
