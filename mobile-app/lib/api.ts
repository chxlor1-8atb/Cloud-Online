// API configuration
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiResponse<T = unknown> {
    success?: boolean;
    error?: string;
    data?: T;
}

interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    size?: string;
    modifiedTime?: string;
    webViewLink?: string;
    thumbnailLink?: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    storageQuotaGB: number;
    storageUsedBytes: number;
}

// Send OTP to email
export async function sendOTP(email: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`${API_URL}/api/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: 'เกิดข้อผิดพลาดในการเชื่อมต่อ' };
    }
}

// Verify OTP
export async function verifyOTP(email: string, code: string): Promise<ApiResponse<{ user: User }>> {
    try {
        const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: 'เกิดข้อผิดพลาดในการยืนยัน OTP' };
    }
}

// Sign up new user
export async function signUp(name: string, email: string): Promise<ApiResponse<{ user: User }>> {
    try {
        const response = await fetch(`${API_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: 'เกิดข้อผิดพลาดในการลงทะเบียน' };
    }
}

// Get files list
export async function getFiles(folderId?: string): Promise<ApiResponse<{ files: DriveFile[] }>> {
    try {
        const url = folderId
            ? `${API_URL}/api/files?folderId=${folderId}`
            : `${API_URL}/api/files`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        return { success: false, error: 'เกิดข้อผิดพลาดในการโหลดไฟล์' };
    }
}

// Create folder
export async function createFolder(name: string, parentId?: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`${API_URL}/api/folders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, parentId }),
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: 'เกิดข้อผิดพลาดในการสร้างโฟลเดอร์' };
    }
}

// Delete file
export async function deleteFile(fileId: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`${API_URL}/api/files/${fileId}`, {
            method: 'DELETE',
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: 'เกิดข้อผิดพลาดในการลบไฟล์' };
    }
}

// Rename file
export async function renameFile(fileId: string, newName: string): Promise<ApiResponse> {
    try {
        const response = await fetch(`${API_URL}/api/files/${fileId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName }),
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: 'เกิดข้อผิดพลาดในการเปลี่ยนชื่อ' };
    }
}

export type { DriveFile, User, ApiResponse };
