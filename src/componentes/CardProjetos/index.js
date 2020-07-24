import React from 'react';
import { Container } from './styles'
import { MdAccountCircle } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

function CardProjetos({ cliente, projeto_id }) {
    const history = useHistory();
    function AcessarQuadroScrum(){
        history.push({pathname: '/quadroScrum', state: {cliente, projeto_id}})
    }

    return (
        <Container onClick={()=> AcessarQuadroScrum()}>
            <header>
                {cliente}
            </header>
            <MdAccountCircle size={50} />            
        </Container>
    );
}

export default CardProjetos;