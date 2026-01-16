import { NextRequest, NextResponse } from 'next/server';
import { getServiceAccountAccessToken, getDefaultFolderId } from '../../../lib/google-drive';

// GET /api/files - List files in a folder (ไม่ต้อง login)
export async function GET(req: NextRequest) {
    try {
        const accessToken = await getServiceAccountAccessToken();
        if (!accessToken) {
            return NextResponse.json({
                error: 'Service Account ยังไม่ได้ตั้งค่า กรุณาตั้งค่า environment variables'
            }, { status: 500 });
        }

        const { searchParams } = new URL(req.url);
        const defaultFolderId = getDefaultFolderId();
        let folderId = searchParams.get('folderId') || defaultFolderId;

        if (folderId === 'root') {
            folderId = defaultFolderId;
        }

        const pageToken = searchParams.get('pageToken') || '';

        // Build query - get files in specific folder
        let query = `'${folderId}' in parents and trashed = false`;

        const params = new URLSearchParams({
            q: query,
            fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, webContentLink, iconLink, thumbnailLink, parents)',
            orderBy: 'folder,name',
            pageSize: '50',
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
                { error: errorData.error?.message || 'โหลดรายการไฟล์ไม่สำเร็จ' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('List Files Error:', error);
        return NextResponse.json(
            { error: error.message || 'โหลดรายการไฟล์ไม่สำเร็จ' },
            { status: 500 }
        );
    }
}
