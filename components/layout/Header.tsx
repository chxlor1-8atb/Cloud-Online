'use client';

import { Search, Upload } from 'lucide-react';
import { MESSAGES, BUTTONS } from '@/lib/constants';

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onFileSelect: (file: File) => void;
}

export function Header({ searchQuery, onSearchChange, onFileSelect }: HeaderProps) {
    return (
        <header className="px-8 py-6 flex items-center justify-between sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md z-10">
            <SearchBar value={searchQuery} onChange={onSearchChange} />
            <UploadButton onFileSelect={onFileSelect} />
        </header>
    );
}

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
                type="text"
                placeholder={MESSAGES.searchPlaceholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-full py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
        </div>
    );
}

interface UploadButtonProps {
    onFileSelect: (file: File) => void;
}

function UploadButton({ onFileSelect }: UploadButtonProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <label className="upload-btn cursor-pointer">
                <Upload size={18} />
                <span>{BUTTONS.upload}</span>
                <input type="file" className="hidden" onChange={handleChange} />
            </label>
        </div>
    );
}
