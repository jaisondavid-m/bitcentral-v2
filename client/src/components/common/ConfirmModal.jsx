import React, { useEffect } from 'react';
import { AlertTriangle, Info, X, Loader2 } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: AlertTriangle,
      iconBg: "bg-[var(--red-bg)] text-[var(--red)] border-[var(--red-border)]",
      btnClass: "btn-danger",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      btnClass: "bg-amber-500 text-white hover:bg-amber-600",
    },
    primary: {
      icon: Info,
      iconBg: "bg-[var(--accent-dim)] text-[var(--accent)] border-[var(--border-accent)]",
      btnClass: "btn-primary",
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;
  const IconComponent = currentVariant.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-lg)] animate-scaleUp relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          disabled={loading}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex gap-4">
          <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${currentVariant.iconBg}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex-1 pt-0.5">
            <h3 className="text-base font-bold text-[var(--text-primary)] font-ui">{title}</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed font-ui">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-[var(--border)]">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={loading} 
            className="btn btn-secondary text-xs px-4"
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            disabled={loading} 
            className={`btn text-xs px-4 ${currentVariant.btnClass}`}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
