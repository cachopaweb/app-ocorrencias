import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

function FeedbackModal({
  title,
  text,
  icon,
  buttons,
  dangerMode,
  content,
  onResolve,
  onClose
}) {
  const [inputValue, setInputValue] = useState(
    typeof content === 'object' && content?.attributes?.value
      ? content.attributes.value
      : ''
  );
  const inputRef = useRef(null);

  useEffect(() => {
    if (content === 'input' || content?.element === 'input') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [content]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [inputValue]);

  const hasInput = content === 'input' || content?.element === 'input';

  const handleConfirm = () => {
    if (hasInput) {
      onResolve(inputValue);
    } else {
      onResolve(true);
    }
    onClose();
  };

  const handleCancel = () => {
    if (hasInput) {
      onResolve(null);
    } else {
      onResolve(buttons ? null : false);
    }
    onClose();
  };

  // Normalização de botões
  let showCancel = false;
  let cancelText = 'Cancelar';
  let confirmText = 'Confirmar';

  if (buttons === true) {
    showCancel = true;
    cancelText = 'Cancelar';
    confirmText = 'Confirmar';
  } else if (Array.isArray(buttons)) {
    if (buttons.length === 2) {
      showCancel = true;
      cancelText = typeof buttons[0] === 'string' ? buttons[0] : 'Cancelar';
      confirmText = typeof buttons[1] === 'string' ? buttons[1] : 'Confirmar';
    } else if (buttons.length === 1) {
      showCancel = false;
      confirmText = typeof buttons[0] === 'string' ? buttons[0] : 'OK';
    }
  } else if (typeof buttons === 'object' && buttons !== null) {
    if (buttons.cancel) {
      showCancel = true;
      if (typeof buttons.cancel === 'string') {
        cancelText = buttons.cancel;
      } else if (typeof buttons.cancel === 'object' && buttons.cancel.text) {
        cancelText = buttons.cancel.text;
      }
    }
    if (buttons.confirm) {
      if (typeof buttons.confirm === 'string') {
        confirmText = buttons.confirm;
      } else if (typeof buttons.confirm === 'object' && buttons.confirm.text) {
        confirmText = buttons.confirm.text;
      }
    }
  } else {
    // Alerta simples
    showCancel = false;
    confirmText = 'OK';
  }

  // Renderização do ícone
  const renderIcon = () => {
    const iconType = (icon || '').toLowerCase();
    switch (iconType) {
      case 'success':
        return (
          <div className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 p-3 rounded-full mb-3 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        );
      case 'error':
      case 'danger':
        return (
          <div className="bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 p-3 rounded-full mb-3 flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
        );
      case 'warning':
      case 'warn':
        return (
          <div className="bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 p-3 rounded-full mb-3 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
        );
      case 'info':
        return (
          <div className="bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 p-3 rounded-full mb-3 flex items-center justify-center">
            <Info className="w-8 h-8" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCancel();
        }
      }}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 max-w-md w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {renderIcon()}

        {title && (
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">
            {title}
          </h2>
        )}

        {text && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed whitespace-pre-line">
            {typeof text === 'object' ? JSON.stringify(text) : String(text)}
          </p>
        )}

        {hasInput && (
          <div className="w-full mb-5">
            <input
              ref={inputRef}
              type={typeof content === 'object' && content?.attributes?.type ? content.attributes.type : 'text'}
              placeholder={typeof content === 'object' && content?.attributes?.placeholder ? content.attributes.placeholder : ''}
              className="flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        )}

        {typeof content === 'function' && content()}

        {React.isValidElement(content) && (
          <div className="w-full mb-5 text-left">{content}</div>
        )}

        <div className="flex items-center justify-center gap-3 w-full">
          {showCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg text-white shadow-sm transition-colors focus:outline-none focus:ring-2 ${
              dangerMode
                ? 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function getFeedbackContainer() {
  let container = document.getElementById('feedback-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'feedback-root';
    document.body.appendChild(container);
  }
  return container;
}

export function swal(arg1, arg2, arg3) {
  return new Promise((resolve) => {
    let options = {};

    if (typeof arg1 === 'string' || React.isValidElement(arg1)) {
      if (typeof arg2 === 'object' && arg2 !== null && !React.isValidElement(arg2)) {
        // Ex: swal("Título", { icon: "success", buttons: true })
        options = { title: arg1, ...arg2 };
      } else if (typeof arg2 === 'string' || React.isValidElement(arg2)) {
        // Ex: swal("Título", "Mensagem", "success")
        options = {
          title: arg1,
          text: arg2,
          icon: arg3,
        };
      } else {
        // Ex: swal("Título")
        options = {
          title: arg1,
          icon: arg3,
        };
      }
    } else if (typeof arg1 === 'object' && arg1 !== null) {
      if (React.isValidElement(arg1)) {
        options = { content: arg1 };
      } else {
        options = { ...arg1 };
      }
    }

    const container = getFeedbackContainer();

    // Cria um container isolado para este diálogo
    const dialogMount = document.createElement('div');
    container.appendChild(dialogMount);

    const root = createRoot(dialogMount);

    const cleanup = () => {
      setTimeout(() => {
        root.unmount();
        if (dialogMount.parentNode) {
          dialogMount.parentNode.removeChild(dialogMount);
        }
      }, 50);
    };

    const handleResolve = (result) => {
      resolve(result);
    };

    root.render(
      <FeedbackModal
        title={options.title}
        text={options.text}
        icon={options.icon}
        buttons={options.buttons}
        dangerMode={options.dangerMode}
        content={options.content}
        onResolve={handleResolve}
        onClose={cleanup}
      />
    );
  });
}

export default swal;
