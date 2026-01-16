'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface OTPModalProps {
    email: string;
    onVerify: (code: string) => Promise<void>;
    onResend: () => Promise<void>;
    onClose: () => void;
    loading?: boolean;
    error?: string;
}

export function OTPModal({ email, onVerify, onResend, onClose, loading, error }: OTPModalProps) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when complete
        if (value && index === 5 && newOtp.every(d => d !== '')) {
            onVerify(newOtp.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData.length === 6) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            onVerify(pastedData);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await onResend();
        } finally {
            setResending(false);
        }
    };

    const handleSubmit = () => {
        const code = otp.join('');
        if (code.length === 6) {
            onVerify(code);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-slide-up">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-slate-800 mb-2">ยืนยันรหัส OTP</h2>
                    <p className="text-slate-500">
                        เราได้ส่งรหัสยืนยันไปยังอีเมล <span className="text-[#20B2C4] font-semibold">{email}</span>
                    </p>
                </div>

                {/* OTP Inputs */}
                <div className="flex justify-center gap-3 mb-6">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            disabled={loading}
                            className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#20B2C4]/20 focus:border-[#20B2C4] transition-all disabled:opacity-50"
                        />
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm text-center font-medium animate-fade-in">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading || otp.some(d => d === '')}
                    className="w-full py-4 bg-[#20B2C4] text-white rounded-full font-bold text-lg shadow-xl shadow-[#20B2C4]/30 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                >
                    {loading ? 'กำลังตรวจสอบ...' : 'ยืนยัน'}
                </button>

                {/* Resend Link */}
                <div className="text-center mt-6">
                    <span className="text-slate-400 text-sm">ไม่ได้รับรหัส? </span>
                    <button
                        onClick={handleResend}
                        disabled={resending}
                        className="text-[#20B2C4] text-sm font-bold hover:underline disabled:opacity-50"
                    >
                        {resending ? 'กำลังส่งใหม่...' : 'กดเพื่อส่งรหัสอีกครั้ง'}
                    </button>
                </div>
            </div>
        </div>
    );
}
