import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserById, findUserByEmail } from '@/lib/users';

// GET /api/storage - Get current user's storage quota info
export async function GET() {
    try {
        // Get current user from session
        const cookieStore = await cookies();
        const session = cookieStore.get('auth-session');

        if (!session) {
            return NextResponse.json(
                { error: 'กรุณาเข้าสู่ระบบ' },
                { status: 401 }
            );
        }

        let user;
        try {
            const sessionData = JSON.parse(Buffer.from(session.value, 'base64').toString());
            user = findUserById(sessionData.userId) || findUserByEmail(sessionData.email);
        } catch {
            return NextResponse.json(
                { error: 'Session ไม่ถูกต้อง' },
                { status: 401 }
            );
        }

        if (!user) {
            return NextResponse.json(
                { error: 'ไม่พบผู้ใช้งาน' },
                { status: 404 }
            );
        }

        // Calculate storage info
        const quotaBytes = user.storageQuotaGB * 1024 * 1024 * 1024;
        const usedBytes = user.storageUsedBytes;
        const usedPercentage = quotaBytes > 0 ? (usedBytes / quotaBytes) * 100 : 0;

        return NextResponse.json({
            storageQuota: {
                limit: quotaBytes,
                limitGB: user.storageQuotaGB,
                usage: usedBytes,
                usageGB: (usedBytes / (1024 * 1024 * 1024)).toFixed(2),
                percentage: Math.min(usedPercentage, 100).toFixed(1),
            },
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error: any) {
        console.error('Storage Info Error:', error);
        return NextResponse.json(
            { error: error.message || 'ดึงข้อมูลไม่สำเร็จ' },
            { status: 500 }
        );
    }
}
