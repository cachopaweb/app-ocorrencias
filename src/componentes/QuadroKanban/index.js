import React, { useEffect, useState } from 'react';

import api from '../../services/api';
import Header from '../Header';
import ListaCards from './ListaKanban'
import { Container, Centralizar } from './styles';

function QuadroKanban(){
    const [listaCards, setListaCards] = useState([]);
    const [loading, setLoading] = useState(false);

    async function fetchKanban(){
        try {
            const response = await api.get('/quadroKanban/Ocorrencias');
            if (response.status === 200){
                setListaCards(response.data);
                setLoading(false)
            }            
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(()=>{
        setLoading(true)
        fetchKanban();
    }, []);


    return (
        <>
        <Header title='Quadro Kanban' />            
        <Container>
            {loading ? <Centralizar>Carregando dados...</Centralizar> : 
            listaCards.length > 0 && 
                listaCards.map((lista, index) => <ListaCards key={index} data={lista}  />)
            }            
        </Container>
        </>
    );
}

export default QuadroKanban;