import { useCallback, useEffect, useRef, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

export const TOAST_DURATION_MS = 5000;
export const TOAST_EXIT_MS = 280;

interface ToastTimer {
  timeoutId?: ReturnType<typeof setTimeout>;
  remaining: number;
  startedAt: number;
}

let toastListeners: Array<(toast: Toast) => void> = [];

export const showToast = (message: string, type: ToastType = 'info') => {
  const toast: Toast = {
    id: Math.random().toString(36).substr(2, 9),
    message,
    type,
  };
  toastListeners.forEach((listener) => listener(toast));
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ToastTimer>>(new Map());
  const exitTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer?.timeoutId) {
      clearTimeout(timer.timeoutId);
    }
    timersRef.current.delete(id);

    if (exitTimersRef.current.has(id)) return;

    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, exiting: true } : toast)),
    );

    const exitId = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      exitTimersRef.current.delete(id);
    }, TOAST_EXIT_MS);

    exitTimersRef.current.set(id, exitId);
  }, []);

  const scheduleDismiss = useCallback(
    (id: string, delay: number) => {
      const timeoutId = setTimeout(() => dismiss(id), delay);
      timersRef.current.set(id, {
        timeoutId,
        remaining: delay,
        startedAt: Date.now(),
      });
    },
    [dismiss],
  );

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      scheduleDismiss(toast.id, TOAST_DURATION_MS);
    };

    toastListeners.push(listener);

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, [scheduleDismiss]);

  useEffect(() => {
    const timers = timersRef.current;
    const exitTimers = exitTimersRef.current;

    return () => {
      timers.forEach((timer) => {
        if (timer.timeoutId) clearTimeout(timer.timeoutId);
      });
      exitTimers.forEach((timeoutId) => clearTimeout(timeoutId));
      timers.clear();
      exitTimers.clear();
    };
  }, []);

  const pauseToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (!timer?.timeoutId) return;

    clearTimeout(timer.timeoutId);
    timersRef.current.set(id, {
      remaining: Math.max(0, timer.remaining - (Date.now() - timer.startedAt)),
      startedAt: Date.now(),
    });
  }, []);

  const resumeToast = useCallback(
    (id: string) => {
      const timer = timersRef.current.get(id);
      if (!timer || timer.timeoutId) return;

      if (timer.remaining <= 0) {
        dismiss(id);
        return;
      }

      scheduleDismiss(id, timer.remaining);
    },
    [dismiss, scheduleDismiss],
  );

  return { toasts, removeToast: dismiss, pauseToast, resumeToast };
};
