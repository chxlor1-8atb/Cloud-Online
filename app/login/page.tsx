'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Cloud, Lock, User, Github, AlertCircle, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

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
                setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            } else {
                router.push('/');
            }
        } catch (err) {
            setError('เข้าสู่ระบบไม่สำเร็จ');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <main className="min-h-screen bg-primary flex items-center justify-center p-4">
            <div className="w-full max-w-6xl premium-card rounded-[2.5rem] flex flex-col md:flex-row overflow-hidden min-h-[700px] animate-fade-in shadow-2xl">
                {/* Left Section - Hero/Illustration */}
                <div className="md:w-1/2 bg-primary p-16 flex flex-col items-center justify-center text-white text-center relative overflow-hidden">
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-1000"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 space-y-8 max-w-sm">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-white/20 animate-bounce-slow">
                            <Cloud size={48} className="text-white" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                                Manage your files the best way
                            </h1>
                            <p className="text-white/70 text-lg leading-relaxed font-medium">
                                Secure, fast, and easy to use cloud storage for all your documents.
                            </p>
                        </div>

                        {/* Illustration Placeholder */}
                        <div className="pt-12">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
                                <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-full border border-white/10 shadow-inner">
                                    <Cloud size={84} className="text-white/40" />
                                </div>
                                <div className="absolute -top-4 -right-4 bg-accent-pink w-12 h-12 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                    <User size={20} className="text-white" />
                                </div>
                                <div className="absolute -bottom-4 -left-4 bg-accent-green w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
                                    <Lock size={16} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="md:w-1/2 bg-white p-12 lg:p-20 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-10">
                            <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Sign In</h2>
                            <p className="text-slate-500 font-medium">Welcome back! Please enter your details.</p>
                        </div>

                        {/* Login Type Tabs */}
                        <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                            <button
                                onClick={() => setMode('credentials')}
                                className={cn(
                                    "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200",
                                    mode === 'credentials' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                Staff Login
                            </button>
                            <button
                                onClick={() => setMode('google')}
                                className={cn(
                                    "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200",
                                    mode === 'google' ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                Google Auth
                            </button>
                        </div>

                        {mode === 'credentials' ? (
                            <form onSubmit={handleCredentialsLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Enter your username"
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-end mb-1">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                        <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot Password?</button>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-fade-in">
                                        <AlertCircle size={18} />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-primary text-white rounded-full font-bold text-lg shadow-xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
                                >
                                    {loading ? 'Processing...' : 'Sign In Now'}
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="text-center pt-4">
                                    <p className="text-slate-400 text-sm font-medium">Default Staff: <span className="text-slate-800 font-bold">admin / admin123</span></p>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-8 animate-fade-in">
                                <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-3">
                                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                                        <AlertCircle size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-800">Administrator Only</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                        Use your Google Admin account to link your drive features. This is required for core functionality.
                                    </p>
                                </div>

                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full flex items-center justify-center gap-4 py-4 bg-white border-2 border-slate-100 text-slate-800 font-bold rounded-full transition-all hover:bg-slate-50 hover:border-slate-200 active:scale-95 shadow-sm"
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>
                            </div>
                        )}

                        <div className="mt-12 text-center">
                            <p className="text-slate-400 text-sm font-medium">
                                Don't have an account? <button className="text-primary font-bold hover:underline">Sign up for free</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
