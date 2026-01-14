import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, getGoogleAccessToken } from '../auth/[...nextauth]/route';

// POST /api/folders - Create a new folder
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        let accessToken = (session as any).accessToken;
        if (!accessToken) {
            accessToken = await getGoogleAccessToken();
        }
        if (!accessToken) {
            return NextResponse.json({ error: 'No Google access token' }, { status: 401 });
        }

        const body = await req.json();
        const { name, parentId } = body;

        if (!name) {
            return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
        }

        const metadata: any = {
            name,
            mimeType: 'application/vnd.google-apps.folder',
        };

        if (parentId && parentId !== 'root') {
            metadata.parents = [parentId];
        }

        const response = await fetch(
            'https://www.googleapis.com/drive/v3/files?fields=id,name,mimeType,modifiedTime,webViewLink',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(metadata),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.error?.message || 'Failed to create folder' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Create Folder Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create folder' },
            { status: 500 }
        );
    }
}
