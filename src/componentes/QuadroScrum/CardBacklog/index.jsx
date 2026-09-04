import React, { useContext } from 'react';
import { useDrag } from 'react-dnd';
import { Trash2 } from 'lucide-react';
import swal from '@/lib/feedback';
import Badge from '../../Badge';
import api from '../../../services/api';
import BoardContext from '../context';
import { cn } from '../../../lib/utils';

export default function CardBacklog({ data, index, listIndex }) {
  const { setAtualizar } = useContext(BoardContext);

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'CARD', index, listIndex, data },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleDeleteBacklog = async (id) => {
    try {
      const response = await api.delete(`/backlog/${id}`);
      return (response.status === 204);
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const onDelete = (id) => {
    swal({
      title: "Deseja excluir este Backlog?",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async (willDelete) => {
      if (willDelete) {
        const isDeleted = await handleDeleteBacklog(id);
        if (isDeleted) {
          swal("Backlog excluído com sucesso", {
            icon: "success",
          });
          setAtualizar(true);
        } else {
          swal("Falha ao deletar Backlog!", { icon: "warning" });
        }        
      } 
    });
  };

  return (
    <div
      ref={dragRef}
      className={cn(
        "relative mb-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-grab active:cursor-grabbing group text-slate-800 dark:text-slate-100 select-none",
        isDragging && "border-2 border-dashed border-indigo-400 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 opacity-60 rounded-xl shadow-none cursor-grabbing"
      )}
    >
      <header className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {data.labels && data.labels.map((label, idx) => (
            <span 
              key={idx} 
              className="w-2.5 h-2.5 rounded-full inline-block shrink-0 ring-1 ring-black/5 dark:ring-white/10" 
              style={{ backgroundColor: label }} 
              title={`Prioridade: ${label}`}
            />
          ))}
          {data.ocorrencia && (
            <Badge variant="secondary" size="sm" className="font-mono text-[11px] px-1.5 py-0.5">
              #{data.ocorrencia}
            </Badge>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(data.id);
          }}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0 ml-auto"
          title="Excluir Backlog"
          aria-label="Excluir Backlog"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </header>

      {data.titulo && (
        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1 leading-snug">
          {data.titulo}
        </h3>
      )}

      {data.content && (
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed whitespace-pre-wrap">
          {data.content}
        </p>
      )}
    </div>
  );
}