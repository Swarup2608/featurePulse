"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const toastStore = {
  toasts: [] as Toast[],
  listeners: new Set<() => void>(),

  add(toast: Omit<Toast, "id">) {
    const id = Math.random().toString(36).substring(7);
    const newToast = { ...toast, id };
    this.toasts.push(newToast);
    this.notify();

    if (toast.duration !== Infinity) {
      setTimeout(() => this.remove(id), toast.duration || 3000);
    }

    return id;
  },

  remove(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  },

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  },

  notify() {
    this.listeners.forEach((listener) => listener());
  },
};

export function useToast() {
  return {
    success: (message: string, duration?: number) =>
      toastStore.add({ message, type: "success", duration }),
    error: (message: string, duration?: number) =>
      toastStore.add({ message, type: "error", duration }),
    info: (message: string, duration?: number) =>
      toastStore.add({ message, type: "info", duration }),
  };
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(() => {
      setToasts([...toastStore.toasts]);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => toastStore.remove(toast.id)}
        />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon =
    toast.type === "success"
      ? CheckCircle2
      : toast.type === "error"
        ? AlertCircle
        : Info;

  const bgColor =
    toast.type === "success"
      ? "bg-emerald-50 border-emerald-200"
      : toast.type === "error"
        ? "bg-red-50 border-red-200"
        : "bg-blue-50 border-blue-200";

  const textColor =
    toast.type === "success"
      ? "text-emerald-700"
      : toast.type === "error"
        ? "text-red-700"
        : "text-blue-700";

  const iconColor =
    toast.type === "success"
      ? "text-emerald-600"
      : toast.type === "error"
        ? "text-red-600"
        : "text-blue-600";

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 rounded-lg border ${bgColor} px-4 py-3 shadow-lg`}
    >
      <Icon size={18} className={iconColor} />
      <p className={`text-sm font-medium ${textColor}`}>{toast.message}</p>
      <button
        onClick={onClose}
        className={`ml-auto text-xl font-bold opacity-50 hover:opacity-100 transition ${textColor}`}
      >
        <X size={16} />
      </button>
    </div>
  );
}
