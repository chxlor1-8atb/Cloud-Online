'use client';

import { useState, useEffect, useCallback } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

interface DriveFile {
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

interface BreadcrumbItem {
  id: string;
  name: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: 'root', name: 'My Drive' }]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameItem, setRenameItem] = useState<DriveFile | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isLoading = status === 'loading';
  const isFolder = (file: DriveFile) => file.mimeType === 'application/vnd.google-apps.folder';

  const fetchFiles = useCallback(async (folderId: string = 'root') => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/files?folderId=${folderId}`);
      const data = await res.json();
      if (res.ok) {
        setFiles(data.files || []);
      } else {
        setStatusMsg({ type: 'error', message: data.error });
      }
    } catch (error) {
      setStatusMsg({ type: 'error', message: 'Failed to load files' });
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchFiles(currentFolder);
    }
  }, [session, currentFolder, fetchFiles]);

  const handleFolderClick = (folder: DriveFile) => {
    setCurrentFolder(folder.id);
    setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolder(newBreadcrumbs[newBreadcrumbs.length - 1].id);
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setStatusMsg(null);

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('folderId', currentFolder);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: 'success', message: `"${data.file.name}" uploaded!` });
        setUploadFile(null);
        fetchFiles(currentFolder);
      } else {
        setStatusMsg({ type: 'error', message: data.error });
      }
    } catch (error) {
      setStatusMsg({ type: 'error', message: 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName, parentId: currentFolder }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ type: 'success', message: `Folder "${data.name}" created!` });
        setShowNewFolderModal(false);
        setNewFolderName('');
        fetchFiles(currentFolder);
      } else {
        setStatusMsg({ type: 'error', message: data.error });
      }
    } catch (error) {
      setStatusMsg({ type: 'error', message: 'Failed to create folder' });
    }
  };

  const handleDelete = async (file: DriveFile) => {
    if (!confirm(`Delete "${file.name}"?`)) return;
    try {
      const res = await fetch(`/api/files/${file.id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMsg({ type: 'success', message: `"${file.name}" deleted` });
        fetchFiles(currentFolder);
      } else {
        const data = await res.json();
        setStatusMsg({ type: 'error', message: data.error });
      }
    } catch (error) {
      setStatusMsg({ type: 'error', message: 'Delete failed' });
    }
  };

  const handleRename = async () => {
    if (!renameItem || !renameValue.trim()) return;
    try {
      const res = await fetch(`/api/files/${renameItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: renameValue }),
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', message: 'Renamed successfully' });
        setRenameItem(null);
        setRenameValue('');
        fetchFiles(currentFolder);
      } else {
        const data = await res.json();
        setStatusMsg({ type: 'error', message: data.error });
      }
    } catch (error) {
      setStatusMsg({ type: 'error', message: 'Rename failed' });
    }
  };

  const formatSize = (bytes?: string) => {
    if (!bytes) return '-';
    const b = parseInt(bytes);
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1024 / 1024).toFixed(1) + ' MB';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
            ☁️ Cloud Drive
          </h1>
          {session && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {session.user?.image && (
                  <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
                )}
                <span className="text-sm text-slate-300 hidden sm:block">{session.user?.email}</span>
              </div>
              <button onClick={() => signOut()} className="text-sm text-slate-400 hover:text-white px-3 py-1 rounded-lg hover:bg-white/10 transition">
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-pink-500 border-t-transparent rounded-full"></div>
          </div>
        ) : !session ? (
          /* Redirect to Login */
          <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">☁️</div>
              <h2 className="text-3xl font-bold">Welcome to Cloud Drive</h2>
              <p className="text-slate-400">Manage your Google Drive files easily</p>
            </div>
            <a
              href="/login"
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Sign In to Continue
            </a>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-sm overflow-x-auto">
                {breadcrumbs.map((crumb, i) => (
                  <div key={crumb.id} className="flex items-center gap-2 shrink-0">
                    {i > 0 && <span className="text-slate-500">/</span>}
                    <button
                      onClick={() => handleBreadcrumbClick(i)}
                      className={`hover:text-pink-400 transition ${i === breadcrumbs.length - 1 ? 'text-white font-medium' : 'text-slate-400'}`}
                    >
                      {crumb.name}
                    </button>
                  </div>
                ))}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNewFolderModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition"
                >
                  <span>📁</span> New Folder
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 rounded-lg text-sm cursor-pointer transition">
                  <span>⬆️</span> Upload
                  <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && setUploadFile(e.target.files[0])} />
                </label>
                <button onClick={() => fetchFiles(currentFolder)} className="p-2 hover:bg-slate-800 rounded-lg transition" title="Refresh">
                  🔄
                </button>
              </div>
            </div>

            {/* Upload preview */}
            {uploadFile && (
              <div className="mb-4 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span>📄</span>
                  <span>{uploadFile.name}</span>
                  <span className="text-sm text-slate-400">({formatSize(uploadFile.size.toString())})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm transition disabled:opacity-50">
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button onClick={() => setUploadFile(null)} className="p-2 hover:bg-slate-700 rounded-lg">✕</button>
                </div>
              </div>
            )}

            {/* Status message */}
            {statusMsg && (
              <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${statusMsg.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                <span>{statusMsg.type === 'success' ? '✅' : '❌'}</span>
                <span>{statusMsg.message}</span>
                <button onClick={() => setStatusMsg(null)} className="ml-auto hover:opacity-70">✕</button>
              </div>
            )}

            {/* Files Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-10 w-10 border-4 border-pink-500 border-t-transparent rounded-full"></div>
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <span className="text-5xl mb-4">📂</span>
                <p>This folder is empty</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="text-3xl shrink-0">
                        {isFolder(file) ? '📁' : file.mimeType.includes('image') ? '🖼️' : file.mimeType.includes('video') ? '🎬' : file.mimeType.includes('audio') ? '🎵' : file.mimeType.includes('pdf') ? '📕' : file.mimeType.includes('sheet') || file.mimeType.includes('excel') ? '📊' : file.mimeType.includes('document') || file.mimeType.includes('word') ? '📝' : '📄'}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0" onClick={() => isFolder(file) ? handleFolderClick(file) : file.webViewLink && window.open(file.webViewLink, '_blank')}>
                        <p className="font-medium truncate" title={file.name}>{file.name}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {isFolder(file) ? 'Folder' : formatSize(file.size)} • {formatDate(file.modifiedTime)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        {!isFolder(file) && file.webContentLink && (
                          <a href={file.webContentLink} className="p-1.5 hover:bg-slate-700 rounded-lg" title="Download">⬇️</a>
                        )}
                        <button onClick={() => { setRenameItem(file); setRenameValue(file.name); }} className="p-1.5 hover:bg-slate-700 rounded-lg" title="Rename">✏️</button>
                        <button onClick={() => handleDelete(file)} className="p-1.5 hover:bg-rose-500/20 text-rose-400 rounded-lg" title="Delete">🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-pink-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => { setShowNewFolderModal(false); setNewFolderName(''); }} className="px-4 py-2 text-slate-400 hover:text-white transition">
                Cancel
              </button>
              <button onClick={handleCreateFolder} className="px-6 py-2 bg-gradient-to-r from-pink-500 to-violet-600 rounded-xl hover:from-pink-400 hover:to-violet-500 transition">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Rename</h3>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-pink-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => { setRenameItem(null); setRenameValue(''); }} className="px-4 py-2 text-slate-400 hover:text-white transition">
                Cancel
              </button>
              <button onClick={handleRename} className="px-6 py-2 bg-gradient-to-r from-pink-500 to-violet-600 rounded-xl hover:from-pink-400 hover:to-violet-500 transition">
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
