import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
].join(', ');

const getFocusableElements = (container) => {
  if (!container) return [];
  const elements = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));
  return elements.filter((el) => {
    if (el.getAttribute('aria-hidden') === 'true') return false;
    if (typeof window !== 'undefined' && window.getComputedStyle) {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
    }
    return true;
  });
};

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
  ariaLabelledby,
  'aria-labelledby': ariaLabelledByProp,
  ariaLabel,
  'aria-label': ariaLabelProp,
  ...props
}) {
  const isModalOpen = activate !== undefined ? Boolean(activate) : (open !== undefined ? Boolean(open) : Boolean(isOpen));
  const ariaLabelledBy = ariaLabelledByProp || ariaLabelledby || props['aria-labelledby'];
  const resolvedAriaLabel = ariaLabelProp || ariaLabel || props['aria-label'];

  const modalRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  const handleClose = () => {
    if (setActivate) setActivate(false);
    if (onClose) onClose();
  };

  const handleCloseRef = useRef(handleClose);
  handleCloseRef.current = handleClose;

  // Focus trap & Escape key handling
  useEffect(() => {
    if (!isModalOpen) return;

    previousActiveElementRef.current = document.activeElement;

    // Focus first focusable element inside modal, or modal container itself
    const initialFocusTimer = setTimeout(() => {
      if (!modalRef.current) return;
      const focusables = getFocusableElements(modalRef.current);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        modalRef.current.focus();
      }
    }, 0);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseRef.current();
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusables = getFocusableElements(modalRef.current);

        if (focusables.length === 0) {
          e.preventDefault();
          modalRef.current.focus();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !modalRef.current.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(initialFocusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      try {
        if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
          previousActiveElementRef.current.focus();
        }
      } catch (_) {}
    };
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
      aria-labelledby={ariaLabelledBy}
      aria-label={resolvedAriaLabel}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative max-w-full max-h-[90vh] overflow-y-auto flex flex-col text-slate-900 dark:text-slate-100 zoom-in-95 animate-in duration-200 outline-none",
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