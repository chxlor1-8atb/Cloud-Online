'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users, Search, Edit2, Trash2, Shield, User as UserIcon,
    HardDrive, AlertCircle, X, ChevronLeft, Save
} from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    storageQuotaGB: number;
    storageUsedBytes: number;
    storageUsedGB: string;
    storagePercentage: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.status === 403) {
                router.push('/');
                return;
            }
            const data = await res.json();
            if (res.ok) {
                setUsers(data.users);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('ไม่สามารถโหลดข้อมูลได้');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteUser = async (user: User) => {
        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(users.filter(u => u.id !== user.id));
                setDeleteConfirm(null);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('ไม่สามารถลบผู้ใช้ได้');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#20B2C4] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/')}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#1B4D7A] to-[#20B2C4] rounded-xl flex items-center justify-center">
                                <Users size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-800">จัดการผู้ใช้งาน</h1>
                                <p className="text-sm text-slate-500">{users.length} ผู้ใช้งานทั้งหมด</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="ค้นหาด้วยชื่อหรืออีเมล..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#20B2C4]/20 focus:border-[#20B2C4] transition-all"
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-600">
                        <AlertCircle size={20} />
                        {error}
                        <button onClick={() => setError('')} className="ml-auto">
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Users Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">ผู้ใช้</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">บทบาท</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">พื้นที่จัดเก็บ</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">วันที่สมัคร</th>
                                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">การดำเนินการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'admin'
                                                        ? 'bg-amber-100 text-amber-600'
                                                        : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {user.role === 'admin' ? <Shield size={18} /> : <UserIcon size={18} />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{user.name}</p>
                                                    <p className="text-sm text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {user.role === 'admin' ? 'แอดมิน' : 'ผู้ใช้'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <HardDrive size={14} className="text-slate-400" />
                                                    <span className="text-slate-600">
                                                        {user.storageUsedGB} / {user.storageQuotaGB} GB
                                                    </span>
                                                </div>
                                                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${parseFloat(user.storagePercentage) > 90
                                                                ? 'bg-rose-500'
                                                                : parseFloat(user.storagePercentage) > 70
                                                                    ? 'bg-amber-500'
                                                                    : 'bg-[#20B2C4]'
                                                            }`}
                                                        style={{ width: `${user.storagePercentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(user.createdAt).toLocaleDateString('th-TH', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingUser(user)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-[#20B2C4]"
                                                    title="แก้ไข"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(user)}
                                                    className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-slate-600 hover:text-rose-600"
                                                    title="ลบ"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="py-12 text-center text-slate-500">
                            <Users size={48} className="mx-auto mb-4 opacity-30" />
                            <p>ไม่พบผู้ใช้งาน</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Edit User Modal */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={(updatedUser) => {
                        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
                        setEditingUser(null);
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">ยืนยันการลบ</h3>
                        <p className="text-slate-600 mb-6">
                            คุณต้องการลบผู้ใช้ <span className="font-semibold">{deleteConfirm.name}</span> ({deleteConfirm.email}) หรือไม่?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={() => handleDeleteUser(deleteConfirm)}
                                className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors"
                            >
                                ลบผู้ใช้
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Edit User Modal Component
function EditUserModal({
    user,
    onClose,
    onSave
}: {
    user: User;
    onClose: () => void;
    onSave: (user: User) => void;
}) {
    const [name, setName] = useState(user.name);
    const [role, setRole] = useState(user.role);
    const [storageQuotaGB, setStorageQuotaGB] = useState(user.storageQuotaGB.toString());
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setSaving(true);
        setError('');

        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    role,
                    storageQuotaGB: parseFloat(storageQuotaGB),
                }),
            });

            const data = await res.json();
            if (res.ok) {
                onSave({
                    ...user,
                    ...data.user,
                    storageUsedGB: (data.user.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(2),
                    storagePercentage: data.user.storageQuotaGB > 0
                        ? Math.min(100, (data.user.storageUsedBytes / (data.user.storageQuotaGB * 1024 * 1024 * 1024)) * 100).toFixed(1)
                        : '0',
                });
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('ไม่สามารถบันทึกได้');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">แก้ไขผู้ใช้งาน</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">ชื่อ</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#20B2C4]/20 focus:border-[#20B2C4]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">อีเมล</label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">บทบาท</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setRole('user')}
                                className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${role === 'user'
                                        ? 'border-[#20B2C4] bg-[#20B2C4]/10 text-[#20B2C4]'
                                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <UserIcon size={18} className="inline mr-2" />
                                ผู้ใช้
                            </button>
                            <button
                                onClick={() => setRole('admin')}
                                className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${role === 'admin'
                                        ? 'border-amber-500 bg-amber-50 text-amber-600'
                                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <Shield size={18} className="inline mr-2" />
                                แอดมิน
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            พื้นที่จัดเก็บ (GB)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={storageQuotaGB}
                                onChange={(e) => setStorageQuotaGB(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#20B2C4]/20 focus:border-[#20B2C4]"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">GB</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                            ใช้ไปแล้ว: {user.storageUsedGB} GB ({user.storagePercentage}%)
                        </p>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-200 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-3 bg-[#20B2C4] text-white rounded-xl font-medium hover:bg-[#1a9aaa] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                    </button>
                </div>
            </div>
        </div>
    );
}
