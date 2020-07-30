import React from 'react';

import { Container, Label } from './styles';
import { useDrag } from 'react-dnd';

function CardSprintBacklog({ data, index, listIndex }) {

    const [{ isDragging }, dragRef] = useDrag({
        item: { type: 'CARD_SPRINT_BACKLOG', index, listIndex, data },
            collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <Container ref={dragRef} isDragging={isDragging}>
            <header>
                {data.labels.map(label => <Label key={label} color={label} />)}
                <span id="ocorrencia">{`Cod. Ocorrencia: ${data.ocorrencia}`}</span>
            </header>
            <p>{data.content}</p>
            {data.user && <img src={data.user} alt="Avatar" />}
        </Container>);
}

export default CardSprintBacklog;