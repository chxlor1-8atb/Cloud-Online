'use client';

import { Search, Upload, Menu } from 'lucide-react';
import { MESSAGES, BUTTONS } from '@/lib/constants';

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onFileSelect: (file: File) => void;
}

export function Header({ searchQuery, onSearchChange, onFileSelect }: HeaderProps) {
    return (
        <header className="px-4 lg:px-8 py-4 lg:py-6 flex items-center justify-between sticky top-0 glass z-10">
            {/* Spacer for mobile menu button */}
            <div className="w-10 lg:hidden" />

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
        <div className="flex-1 max-w-xl relative mx-2 lg:mx-0 group">
            <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input
                type="text"
                placeholder={MESSAGES.searchPlaceholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full glass-light rounded-xl py-2.5 lg:py-3.5 pl-10 lg:pl-12 pr-4 lg:pr-6 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
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
            <label className="upload-btn cursor-pointer text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-2.5">
                <Upload size={18} />
                <span className="hidden sm:inline">{BUTTONS.upload}</span>
                <input type="file" className="hidden" onChange={handleChange} />
            </label>
        </div>
    );
}
