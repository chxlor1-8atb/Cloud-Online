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

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 glass rounded-xl hover:bg-white/10 transition-colors"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X size={22} className="text-white" /> : <Menu size={22} className="text-white" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm animate-fade-in"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <aside className="w-72 glass hidden lg:flex flex-col p-6 shrink-0 border-r border-white/5">
                <Logo />
                <Navigation activeTab={activeTab} onTabChange={handleTabClick} />

                {isAdmin && (
                    <div className="pt-4 border-t border-white/10 mt-4">
                        <button
                            onClick={() => router.push('/admin/users')}
                            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-all font-medium group"
                        >
                            <Users size={20} className="group-hover:scale-110 transition-transform" />
                            <span>จัดการผู้ใช้งาน</span>
                        </button>
                    </div>
                )}

                <div className="pt-4 border-t border-white/10 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-medium group"
                    >
                        <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                        <span>ออกจากระบบ</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 h-full w-72 glass z-50 flex flex-col p-6 pt-16 transition-all duration-300 ease-out lg:hidden",
                    isMobileOpen
                        ? "translate-x-0 opacity-100 visible"
                        : "-translate-x-full opacity-0 invisible"
                )}
            >
                <Logo />
                <Navigation activeTab={activeTab} onTabChange={handleTabClick} />

                {isAdmin && (
                    <div className="pt-4 border-t border-white/10 mt-4">
                        <button
                            onClick={() => {
                                router.push('/admin/users');
                                setIsMobileOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-all font-medium"
                        >
                            <Users size={20} />
                            <span>จัดการผู้ใช้งาน</span>
                        </button>
                    </div>
                )}

                <div className="pt-4 border-t border-white/10 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-medium"
                    >
                        <LogOut size={20} />
                        <span>ออกจากระบบ</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass z-40 safe-area-bottom border-t border-white/5">
                <div className="grid grid-cols-5 h-16">
                    {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => onTabChange(id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-0.5 transition-all duration-300",
                                activeTab === id
                                    ? "text-primary"
                                    : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <div className={cn(
                                "transition-transform duration-300",
                                activeTab === id && "scale-110 -translate-y-0.5"
                            )}>
                                <Icon size={22} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-medium transition-all",
                                activeTab === id && "text-primary"
                            )}>{label}</span>
                            {activeTab === id && (
                                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary animate-pulse-glow" />
                            )}
                        </button>
                    ))}
                </div>
            </nav>
        </>
    );
}

function Logo() {
    return (
        <div className="flex items-center gap-3 mb-8 animate-slide-in">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 animate-float">
                <Cloud className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">CloudSync</span>
        </div>
    );
}

interface NavigationProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

function Navigation({ activeTab, onTabChange }: NavigationProps) {
    return (
        <nav className="space-y-1 flex-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }, index) => (
                <button
                    key={id}
                    onClick={() => onTabChange(id)}
                    className={cn(
                        "sidebar-item w-full animate-slide-in",
                        activeTab === id && "active"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    <Icon size={20} />
                    <span className="font-medium">{label}</span>
                </button>
            ))}
        </nav>
    );
}
