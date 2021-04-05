import React from 'react';

import { Container } from './styles'

function CardsKanban({ data }) {
    return (
        <Container>
            <header>
                <h4>{data.titulo}</h4>
            </header>
            <p className="conteudo">{data.content}</p>            
        </Container>
    );
}

export default CardsKanban;