import React from 'react';
import { useDrag } from 'react-dnd';

import { Container, Label } from './styles';

function CardsKanban({ data, index, listIndex, color }) {
    const [{ isDragging }, dragRef] = useDrag({
        item: { type: 'CARD_OCORRENCIA', index, listIndex, data },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <Container ref={dragRef} isDragging={isDragging} color={color}>
            {data?.labels?.map(label => <Label key={label} color={label} />)}
            <header>
                <h4>{data?.titulo}</h4>
            </header>
            <p className="conteudo">{data?.content}</p>
            <br />
            <p><strong>{data?.user}</strong></p>
        </Container>
    );
}

export default CardsKanban;