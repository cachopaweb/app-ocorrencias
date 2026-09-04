import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Calendar } from 'lucide-react';
import Badge from '../../Badge';
import Modal from '../../Modal';
import { cn } from '../../../lib/utils';

function CardSprintBacklog({ data, index, listIndex, dataEntrega }) {  
  const [modalAtivo, setModalAtivo] = useState(false);    

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'CARD_SPRINT_BACKLOG', index, listIndex, data },
    collect: monitor => ({
      isDragging: monitor.isDragging(),        
    }),        
  });

  return (
    <>
      <div 
        ref={dragRef} 
        className={cn(
          "p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer text-slate-800 dark:text-slate-200 select-none",
          isDragging && "border-2 border-dashed border-indigo-400 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 opacity-60 rounded-lg shadow-none cursor-grabbing"
        )} 
        onClick={() => setModalAtivo(true)}
      >
        <div className="flex items-center justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-1 flex-wrap">
            {data.labels && data.labels.map((label, idx) => (
              <span 
                key={idx} 
                className="w-2 h-2 rounded-full inline-block shrink-0 ring-1 ring-black/5 dark:ring-white/10" 
                style={{ backgroundColor: label }} 
                title={`Prioridade: ${label}`}
              />
            ))}
            {data.ocorrencia && (
              <Badge variant="secondary" size="sm" className="font-mono text-[10px] px-1.5 py-0 h-4 leading-none">
                #{data.ocorrencia}
              </Badge>
            )}
          </div>
        </div>

        {data.titulo && (
          <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
            {data.titulo}
          </h4>
        )}

        {data.content && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed whitespace-pre-wrap">
            {data.content}
          </p>
        )}
      </div>

      {modalAtivo && (
        <Modal 
          activate={modalAtivo} 
          setActivate={setModalAtivo} 
          className="max-w-lg"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {data.ocorrencia && (
                  <Badge variant="default" size="sm" className="font-mono">
                    Ocorrência #{data.ocorrencia}
                  </Badge>
                )}
                {data.labels && data.labels.map((label, idx) => (
                  <span 
                    key={idx} 
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0" 
                    style={{ backgroundColor: label }} 
                    title={`Prioridade: ${label}`}
                  />
                ))}
              </div>
              {dataEntrega && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Entrega: {new Date(dataEntrega).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                {data.titulo || `Estória #${data.ocorrencia || ''}`}
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/80">
                <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {data.content}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default CardSprintBacklog;