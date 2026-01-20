import { NextRequest, NextResponse } from 'next/server';
import { getServiceAccountAccessToken } from '../../../../lib/google-drive';
import { cookies } from 'next/headers';
import { updateUserStorageUsed } from '@/lib/users';

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

// DELETE /api/files/[id] - Delete a file or folder
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const accessToken = await getServiceAccountAccessToken();

        const { id } = await params;
        const userId = await getCurrentUserId();

        // Get file info first to know the size
        let fileSize = 0;
        if (userId) {
            try {
                const fileInfoResponse = await fetch(
                    `https://www.googleapis.com/drive/v3/files/${id}?fields=size,mimeType`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                if (fileInfoResponse.ok) {
                    const fileInfo = await fileInfoResponse.json();
                    // Only count size for non-folder items
                    if (fileInfo.mimeType !== 'application/vnd.google-apps.folder') {
                        fileSize = parseInt(fileInfo.size || '0', 10);
                    }
                }
            } catch (e) {
                console.error('Failed to get file info before delete:', e);
            }
        }

        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files/${id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok && response.status !== 204) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.error?.message || 'ลบไม่สำเร็จ' },
                { status: response.status }
            );
        }

        // Update user's storage used (decrease by file size)
        if (userId && fileSize > 0) {
            updateUserStorageUsed(userId, -fileSize);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Delete Error:', error);
        return NextResponse.json(
            { error: error.message || 'ลบไม่สำเร็จ' },
            { status: 500 }
        );
    }
}

// PATCH /api/files/[id] - Rename a file or folder
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const accessToken = await getServiceAccountAccessToken();

        const { id } = await params;
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'กรุณาระบุชื่อ' }, { status: 400 });
        }

        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files/${id}`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.error?.message || 'เปลี่ยนชื่อไม่สำเร็จ' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Rename Error:', error);
        return NextResponse.json(
            { error: error.message || 'เปลี่ยนชื่อไม่สำเร็จ' },
            { status: 500 }
        );
    }
}
