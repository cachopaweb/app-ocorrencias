import React, { useState } from 'react';

import { Container, Label } from './styles';
import { useDrag } from 'react-dnd';
import Modal from '../Modal';

function CardSprintBacklog({ data, index, listIndex, dataEntrega }) {  
    const [modalAtivo, setModalAtivo] = useState(false);    

    const [{ isDragging }, dragRef] = useDrag({
        item: { type: 'CARD_SPRINT_BACKLOG', index, listIndex, data },
            collect: monitor => ({
            isDragging: monitor.isDragging(),        
        }),        
    });   

    return (
        <Container ref={dragRef} isDragging={isDragging} onClick={()=> setModalAtivo(!modalAtivo)}>
            <header>
                {data.labels.map(label => <Label key={label} color={label} />)}
                <span id="ocorrencia">{`Cod. Ocorrencia: ${data.ocorrencia}`}</span>
            </header>
            <h3>{data.titulo}</h3> 
            <Modal activate={modalAtivo} setActivate={setModalAtivo} altura={400} largura={500} >
                <Container>
                    <h3>{data.titulo}</h3>
                    <h3>{new Date(dataEntrega).toLocaleDateString()}</h3>
                    <p>
                        {data.content}
                    </p>
                </Container>
            </Modal>          
        </Container>);
}

export default CardSprintBacklog;