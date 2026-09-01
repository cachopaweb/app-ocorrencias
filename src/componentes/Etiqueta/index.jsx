import React from 'react';

export default function Etiqueta({ texto, percentual, cor, corTexto, click, children }) {
  // Ignore old colors and use a clean modern look
  return (
    <div 
      className="flex flex-col bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full"
      onClick={click}
    >
      <div className="flex justify-between items-center text-slate-500 mb-2">
        <span className="text-sm font-medium text-slate-600">{texto}</span>
        <div className="text-slate-400 bg-slate-100 p-2 rounded-lg">
          {children}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-slate-900">{`${parseFloat(percentual).toFixed(0)}`}</span>
      </div>
    </div>
  );
}
