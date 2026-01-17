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
            "fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg flex items-center gap-3 z-[100] animate-slide-up border",
            isSuccess
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
        )}>
            {isSuccess ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span className="text-sm font-medium">{status.message}</span>
            <button onClick={onClose} className="ml-2 p-1 hover:bg-white/5 rounded transition-colors">
                <X size={14} />
            </button>
        </div>
    );
}
