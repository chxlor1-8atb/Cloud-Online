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

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFileSelect={selectFile}
        />

        <div className="px-8 pb-12 animate-fade-in">
          {activeTab === 'dashboard' ? (
            <DashboardView
              stats={stats}
              files={files}
              loading={loading}
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
  onCategoryClick: (category: TabType) => void;
  onRefresh: () => void;
  onRename: (file: DriveFile) => void;
  onDelete: (file: DriveFile) => void;
}

function DashboardView({ stats, files, loading, onCategoryClick, onRefresh, onRename, onDelete }: DashboardViewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <StorageCard usedBytes={stats.total} />
        <CategoryGrid stats={stats} onCategoryClick={onCategoryClick} />
      </div>
      <RecentFiles
        files={files}
        loading={loading}
        onRefresh={onRefresh}
        onRename={onRename}
        onDelete={onDelete}
      />
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">{tabLabels[activeTab]}</h2>
          <p className="text-slate-500 font-medium">
            {LABELS.total}: {files.length} {LABELS.items}
          </p>
        </div>
        <NewFolderButton onClick={onNewFolder} />
      </div>

      <Breadcrumbs
        items={breadcrumbs}
        loading={loading}
        onNavigate={onBreadcrumbNavigate}
        onRefresh={onRefresh}
        onNewFolder={onNewFolder}
      />

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
