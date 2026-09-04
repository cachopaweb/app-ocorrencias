import React from 'react';
import { cn } from '../../lib/utils';

export default function Etiqueta({ texto, percentual, cor, corTexto, click, onClick, children, className = '' }) {
  const handleClick = onClick || click;
  const displayVal = percentual !== undefined && percentual !== null && !isNaN(percentual)
    ? parseFloat(percentual).toFixed(0)
    : '0';

  return (
    <div 
      className={cn(
        "rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 shadow-2xs flex flex-col justify-between hover:border-slate-400/80 dark:hover:border-slate-600 transition-colors group cursor-pointer w-full",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
          {texto}
        </span>
        {children && (
          <div className="text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
            {children}
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-mono font-bold text-2xl text-slate-900 dark:text-slate-100 tabular-nums">
          {displayVal}
        </span>
      </div>
    </div>
  );
}
