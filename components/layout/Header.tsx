'use client';

import { Search, Bell, User } from 'lucide-react';
import { MESSAGES } from '@/lib/constants';

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onFileSelect: (file: File) => void;
}

export function Header({ searchQuery, onSearchChange, onFileSelect }: HeaderProps) {
    return (
        <header className="px-4 lg:px-8 py-4 flex items-center justify-between gap-4 safe-area-top">
            {/* Spacer for mobile menu button */}
            <div className="w-10 lg:hidden" />

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
                <div className="search-input">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder={MESSAGES.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                {/* Notifications */}
                <button className="btn-icon btn-ghost relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
                </button>

                {/* User Avatar */}
                <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg hover:scale-105 transition-transform">
                    <User size={18} />
                </button>
            </div>
        </header>
    );
}
