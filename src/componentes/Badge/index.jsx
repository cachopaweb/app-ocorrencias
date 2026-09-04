import React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = {
  default: "bg-indigo-50/70 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",
  primary: "bg-indigo-50/70 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",
  indigo: "bg-indigo-50/70 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",
  success: "bg-emerald-50/70 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
  warning: "bg-amber-50/70 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
  destructive: "bg-rose-50/70 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
  secondary: "bg-slate-100/80 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/80",
  outline: "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-transparent",
};

const badgeSizes = {
  sm: "px-1.5 py-0.2 text-[10px] gap-1",
  default: "px-2 py-0.5 text-[11px] gap-1.5",
  md: "px-2 py-0.5 text-[11px] gap-1.5",
  lg: "px-2.5 py-1 text-xs gap-1.5",
};

const dotColorMap = {
  default: "bg-[#6366f1]",
  primary: "bg-[#6366f1]",
  indigo: "bg-[#6366f1]",
  success: "bg-[#10b981]",
  warning: "bg-[#f59e0b]",
  destructive: "bg-[#f43f5e]",
  secondary: "bg-[#94a3b8]",
  outline: "bg-[#94a3b8]",
};

export function Badge({
  children,
  variant = 'default',
  icon: Icon,
  dot = false,
  className = '',
  size = 'md',
  ...props
}) {
  const variantClass = badgeVariants[variant] || badgeVariants.default;
  const sizeClass = badgeSizes[size] || badgeSizes.default;
  const dotColor = dotColorMap[variant] || dotColorMap.default;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded font-mono font-medium border transition-colors",
        sizeClass,
        variantClass,
        className
      )}
      {...props}
    >
      {Icon ? (
        React.isValidElement(Icon) ? Icon : <Icon className="w-3 h-3 shrink-0" />
      ) : dot ? (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
      ) : null}
      {children}
    </span>
  );
}

export default Badge;
