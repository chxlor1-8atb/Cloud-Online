'use client';

import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import type { StatusMessage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusNotificationProps {
    status: StatusMessage;
    onClose: () => void;
}

export function StatusNotification({ status, onClose }: StatusNotificationProps) {
    const isSuccess = status.type === 'success';

    return (
        <div className={cn(
            "fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[100] animate-bounce-in border",
            isSuccess
                ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                : "bg-rose-50 border-rose-100 text-rose-800"
        )}>
            {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="font-bold text-sm tracking-tight">{status.message}</span>
            <button onClick={onClose} className="ml-4 hover:opacity-70">
                <X size={16} />
            </button>
        </div>
    );
}
