// Types สำหรับระบบจัดการไฟล์

export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
    size?: string;
    modifiedTime: string;
    webViewLink?: string;
    webContentLink?: string;
    iconLink?: string;
    thumbnailLink?: string;
}

export interface BreadcrumbItem {
    id: string;
    name: string;
}

export interface StatusMessage {
    type: 'success' | 'error';
    message: string;
}

export type TabType = 'dashboard' | 'documents' | 'images' | 'media' | 'others';

export interface FileStats {
    documents: number;
    images: number;
    media: number;
    total: number;
    count: number;
}

export interface Category {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    color: string;
    size: number;
}

export interface UploadState {
    file: File | null;
    uploading: boolean;
}

export interface FileActionHandlers {
    onRename: (file: DriveFile) => void;
    onDelete: (file: DriveFile) => void;
    onDownload: (file: DriveFile) => void;
    onClick: (file: DriveFile) => void;
}
