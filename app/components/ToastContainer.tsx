'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Info, LucideIcon, X, XCircle } from 'lucide-react';
import {
  Toast,
  ToastType,
  TOAST_DURATION_MS,
  useToast,
} from '../hooks/useToast';

interface ToastStyle {
  label: string;
  accent: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  progress: string;
  labelColor: string;
}

const toastStyles: Record<ToastType, ToastStyle> = {
  success: {
    label: 'Success',
    accent: 'border-l-green',
    icon: CheckCircle,
    iconBg: 'bg-green',
    iconColor: 'text-white',
    progress: 'bg-green',
    labelColor: 'text-green',
  },
  error: {
    label: 'Error',
    accent: 'border-l-red',
    icon: XCircle,
    iconBg: 'bg-red',
    iconColor: 'text-white',
    progress: 'bg-red',
    labelColor: 'text-red',
  },
  warning: {
    label: 'Warning',
    accent: 'border-l-yellow',
    icon: AlertCircle,
    iconBg: 'bg-orange',
    iconColor: 'text-white',
    progress: 'bg-yellow',
    labelColor: 'text-orange',
  },
  info: {
    label: 'Info',
    accent: 'border-l-blue',
    icon: Info,
    iconBg: 'bg-blue',
    iconColor: 'text-white',
    progress: 'bg-blue',
    labelColor: 'text-blue',
  },
};

const ToastItem: React.FC<{
  toast: Toast;
  onDismiss: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}> = ({ toast, onDismiss, onPause, onResume }) => {
  const style = toastStyles[toast.type];
  const Icon = style.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      onMouseEnter={() => {
        if (!toast.exiting) onPause(toast.id);
      }}
      onMouseLeave={() => {
        if (!toast.exiting) onResume(toast.id);
      }}
      className={`group pointer-events-auto relative overflow-hidden rounded-lg border border-gray-100 border-l-4 bg-white shadow-xl ${style.accent} ${
        toast.exiting ? 'animate-slide-out' : 'animate-slide-in'
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${style.iconBg}`}
        >
          <Icon className={`h-4 w-4 ${style.iconColor}`} aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <p className={`text-xs font-semibold tracking-wide ${style.labelColor}`}>
            {style.label}
          </p>
          <p className="mt-0.5 text-sm leading-relaxed text-gray">{toast.message}</p>
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="flex-shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {!toast.exiting && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-100">
          <div
            className={`h-full origin-left ${style.progress} animate-toast-progress group-hover:[animation-play-state:paused]`}
            style={{ animationDuration: `${TOAST_DURATION_MS}ms` }}
          />
        </div>
      )}
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast, pauseToast, resumeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] w-full max-w-sm space-y-3">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={removeToast}
          onPause={pauseToast}
          onResume={resumeToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
