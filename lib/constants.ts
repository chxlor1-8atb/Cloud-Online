// Constants และ Configurations

import { FileText, Image as ImageIcon, Video, MoreHorizontal } from 'lucide-react';
import type { TabType } from './types';

// Storage
export const STORAGE_LIMIT_TB = 2;
export const STORAGE_LIMIT_BYTES = STORAGE_LIMIT_TB * 1024 * 1024 * 1024 * 1024;

// Default folder
export const ROOT_FOLDER_ID = 'root';
export const ROOT_FOLDER_NAME = 'Cloud-Online';

// File type patterns for categorization
export const FILE_TYPE_PATTERNS = {
    documents: ['pdf', 'document', 'sheet', 'msword', 'text'],
    images: ['image'],
    media: ['video', 'audio'],
} as const;

// Category configurations
export const CATEGORIES = [
    {
        id: 'documents' as TabType,
        label: 'เอกสาร',
        icon: FileText,
        color: 'bg-rose-100 text-rose-500'
    },
    {
        id: 'images' as TabType,
        label: 'รูปภาพ',
        icon: ImageIcon,
        color: 'bg-blue-100 text-blue-500'
    },
    {
        id: 'media' as TabType,
        label: 'มีเดีย',
        icon: Video,
        color: 'bg-emerald-100 text-emerald-500'
    },
    {
        id: 'others' as TabType,
        label: 'อื่นๆ',
        icon: MoreHorizontal,
        color: 'bg-purple-100 text-purple-500'
    },
] as const;

// Sidebar navigation items
export const NAV_ITEMS = [
    { id: 'dashboard' as TabType, label: 'หน้าแรก', icon: 'LayoutDashboard' },
    { id: 'documents' as TabType, label: 'เอกสาร', icon: 'FileText' },
    { id: 'images' as TabType, label: 'รูปภาพ', icon: 'Image' },
    { id: 'media' as TabType, label: 'มีเดีย', icon: 'Video' },
    { id: 'others' as TabType, label: 'อื่นๆ', icon: 'MoreHorizontal' },
] as const;

// Google Drive folder MIME type
export const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';

// UI Messages (Thai)
export const MESSAGES = {
    loading: 'กำลังโหลด...',
    uploading: 'กำลังอัปโหลด...',
    noFiles: 'ยังไม่มีไฟล์',
    noItemsFound: 'ไม่พบรายการ',
    noItemsHint: 'ลองค้นหาด้วยคำอื่น หรืออัปโหลดไฟล์ใหม่',
    searchPlaceholder: 'ค้นหา...',
    folderNamePlaceholder: 'ระบุชื่อโฟลเดอร์',

    // Success messages
    uploadSuccess: (name: string) => `อัปโหลด "${name}" สำเร็จ!`,
    folderCreated: (name: string) => `สร้างโฟลเดอร์ "${name}" สำเร็จ!`,
    deleteSuccess: (name: string) => `ลบ "${name}" สำเร็จ`,
    renameSuccess: 'เปลี่ยนชื่อสำเร็จ',

    // Error messages
    loadError: 'โหลดไฟล์ไม่สำเร็จ',
    uploadError: 'อัปโหลดไม่สำเร็จ',
    folderError: 'สร้างโฟลเดอร์ไม่สำเร็จ',
    deleteError: 'ลบไม่สำเร็จ',
    renameError: 'เปลี่ยนชื่อไม่สำเร็จ',

    // Confirmations
    deleteConfirm: (name: string) => `ลบ "${name}" หรือไม่?`,
} as const;

// Button labels
export const BUTTONS = {
    upload: 'อัปโหลด',
    create: 'สร้าง',
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    confirm: 'ยืนยัน',
    rename: 'เปลี่ยนชื่อ',
    download: 'ดาวน์โหลด',
    delete: 'ลบ',
    newFolder: 'สร้างโฟลเดอร์',
} as const;

// Modal titles
export const MODAL_TITLES = {
    upload: 'อัปโหลดไฟล์',
    newFolder: 'สร้างโฟลเดอร์ใหม่',
    rename: 'เปลี่ยนชื่อ',
} as const;

// Labels
export const LABELS = {
    storageUsage: 'พื้นที่ใช้งาน',
    recentFiles: 'ไฟล์ล่าสุด',
    folderName: 'ชื่อโฟลเดอร์',
    newName: 'ชื่อใหม่',
    folder: 'โฟลเดอร์',
    total: 'ทั้งหมด',
    items: 'รายการ',
} as const;
