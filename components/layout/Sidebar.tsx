'use client';

import { LayoutDashboard, FileText, Image as ImageIcon, Video, MoreHorizontal, Cloud } from 'lucide-react';
import type { TabType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const NAV_ITEMS: { id: TabType; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'dashboard', label: 'หน้าแรก', icon: LayoutDashboard },
    { id: 'documents', label: 'เอกสาร', icon: FileText },
    { id: 'images', label: 'รูปภาพ', icon: ImageIcon },
    { id: 'media', label: 'มีเดีย', icon: Video },
    { id: 'others', label: 'อื่นๆ', icon: MoreHorizontal },
];

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col p-8 shrink-0">
            <Logo />
            <Navigation activeTab={activeTab} onTabChange={onTabChange} />

            <div className="pt-8 border-t border-slate-100 mt-auto">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-semibold group"
                >
                    <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                    <span>ออกจากระบบ</span>
                </button>
            </div>
        </aside>
    );
}

function Logo() {
    return (
        <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                <Cloud className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">CloudSync</span>
        </div>
    );
}

interface NavigationProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

function Navigation({ activeTab, onTabChange }: NavigationProps) {
    return (
        <nav className="space-y-2 flex-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <button
                    key={id}
                    onClick={() => onTabChange(id)}
                    className={cn("sidebar-item w-full", activeTab === id && "active")}
                >
                    <Icon size={20} />
                    <span className="font-semibold">{label}</span>
                </button>
            ))}
        </nav>
    );
}
