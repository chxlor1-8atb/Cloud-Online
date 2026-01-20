'use client';

import { useState, useEffect, useMemo } from 'react';
import type { DriveFile, TabType } from '@/lib/types';
import { calculateFileStats, filterBySearch, filterByCategory, isFolder } from '@/lib/utils';
import { LABELS } from '@/lib/constants';

// Hooks
import { useFiles } from '@/hooks/useFiles';
import { useUpload } from '@/hooks/useUpload';

// Layout Components
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

// Dashboard Components
import { StorageCard } from '@/components/dashboard/StorageCard';
import { CategoryGrid } from '@/components/dashboard/CategoryGrid';
import { RecentFiles } from '@/components/dashboard/RecentFiles';

// File Components
import { FileGrid } from '@/components/files/FileGrid';
import { Breadcrumbs, NewFolderButton } from '@/components/files/Breadcrumbs';

// Modal Components
import { UploadModal } from '@/components/modals/UploadModal';
import { NewFolderModal } from '@/components/modals/NewFolderModal';
import { RenameModal } from '@/components/modals/RenameModal';

// UI Components
import { StatusNotification } from '@/components/ui/StatusNotification';

export default function Home() {
  // Custom hooks for file operations
  const {
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
    setStatus,
  } = useFiles();

  const {
    selectedFile,
    uploading,
    selectFile,
    uploadFile,
    clearSelection,
  } = useUpload();

  // Local state
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [renameItem, setRenameItem] = useState<DriveFile | null>(null);
  const [storageQuota, setStorageQuota] = useState({ usedBytes: 0, quotaBytes: 5 * 1024 * 1024 * 1024, quotaGB: 5 });

  // Fetch storage quota
  useEffect(() => {
    const fetchStorageQuota = async () => {
      try {
        const res = await fetch('/api/storage');
        if (res.ok) {
          const data = await res.json();
          setStorageQuota({
            usedBytes: data.storageQuota.usage || 0,
            quotaBytes: data.storageQuota.limit || 5 * 1024 * 1024 * 1024,
            quotaGB: data.storageQuota.limitGB || 5,
          });
        }
      } catch (error) {
        console.error('Failed to fetch storage quota:', error);
      }
    };
    fetchStorageQuota();
  }, [files]);

  // Load files on mount and folder change
  useEffect(() => {
    fetchFiles(currentFolder);
  }, [currentFolder, fetchFiles]);

  // Computed values
  const stats = useMemo(() => calculateFileStats(files), [files]);

  const filteredFiles = useMemo(() => {
    const searchFiltered = filterBySearch(files, searchQuery);
    return filterByCategory(searchFiltered, activeTab);
  }, [files, searchQuery, activeTab]);

  // Event handlers
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleFileClick = (file: DriveFile) => {
    if (isFolder(file)) {
      navigateToFolder(file);
      setActiveTab('dashboard');
    } else if (file.webViewLink) {
      window.open(file.webViewLink, '_blank');
    }
  };

  const handleUploadConfirm = async () => {
    await uploadFile(currentFolder, () => fetchFiles(currentFolder), setStatus);
  };

  const handleCreateFolder = async (name: string) => {
    await createFolder(name);
    setShowNewFolderModal(false);
  };

  const handleRename = async (newName: string) => {
    if (renameItem) {
      await renameFile(renameItem.id, newName);
      setRenameItem(null);
    }
  };

  const openRenameModal = (file: DriveFile) => {
    setRenameItem(file);
  };

  // Hidden file input ref for upload
  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) selectFile(file);
    };
    input.click();
  };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onUploadClick={handleUploadClick}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFileSelect={selectFile}
        />

        <div className="px-4 lg:px-8 py-6 animate-fade-in">
          {activeTab === 'dashboard' ? (
            <DashboardView
              stats={stats}
              files={files}
              loading={loading}
              storageQuota={storageQuota}
              onCategoryClick={handleTabChange}
              onRefresh={() => fetchFiles(currentFolder)}
              onRename={openRenameModal}
              onDelete={deleteFile}
            />
          ) : (
            <FilesView
              activeTab={activeTab}
              files={filteredFiles}
              loading={loading}
              breadcrumbs={breadcrumbs}
              onFileClick={handleFileClick}
              onRename={openRenameModal}
              onDelete={deleteFile}
              onBreadcrumbNavigate={navigateToBreadcrumb}
              onRefresh={() => fetchFiles(currentFolder)}
              onNewFolder={() => setShowNewFolderModal(true)}
            />
          )}
        </div>
      </main>

      {/* Status Notification */}
      {statusMessage && (
        <StatusNotification status={statusMessage} onClose={clearStatus} />
      )}

      {/* Modals */}
      {selectedFile && (
        <UploadModal
          file={selectedFile}
          uploading={uploading}
          onConfirm={handleUploadConfirm}
          onCancel={clearSelection}
        />
      )}

      {showNewFolderModal && (
        <NewFolderModal
          onSubmit={handleCreateFolder}
          onCancel={() => setShowNewFolderModal(false)}
        />
      )}

      {renameItem && (
        <RenameModal
          currentName={renameItem.name}
          onSubmit={handleRename}
          onCancel={() => setRenameItem(null)}
        />
      )}
    </div>
  );
}

