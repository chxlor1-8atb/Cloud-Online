import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, getGoogleAccessToken } from '../../auth/[...nextauth]/route';

// DELETE /api/files/[id] - Delete a file or folder
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

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
                { error: errorData.error?.message || 'Failed to delete' },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Delete Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete' },
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

        const { id } = await params;
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
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
                { error: errorData.error?.message || 'Failed to rename' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Rename Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to rename' },
            { status: 500 }
        );
    }
}
