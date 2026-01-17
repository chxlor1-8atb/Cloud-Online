import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/users';
import { cookies } from 'next/headers';

// Helper to check if user is admin
async function isAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get('auth-session');
    if (!session) return false;

    try {
        const sessionData = JSON.parse(Buffer.from(session.value, 'base64').toString());
        // For now, check if email matches admin (first user or specific email)
        // In production, check role from database
        const { getAllUsers } = await import('@/lib/users');
        const users = getAllUsers();
        const user = users.find(u => u.email === sessionData.email);
        return user?.role === 'admin';
    } catch {
        return false;
    }
}

// GET /api/admin/users - Get all users
export async function GET(req: NextRequest) {
    // Check admin permission
    if (!await isAdmin()) {
        return NextResponse.json(
            { error: 'ไม่มีสิทธิ์เข้าถึง' },
            { status: 403 }
        );
    }

    try {
        const users = getAllUsers();

        // Return users with formatted data
        const formattedUsers = users.map(user => ({
            ...user,
            storageUsedGB: (user.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(2),
            storagePercentage: user.storageQuotaGB > 0
                ? Math.min(100, (user.storageUsedBytes / (user.storageQuotaGB * 1024 * 1024 * 1024)) * 100).toFixed(1)
                : 0,
        }));

        return NextResponse.json({ users: formattedUsers });
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { error: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้' },
            { status: 500 }
        );
    }
}
