import { NextRequest, NextResponse } from 'next/server';
import { getServiceAccountAccessToken, getDefaultFolderId } from '../../../lib/google-drive';

export async function POST(req: NextRequest) {
    try {
        const accessToken = await getServiceAccountAccessToken();
        if (!accessToken) {
            return NextResponse.json({
                error: 'Service Account ยังไม่ได้ตั้งค่า กรุณาตั้งค่า environment variables'
            }, { status: 500 });
        }

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
