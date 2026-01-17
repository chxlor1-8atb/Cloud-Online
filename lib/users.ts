// User store and OTP management with JSON file persistence
import fs from 'fs';
import path from 'path';

export type UserRole = 'admin' | 'user';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    storageQuotaGB: number;      // e.g., 5.5 = 5.5 GB
    storageUsedBytes: number;    // current usage in bytes
    createdAt: string;
}

export interface OTPRecord {
    email: string;
    code: string;
    expiresAt: string;
    attempts: number;
}

interface Database {
    users: User[];
    otpRecords: OTPRecord[];
}

// Data file path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default storage quota for new users (in GB)
const DEFAULT_STORAGE_QUOTA_GB = 5;

// Ensure data directory exists
function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

// Load database from file
function loadDatabase(): Database {
    ensureDataDir();
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading database:', error);
    }
    return { users: [], otpRecords: [] };
}

// Save database to file
function saveDatabase(db: Database) {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// In-memory cache with global persistence for development
declare global {
    var _dbCache: Database | undefined;
}

function getDB(): Database {
    if (!globalThis._dbCache) {
        globalThis._dbCache = loadDatabase();
    }
    return globalThis._dbCache;
}

function persistDB() {
    if (globalThis._dbCache) {
        saveDatabase(globalThis._dbCache);
    }
}

// ============================================
// User management functions
// ============================================

export function findUserByEmail(email: string): User | undefined {
    const db = getDB();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
    const db = getDB();
    return db.users.find(u => u.id === id);
}

export function createUser(name: string, email: string, role?: UserRole): User {
    const db = getDB();
    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    // First user automatically becomes admin
    const isFirstUser = db.users.length === 0;
    const userRole = role ?? (isFirstUser ? 'admin' : 'user');

    const user: User = {
        id,
        name,
        email: email.toLowerCase(),
        role: userRole,
        storageQuotaGB: DEFAULT_STORAGE_QUOTA_GB,
        storageUsedBytes: 0,
        createdAt: new Date().toISOString(),
    };

    db.users.push(user);
    persistDB();
    return user;
}

export function updateUser(id: string, updates: Partial<Pick<User, 'name' | 'role' | 'storageQuotaGB'>>): User | null {
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === id);

    if (userIndex === -1) return null;

    db.users[userIndex] = { ...db.users[userIndex], ...updates };
    persistDB();
    return db.users[userIndex];
}

export function deleteUser(id: string): boolean {
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === id);

    if (userIndex === -1) return false;

    db.users.splice(userIndex, 1);
    persistDB();
    return true;
}

export function getAllUsers(): User[] {
    const db = getDB();
    return db.users;
}

export function updateUserStorageUsed(id: string, bytesChange: number): User | null {
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === id);

    if (userIndex === -1) return null;

    db.users[userIndex].storageUsedBytes = Math.max(0, db.users[userIndex].storageUsedBytes + bytesChange);
    persistDB();
    return db.users[userIndex];
}

export function checkStorageQuota(userId: string, fileSizeBytes: number): { allowed: boolean; message?: string } {
    const user = findUserById(userId);
    if (!user) {
        return { allowed: false, message: 'ไม่พบผู้ใช้งาน' };
    }

    const quotaBytes = user.storageQuotaGB * 1024 * 1024 * 1024;
    const newUsage = user.storageUsedBytes + fileSizeBytes;

    if (newUsage > quotaBytes) {
        const usedGB = (user.storageUsedBytes / (1024 * 1024 * 1024)).toFixed(2);
        const quotaGB = user.storageQuotaGB.toFixed(2);
        return {
            allowed: false,
            message: `พื้นที่เก็บข้อมูลเต็ม (ใช้ไป ${usedGB} GB จาก ${quotaGB} GB)`
        };
    }

    return { allowed: true };
}

// Set user's storage used directly (for syncing from Google Drive)
export function setUserStorageUsed(id: string, bytes: number): User | null {
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === id);

    if (userIndex === -1) return null;

    db.users[userIndex].storageUsedBytes = Math.max(0, bytes);
    persistDB();
    return db.users[userIndex];
}

// ============================================
// OTP management functions  
// ============================================

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(email: string, code: string): void {
    const db = getDB();
    const emailLower = email.toLowerCase();

    // Remove existing OTP for this email
    db.otpRecords = db.otpRecords.filter(r => r.email !== emailLower);

    db.otpRecords.push({
        email: emailLower,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        attempts: 0,
    });
    persistDB();
}

export function verifyOTP(email: string, code: string): { success: boolean; error?: string } {
    const db = getDB();
    const emailLower = email.toLowerCase();
    const recordIndex = db.otpRecords.findIndex(r => r.email === emailLower);

    if (recordIndex === -1) {
        return { success: false, error: 'ไม่พบรหัส OTP กรุณาขอรหัสใหม่' };
    }

    const record = db.otpRecords[recordIndex];

    if (record.attempts >= 3) {
        db.otpRecords.splice(recordIndex, 1);
        persistDB();
        return { success: false, error: 'ใส่รหัสผิดเกินจำนวนครั้งที่กำหนด กรุณาขอรหัสใหม่' };
    }

    if (new Date() > new Date(record.expiresAt)) {
        db.otpRecords.splice(recordIndex, 1);
        persistDB();
        return { success: false, error: 'รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่' };
    }

    if (record.code !== code) {
        record.attempts++;
        persistDB();
        return { success: false, error: `รหัส OTP ไม่ถูกต้อง (เหลือโอกาสอีก ${3 - record.attempts} ครั้ง)` };
    }

    // Success - remove OTP
    db.otpRecords.splice(recordIndex, 1);
    persistDB();
    return { success: true };
}

export function clearOTP(email: string): void {
    const db = getDB();
    db.otpRecords = db.otpRecords.filter(r => r.email !== email.toLowerCase());
    persistDB();
}
