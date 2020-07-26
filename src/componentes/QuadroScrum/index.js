import React, { useState } from 'react';
import BoardContext from './context';
import { Container } from './styles';
import Lista from '../Lista';
import produce from 'immer';
import Header from '../Header';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import api from '../../services/api';

export default function QuadroScrum() {
  const [lista, setLista] = useState([]);
  const [atualizar, setAtualizar] = useState(false);
  const { state } = useLocation();
  const { cliente, projeto_id} = state;

  async function fetchQuadroScrum(){
    let response = await api.get(`/quadroScrum?projeto_id=${projeto_id}`);
    setLista(response.data);
  }

  useEffect(()=> {
    fetchQuadroScrum();
    setAtualizar(false);
  }, [atualizar]);

  function move(fromList, toList, from, to, type) {
    console.log(lista)
    console.table(fromList, toList, from, to, type)
    setLista(produce(lista, draft => {
        const dragged = draft[fromList].cards[from];
        draft[fromList].cards.splice(from, 1);
        if (type === 'CARD_SPRINT'){
          if (draft[toList].cards.length > 0){
            draft[toList].cards.splice(to, 0, dragged)
          }else{            
            draft[toList].cards.push(dragged)
          }
        }
      }
    ))
  }

  return (
    <BoardContext.Provider value={{ lista, move, setAtualizar }}>
      <Header title={`Scrum ${state.cliente}`} />
      <Container>
        {lista.map((lista, index) => <Lista key={lista.title} index={index} data={lista} cliente={cliente} projeto_id={projeto_id} update={setAtualizar} />)}
      </Container>
    </BoardContext.Provider>
  );
}
