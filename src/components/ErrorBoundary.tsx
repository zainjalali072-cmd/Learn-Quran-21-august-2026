import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends (Component as any) {
  state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("truth_quran_cms_data");
        window.localStorage.removeItem("truth_quran_deleted_media_ids");
        window.localStorage.removeItem("truth_quran_deleted_media_urls");
      }
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.clear();
      }
    } catch (e) {
      console.warn("Storage reset failed:", e);
    }
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#07080b] text-[#f3ecd8] flex items-center justify-center p-6 selection:bg-[#d9b45c] selection:text-[#07080b]">
          <div className="max-w-lg w-full bg-[#12141b] border border-[#d9b45c]/40 rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-center relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#d9b45c]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#d9b45c]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#d9b45c]/10 border border-[#d9b45c]/30 flex items-center justify-center text-[#d9b45c]">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-serif font-bold text-[#f3ecd8] mb-2">
              Application Restored
            </h1>

            <p className="text-[#c9c2ab] text-sm leading-relaxed mb-6">
              A temporary display issue occurred while rendering. We have protected your data and configurations.
            </p>

            {this.state.error?.message && (
              <div className="mb-6 p-3 bg-[#07080b]/80 border border-red-500/30 rounded-lg text-left text-xs font-mono text-red-300/90 break-words max-h-32 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d9b45c] to-[#c29d47] text-[#07080b] font-semibold text-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-[#d9b45c]/20"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleResetCache}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#07080b] border border-[#d9b45c]/40 text-[#d9b45c] font-medium text-sm hover:bg-[#d9b45c]/10 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Cache & Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
