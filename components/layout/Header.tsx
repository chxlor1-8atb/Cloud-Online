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
        <header className="px-4 lg:px-6 py-4 flex items-center justify-between border-b border-zinc-800">
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
        <div className="flex-1 max-w-md relative mx-2 lg:mx-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
                type="text"
                placeholder={MESSAGES.searchPlaceholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
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
        <label className="btn-primary cursor-pointer flex items-center gap-2 text-sm">
            <Upload size={16} />
            <span className="hidden sm:inline">{BUTTONS.upload}</span>
            <input type="file" className="hidden" onChange={handleChange} />
        </label>
    );
}
