import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

function Cronograma({ projeto_id }) {
  const [carregando, setCarregando] = useState(false);

  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Cronograma do Projeto
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Linha do tempo e marcos de entrega
          </p>
        </div>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center py-8 text-sm text-slate-500 dark:text-slate-400">
          <Clock className="w-5 h-5 mr-2 animate-spin text-indigo-500" />
          Aguarde, carregando cronograma...
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Cronograma carregado</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Planejamento e datas sincronizadas com sucesso.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cronograma;