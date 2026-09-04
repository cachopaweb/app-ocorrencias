import React, { useState, useContext, useRef } from 'react';
import { Plus } from 'lucide-react';
import CardSprint from '../CardSprint';
import Modal from '../../Modal';
import CriarEstoria from '../CriarEstoria';
import CriarSprint from '../CriarSprint';
import { useDrop } from 'react-dnd';

import QuadroScrumContext from '../context';
import CardBacklog from '../CardBacklog';
import api from '../../../services/api';

export default function Lista({ data, index: listIndex, cliente, projeto_id, contrato, ocorrencia }) {
  const [modalCriarEstoria, setModalCriarEstoria] = useState(false);
  const [modalCriarSprint, setModalCriarSprint] = useState(false);
  const { setAtualizar } = useContext(QuadroScrumContext);
  const ref = useRef();
  
  function dispararAtualizacao(){
    setAtualizar(true);
  }

  async function AtualizarEstadoSprint(codigo, estado){
    let response = await api.put(`/sprint/${codigo}`, {Estado: estado});
    if (response.data.NOVO_ESTADO !== ''){
      setAtualizar(true);
    }
  }

  async function deletaVinculoSprint(bb_codigo){
    await api.delete(`/sprint_backlog/${bb_codigo}`);
    setAtualizar(true);
  }

  function indexToEstado(index){
    let estado = '';
    if (index === 1) { estado = "A FAZER"}
    if (index === 2) { estado = "EM ANDAMENTO"}
    if (index === 3) { estado = "REVISAO"}
    if (index === 4) { estado = "ENTREGUE"}
    return estado;
  }

  const [, dropSprint] = useDrop({
    accept: 'CARD_SPRINT',
    drop(item, monitor) {        
      if (listIndex === 0) return;
      AtualizarEstadoSprint(item.data.id, indexToEstado(listIndex));
      setAtualizar(true);
    },
  });

  const [, dropSprintBacklog] = useDrop({
    accept: 'CARD_SPRINT_BACKLOG',
    drop(item, monitor) {       
      deletaVinculoSprint(item.data.bb_codigo);
    },
  });
  
  dropSprint(dropSprintBacklog(ref));

  return (
    <>   
      {modalCriarSprint && (
        <Modal activate={modalCriarSprint} setActivate={setModalCriarSprint} altura={800} largura={400}>
          <CriarSprint cliente={cliente} projeto_id={projeto_id} setModalActivate={setModalCriarSprint} atualizar={dispararAtualizacao} />
        </Modal>
      )}
      {modalCriarEstoria && (
        <Modal activate={modalCriarEstoria} setActivate={setModalCriarEstoria} altura={800} largura={400}>
          <CriarEstoria cliente={cliente} cod_ocorrencia={ocorrencia} projeto_id={projeto_id} setModalActivate={setModalCriarEstoria} atualizar={dispararAtualizacao} />
        </Modal>      
      )}  
      <div 
        ref={ref} 
        className="flex flex-col flex-none w-[320px] bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-xs max-h-[calc(100vh-240px)]"
      >            
        <header className="flex items-center justify-between px-2 py-2 mb-2 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <h2>{data.title}</h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {data.cards ? data.cards.length : 0}
            </span>
          </div>
          {data.createBacklog && (
            <button 
              type="button"
              onClick={() => setModalCriarEstoria(true)} 
              className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-xs cursor-pointer inline-flex items-center justify-center"
              title="Adicionar Estória"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          {data.createSprint && (
            <button 
              type="button"
              onClick={() => setModalCriarSprint(true)} 
              className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-xs cursor-pointer inline-flex items-center justify-center"
              title="Adicionar Sprint"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </header>
        {!data.ehSprint && (
          <ul className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 mt-2 scrollbar-thin">
            {data.cards && data.cards.map((card, index) =>
              <CardBacklog
                index={index}
                listIndex={listIndex}
                key={card.id}
                data={card}
              />)}
          </ul>
        )}
        {data.ehSprint && (
          <ul className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 mt-2 scrollbar-thin">
            {data.cards && data.cards.map((card, index) =>
              <CardSprint
                index={index}
                listIndex={listIndex}
                key={card.id}
                data={card}
                cliente={cliente}
                contrato={contrato}
              />)}
          </ul>
        )}      
      </div>
    </>
  );
}
