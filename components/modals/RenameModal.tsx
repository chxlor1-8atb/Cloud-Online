'use client';

import { useState, useEffect } from 'react';
import { Edit3 } from 'lucide-react';
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <div className="glass rounded-2xl p-6 lg:p-8 w-full max-w-md shadow-2xl animate-scale-in border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                        <Edit3 size={24} className="text-primary" />
                    </div>
                    <h3 className="text-xl lg:text-2xl font-bold text-white">{MODAL_TITLES.rename}</h3>
                </div>

                <div className="space-y-2 mb-6">
                    <label className="text-sm font-medium text-slate-400">{LABELS.newName}</label>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={handleKeyDown}
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
                        disabled={!newName.trim()}
                        className="flex-1 py-3.5 gradient-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 hover:shadow-primary/50"
                    >
                        {BUTTONS.save}
                    </button>
                </div>
            </div>
        </div>
    );
}
