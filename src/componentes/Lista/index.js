import React from 'react';
import { MdAdd } from 'react-icons/md';
import { Container } from './styles';
import CardScrum from '../CardScrum';

export default function Lista({ data, index: listIndex }) {
  return (
    <Container>
        <header>
            <h2>{data.title}</h2>
                {data.creatable && (
                <button>
                  <MdAdd size={24} color="#FFF" />
                </button>)}
        </header>
        <ul>
          {data.cards.map((card, index) => 
            <CardScrum 
              index={index} 
              listIndex={listIndex}
              key={card.id} 
              data={card} 
            />)}
        </ul>     
    </Container>
  );
}
