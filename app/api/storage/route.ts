import { NextResponse } from 'next/server';
import { getServiceAccountAccessToken } from '../../../lib/google-drive';

// GET /api/storage - Get storage quota info
export async function GET() {
    try {
        const accessToken = await getServiceAccountAccessToken();
        if (!accessToken) {
            return NextResponse.json({
                error: 'Service Account ยังไม่ได้ตั้งค่า'
            }, { status: 500 });
        }

        const response = await fetch(
            'https://www.googleapis.com/drive/v3/about?fields=storageQuota,user',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.error?.message || 'ดึงข้อมูลไม่สำเร็จ' },
                { status: response.status }
            );
        }

        const data = await response.json();

        // storageQuota contains: limit, usage, usageInDrive, usageInDriveTrash
        return NextResponse.json({
            storageQuota: data.storageQuota,
            user: data.user
        });

    } catch (error: any) {
        console.error('Storage Info Error:', error);
        return NextResponse.json(
            { error: error.message || 'ดึงข้อมูลไม่สำเร็จ' },
            { status: 500 }
        );
    }
}
