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
  const [currentFolder, setCurrentFolder] = useState<string>('1xO8zenJM5cIRhtGfkBmuPw9Szxs7mg-F');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: '1xO8zenJM5cIRhtGfkBmuPw9Szxs7mg-F', name: 'Cloud-Online' }]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameItem, setRenameItem] = useState<DriveFile | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
  const [hoveredFile, setHoveredFile] = useState<DriveFile | null>(null);

  const isLoading = status === 'loading';
  const isFolder = (file: DriveFile) => file.mimeType === 'application/vnd.google-apps.folder';

  const fetchFiles = useCallback(async (folderId: string = '1xO8zenJM5cIRhtGfkBmuPw9Szxs7mg-F') => {
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
    fetchFiles(currentFolder);
  }, [currentFolder, fetchFiles]);

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
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <div className="flex items-center gap-2">
                  {session.user?.image && (
                    <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
                  )}
                  <span className="text-sm text-slate-300 hidden sm:block">{session.user?.email}</span>
                </div>
                <button onClick={() => signOut()} className="text-sm text-slate-400 hover:text-white px-3 py-1 rounded-lg hover:bg-white/10 transition">
                  Sign out
                </button>
              </>
            ) : (
              <a href="/login" className="text-sm text-slate-400 hover:text-white px-3 py-1 rounded-lg hover:bg-white/10 transition">
                Sign In
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-pink-500 border-t-transparent rounded-full"></div>
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

            {/* Main Content Area with Side Preview */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                {files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <span className="text-5xl mb-4">📂</span>
                    <p>This folder is empty</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        onMouseEnter={() => !isFolder(file) && setHoveredFile(file)}
                        className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 transition-all cursor-pointer relative overflow-hidden"
                      >
                        <div className="flex items-start gap-4">
                          {/* Thumbnail / Icon */}
                          <div className="w-16 h-16 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 overflow-hidden border border-white/5 relative group-hover:border-pink-500/50 transition-colors">
                            {file.thumbnailLink ? (
                              <img
                                src={file.thumbnailLink.replace('=s220', '=s400')}
                                alt=""
                                className="w-full h-full object-cover transition transform group-hover:scale-110"
                              />
                            ) : (
                              <div className="text-3xl">
                                {isFolder(file) ? '📁' : file.mimeType.includes('image') ? '🖼️' : file.mimeType.includes('video') ? '🎬' : file.mimeType.includes('audio') ? '🎵' : file.mimeType.includes('pdf') ? '📕' : file.mimeType.includes('sheet') || file.mimeType.includes('excel') ? '📊' : file.mimeType.includes('document') || file.mimeType.includes('word') ? '📝' : '📄'}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0" onClick={() => isFolder(file) ? handleFolderClick(file) : setPreviewFile(file)}>
                            <p className="font-medium truncate text-sm" title={file.name}>{file.name}</p>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1 font-bold">
                              {isFolder(file) ? 'Folder' : file.mimeType.split('/').pop()?.split('.').pop()}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {isFolder(file) ? '-' : formatSize(file.size)} • {formatDate(file.modifiedTime)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition translate-x-2 group-hover:translate-x-0">
                            <button onClick={(e) => { e.stopPropagation(); setRenameItem(file); setRenameValue(file.name); }} className="p-1.5 bg-slate-900/80 hover:bg-slate-700 rounded-lg backdrop-blur-md border border-white/10" title="Rename">✏️</button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(file); }} className="p-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 rounded-lg backdrop-blur-md border border-rose-500/20" title="Delete">🗑️</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Instant Preview Side Pane */}
              <div className="hidden lg:block w-80 shrink-0">
                <div className="sticky top-24 bg-slate-800/30 border border-white/5 rounded-2xl p-6 backdrop-blur-sm min-h-[400px] flex flex-col">
                  {hoveredFile ? (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="aspect-square rounded-xl bg-black/40 overflow-hidden border border-white/10 mb-4 group relative">
                        {hoveredFile.thumbnailLink ? (
                          <img
                            src={hoveredFile.thumbnailLink.replace('=s220', '=s800')}
                            className="w-full h-full object-contain"
                            alt=""
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
                            📄
                          </div>
                        )}
                        <button
                          onClick={() => setPreviewFile(hoveredFile)}
                          className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-[2px]"
                        >
                          <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm shadow-xl">
                            Open Peek 👁️
                          </span>
                        </button>
                      </div>
                      <h4 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{hoveredFile.name}</h4>
                      <div className="space-y-4 text-sm text-slate-400">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span>Type</span>
                          <span className="text-white truncate max-w-[150px]">{hoveredFile.mimeType}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span>Size</span>
                          <span className="text-white">{formatSize(hoveredFile.size)}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span>Modified</span>
                          <span className="text-white">{formatDate(hoveredFile.modifiedTime)}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-6 flex flex-col gap-2">
                        {hoveredFile.webContentLink && (
                          <a
                            href={hoveredFile.webContentLink}
                            className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition"
                          >
                            <span>⬇️</span> Download
                          </a>
                        )}
                        <button
                          onClick={() => setPreviewFile(hoveredFile)}
                          className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition"
                        >
                          Full Preview
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mb-4">
                        🔍
                      </div>
                      <p className="text-sm">Hover over a file<br />to see instant details</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
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
      {/* Peek Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 scale-in">
          <div className="bg-slate-900 rounded-2xl w-full max-w-5xl h-[85vh] border border-white/10 flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {previewFile.mimeType.includes('image') ? '🖼️' : previewFile.mimeType.includes('video') ? '🎬' : previewFile.mimeType.includes('audio') ? '🎵' : previewFile.mimeType.includes('pdf') ? '📕' : '📄'}
                </span>
                <div>
                  <h3 className="font-bold truncate max-w-md">{previewFile.name}</h3>
                  <p className="text-xs text-slate-400">{formatSize(previewFile.size)} • {formatDate(previewFile.modifiedTime)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewFile.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm transition"
                >
                  Open in Drive ↗
                </a>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 hover:bg-rose-500/20 text-rose-400 rounded-xl transition rotate-hover"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
            </div>
            <div className="flex-1 bg-black relative">
              <iframe
                src={`https://drive.google.com/file/d/${previewFile.id}/preview`}
                className="w-full h-full border-none"
                allow="autoplay"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
