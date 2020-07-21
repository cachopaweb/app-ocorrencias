import React, { useState, useEffect } from 'react';
import { Container } from './styles';
import api from '../../services/api';
import Header from '../../componentes/Header';
import FiltroData from '../../componentes/FiltroData';

function OcorrenciasFinalizadas(){
    const [ocorrencias, SetOcorrencias] = useState([]);
    const [dataInicial, setDataInicial] = useState(new Date());
    const [dataFinal, setDataFinal] = useState(new Date());
    const [codCliente, setCodCliente] = useState(0);
    async function CarregaDadosOcorrencias(){
        let response = await api.get('/OcorrenciasFinalizadas');
        SetOcorrencias(response.data);
    }

    async function CarregaDadosOcorrenciasFiltrada(){
        var response = '';
        if (codCliente === 0){
            response = await api.get(`/OcorrenciasFinalizadas?dataInicial=${dataInicial.toLocaleDateString()}&dataFinal=${dataFinal.toLocaleDateString()}`);
        }
        else
        {
            response = await api.get(`/OcorrenciasFinalizadas?cliente=${codCliente}`);   
        }
        SetOcorrencias(response.data);
    }

    useEffect(()=>{
        CarregaDadosOcorrencias()
    }, [])

    function handleFiltro(e){
        e.preventDefault();
        CarregaDadosOcorrenciasFiltrada(codCliente);
    }
  
    return (
        <>
            <Header title={'Finalizadas'} />        
            <Container>
                <FiltroData funcSubmitted={handleFiltro} dataInic={setDataInicial} dataFin={setDataFinal} setCodCliente={setCodCliente}  />
                <div className="card">
                    <h1>Ocorrências Finalizadas</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Ocorrência</th>
                                <th>Data</th>
                                <th>Quem Atendeu</th>
                                <th>Cliente</th>
                                <th>Abriu OS</th>
                            </tr>
                        </thead>
                            {
                                ocorrencias.length > 0 ? 
                                ocorrencias.map((oco)=> (
                                    <tbody>
                                        <tr>
                                            <th>{oco.codigo}</th>       
                                            <td>{oco.obs}</td>       
                                            <td>{new Date(oco.dataFinalizada).toLocaleDateString()}</td>       
                                            <td>{oco.fun_atendente}</td>       
                                            <td>{oco.cli_nome}</td>  
                                            <td>{oco.abriuOS}</td>     
                                        </tr>
                                    </tbody>  
                                ))                              
                                : <h1>Carregando Ocorrências...</h1>
                            }
                        
                    </table>        
                </div>        
            </Container>
        </>
    );
}

export default OcorrenciasFinalizadas;