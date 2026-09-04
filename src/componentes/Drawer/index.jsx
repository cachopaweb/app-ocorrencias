import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Drawer({
  isOpen,
  open,
  activate,
  setActivate,
  onClose,
  title,
  description,
  children,
  width = 'max-w-xl',
  className = '',
  headerActions,
  footer,
  showCloseButton = true,
  ...props
}) {
  const isDrawerOpen = isOpen !== undefined ? Boolean(isOpen) : (open !== undefined ? Boolean(open) : Boolean(activate));

  const handleClose = () => {
    if (setActivate) setActivate(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex max-w-full pl-10">
        <div
          className={cn(
            "w-screen flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-right duration-200 ease-out text-slate-900 dark:text-slate-100",
            width,
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {/* Header */}
          {(title || description || showCloseButton || headerActions) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex flex-col gap-0.5 pr-4">
                {title && (
                  <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {headerActions}
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center gap-1.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
                    aria-label="Fechar painel"
                  >
                    <span className="text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 select-none">
                      ESC
                    </span>
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {children}
          </div>

          {/* Optional Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Drawer;
