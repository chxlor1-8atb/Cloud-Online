'use client';

import { useState, useCallback } from 'react';
import type { DriveFile, StatusMessage, BreadcrumbItem } from '@/lib/types';
import { ROOT_FOLDER_ID, ROOT_FOLDER_NAME, MESSAGES } from '@/lib/constants';

interface UseFilesReturn {
    files: DriveFile[];
    loading: boolean;
    currentFolder: string;
    breadcrumbs: BreadcrumbItem[];
    statusMessage: StatusMessage | null;

    fetchFiles: (folderId?: string) => Promise<void>;
    navigateToFolder: (folder: DriveFile) => void;
    navigateToBreadcrumb: (index: number) => void;
    deleteFile: (file: DriveFile) => Promise<void>;
    renameFile: (fileId: string, newName: string) => Promise<void>;
    createFolder: (name: string) => Promise<void>;
    clearStatus: () => void;
    setStatus: (status: StatusMessage | null) => void;
}

export function useFiles(): UseFilesReturn {
    const [files, setFiles] = useState<DriveFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentFolder, setCurrentFolder] = useState(ROOT_FOLDER_ID);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
        { id: ROOT_FOLDER_ID, name: ROOT_FOLDER_NAME }
    ]);
    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

    const fetchFiles = useCallback(async (folderId: string = ROOT_FOLDER_ID) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/files?folderId=${folderId}`);
            const data = await response.json();

            if (response.ok) {
                setFiles(data.files || []);
            } else {
                setStatusMessage({ type: 'error', message: data.error });
            }
        } catch {
            setStatusMessage({ type: 'error', message: MESSAGES.loadError });
        } finally {
            setLoading(false);
        }
    }, []);

    const navigateToFolder = useCallback((folder: DriveFile) => {
        setCurrentFolder(folder.id);
        setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
    }, []);

    const navigateToBreadcrumb = useCallback((index: number) => {
        setBreadcrumbs(prev => {
            const newBreadcrumbs = prev.slice(0, index + 1);
            setCurrentFolder(newBreadcrumbs[newBreadcrumbs.length - 1].id);
            return newBreadcrumbs;
        });
    }, []);

    const deleteFile = useCallback(async (file: DriveFile) => {
        if (!confirm(MESSAGES.deleteConfirm(file.name))) return;

        try {
            const response = await fetch(`/api/files/${file.id}`, { method: 'DELETE' });

            if (response.ok) {
                setStatusMessage({ type: 'success', message: MESSAGES.deleteSuccess(file.name) });
                await fetchFiles(currentFolder);
            } else {
                const data = await response.json();
                setStatusMessage({ type: 'error', message: data.error });
            }
        } catch {
            setStatusMessage({ type: 'error', message: MESSAGES.deleteError });
        }
    }, [currentFolder, fetchFiles]);

    const renameFile = useCallback(async (fileId: string, newName: string) => {
        try {
            const response = await fetch(`/api/files/${fileId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });

            if (response.ok) {
                setStatusMessage({ type: 'success', message: MESSAGES.renameSuccess });
                await fetchFiles(currentFolder);
            } else {
                const data = await response.json();
                setStatusMessage({ type: 'error', message: data.error });
            }
        } catch {
            setStatusMessage({ type: 'error', message: MESSAGES.renameError });
        }
    }, [currentFolder, fetchFiles]);

    const createFolder = useCallback(async (name: string) => {
        try {
            const response = await fetch('/api/folders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, parentId: currentFolder }),
            });
            const data = await response.json();

            if (response.ok) {
                setStatusMessage({ type: 'success', message: MESSAGES.folderCreated(data.name) });
                await fetchFiles(currentFolder);
            } else {
                setStatusMessage({ type: 'error', message: data.error });
            }
        } catch {
            setStatusMessage({ type: 'error', message: MESSAGES.folderError });
        }
    }, [currentFolder, fetchFiles]);

    const clearStatus = useCallback(() => setStatusMessage(null), []);

    return {
        files,
        loading,
        currentFolder,
        breadcrumbs,
        statusMessage,
        fetchFiles,
        navigateToFolder,
        navigateToBreadcrumb,
        deleteFile,
        renameFile,
        createFolder,
        clearStatus,
        setStatus: setStatusMessage,
    };
}
