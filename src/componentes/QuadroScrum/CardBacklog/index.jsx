import React, { useContext } from 'react';
import { useDrag } from 'react-dnd';
import { MdDelete } from 'react-icons/md';

import swal from 'sweetalert';
import api from '../../../services/api';
import BoardContext from '../context';

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
    <div
      ref={dragRef}
      className={`relative mb-[10px] text-black p-[15px] shadow-[0_1px_4px_0_rgba(192,208,230,0.8)] border-t-[20px] border-t-[rgba(230,236,245,0.4)] transition-transform hover:-translate-y-[2px] ${
        isDragging
          ? 'border-2 border-dashed border-black/20 pt-[31px] rounded-none bg-transparent shadow-none cursor-grabbing [&_p]:opacity-0 [&_img]:opacity-0 [&_span]:opacity-0'
          : 'bg-white rounded-[5px]'
      }`}
    >
      <header className="absolute top-[-22px]">
        {data.labels.map(label => (
          <span 
            key={label} 
            className="w-[10px] h-[10px] rounded-[2px] inline-block" 
            style={{ backgroundColor: label }} 
          />
        ))}
        <span id="ocorrencia" className="ml-[10px]">{`Cod. Ocorrencia: ${data.ocorrencia}`}</span>
      </header>
      <h3>{data.titulo}</h3>
      <p className="conteudo font-medium text-justify whitespace-pre-wrap w-full">{data.content}</p>   
      <button onClick={()=> onDelete(data.id)}><MdDelete size={20} color='red' /></button>
    </div>
  );
}