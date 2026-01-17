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
            "fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-[100] animate-slide-up backdrop-blur-md border",
            isSuccess
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/20 border-rose-500/30 text-rose-300"
        )}>
            <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                isSuccess ? "bg-emerald-500/20" : "bg-rose-500/20"
            )}>
                {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            </div>
            <span className="font-medium text-sm">{status.message}</span>
            <button onClick={onClose} className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X size={14} />
            </button>
        </div>
    );
}
