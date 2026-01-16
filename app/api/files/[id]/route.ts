import { NextRequest, NextResponse } from 'next/server';
import { getServiceAccountAccessToken } from '../../../../lib/google-drive';

// DELETE /api/files/[id] - Delete a file or folder
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const accessToken = await getServiceAccountAccessToken();
        if (!accessToken) {
            return NextResponse.json({
                error: 'Service Account ยังไม่ได้ตั้งค่า'
            }, { status: 500 });
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
                { error: errorData.error?.message || 'ลบไม่สำเร็จ' },
                { status: response.status }
            );
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
        if (!accessToken) {
            return NextResponse.json({
                error: 'Service Account ยังไม่ได้ตั้งค่า'
            }, { status: 500 });
        }

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
