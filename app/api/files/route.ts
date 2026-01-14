import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, getGoogleAccessToken } from '../auth/[...nextauth]/route';

// GET /api/files - List files in a folder
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Get access token from session or stored token
        let accessToken = session ? (session as any).accessToken : null;

        if (!accessToken) {
            // Try to get from stored token (for both credentials and public users)
            accessToken = await getGoogleAccessToken();
        }

        if (!accessToken) {
            return NextResponse.json({ error: 'No Google access token. Admin needs to login with Google first.' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const folderId = searchParams.get('folderId') || 'root';
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
                { error: errorData.error?.message || 'Failed to list files' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('List Files Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to list files' },
            { status: 500 }
        );
    }
}
