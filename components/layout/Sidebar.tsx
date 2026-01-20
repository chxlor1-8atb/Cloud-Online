'use client';

import { useState } from 'react';
import { LayoutDashboard, FileText, Image as ImageIcon, Film, MoreHorizontal, Cloud, LogOut, Menu, X, Upload } from 'lucide-react';
import type { TabType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SidebarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    onUploadClick?: () => void;
}

const NAV_ITEMS: { id: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'dashboard', label: 'หน้าแรก', icon: LayoutDashboard },
    { id: 'documents', label: 'เอกสาร', icon: FileText },
    { id: 'images', label: 'รูปภาพ', icon: ImageIcon },
    { id: 'media', label: 'มีเดีย', icon: Film },
    { id: 'others', label: 'อื่นๆ', icon: MoreHorizontal },
];

export function Sidebar({ activeTab, onTabChange, onUploadClick }: SidebarProps) {
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleTabClick = (tab: TabType) => {
        onTabChange(tab);
        setIsMobileOpen(false);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg glow-primary">
                    <Cloud className="w-5 h-5 text-white" />
                </div>
                <div>
                    <span className="text-lg font-bold text-white tracking-tight">CloudSync</span>
                    <p className="text-xs text-zinc-500">คลาวด์ไดรฟ์</p>
                </div>
            </div>

            {/* Upload Button */}
            <div className="px-3 mb-6">
                <button
                    onClick={onUploadClick}
                    className="w-full btn btn-primary py-3 gap-2"
                >
                    <Upload size={18} />
                    <span>อัปโหลดไฟล์</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider px-3 mb-3">เมนูหลัก</p>
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => handleTabClick(id)}
                        className={cn(
                            "sidebar-item w-full",
                            activeTab === id && "active"
                        )}
                    >
                        <Icon size={20} />
                        <span>{label}</span>
                    </button>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="px-3 py-4 border-t border-zinc-800/50">
                <button
                    onClick={handleLogout}
                    className="sidebar-item w-full text-zinc-500 hover:text-red-400"
                >
                    <LogOut size={20} />
                    <span>ออกจากระบบ</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-lg"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <aside className="w-72 sidebar hidden lg:flex flex-col shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 h-full w-72 sidebar z-50 transition-transform duration-300 ease-out lg:hidden",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/50 z-40 safe-area-bottom">
                <div className="grid grid-cols-5 h-16">
                    {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => onTabChange(id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 transition-all duration-200",
                                activeTab === id
                                    ? "text-indigo-400"
                                    : "text-zinc-600 hover:text-zinc-400"
                            )}
                        >
                            <Icon size={22} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </>
    );
}
