import { NextRequest, NextResponse } from 'next/server';
import { getServiceAccountAccessToken, getDefaultFolderId } from '../../../lib/google-drive';
import { findUserById, checkStorageQuota, updateUserStorageUsed } from '@/lib/users';
import { cookies } from 'next/headers';

// Helper to get current user ID from session
async function getCurrentUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get('auth-session');
    if (!session) return null;

    try {
        const sessionData = JSON.parse(Buffer.from(session.value, 'base64').toString());
        return sessionData.userId || null;
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const accessToken = await getServiceAccountAccessToken();

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const defaultFolderId = getDefaultFolderId();
        let folderId = formData.get('folderId') as string || defaultFolderId;

        if (folderId === 'root') {
            folderId = defaultFolderId;
        }

        if (!file) {
            return NextResponse.json({ error: 'ไม่พบไฟล์ที่ต้องการอัปโหลด' }, { status: 400 });
        }

        // Check storage quota for logged-in user
        const userId = await getCurrentUserId();
        if (userId) {
            const quotaCheck = checkStorageQuota(userId, file.size);
            if (!quotaCheck.allowed) {
                return NextResponse.json(
                    { error: quotaCheck.message || 'พื้นที่จัดเก็บเต็ม' },
                    { status: 413 }
                );
            }
        }

        // Convert File to ArrayBuffer then to base64
        const buffer = await file.arrayBuffer();
        const base64Data = Buffer.from(buffer).toString('base64');

        // Create file metadata
        const metadata: any = {
            name: file.name,
            mimeType: file.type,
        };

        if (folderId && folderId !== 'root') {
            metadata.parents = [folderId];
        }

        // Use multipart upload for Google Drive API
        const boundary = 'foo_bar_baz';
        const delimiter = `\r\n--${boundary}\r\n`;
        const closeDelimiter = `\r\n--${boundary}--`;

        const multipartBody =
            delimiter +
            'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            `Content-Type: ${file.type}\r\n` +
            'Content-Transfer-Encoding: base64\r\n\r\n' +
            base64Data +
            closeDelimiter;

        // Upload to Google Drive
        const response = await fetch(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': `multipart/related; boundary=${boundary}`,
                },
                body: multipartBody,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Google Drive API Error:', errorData);
            return NextResponse.json(
                { error: errorData.error?.message || 'อัปโหลดไม่สำเร็จ' },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Update user's storage used
        if (userId) {
            updateUserStorageUsed(userId, file.size);
        }

        return NextResponse.json({
            success: true,
            file: data,
        });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json(
            { error: error.message || 'อัปโหลดไม่สำเร็จ' },
            { status: 500 }
        );
    }
}
