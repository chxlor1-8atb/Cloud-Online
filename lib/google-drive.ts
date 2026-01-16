import { google } from 'googleapis';

/**
 * สร้าง Google Drive client ด้วย Service Account
 * ใช้สำหรับ upload/อ่านไฟล์โดยไม่ต้อง login
 */
export async function getServiceAccountDrive() {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
        throw new Error('Service Account ยังไม่ได้ตั้งค่า กรุณาตั้งค่า GOOGLE_SERVICE_ACCOUNT_EMAIL และ GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY');
    }

    const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file']
    });

    return google.drive({ version: 'v3', auth });
}

/**
 * ดึง access token จาก Service Account
 */
export async function getServiceAccountAccessToken(): Promise<string | null> {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
        return null;
    }

    try {
        const auth = new google.auth.JWT({
            email: clientEmail,
            key: privateKey.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file']
        });

        const token = await auth.getAccessToken();
        return token.token || null;
    } catch (error) {
        console.error('Service Account Auth Error:', error);
        return null;
    }
}

/**
 * Folder ID เริ่มต้น
 */
export function getDefaultFolderId(): string {
    return process.env.GOOGLE_DRIVE_FOLDER_ID || '1xO8zenJM5cIRhtGfkBmuPw9Szxs7mg-F';
}
