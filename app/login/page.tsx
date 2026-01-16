'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cloud, Mail, User, AlertCircle, ChevronRight, Lock } from 'lucide-react';
import { OTPModal } from '@/components/modals/OTPModal';

type AuthMode = 'signin' | 'signup';

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>('signin');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [verifying, setVerifying] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                // Sign up flow
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email }),
                });

                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || 'Failed to sign up');
                    return;
                }

                // Show OTP modal
                setShowOTPModal(true);

                // Debug OTP (Development only)
                if (data.debug_otp) {
                    console.log('═══════════════════════════════════════');
                    console.log('🔓 DEV MODE OTP:', data.debug_otp);
                    console.log('═══════════════════════════════════════');
                    alert(`[DEV MODE] Your OTP is: ${data.debug_otp}`);
                }
            } else {
                // Sign in flow
                const res = await fetch('/api/auth/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, isSignIn: true }),
                });

                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || 'Failed to send OTP');
                    return;
                }

                // Show OTP modal
                setShowOTPModal(true);

                // Debug OTP (Development only)
                if (data.debug_otp) {
                    console.log('═══════════════════════════════════════');
                    console.log('🔓 DEV MODE OTP:', data.debug_otp);
                    console.log('═══════════════════════════════════════');
                    alert(`[DEV MODE] Your OTP is: ${data.debug_otp}`);
                }
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (code: string) => {
        setOtpError('');
        setVerifying(true);

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, name: mode === 'signup' ? name : undefined }),
            });

            const data = await res.json();
            if (!res.ok) {
                setOtpError(data.error || 'Invalid OTP');
                return;
            }

            // Success - redirect to home
            router.push('/');
        } catch (err) {
            setOtpError('Failed to verify OTP. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const handleResendOTP = async () => {
        setOtpError('');

        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, isSignIn: mode === 'signin' }),
            });

            const data = await res.json();
            if (!res.ok) {
                setOtpError(data.error || 'Failed to resend OTP');
            } else if (data.debug_otp) {
                console.log('🔓 DEV MODE OTP (Resend):', data.debug_otp);
                alert(`[DEV MODE] Your OTP is: ${data.debug_otp}`);
            }
        } catch (err) {
            setOtpError('Failed to resend OTP. Please try again.');
        }
    };

    return (
        <main className="min-h-screen bg-[#1B4D7A] flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-white rounded-[2.5rem] flex flex-col md:flex-row overflow-hidden min-h-[700px] animate-fade-in shadow-2xl">
                {/* Left Section - Hero/Illustration */}
                <div className="md:w-1/2 bg-[#1B4D7A] p-16 flex flex-col items-center justify-center text-white text-center relative overflow-hidden">
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 space-y-8 max-w-sm">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-white/20 animate-bounce-slow">
                            <Cloud size={48} className="text-white" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                                จัดการไฟล์ของคุณ<br />ด้วยวิธีที่ดีที่สุด
                            </h1>
                            <p className="text-white/70 text-lg leading-relaxed font-medium">
                                พื้นที่จัดเก็บข้อมูลบนคลาวด์ที่ปลอดภัย รวดเร็ว และใช้งานง่าย สำหรับทุกเอกสารสำคัญของคุณ
                            </p>
                        </div>

                        {/* Illustration Placeholder */}
                        <div className="pt-12">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
                                <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-full border border-white/10 shadow-inner">
                                    <Cloud size={84} className="text-white/40" />
                                </div>
                                <div className="absolute -top-4 -right-4 bg-pink-400 w-12 h-12 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                    <User size={20} className="text-white" />
                                </div>
                                <div className="absolute -bottom-4 -left-4 bg-green-400 w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
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
                            <h2 className="text-4xl font-black text-[#1B4D7A] tracking-tight mb-2">
                                {mode === 'signup' ? 'ลงทะเบียน' : 'เข้าสู่ระบบ'}
                            </h2>
                            <p className="text-slate-500 font-medium">
                                {mode === 'signup'
                                    ? 'สร้างบัญชีผู้ใช้เพื่อเริ่มต้นใช้งาน'
                                    : 'ยินดีต้อนรับกลับ! กรุณากรอกอีเมลของคุณ'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {mode === 'signup' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#20B2C4] ml-1">ชื่อ-นามสกุล</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="กรอกชื่อ-นามสกุลของคุณ"
                                            className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#20B2C4]/10 focus:border-[#20B2C4] transition-all font-medium text-slate-800 placeholder:text-slate-400"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#20B2C4] ml-1">อีเมล</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="กรอกอีเมลของคุณ"
                                        className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#20B2C4]/10 focus:border-[#20B2C4] transition-all font-medium text-slate-800 placeholder:text-slate-400"
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
                                className="w-full py-4 bg-[#20B2C4] text-white rounded-full font-bold text-lg shadow-xl shadow-[#20B2C4]/30 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 group"
                            >
                                {loading ? 'กำลังดำเนินการ...' : mode === 'signup' ? 'ลงทะเบียน' : 'เข้าสู่ระบบ'}
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-400 text-sm font-medium">
                                {mode === 'signup' ? (
                                    <>
                                        มีบัญชีอยู่แล้ว?{' '}
                                        <button
                                            onClick={() => { setMode('signin'); setError(''); }}
                                            className="text-[#20B2C4] font-bold hover:underline"
                                        >
                                            เข้าสู่ระบบ
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        ยังไม่มีบัญชี?{' '}
                                        <button
                                            onClick={() => { setMode('signup'); setError(''); }}
                                            className="text-[#20B2C4] font-bold hover:underline"
                                        >
                                            ลงทะเบียนฟรี
                                        </button>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOTPModal && (
                <OTPModal
                    email={email}
                    onVerify={handleVerifyOTP}
                    onResend={handleResendOTP}
                    onClose={() => setShowOTPModal(false)}
                    loading={verifying}
                    error={otpError}
                />
            )}
        </main>
    );
}
