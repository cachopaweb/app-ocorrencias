import React, { useState, useContext, useRef } from 'react';
import { MdAdd } from 'react-icons/md';
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
    setAtualizar(true)
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
      setAtualizar(true)
    },
  })

  const [, dropSprintBacklog] = useDrop({
    accept: 'CARD_SPRINT_BACKLOG',
    drop(item, monitor) {       
      deletaVinculoSprint(item.data.bb_codigo);
    },
  })
  
  dropSprint(dropSprintBacklog(ref))

  return (
    <>   
    {
        <Modal activate={modalCriarSprint} setActivate={setModalCriarSprint}  altura={800} largura={400}>
          <CriarSprint cliente={cliente} projeto_id={projeto_id} setModalActivate={setModalCriarSprint} atualizar={dispararAtualizacao} />
        </Modal>
      }
      {
        <Modal activate={modalCriarEstoria} setActivate={setModalCriarEstoria} altura={800} largura={400}>
          <CriarEstoria cliente={cliente} cod_ocorrencia={ocorrencia} projeto_id={projeto_id} setModalActivate={setModalCriarEstoria} atualizar={dispararAtualizacao} />
        </Modal>      
      }  
    <div ref={ref} className="px-[15px] h-full w-full flex-none shrink-0 grow-0 basis-[250px] [&+div]:border-l [&+div]:border-black/5">            
      <header className="flex justify-center items-center h-[42px]">
        <h2 className="font-medium text-[16px] px-[10px]">{data.title}</h2>
        {data.createBacklog && (
          <button onClick={() => setModalCriarEstoria(true)} className="w-[42px] h-[42px] rounded-[18px] bg-[#3b5bfd] border-0 cursor-pointer mb-[5px]">
            <MdAdd size={24} color="#FFF" />
          </button>)}
          {data.createSprint && (
          <button onClick={() => setModalCriarSprint(true)} className="w-[42px] h-[42px] rounded-[18px] bg-[#3b5bfd] border-0 cursor-pointer mb-[5px]">
            <MdAdd size={24} color="#FFF" />
          </button>)}
      </header>
      {!data.ehSprint && (
        <ul className="mt-[30px]">
          {data.cards.map((card, index) =>
            <CardBacklog
              index={index}
              listIndex={listIndex}
              key={card.id}
              data={card}
            />)}
        </ul>)
      }
      {data.ehSprint && (
        <ul className="mt-[30px]">
          {data.cards.map((card, index) =>
          <CardSprint
              index={index}
              listIndex={listIndex}
              key={card.id}
              data={card}
              cliente={cliente}
              contrato={contrato}
            />)}
        </ul>)
      }      
    </div>
    </>
  );
}
