import React, { useState, useEffect } from 'react';
import { Container } from './styles';
import api from '../../services/api';
import Header from '../../componentes/Header';
import { MdAssignment } from 'react-icons/md';
import { Link } from 'react-router-dom';

function OrdensAndamento(){
    const [ordens, SetOrdens] = useState([]);

    async function CarregaDadosOcorrencias(){
        let response = await api.get('/Ordens');
        SetOrdens(response.data);
    }

    useEffect(()=>{
        CarregaDadosOcorrencias()
    }, [])
  
    return (
        <>
            <Header title={'Em Andamento'} />        
            <Container>
                <div className="card">
                    <h1>Ordens de Serviço em Andamento</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Data Entrega</th>
                                <th>Ordem</th>
                                <th>Cliente</th>
                                <th>Data Abertura</th>
                                <th>Situação</th>
                                <th>Prioridade</th>
                                <th>Programador</th>
                                <th>Quem Abriu</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                            {
                                ordens.length > 0 ? 
                                ordens.map((ordem)=> (
                                    <tbody>
                                        <tr>
                                            <th>{new Date(ordem.prazoEntrega).toLocaleDateString()}</th>       
                                            <td>{ordem.ord_codigo}</td>       
                                            <td>{ordem.cli_nome}</td>       
                                            <td>{new Date(ordem.dataAbertura).toLocaleDateString()}</td>       
                                            <td>{ordem.estado}</td>       
                                            <td>{ordem.prioridade}</td>  
                                            <td>{ordem.programador}</td>     
                                            <td>{ordem.quemAbriu}</td>     
                                            <td><Link to={{pathname: '/ordemDetalhe', state: { ordem: ordem } }}><MdAssignment color={'black'} /> Ver Detalhes</Link></td>     
                                        </tr>
                                    </tbody>  
                                ))                              
                                : <h1>Carregando Ordens...</h1>
                            }
                        
                    </table>        
                </div>        
            </Container>
        </>
    );
}

export default OrdensAndamento;