// Sub-components for main page sections

interface DashboardViewProps {
  stats: ReturnType<typeof calculateFileStats>;
  files: DriveFile[];
  loading: boolean;
  storageQuota: { usedBytes: number; quotaBytes: number; quotaGB: number };
  onCategoryClick: (category: TabType) => void;
  onRefresh: () => void;
  onRename: (file: DriveFile) => void;
  onDelete: (file: DriveFile) => void;
}

function DashboardView({ stats, files, loading, storageQuota, onCategoryClick, onRefresh, onRename, onDelete }: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          ยินดีต้อนรับ 👋
        </h1>
        <p className="text-zinc-500">จัดการไฟล์และโฟลเดอร์ของคุณได้ที่นี่</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Storage & Categories */}
        <div className="lg:col-span-2 space-y-6">
          <StorageCard
            usedBytes={storageQuota.usedBytes}
            quotaBytes={storageQuota.quotaBytes}
            quotaGB={storageQuota.quotaGB}
          />
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">หมวดหมู่</h2>
            <CategoryGrid stats={stats} onCategoryClick={onCategoryClick} />
          </div>
        </div>

        {/* Right Column - Recent Files */}
        <div className="lg:col-span-1">
          <RecentFiles
            files={files}
            loading={loading}
            onRefresh={onRefresh}
            onRename={onRename}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}

interface FilesViewProps {
  activeTab: TabType;
  files: DriveFile[];
  loading: boolean;
  breadcrumbs: { id: string; name: string }[];
  onFileClick: (file: DriveFile) => void;
  onRename: (file: DriveFile) => void;
  onDelete: (file: DriveFile) => void;
  onBreadcrumbNavigate: (index: number) => void;
  onRefresh: () => void;
  onNewFolder: () => void;
}

function FilesView({
  activeTab,
  files,
  loading,
  breadcrumbs,
  onFileClick,
  onRename,
  onDelete,
  onBreadcrumbNavigate,
  onRefresh,
  onNewFolder,
}: FilesViewProps) {
  const tabLabels: Record<TabType, string> = {
    dashboard: 'หน้าแรก',
    documents: 'เอกสาร',
    images: 'รูปภาพ',
    media: 'มีเดีย',
    others: 'อื่นๆ',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">{tabLabels[activeTab]}</h1>
          <p className="text-zinc-500">
            {LABELS.total}: {files.length} {LABELS.items}
          </p>
        </div>
        <NewFolderButton onClick={onNewFolder} />
      </div>

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={breadcrumbs}
        loading={loading}
        onNavigate={onBreadcrumbNavigate}
        onRefresh={onRefresh}
        onNewFolder={onNewFolder}
      />

      {/* File Grid */}
      <FileGrid
        files={files}
        loading={loading}
        onFileClick={onFileClick}
        onRename={onRename}
        onDelete={onDelete}
      />
    </div>
  );
}
