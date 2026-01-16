'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Video,
  MoreHorizontal,
  Search,
  Plus,
  LogOut,
  ChevronRight,
  Trash2,
  Edit3,
  Download,
  FolderPlus,
  RefreshCw,
  File,
  X,
  Upload,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Folder
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

type TabType = 'dashboard' | 'documents' | 'images' | 'media' | 'others';

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
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const isLoadingAuth = status === 'loading';
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
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchFiles(currentFolder);
    }
  }, [currentFolder, fetchFiles, status]);

  const handleFolderClick = (folder: DriveFile) => {
    setCurrentFolder(folder.id);
    setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
    setActiveTab('dashboard'); // Reset to dashboard when entering a folder
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
    } finally {
      setShowActionMenu(null);
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
    return new Date(date).toLocaleDateString('en-US', {
      hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short'
    });
  };

  // Filtering logic
  const filteredFiles = useMemo(() => {
    let result = files;

    // Search filter
    if (searchQuery) {
      result = result.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Category filter
    if (activeTab === 'dashboard') return result;

    const docTags = ['pdf', 'document', 'sheet', 'msword', 'text'];
    const imgTags = ['image'];
    const mediaTags = ['video', 'audio'];

    if (activeTab === 'documents') {
      return result.filter(f => docTags.some(tag => f.mimeType.includes(tag)));
    }
    if (activeTab === 'images') {
      return result.filter(f => imgTags.some(tag => f.mimeType.includes(tag)));
    }
    if (activeTab === 'media') {
      return result.filter(f => mediaTags.some(tag => f.mimeType.includes(tag)));
    }
    if (activeTab === 'others') {
      return result.filter(f =>
        !isFolder(f) &&
        !docTags.some(tag => f.mimeType.includes(tag)) &&
        !imgTags.some(tag => f.mimeType.includes(tag)) &&
        !mediaTags.some(tag => f.mimeType.includes(tag))
      );
    }

    return result;
  }, [files, activeTab, searchQuery]);

  const stats = useMemo(() => {
    const calculateSize = (type: string[]) =>
      files.filter(f => type.some(tag => f.mimeType.includes(tag)))
        .reduce((acc, f) => acc + parseInt(f.size || '0'), 0);

    const docSize = calculateSize(['pdf', 'document', 'sheet', 'msword', 'text']);
    const imgSize = calculateSize(['image']);
    const mediaSize = calculateSize(['video', 'audio']);
    const totalSize = files.reduce((acc, f) => acc + parseInt(f.size || '0'), 0);

    return {
      documents: docSize,
      images: imgSize,
      media: mediaSize,
      total: totalSize,
      count: files.length
    };
  }, [files]);

  if (status === 'unauthenticated' || status === 'loading') {
    return (
      <div className="min-h-screen bg-[#00A6EB] flex items-center justify-center p-4">
        <div className="w-full max-w-6xl premium-card rounded-2xl flex flex-col md:flex-row overflow-hidden min-h-[600px] animate-fade-in">
          {/* Left Hero */}
          <div className="md:w-1/2 bg-[#00A6EB] p-12 flex flex-col items-center justify-center text-white text-center">
            <Cloud className="w-24 h-24 mb-8" />
            <h1 className="text-4xl font-bold mb-4 leading-tight">Manage your files the best way</h1>
            <p className="text-white/80 text-lg">This is a place where you can store all your documents securely.</p>
            <div className="mt-12 relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
              <Folder className="relative w-32 h-32 text-white/40" />
            </div>
          </div>
          {/* Right Form */}
          <div className="md:w-1/2 bg-white p-12 flex flex-col items-center justify-center">
            {status === 'loading' ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium">Loading session...</p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-[#1E293B] mb-8">Sign In</h2>
                <div className="w-full max-w-sm space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-500">Email Address</label>
                    <div className="w-full px-4 py-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-400">
                      Login with Google to continue
                    </div>
                  </div>
                  <button
                    onClick={() => signIn('google')}
                    className="w-full py-4 bg-[#00A6EB] text-white rounded-full font-bold shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                  >
                    Sign In with Google
                  </button>
                  <p className="text-center text-slate-400 text-sm">
                    Don't have an account? <span className="text-primary font-bold cursor-pointer">Sign Up</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col p-8 shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <Cloud className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">CloudSync</span>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={cn("sidebar-item w-full", activeTab === 'dashboard' && "active")}
          >
            <LayoutDashboard size={20} />
            <span className="font-semibold">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={cn("sidebar-item w-full", activeTab === 'documents' && "active")}
          >
            <FileText size={20} />
            <span className="font-semibold">Documents</span>
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={cn("sidebar-item w-full", activeTab === 'images' && "active")}
          >
            <ImageIcon size={20} />
            <span className="font-semibold">Images</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={cn("sidebar-item w-full", activeTab === 'media' && "active")}
          >
            <Video size={20} />
            <span className="font-semibold">Media</span>
          </button>
          <button
            onClick={() => setActiveTab('others')}
            className={cn("sidebar-item w-full", activeTab === 'others' && "active")}
          >
            <MoreHorizontal size={20} />
            <span className="font-semibold">Others</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="mt-auto pt-8 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl relative group">
            {session?.user?.image && (
              <img src={session.user.image} alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{session?.user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md z-10">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-full py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="upload-btn cursor-pointer">
              <Upload size={18} />
              <span>Upload</span>
              <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && setUploadFile(e.target.files[0])} />
            </label>
            <button
              onClick={() => signOut()}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="px-8 pb-12 animate-fade-in">
          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Storage & Categories */}
              <div className="lg:col-span-2 space-y-8">
                {/* Storage Card */}
                <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white/80">Available Storage</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">{formatSize(stats.total.toString())}</span>
                        <span className="text-xl text-white/60">/ 15 GB</span>
                      </div>
                    </div>
                    <div className="w-32 h-32 relative">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/20" />
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364} strokeDashoffset={364 * (1 - Math.min(stats.total / (15 * 1024 * 1024 * 1024), 1))} className="text-white" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-bold">
                        {Math.round((stats.total / (15 * 1024 * 1024 * 1024)) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { id: 'documents', label: 'Documents', icon: FileText, color: 'bg-rose-100 text-rose-500', size: stats.documents },
                    { id: 'images', label: 'Images', icon: ImageIcon, color: 'bg-blue-100 text-blue-500', size: stats.images },
                    { id: 'media', label: 'Media', icon: Video, color: 'bg-emerald-100 text-emerald-500', size: stats.media },
                    { id: 'others', label: 'Others', icon: MoreHorizontal, color: 'bg-purple-100 text-purple-500', size: Math.max(0, stats.total - (stats.documents + stats.images + stats.media)) }
                  ].map((category) => (
                    <div
                      key={category.id}
                      onClick={() => setActiveTab(category.id as TabType)}
                      className="premium-card rounded-2xl p-6 cursor-pointer flex flex-col gap-4 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", category.color)}>
                          <category.icon size={24} />
                        </div>
                        <span className="text-sm font-bold text-slate-800">{formatSize(category.size.toString())}</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-800">{category.label}</h4>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className={cn("h-full transition-all duration-1000", category.color.split(' ')[0])} style={{ width: `${Math.min((category.size / Math.max(stats.total, 1)) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Recent Files */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-800">Recent files uploaded</h3>
                  <button onClick={() => fetchFiles(currentFolder)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <RefreshCw size={18} className={cn(loading && "animate-spin")} />
                  </button>
                </div>

                <div className="space-y-4 flex-1">
                  {files.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                      <File size={48} strokeWidth={1} />
                      <p className="text-sm font-medium">No files are uploaded</p>
                    </div>
                  ) : (
                    files.slice(0, 8).map(file => (
                      <div key={file.id} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
                          {file.thumbnailLink ? (
                            <img src={file.thumbnailLink} className="w-full h-full object-cover" />
                          ) : (
                            <File size={20} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-sm truncate">{file.name}</p>
                          <p className="text-xs text-slate-400">{formatDate(file.modifiedTime)}</p>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === file.id ? null : file.id)}
                            className="p-2 text-slate-300 hover:text-slate-600 transition-colors"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          {showActionMenu === file.id && (
                            <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-20 animate-fade-in">
                              <button
                                onClick={() => { setRenameItem(file); setRenameValue(file.name); setShowActionMenu(null); }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                              >
                                <Edit3 size={16} className="text-primary" /> Rename
                              </button>
                              {file.webContentLink && (
                                <a
                                  href={file.webContentLink}
                                  className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                                >
                                  <Download size={16} className="text-accent-purple" /> Download
                                </a>
                              )}
                              <button
                                onClick={() => handleDelete(file)}
                                className="w-full px-4 py-2 text-left text-sm text-rose-500 hover:bg-rose-50 flex items-center gap-3"
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Tab View: List/Grid of files
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 capitalize mb-2">{activeTab}</h2>
                  <p className="text-slate-500 font-medium">Total: {filteredFiles.length} items</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowNewFolderModal(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                  >
                    <FolderPlus size={18} className="text-primary" />
                    <span>New Folder</span>
                  </button>
                </div>
              </div>

              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-sm text-slate-400 bg-white p-4 rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
                {breadcrumbs.map((crumb, i) => (
                  <div key={crumb.id} className="flex items-center gap-2 shrink-0">
                    {i > 0 && <ChevronRight size={14} />}
                    <button
                      onClick={() => handleBreadcrumbClick(i)}
                      className={cn("hover:text-primary transition font-semibold", i === breadcrumbs.length - 1 && "text-slate-800")}
                    >
                      {crumb.name}
                    </button>
                  </div>
                ))}
                <button onClick={() => fetchFiles(currentFolder)} className="ml-auto p-1 text-slate-300 hover:text-primary transition-colors">
                  <RefreshCw size={16} className={cn(loading && "animate-spin")} />
                </button>
              </div>

              {/* Files Grid */}
              {loading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 space-y-4 premium-card rounded-2xl">
                  <Folder size={64} strokeWidth={1} />
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">No items found</p>
                    <p className="text-sm">Try searching for something else or upload a new file.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredFiles.map(file => (
                    <div key={file.id} className="premium-card rounded-3xl p-6 group relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", isFolder(file) ? "bg-amber-100 text-amber-500" : "bg-slate-100 text-slate-500 overflow-hidden")}>
                          {isFolder(file) ? <Folder size={32} /> : file.thumbnailLink ? <img src={file.thumbnailLink} className="w-full h-full object-cover" /> : <File size={32} />}
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === file.id ? null : file.id)}
                            className="p-2 text-slate-300 hover:text-slate-600 transition-colors"
                          >
                            <MoreHorizontal size={20} />
                          </button>
                          {showActionMenu === file.id && (
                            <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-20 animate-fade-in">
                              <button
                                onClick={() => { setRenameItem(file); setRenameValue(file.name); setShowActionMenu(null); }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                              >
                                <Edit3 size={16} className="text-primary" /> Rename
                              </button>
                              {file.webContentLink && (
                                <a
                                  href={file.webContentLink}
                                  className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3"
                                >
                                  <Download size={16} className="text-accent-purple" /> Download
                                </a>
                              )}
                              <button
                                onClick={() => handleDelete(file)}
                                className="w-full px-4 py-2 text-left text-sm text-rose-500 hover:bg-rose-50 flex items-center gap-3"
                              >
                                <Trash2 size={16} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => isFolder(file) ? handleFolderClick(file) : window.open(file.webViewLink, '_blank')}
                      >
                        <h4 className="font-bold text-slate-800 truncate mb-1" title={file.name}>{file.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400">{isFolder(file) ? 'Folder' : formatSize(file.size)}</span>
                          <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">{formatDate(file.modifiedTime)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating Status Notification */}
      {statusMsg && (
        <div className={cn(
          "fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[100] animate-bounce-in border",
          statusMsg.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-rose-50 border-rose-100 text-rose-800"
        )}>
          {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="font-bold text-sm tracking-tight">{statusMsg.message}</span>
          <button onClick={() => setStatusMsg(null)} className="ml-4 hover:opacity-70"><X size={16} /></button>
        </div>
      )}

      {/* Modal Overlay Components */}
      {uploadFile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Uploading</h3>
            <div className="bg-slate-50 rounded-2xl p-6 flex items-center gap-4 border border-slate-100 mb-8 overflow-hidden">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-sm shrink-0">
                <File size={32} />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-bold text-slate-800 truncate">{uploadFile.name}</p>
                <p className="text-sm text-slate-400">{formatSize(uploadFile.size.toString())}</p>
              </div>
              <button onClick={() => setUploadFile(null)} className="p-2 text-slate-300 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setUploadFile(null)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-full transition-colors">Cancel</button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 py-4 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/30 transition-all hoverScale active:scale-95 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Create New Folder</h3>
            <div className="space-y-4 mb-8">
              <label className="text-sm font-semibold text-slate-500">Folder Name</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter workspace name"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                autoFocus
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setShowNewFolderModal(false); setNewFolderName(''); }} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-full transition-colors">Cancel</button>
              <button
                onClick={handleCreateFolder}
                className="flex-1 py-4 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/30 transition-all active:scale-95"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Rename</h3>
            <div className="space-y-4 mb-8">
              <label className="text-sm font-bold text-slate-500">New Name</label>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold"
                autoFocus
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setRenameItem(null); setRenameValue(''); }} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-full transition-colors">Cancel</button>
              <button
                onClick={handleRename}
                className="flex-1 py-4 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/30 transition-all active:scale-95"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
