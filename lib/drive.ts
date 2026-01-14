
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

export const getDriveService = () => {
    const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        throw new Error('Missing Google Drive credentials');
    }

    // Handle private key newlines for Vercel environment variables
    const privateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: GOOGLE_CLIENT_EMAIL,
            private_key: privateKey,
        },
        scopes: SCOPES,
    });

    return google.drive({ version: 'v3', auth });
};
