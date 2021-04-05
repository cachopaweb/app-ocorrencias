import React, { useContext } from 'react';
import { useDrag } from 'react-dnd';
import { MdDelete } from 'react-icons/md';

import { Container, Label } from './styles';
import swal from 'sweetalert';
import api from '../../services/api';
import BoardContext from '../QuadroScrum/context';

export default function CardBacklog({ data, index, listIndex}) {
  const { setAtualizar } = useContext(BoardContext);

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'CARD', index, listIndex, data },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleDeleteBacklog = async (id)=> {
    console.log(id)
    const response = await api.delete(`/backlog/${id}`);
    console.log(response)
    return (response.status === 204);
  }

  const onDelete = (id)=>{
    swal({
      title: "Deseja excluir este Backlog?",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        const isDeleted = handleDeleteBacklog(id);
        if (isDeleted){
          swal("Backlog excluido com sucesso", {
            icon: "success",
          });
          setAtualizar();
        }else{
          swal("Falha ao deletar Backlog!", {icon: "warning"})
        }        
      } 
    });
  }

   return (
    <Container ref={dragRef} isDragging={isDragging}>
      <header>
        {data.labels.map(label => <Label key={label} color={label} />)}
        <span id="ocorrencia">{`Cod. Ocorrencia: ${data.ocorrencia}`}</span>
      </header>
      <h3>{data.titulo}</h3>
      <p className="conteudo">{data.content}</p>   
      <button onClick={()=> onDelete(data.id)}><MdDelete size={20} color='red' /></button>
    </Container>
  );
}