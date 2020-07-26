import React, { useState, useContext, useRef } from 'react';
import { MdAdd } from 'react-icons/md';
import { Container } from './styles';
import CardSprint from '../CardSprint';
import Modal from '../Modal';
import CriarEstoria from '../CriarEstoria';
import CriarSprint from '../CriarSprint';
import { useDrop } from 'react-dnd';

import QuadroScrumContext from '../QuadroScrum/context';
import CardBacklog from '../CardBacklog';
import api from '../../services/api';

export default function Lista({ data, index: listIndex, cliente, projeto_id, update }) {
  const [modalCriarEstoria, setModalCriarEstoria] = useState(false);
  const [modalCriarSprint, setModalCriarSprint] = useState(false);
  const { setAtualizar } = useContext(QuadroScrumContext);
  
  function dispararAtualizacao(){
    update(true);
  }

  async function AtualizarEstadoSprint(codigo, estado){
    let response = await api.put(`/sprint/${codigo}`, {Estado: estado});
    if (response.data.NOVO_ESTADO != ''){
      setAtualizar(true);
    }
  }

  function indexToEstado(index){
    let estado = '';
    if (index === 1) { estado = "A FAZER"}
    if (index === 2) { estado = "EM ANDAMENTO"}
    if (index === 3) { estado = "REVISAO"}
    if (index === 4) { estado = "ENTREGA"}
    return estado;
  }

  const [, dropRef] = useDrop({
    accept: 'CARD_SPRINT',
    drop(item, monitor) {        
      if (listIndex === 0) return;
      AtualizarEstadoSprint(item.data.id, indexToEstado(listIndex));
    },
  })
  
  return (
    <Container ref={dropRef} >
      <header>
        <h2>{data.title}</h2>
        {data.createBacklog && (
          <button onClick={() => setModalCriarEstoria(true)}>
            <MdAdd size={24} color="#FFF" />
          </button>)}
          {data.createSprint && (
          <button onClick={() => setModalCriarSprint(true)}>
            <MdAdd size={24} color="#FFF" />
          </button>)}
      </header>
      {!data.ehSprint && (
        <ul>
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
        <ul>
          {data.cards.map((card, index) =>
          <CardSprint
              index={index}
              listIndex={listIndex}
              key={card.id}
              data={card}
            />)}
        </ul>)
      }
      {
        modalCriarEstoria &&
        <Modal activate={modalCriarEstoria} setActivate={setModalCriarEstoria}>
          <CriarEstoria cliente={cliente} projeto_id={projeto_id} setModalActivate={setModalCriarEstoria} atualizar={dispararAtualizacao} />
        </Modal>      
      }
      {
        modalCriarSprint && 
        <Modal activate={modalCriarSprint} setActivate={setModalCriarSprint}>
          <CriarSprint cliente={cliente} projeto_id={projeto_id} setModalActivate={setModalCriarSprint} atualizar={dispararAtualizacao} />
        </Modal>
      }
    </Container>
  );
}
