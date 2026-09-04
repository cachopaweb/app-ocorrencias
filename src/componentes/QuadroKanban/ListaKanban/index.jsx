import React, { useContext, useRef, useState } from 'react';
import { Plus, Layers, Inbox, ArrowDownToLine } from 'lucide-react';
import { useHistory } from 'react-router';
import CardsKanban from '../CardsKanban';
import { useDrop } from 'react-dnd';
import swal from '@/lib/feedback';

import BoardContext from '../context';
import api from '../../../services/api';
import { useUsuario } from '../../../context/UsuarioContext';

function ListaKanban({ data, listIndex }) {
  const history = useHistory();
  const [cards, setCards] = useState([]);
  const ref = useRef();
  const { setAtualizar, move } = useContext(BoardContext);
  const [funAtendente, setFunAtendente] = useState(0);
  const { cod_funcionario, login } = useUsuario();

  const criarOcorrencia = () => {
    history.push('/create');
  };

  async function fetchData(idOcorrencia) {
    const response = await api.get(`/Ocorrencias/${idOcorrencia}`);
    if (response.status === 200) {
      return response.data;
    } else {
      return {};
    }
  }

  async function Atender(idOcorrencia) {
    const request = {
      fun_codigo: cod_funcionario
    };
    const response = await api.put('/Ocorrencias/' + idOcorrencia, JSON.stringify(request));
    if (response.data.fun_codigo > 0) {
      setFunAtendente(response.data.fun_codigo);
    }
  }

  async function fecharOcorrencia(tempo, cod_ocorrencia) {
    const request = {
      fun_codigo: cod_funcionario,
      finalizada: 'S',
      tempoAtendimento: tempo
    };
    try {
      let response = await api.put('/Ocorrencias/' + cod_ocorrencia, JSON.stringify(request));
      if (response.data.fun_codigo > 0) {
        setAtualizar(true);
      } else {
        swal('Erro ao fechar Ocorrencia', '', 'error');
      }
    } catch (error) {
      swal('Erro ao fechar Ocorrencia', error, 'error');
    }
  }

  function finalizar(cod_ocorrencia) {
    swal("Informe o tempo de atendimento (em minutos):", {
      content: "input",
    })
      .then((value) => {
        if (value === '') {
          swal('Informe o tempo de atendimento corretamente', 'Informe o tempo de atendimento (em minutos):', 'warning');
          return;
        }
        let tempo = 0;
        try {
          tempo = parseInt(value);
        } catch (erro) {
          swal('É permitido somente números!', 'informe o tempo em números', 'warning');
          return;
        }
        if (tempo === 0) { swal("Tempo não informado!", 'Informe o tempo', "warning"); return; }
        if (tempo === 1) { swal('O Tempo deve ser maior que 1 min', 'Informe o tempo corretamente', 'warning'); return; }

        fecharOcorrencia(tempo, cod_ocorrencia);
      });
  }

  const [{ isOverColumn, canDrop }, dropCardOcorrencia] = useDrop({
    accept: 'CARD_OCORRENCIA',
    collect: (monitor) => ({
      isOverColumn: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
    drop(item, monitor) {
      if (listIndex === 0) return;
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;
      const draggedIndex = item.index;
      const targetIndex = item.index;
      if (draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
        return;
      }

      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;

      const draggedOffset = monitor.getClientOffset();
      const draggedTop = draggedOffset.y - targetSize.top;

      if (draggedIndex < targetIndex && draggedTop < targetCenter) {
        return;
      }

      if (draggedIndex > targetIndex && draggedTop > targetCenter) {
        return;
      }

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex, 'CARD_OCORRENCIA');
      if (cards.length)
        setCards([...cards, item.data]);
      else setCards([item.data]);
      item.index = targetIndex;
      item.listIndex = targetListIndex;
      if (listIndex === 1) {
        swal({
          title: "Deseja Atender esta ocorrência?",
          text: "Click nas opções a seguir",
          icon: "warning",
          buttons: ['Cancelar', 'Atender'],
          dangerMode: true,
        })
          .then(async (isAtender) => {
            if (isAtender) {
              Atender(item.data.ocorrencia);
              setAtualizar(true);
            }
          });
      }
      if (listIndex === 2) {
        swal({
          title: "Deseja Fechar ou Abrir Scrum?",
          text: "Click nas opções a seguir",
          icon: "warning",
          buttons: ['Abrir Scrum', 'Finalizar'],
          dangerMode: true,
        })
          .then(async (isFinalizar) => {
            if (isFinalizar) {
              finalizar(item.data.ocorrencia);
              setAtualizar(true);
            } else {
              const data = await fetchData(item.data.ocorrencia);
              if (data.codigo > 0) {
                history.push({ pathname: '/quadroScrum', state: { cliente: data.cli_nome, projeto_id: data.projeto_scrum, contrato: data.contrato, ocorrencia: data.codigo } });
              }
            }
          });
      }
    },
  });

  const [, dropCardOS] = useDrop({
    accept: 'CARD_OS',
    drop(item, monitor) {
      //deletaVinculoSprint(item.data.bb_codigo);
    },
  });

  dropCardOcorrencia(dropCardOS(ref));

  const getStatusDotClass = (title) => {
    if (!title) return 'bg-slate-400';
    const t = title.toLowerCase();
    if (t.includes('fazer') || t.includes('aberto') || t.includes('pendente')) return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
    if (t.includes('fazendo') || t.includes('andamento') || t.includes('progresso')) return 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]';
    if (t.includes('feito') || t.includes('conclu') || t.includes('finaliz')) return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    return 'bg-slate-400';
  };

  const cardsList = data?.cards || [];

  return (
    <div 
      ref={ref} 
      className={`w-[340px] min-w-[310px] flex flex-col rounded-xl p-2.5 bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/70 max-h-[calc(100vh-230px)] transition-all ${
        isOverColumn && canDrop
          ? "ring-2 ring-indigo-500/70 border-indigo-400 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40"
          : ""
      }`}
    >
      {/* Cabeçalho da Coluna */}
      <header className="flex items-center justify-between px-1.5 py-1.5 mb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${getStatusDotClass(data.title)}`} />
          <span className="font-semibold text-slate-700 dark:text-slate-300">{data.title}</span>
          <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">[{cardsList.length}]</span>
        </div>
        {listIndex === 0 && (
          <button 
            type="button"
            title="Nova Ocorrência"
            aria-label="Nova Ocorrência"
            className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer" 
            onClick={() => criarOcorrencia()}
          >
            <Plus size={14} />
          </button>
        )}
      </header>

      {/* Lista de Cards */}
      {cardsList.length > 0 ? (
        <ul className="flex-1 flex flex-col gap-2 overflow-y-auto pr-0.5 scrollbar-thin">
          {cardsList.map((card, index) => (
            <CardsKanban
              key={card?.id || `${listIndex}-${index}`}
              data={card}
              index={index}
              listIndex={listIndex}
              color={card?.ocorrencia === 0 ? "#D3D3D3" : '#FFF'}
            />
          ))}
        </ul>
      ) : (
        <div className="flex-1 flex flex-col justify-center py-6 text-center text-slate-400 dark:text-slate-500 gap-2">
          {isOverColumn && canDrop ? (
            <div className="border-2 border-dashed border-indigo-500 dark:border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/70 rounded-lg h-20 flex items-center justify-center gap-2 text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 animate-pulse my-2">
              <ArrowDownToLine className="w-4 h-4" />
              <span>Solte para mover para esta etapa</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 gap-2">
              <Inbox className="w-6 h-6 opacity-40 stroke-[1.5]" />
              <span className="text-[11px] font-mono">Nenhum item nesta etapa</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(ListaKanban);