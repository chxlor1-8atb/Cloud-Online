// Utility functions

import type { DriveFile, FileStats } from './types';
import { FILE_TYPE_PATTERNS, FOLDER_MIME_TYPE } from './constants';

/**
 * Format bytes to human readable size
 */
export function formatSize(bytes?: string | number): string {
    if (!bytes) return '-';
    const b = typeof bytes === 'string' ? parseInt(bytes) : bytes;

    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
    return `${(b / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

/**
 * Format date to Thai locale
 */
export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short'
    });
}

/**
 * Check if a file is a folder
 */
export function isFolder(file: DriveFile): boolean {
    return file.mimeType === FOLDER_MIME_TYPE;
}

/**
 * Check if file matches document types
 */
export function isDocument(file: DriveFile): boolean {
    return FILE_TYPE_PATTERNS.documents.some(tag => file.mimeType.includes(tag));
}

/**
 * Check if file matches image types
 */
export function isImage(file: DriveFile): boolean {
    return FILE_TYPE_PATTERNS.images.some(tag => file.mimeType.includes(tag));
}

/**
 * Check if file matches media types
 */
export function isMedia(file: DriveFile): boolean {
    return FILE_TYPE_PATTERNS.media.some(tag => file.mimeType.includes(tag));
}

/**
 * Calculate file statistics from files array
 */
export function calculateFileStats(files: DriveFile[]): FileStats {
    const calculateSize = (typePatterns: readonly string[]) =>
        files
            .filter(f => typePatterns.some(tag => f.mimeType.includes(tag)))
            .reduce((acc, f) => acc + parseInt(f.size || '0'), 0);

    const docSize = calculateSize(FILE_TYPE_PATTERNS.documents);
    const imgSize = calculateSize(FILE_TYPE_PATTERNS.images);
    const mediaSize = calculateSize(FILE_TYPE_PATTERNS.media);
    const totalSize = files.reduce((acc, f) => acc + parseInt(f.size || '0'), 0);

    return {
        documents: docSize,
        images: imgSize,
        media: mediaSize,
        total: totalSize,
        count: files.length
    };
}

/**
 * Filter files by search query
 */
export function filterBySearch(files: DriveFile[], query: string): DriveFile[] {
    if (!query) return files;
    const lowerQuery = query.toLowerCase();
    return files.filter(f => f.name.toLowerCase().includes(lowerQuery));
}

/**
 * Filter files by category/tab
 */
export function filterByCategory(files: DriveFile[], category: string): DriveFile[] {
    if (category === 'dashboard') return files;

    switch (category) {
        case 'documents':
            return files.filter(isDocument);
        case 'images':
            return files.filter(isImage);
        case 'media':
            return files.filter(isMedia);
        case 'others':
            return files.filter(f =>
                !isFolder(f) && !isDocument(f) && !isImage(f) && !isMedia(f)
            );
        default:
            return files;
    }
}

/**
 * Merge class names conditionally (utility for Tailwind)
 */
export function cn(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}
