import { NextResponse } from 'next/server';
import { getServiceAccountDrive } from '../../../lib/google-drive';

export async function GET() {
    try {
        const drive = await getServiceAccountDrive();

        const response = await drive.about.get({
            fields: 'storageQuota',
        });

        const storageQuota = response.data.storageQuota;

        if (!storageQuota) {
            return NextResponse.json(
                { storageQuota: { usage: 0, limit: 15 * 1024 * 1024 * 1024, limitGB: 15 } }, // Default fallback
                { status: 200 }
            );
        }

        const usage = parseInt(storageQuota.usage || '0');
        const limit = parseInt(storageQuota.limit || '0');

        return NextResponse.json({
            storageQuota: {
                usage,
                limit,
                limitGB: limit > 0 ? Math.round(limit / (1024 * 1024 * 1024)) : 0
            }
        });

    } catch (error: any) {
        console.error('Storage Quota Error:', error.message);
        return NextResponse.json(
            { error: 'Failed to fetch storage quota' },
            { status: 500 }
        );
    }
}
