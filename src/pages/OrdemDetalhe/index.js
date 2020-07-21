import React, { useState, useEffect } from 'react';
import { Container } from './styles';
import Header from '../../componentes/Header';
import Card from '../../componentes/Card';
import { useLocation } from 'react-router-dom';

function OrdemDetalhe(){
    const { state  } = useLocation();
    const { ordem } = state;

    function converteData(data){
        let arrayData = data.split('/');
        let date = new Date(parseInt(arrayData[2]+'20'), arrayData[0]-1, arrayData[1]);
        return date;    
    } 
   
    return (
            <>
                <Header title={'Detalhe da Ordem'} />        
                <Container>
                    { 
                        <Card key={ordem.ord_codigo} cliente={ordem.cli_nome} contrato={ordem.ord_codigo} ocorrencia={ordem.ocorrencia} atendente={ordem.programador} nomeAtendente={ordem.programador} cod_ocorrencia={ordem.ord_codigo} data={converteData(ordem.prazoEntrega)} showActions={false} />                    
                    }                 
                </Container>
            </>
        );
}

export default OrdemDetalhe;