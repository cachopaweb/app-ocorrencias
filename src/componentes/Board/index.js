import React, { useState } from 'react';
import BoardContext from './context';
import { Container } from './styles';
import { loadLists } from '../../services/ApiFake';
import Lista from '../Lista';
import produce from 'immer';
import Header from '../Header';

const data = loadLists();

export default function Board() {
  const [lista, setLista] = useState(data);

  function move(fromList, toList, from, to) {
    console.table(fromList, toList, from, to)
    setLista(produce(lista, draft => {
      const dragged = draft[fromList].cards[from];

      draft[fromList].cards.splice(from, 1);
      draft[toList].cards.splice(to, 0, dragged);
    }
    ))
  }

  return (
      <BoardContext.Provider value={{ lista, move }}>
        <Header title={'SCRUM'} />
        <Container>
          {lista.map((lista, index) => <Lista key={lista.title} index={index} data={lista} />)}
        </Container>
      </BoardContext.Provider>    
  );
}
