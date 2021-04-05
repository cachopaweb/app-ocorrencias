import React from 'react';
import { MdAdd } from 'react-icons/md';
import { useHistory } from 'react-router';
import CardsKanban from '../CardsKanban';

import { Container } from './styles'


function ListaKanban({data}){
    const history = useHistory();

    const criarOcorrencia = ()=>{
        history.push('/ocorrencias')
    }

    return (
       <Container>            
        <header>
            <h2>{data.title}</h2>
            {data.createBacklog && (
            <button onClick={() => criarOcorrencia()}>
                <MdAdd size={24} color="#FFF" />
            </button>)}
            {data.createSprint && (
            <button onClick={() => criarOcorrencia()}>
                <MdAdd size={24} color="#FFF" />
            </button>)}
        </header>
        {data.cards.length > 0 && (
            <ul>
            {data.cards.map((card, index) =>
                <CardsKanban                
                key={card.id}
                data={card}
                />)}
            </ul>)
        }
      </Container> 
    );
}

export default ListaKanban;