import React from 'react';
import { Container } from './styles'
import { MdAccountCircle } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

function CardProjetos({ cliente, projeto_id, contrato, status, data_entrega }) {
    const history = useHistory();
    function AcessarQuadroScrum(){
        history.push({pathname: '/quadroScrum', state: {cliente, projeto_id, contrato}})
    }

    return (
        <Container onClick={()=> AcessarQuadroScrum()}>
            <header>
                {cliente}
            </header>
            <MdAccountCircle size={50} />   
            <h3>Status</h3>
            {status}         
            <h4>Data Entrega</h4>
            {new Date(data_entrega).toLocaleDateString()}         
        </Container>
    );
}

export default CardProjetos;