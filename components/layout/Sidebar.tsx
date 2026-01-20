'use client';

import { useState } from 'react';
import { LayoutDashboard, FileText, Image as ImageIcon, Video, MoreHorizontal, Cloud, Users, LogOut, Menu, X } from 'lucide-react';
import type { TabType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface SidebarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const NAV_ITEMS: { id: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'dashboard', label: 'หน้าแรก', icon: LayoutDashboard },
    { id: 'documents', label: 'เอกสาร', icon: FileText },
    { id: 'images', label: 'รูปภาพ', icon: ImageIcon },
    { id: 'media', label: 'มีเดีย', icon: Video },
    { id: 'others', label: 'อื่นๆ', icon: MoreHorizontal },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await fetch('/api/admin/users');
                setIsAdmin(res.ok);
            } catch {
                setIsAdmin(false);
            }
        };
        checkAdmin();
    }, []);

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
        <>
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 mb-8">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Cloud className="w-5 h-5 text-black" />
                </div>
                <span className="text-lg font-bold text-white">CloudSync</span>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 flex-1">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => handleTabClick(id)}
                        className={cn(
                            "sidebar-item w-full",
                            activeTab === id && "active"
                        )}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </button>
                ))}
            </nav>

            {/* Admin & Logout */}
            <div className="pt-4 border-t border-zinc-800 space-y-1">
                {isAdmin && (
                    <button
                        onClick={() => {
                            router.push('/admin/users');
                            setIsMobileOpen(false);
                        }}
                        className="sidebar-item w-full"
                    >
                        <Users size={18} />
                        <span>จัดการผู้ใช้งาน</span>
                    </button>
                )}
                <button
                    onClick={handleLogout}
                    className="sidebar-item w-full text-zinc-500 hover:text-red-400"
                >
                    <LogOut size={18} />
                    <span>ออกจากระบบ</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-lg safe-area-top safe-area-left mt-2 ml-2"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/80 z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <aside className="w-64 bg-black border-r border-zinc-800 hidden lg:flex flex-col p-4 shrink-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 h-full w-64 bg-black border-r border-zinc-800 z-50 flex flex-col p-4 pt-16 transition-transform duration-200 lg:hidden safe-area-left",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 z-40 safe-area-bottom">
                <div className="grid grid-cols-5 h-14">
                    {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => onTabChange(id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-0.5 transition-colors",
                                activeTab === id ? "text-white" : "text-zinc-600"
                            )}
                        >
                            <Icon size={20} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </>
    );
}
