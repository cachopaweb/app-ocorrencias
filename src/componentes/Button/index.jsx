import React from 'react';
import { cn } from '../../lib/utils';

const variantMap = {
  default: "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 border border-indigo-700/40 shadow-xs",
  primary: "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 border border-indigo-700/40 shadow-xs",
  indigo: "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 border border-indigo-700/40 shadow-xs",
  secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/80 shadow-xs",
  outline: "border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300",
  destructive: "bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 border border-rose-700/40 shadow-xs",
  success: "bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 border border-emerald-700/40 shadow-xs",
  ghost: "hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300 border border-transparent",
  black: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white border border-slate-900 dark:border-slate-100 shadow-xs",
  white: "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-xs"
};

const sizeMap = {
  sm: "h-7 px-2.5 text-[11px] gap-1.5",
  default: "h-8 px-3 text-xs gap-1.5",
  md: "h-8 px-3 text-xs gap-1.5",
  lg: "h-9 px-3.5 text-sm gap-2",
  icon: "h-8 w-8 p-0 flex items-center justify-center",
  "icon-sm": "h-7 w-7 p-0 flex items-center justify-center",
  "icon-lg": "h-9 w-9 p-0 flex items-center justify-center",
};

const Button = React.forwardRef(({
  click,
  onClick,
  nome,
  color,
  corTexto,
  borderRadius,
  Icon,
  tamanho_icone = 14,
  disabled = false,
  className = '',
  variant = 'default',
  size = 'default',
  kbd,
  children,
  type = 'button',
  style,
  ...props
}, ref) => {
  // Legacy color resolution for backward compatibility
  let resolvedVariant = variant;
  if (color) {
    const c = String(color).toLowerCase().trim();
    if (['#3498db', '#1976d2', '#2563eb', '#4f46e5', 'blue', '#3b82f6'].includes(c)) {
      resolvedVariant = 'indigo';
    } else if (['#733130', '#f00', '#ff0000', 'red', '#dc2626', '#e11d48', '#e53e3e'].includes(c)) {
      resolvedVariant = 'destructive';
    } else if (['#27ae60', '#7fa66d', 'green', '#16a34a', '#059669', '#10b981', '#22c55e'].includes(c)) {
      resolvedVariant = 'success';
    } else if (['black', '#000', '#000000', '#323540', '#0f172a', '#1e293b'].includes(c)) {
      resolvedVariant = 'black';
    } else if (['white', '#fff', '#ffffff', '#f0f0f2', '#f8fafc'].includes(c)) {
      resolvedVariant = 'white';
    }
  }

  const variantClasses = variantMap[resolvedVariant] || variantMap.default;
  const sizeClasses = sizeMap[size] || sizeMap.default;

  const customStyle = {
    ...(borderRadius ? { borderRadius } : {}),
    ...(corTexto ? { color: corTexto } : {}),
    ...style
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick || click}
      disabled={disabled}
      style={customStyle}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none",
        variantClasses,
        sizeClasses,
        className
      )}
      {...props}
    >
      {Icon && (React.isValidElement(Icon) ? Icon : <Icon size={tamanho_icone} className="shrink-0" />)}
      {nome && <span>{nome}</span>}
      {children}
      {kbd && (
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-200/60 dark:bg-slate-800/80 rounded border border-slate-300/60 dark:border-slate-700/60 ml-2 select-none pointer-events-none">
          {kbd}
        </kbd>
      )}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
export default Button;