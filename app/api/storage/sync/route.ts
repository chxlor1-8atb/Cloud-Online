import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserById, findUserByEmail, setUserStorageUsed } from '@/lib/users';
import { getServiceAccountAccessToken, getDefaultFolderId } from '@/lib/google-drive';

// POST /api/storage/sync - Sync storage usage from Google Drive
export async function POST() {
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
        let userId: string;
        try {
            const sessionData = JSON.parse(Buffer.from(session.value, 'base64').toString());
            userId = sessionData.userId;
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

        // Get access token
        const accessToken = await getServiceAccountAccessToken();
        if (!accessToken) {
            return NextResponse.json({
                error: 'Service Account ยังไม่ได้ตั้งค่า'
            }, { status: 500 });
        }

        // Get all files from Google Drive and calculate total size
        const defaultFolderId = getDefaultFolderId();
        let totalSize = 0;
        let pageToken: string | null = null;

        do {
            const params = new URLSearchParams({
                q: `'${defaultFolderId}' in parents and trashed = false`,
                fields: 'nextPageToken, files(id, size, mimeType)',
                pageSize: '1000',
            });

            if (pageToken) {
                params.append('pageToken', pageToken);
            }

            const response = await fetch(
                `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                return NextResponse.json(
                    { error: errorData.error?.message || 'ไม่สามารถดึงข้อมูลไฟล์ได้' },
                    { status: response.status }
                );
            }

            const data = await response.json();

            // Sum up file sizes (folders don't have size)
            for (const file of data.files || []) {
                if (file.size && file.mimeType !== 'application/vnd.google-apps.folder') {
                    totalSize += parseInt(file.size, 10);
                }
            }

            pageToken = data.nextPageToken || null;
        } while (pageToken);

        // Update user's storage used with calculated value
        setUserStorageUsed(userId, totalSize);

        // Calculate storage info for response
        const quotaBytes = user.storageQuotaGB * 1024 * 1024 * 1024;
        const usedPercentage = quotaBytes > 0 ? (totalSize / quotaBytes) * 100 : 0;

        return NextResponse.json({
            success: true,
            message: 'ซิงค์ข้อมูลสำเร็จ',
            storageQuota: {
                limit: quotaBytes,
                limitGB: user.storageQuotaGB,
                usage: totalSize,
                usageGB: (totalSize / (1024 * 1024 * 1024)).toFixed(2),
                percentage: Math.min(usedPercentage, 100).toFixed(1),
            }
        });

    } catch (error: any) {
        console.error('Storage Sync Error:', error);
        return NextResponse.json(
            { error: error.message || 'ซิงค์ข้อมูลไม่สำเร็จ' },
            { status: 500 }
        );
    }
}
