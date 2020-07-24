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

export default function Lista({ data, index: listIndex, cliente, projeto_id, update }) {
  const [modalCriarEstoria, setModalCriarEstoria] = useState(false);
  const [modalCriarSprint, setModalCriarSprint] = useState(false);
  const { move } = useContext(QuadroScrumContext);
  
  function dispararAtualizacao(){
    update(true);
  }

  const [, dropRef] = useDrop({
    accept: 'CARD_SPRINT',
    drop(item, monitor) {  
      console.log(item)
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;
      const draggedIndex = item.index;
      const targetIndex = listIndex;

      if (draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
        return;
      }

      // const targetSize = ref.current.getBoundingClientRect();
      // const targetCenter = (targetSize.bottom - targetSize.top) / 2;

      // const draggedOffset = monitor.getClientOffset();
      // const draggedTop = draggedOffset.y - targetSize.top;

      // if (draggedIndex < targetIndex && draggedTop < targetCenter) {
      //   return;
      // }

      // if (draggedIndex > targetIndex && draggedTop > targetCenter) {
      //   return;
      // }

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);
      item.index = targetIndex;
      item.listIndex = targetListIndex;
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
      {data.createBacklog &&
        <ul>
          {data.cards.map((card, index) =>
            <CardBacklog
              index={index}
              listIndex={listIndex}
              key={card.id}
              data={card}
            />)}
        </ul>
      }
      {data.createSprint &&
        <ul>
          {data.cards.map((card, index) =>
            <CardSprint
              index={index}
              listIndex={listIndex}
              key={card.id}
              data={card}
            />)}
        </ul>
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
