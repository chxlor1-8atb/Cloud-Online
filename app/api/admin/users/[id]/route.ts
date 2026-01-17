import { NextRequest, NextResponse } from 'next/server';
import { findUserById, updateUser, deleteUser } from '@/lib/users';
import { cookies } from 'next/headers';

// Helper to check if user is admin
async function isAdmin(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get('auth-session');
    if (!session) return false;

    try {
        const sessionData = JSON.parse(Buffer.from(session.value, 'base64').toString());
        const { getAllUsers } = await import('@/lib/users');
        const users = getAllUsers();
        const user = users.find(u => u.email === sessionData.email);
        return user?.role === 'admin';
    } catch {
        return false;
    }
}

// GET /api/admin/users/[id] - Get single user
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 });
    }

    const { id } = await params;
    const user = findUserById(id);

    if (!user) {
        return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
    }

    return NextResponse.json({ user });
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { name, role, storageQuotaGB } = body;

        // Validate
        if (storageQuotaGB !== undefined && (isNaN(storageQuotaGB) || storageQuotaGB < 0)) {
            return NextResponse.json(
                { error: 'ค่า Storage Quota ไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        const updates: any = {};
        if (name !== undefined) updates.name = name;
        if (role !== undefined && ['admin', 'user'].includes(role)) updates.role = role;
        if (storageQuotaGB !== undefined) updates.storageQuotaGB = parseFloat(storageQuotaGB);

        const updatedUser = updateUser(id, updates);

        if (!updatedUser) {
            return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'อัพเดทข้อมูลสำเร็จ',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { error: 'ไม่สามารถอัพเดทข้อมูลได้' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!await isAdmin()) {
        return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 });
    }

    try {
        const { id } = await params;

        // Prevent deleting yourself
        const cookieStore = await cookies();
        const session = cookieStore.get('auth-session');
        if (session) {
            const sessionData = JSON.parse(Buffer.from(session.value, 'base64').toString());
            const user = findUserById(id);
            if (user && user.email === sessionData.email) {
                return NextResponse.json(
                    { error: 'ไม่สามารถลบบัญชีตัวเองได้' },
                    { status: 400 }
                );
            }
        }

        const deleted = deleteUser(id);

        if (!deleted) {
            return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'ลบผู้ใช้สำเร็จ'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { error: 'ไม่สามารถลบผู้ใช้ได้' },
            { status: 500 }
        );
    }
}
