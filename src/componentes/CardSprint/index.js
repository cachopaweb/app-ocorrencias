import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { Container, Label } from './styles';
import { useState, useRef, useContext } from 'react';
import QuadroScrumContext from '../QuadroScrum/context';
import CardSprintBacklog from '../../componentes/CardSprintBacklog';
import api from '../../services/api';


export default function CardSprint({ data, index, listIndex }) {
  const [backlogs, setBacklogs] = useState(data.backlogs); 
  const ref = useRef();
  const { move, setAtualizar } = useContext(QuadroScrumContext);

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'CARD_SPRINT', index, listIndex, data },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  async function criarVinculoSprintBacklog(codBacklog, codSprint){
    let response = await api.post(`/sprint_backlog/${codSprint}`, {Codigo: codBacklog});
    if (response.data.BS_BP){
      setAtualizar(true);
    }
  }

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {  
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;
      const draggedIndex = item.index;
      const targetIndex = index;

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

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex, 'CARD');
      if (backlogs.length)
         setBacklogs([...backlogs, item.data])
      else setBacklogs([item.data])
      item.index = targetIndex;
      item.listIndex = targetListIndex;
      criarVinculoSprintBacklog(item.data.id, data.id);
    },
  })

  dragRef(dropRef(ref));

   return (
    <Container ref={ref} isDragging={isDragging}>
      <header>
        {data.labels.map(label => <Label key={label} color={label} />)}
      </header>
      <p>{data.content}</p>
      { data.user && <img src={data.user} alt="Avatar"/> }
      {
        backlogs.length > 0 ?
          backlogs.map((backlog, index)=> <CardSprintBacklog key={index} data={backlog} />)
        : <h3>Aguardando Backlogs...</h3>
      }
    </Container>
  );
}