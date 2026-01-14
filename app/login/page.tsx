'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<'credentials' | 'google'>('credentials');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid username or password');
            } else {
                router.push('/');
            }
        } catch (err) {
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-400">
                        ☁️ Cloud Drive
                    </h1>
                    <p className="text-slate-400 mt-2">Sign in to manage your files</p>
                </div>

                {/* Card */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8">
                    {/* Tab Switcher */}
                    <div className="flex rounded-xl bg-slate-900 p-1 mb-6">
                        <button
                            onClick={() => setMode('credentials')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${mode === 'credentials'
                                    ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Username
                        </button>
                        <button
                            onClick={() => setMode('google')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${mode === 'google'
                                    ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Google (Admin)
                        </button>
                    </div>

                    {mode === 'credentials' ? (
                        /* Username/Password Form */
                        <form onSubmit={handleCredentialsLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500 transition"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-pink-500 transition"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-lg text-rose-300 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 text-white font-semibold rounded-xl transition disabled:opacity-50"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>

                            <p className="text-xs text-slate-500 text-center mt-4">
                                Default: admin / admin123
                            </p>
                        </form>
                    ) : (
                        /* Google Login */
                        <div className="space-y-4">
                            <div className="p-4 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-200 text-sm">
                                <p className="font-medium mb-1">⚠️ Admin Only</p>
                                <p className="text-amber-300/80">
                                    Use Google login to connect your Drive account. This is required for the first setup or to update the connection.
                                </p>
                            </div>

                            <button
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-3 py-3 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-100 transition"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Sign in with Google
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    Powered by Next.js & Google Drive API
                </p>
            </div>
        </main>
    );
}
