"use client";

import React, { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback?.(this.state.error!) ?? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-950">
                  Something went wrong
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  {this.state.error?.message || "An unexpected error occurred"}
                </p>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
