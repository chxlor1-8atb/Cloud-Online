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
export async function getServiceAccountAccessToken(): Promise<string> {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
        throw new Error('Missing Service Account Credentials (GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY)');
    }

    try {
        const auth = new google.auth.JWT({
            email: clientEmail,
            key: privateKey.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file']
        });

        const token = await auth.getAccessToken();
        if (!token.token) {
            throw new Error('Failed to retrieve access token from Google');
        }
        return token.token;
    } catch (error: any) {
        console.error('Service Account Auth Error:', error);
        throw new Error(`Service Account Authentication Failed: ${error.message}`);
    }
}

/**
 * Folder ID เริ่มต้น
 */
export function getDefaultFolderId(): string {
    return process.env.GOOGLE_DRIVE_FOLDER_ID || '1xO8zenJM5cIRhtGfkBmuPw9Szxs7mg-F';
}
