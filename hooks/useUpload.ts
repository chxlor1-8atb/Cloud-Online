'use client';

import { useState, useCallback } from 'react';
import type { StatusMessage } from '@/lib/types';
import { MESSAGES } from '@/lib/constants';

interface UseUploadReturn {
    selectedFile: File | null;
    uploading: boolean;
    selectFile: (file: File | null) => void;
    uploadFile: (folderId: string, onSuccess: () => void, setStatus: (status: StatusMessage) => void) => Promise<void>;
    clearSelection: () => void;
}

export function useUpload(): UseUploadReturn {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const selectFile = useCallback((file: File | null) => {
        setSelectedFile(file);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedFile(null);
    }, []);

    const uploadFile = useCallback(async (
        folderId: string,
        onSuccess: () => void,
        setStatus: (status: StatusMessage) => void
    ) => {
        if (!selectedFile) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('folderId', folderId);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: MESSAGES.uploadSuccess(data.file.name) });
                setSelectedFile(null);
                onSuccess();
            } else {
                setStatus({ type: 'error', message: data.error });
            }
        } catch {
            setStatus({ type: 'error', message: MESSAGES.uploadError });
        } finally {
            setUploading(false);
        }
    }, [selectedFile]);

    return {
        selectedFile,
        uploading,
        selectFile,
        uploadFile,
        clearSelection,
    };
}
