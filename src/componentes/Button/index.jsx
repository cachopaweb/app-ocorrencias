import React from 'react';
import { cn } from '../../lib/utils';

function Button({click, nome, color, corTexto, borderRadius, Icon, tamanho_icone = 16, disabled, className, variant = 'default'}) {
  // Map old inline colors to tailwind variants for modern look
  let variantClasses = "bg-slate-900 text-white hover:bg-slate-800";
  
  if (disabled) {
    variantClasses = "bg-slate-300 text-slate-500 cursor-not-allowed";
  } else if (color === '#3498db' || color === '#1976d2') {
    variantClasses = "bg-blue-600 text-white hover:bg-blue-700";
  } else if (color === '#733130' || color === '#F00') {
    variantClasses = "bg-red-600 text-white hover:bg-red-700";
  } else if (color === '#27ae60' || color === '#7FA66D') {
    variantClasses = "bg-green-600 text-white hover:bg-green-700";
  } else if (color === '#F0F0F2' || color === 'white') {
    variantClasses = "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 shadow-sm";
  }

  return (
    <button 
      onClick={click} 
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none px-4 py-2 rounded-md shadow-sm h-9",
        variantClasses,
        className
      )}
    >
        {Icon && <Icon size={tamanho_icone} />} 
        {nome && <span>{nome}</span>}
    </button>
  );
}

export default Button;