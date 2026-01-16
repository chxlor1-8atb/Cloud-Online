// In-memory user store and OTP management
// In production, replace with a database

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
}

export interface OTPRecord {
    email: string;
    code: string;
    expiresAt: Date;
    attempts: number;
}

// In-memory stores
// In-memory stores with global persistence for development
declare global {
    var _userStore: Map<string, User> | undefined;
    var _otpStore: Map<string, OTPRecord> | undefined;
}

const users = globalThis._userStore || new Map<string, User>();
const otpStore = globalThis._otpStore || new Map<string, OTPRecord>();

if (process.env.NODE_ENV !== 'production') {
    globalThis._userStore = users;
    globalThis._otpStore = otpStore;
}

// User management functions
export function findUserByEmail(email: string): User | undefined {
    return Array.from(users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(name: string, email: string): User {
    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const user: User = {
        id,
        name,
        email: email.toLowerCase(),
        createdAt: new Date(),
    };
    users.set(id, user);
    return user;
}

export function getAllUsers(): User[] {
    return Array.from(users.values());
}

// OTP management functions
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(email: string, code: string): void {
    const record: OTPRecord = {
        email: email.toLowerCase(),
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        attempts: 0,
    };
    otpStore.set(email.toLowerCase(), record);
}

export function verifyOTP(email: string, code: string): { success: boolean; error?: string } {
    const record = otpStore.get(email.toLowerCase());

    if (!record) {
        return { success: false, error: 'ไม่พบรหัส OTP กรุณาขอรหัสใหม่' };
    }

    if (record.attempts >= 3) {
        otpStore.delete(email.toLowerCase());
        return { success: false, error: 'ใส่รหัสผิดเกินจำนวนครั้งที่กำหนด กรุณาขอรหัสใหม่' };
    }

    if (new Date() > record.expiresAt) {
        otpStore.delete(email.toLowerCase());
        return { success: false, error: 'รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่' };
    }

    if (record.code !== code) {
        record.attempts++;
        return { success: false, error: `รหัส OTP ไม่ถูกต้อง (เหลือโอกาสอีก ${3 - record.attempts} ครั้ง)` };
    }

    // Success - remove OTP
    otpStore.delete(email.toLowerCase());
    return { success: true };
}

export function clearOTP(email: string): void {
    otpStore.delete(email.toLowerCase());
}
