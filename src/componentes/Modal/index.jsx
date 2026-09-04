import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

function CustomModal({
  activate,
  setActivate,
  open,
  isOpen,
  onClose,
  children,
  altura,
  largura,
  className = '',
  contentClassName = '',
  showCloseButton = true,
  left = 0,
  ...props
}) {
  const isModalOpen = activate !== undefined ? Boolean(activate) : (open !== undefined ? Boolean(open) : Boolean(isOpen));

  const handleClose = () => {
    if (setActivate) setActivate(false);
    if (onClose) onClose();
  };

  // Close on Escape key press
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const styleObj = {
    ...(largura ? { width: typeof largura === 'number' ? `${largura}px` : largura } : {}),
    ...(altura ? { height: typeof altura === 'number' ? `${altura}px` : altura } : {}),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative max-w-full max-h-[90vh] overflow-y-auto flex flex-col text-slate-900 dark:text-slate-100 zoom-in-95 animate-in duration-200",
          className
        )}
        style={styleObj}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 z-10"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className={cn("w-full h-full flex flex-col", contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}

export { CustomModal as Modal, CustomModal };
export default CustomModal;