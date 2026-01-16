import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, getGoogleAccessToken } from '../auth/[...nextauth]/route';

// POST /api/folders - Create a new folder
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        let accessToken = session ? (session as any).accessToken : null;
        if (!accessToken) {
            accessToken = await getGoogleAccessToken();
        }
        if (!accessToken) {
            return NextResponse.json({ error: 'ไม่พบ Google access token' }, { status: 401 });
        }

        const body = await req.json();
        const { name, parentId } = body;

        if (!name) {
            return NextResponse.json({ error: 'กรุณาระบุชื่อโฟลเดอร์' }, { status: 400 });
        }

        const metadata: any = {
            name,
            mimeType: 'application/vnd.google-apps.folder',
        };

        const effectiveParentId = (!parentId || parentId === 'root') ? '1xO8zenJM5cIRhtGfkBmuPw9Szxs7mg-F' : parentId;
        metadata.parents = [effectiveParentId];

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
                { error: errorData.error?.message || 'สร้างโฟลเดอร์ไม่สำเร็จ' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Create Folder Error:', error);
        return NextResponse.json(
            { error: error.message || 'สร้างโฟลเดอร์ไม่สำเร็จ' },
            { status: 500 }
        );
    }
}
