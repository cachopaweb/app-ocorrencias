import React, { useState, useEffect } from 'react';
import { MdAlarm, MdAccountCircle, MdAssessment, MdAlarmAdd, MdQuestionAnswer, MdReorder } from 'react-icons/md';
import swal from 'sweetalert';

import { Container, ContainerEtiquetas, ContainerGrafico, ContainerBuscaGrafico } from './styles';
import api from '../../services/api';
import Header from '../../componentes/Header';
import FiltroData from '../../componentes/FiltroData';
import Etiqueta from '../../componentes/Etiqueta';
import Graficos from '../../componentes/Graficos';
import { tipo_erro } from '../../constants';

function OcorrenciasFinalizadas() {
    const [ocorrencias, SetOcorrencias] = useState([]);
    const [ocorrenciasFiltro, setOcorrenciasFiltro] = useState([]);
    const [dataInicial, setDataInicial] = useState(new Date());
    const [dataFinal, setDataFinal] = useState(new Date());
    const [codContrato, setCodContrato] = useState(0);
    const [OrdensGeradas, setOrdensGeradas] = useState(0);
    const [ErroUsuario, setErroUsuario] = useState(0);
    const [ErroSistema, setErroSistema] = useState(0);
    const [ProgramacaoNova, setProgramacaoNova] = useState(0);
    const [DuvidaUsuario, setDuvidaUsuario] = useState(0);
    const [Outros, setOutros] = useState(0);
    const [carregando, setCarregando] = useState(false);
    const [dadosGrafico, setDadosGrafico] = useState({});

    function ContaOrdens(auxOcorrencias) {
        let totalOcorrencias = auxOcorrencias.length;
        //ordens geradas
        let gerouOrdens = auxOcorrencias.filter((oco) => {
            return oco.abriuOS === 'SIM'
        });
        let numOrdensGeradas = gerouOrdens.length;
        setOrdensGeradas((numOrdensGeradas / totalOcorrencias) * 100);
        //erro de usuario
        let erroSistema = ContaTipoOcorrencia('ERRO DE SISTEMA', auxOcorrencias);
        if (erroSistema > 0)
            setErroSistema((erroSistema / totalOcorrencias) * 100)
        let erroUsuario = ContaTipoOcorrencia('ERRO DE USUARIO', auxOcorrencias);
        if (erroUsuario > 0)
            setErroUsuario((erroUsuario / totalOcorrencias) * 100)
        let progNova = ContaTipoOcorrencia('IMPLEMENTACAO NOVA', auxOcorrencias);
        if (progNova > 0)
            setProgramacaoNova((progNova / totalOcorrencias) * 100)
        let duvida = ContaTipoOcorrencia('DUVIDA USUARIO', auxOcorrencias);
        if (duvida > 0)
            setDuvidaUsuario((duvida / totalOcorrencias) * 100)
        let outros = ContaTipoOcorrencia('OUTROS', auxOcorrencias);
        if (outros > 0)
            setOutros((outros / totalOcorrencias) * 100);
    }

    function MontaDadosGrafico() {
        let dados = {
            labels: ['ERRO DE SISTEMA', 'ERRO DE USUARIO', 'IMPLEMENTACAO NOVA', 'DUVIDA USUARIO', 'OUTROS'],
            datasets: [
                {
                    label: 'ERRO DE SISTEMA',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    borderWidth: 1,
                    data: [ErroSistema, 0, 0, 0, 0]
                },
                {
                    label: 'ERRO DE USUARIO',
                    backgroundColor: 'rgba(255, 0, 235, 0.8)',
                    borderWidth: 1,
                    data: [0, ErroUsuario, 0, 0, 0]
                },
                {
                    label: 'IMPLEMENTACAO NOVA',
                    backgroundColor: 'rgba(255, 0, 0, 0.8)',
                    borderWidth: 1,
                    data: [0, 0, ProgramacaoNova, 0, 0]
                },
                {
                    label: 'DUVIDA USUARIO',
                    backgroundColor: 'rgba(0, 255, 25, 0.8)',
                    borderWidth: 1,
                    data: [0, 0, 0, DuvidaUsuario, 0]
                },
                {
                    label: 'OUTROS',
                    backgroundColor: 'rgba(0, 255, 255, 0.8)',
                    borderWidth: 1,
                    data: [0, 0, 0, 0, Outros]
                },
            ]
        };
        setDadosGrafico(dados);
    }

    function ContaTipoOcorrencia(tipo, auxOcorrencias) {
        let contador = auxOcorrencias.filter((oco) => {
            return oco.ocorrencia === tipo
        });

        return contador.length;
    }

    function FiltrarPorTipoErro(tipo) {
        if (tipo === -1) {
            SetOcorrencias(ocorrenciasFiltro);
            return;
        }
        let erro = tipo_erro[tipo];
        console.log(erro)
        let ocorrenciasfiltrada = ocorrenciasFiltro.filter(oco => {
            return oco.ocorrencia === String(erro.tipo).toUpperCase();
        })
        SetOcorrencias(ocorrenciasfiltrada);
    }

    async function CarregaDadosOcorrencias() {
        setCarregando(true)
        let response = await api.get('/OcorrenciasFinalizadas');
        SetOcorrencias(response.data);
        setOcorrenciasFiltro(response.data);
        ContaOrdens(response.data);
        setCarregando(false)
    }

    async function CarregaDadosOcorrenciasFiltrada() {
        setCarregando(true)
        var response = '';
        if (codContrato === 0) {
            response = await api.get(`/OcorrenciasFinalizadas?dataInicial=${dataInicial.toLocaleDateString()}&dataFinal=${dataFinal.toLocaleDateString()}`);
        }
        else {
            response = await api.get(`/OcorrenciasFinalizadas?contrato=${codContrato}`);
        }
        SetOcorrencias(response.data);
        setOcorrenciasFiltro(response.data);
        ContaOrdens(response.data);
        setCarregando(false)
    }

    useEffect(() => {
        CarregaDadosOcorrencias();
    }, [])

    useEffect(()=>{
        if (carregando){
            swal('Aguarde...', 'Carregando dados de ocorrencias', 'info')
        }else{
            swal('Ok', 'Dados carregados com sucesso', 'success')
        }
    }, [carregando])

    useEffect(() => {
        MontaDadosGrafico()
    }, [ErroSistema, ErroUsuario, ProgramacaoNova, DuvidaUsuario, Outros])

    function handleFiltro(e) {
        e.preventDefault();
        CarregaDadosOcorrenciasFiltrada();
    }

    return (
        <>
            <Header title={'Finalizadas'} />
            <Container>
                <ContainerBuscaGrafico>
                    <FiltroData funcSubmitted={handleFiltro} dataInic={setDataInicial} dataFin={setDataFinal} setCodContrato={setCodContrato} />
                    <ContainerGrafico>
                        <Graficos titulo="Estatísticas de Ocorrências" tipo="horizontalBar" data={dadosGrafico} />
                    </ContainerGrafico>
                </ContainerBuscaGrafico>
                <ContainerEtiquetas>
                    <Etiqueta key="1" click={()=> FiltrarPorTipoErro(-1)} texto="Ordens Geradas" percentual={OrdensGeradas} cor="rgba(255, 255, 255, 0.8)" corTexto="#000"><MdAlarm /></Etiqueta>
                    <Etiqueta key="2" click={()=> FiltrarPorTipoErro(0)} texto="Erro Usuário" percentual={ErroUsuario} cor="rgba(0, 0, 0, 0.8)" corTexto="#FFF"><MdAccountCircle /></Etiqueta>
                    <Etiqueta key="3" click={()=> FiltrarPorTipoErro(1)} texto="Erro Sistema" percentual={ErroSistema} cor="rgba(255, 0, 235, 0.8)" corTexto="#000"><MdAssessment /></Etiqueta>
                    <Etiqueta key="4" click={()=> FiltrarPorTipoErro(2)} texto="Programação Nova" percentual={ProgramacaoNova} cor="rgba(255, 0, 0, 0.8)" corTexto="#FFF"><MdAlarmAdd /></Etiqueta>
                    <Etiqueta key="5" click={()=> FiltrarPorTipoErro(3)} texto="Dúvidas do Usuário" percentual={DuvidaUsuario} cor="rgba(0, 255, 25, 0.8)" corTexto="#000"><MdQuestionAnswer /></Etiqueta>
                    <Etiqueta key="6" click={()=> FiltrarPorTipoErro(4)} texto="Outros" percentual={Outros} cor="rgba(0, 255, 255, 0.8)" corTexto="#000"><MdReorder /></Etiqueta>
                </ContainerEtiquetas>

                <div className="card">
                    <h1>Ocorrências Finalizadas</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Ocorrência</th>
                                <th>Tipo Erro</th>
                                <th>Data</th>
                                <th>Quem Atendeu</th>
                                <th>Cliente</th>
                                <th>Abriu OS</th>
                            </tr>
                        </thead>
                        {
                            ocorrencias.length > 0 ?
                                ocorrencias.map((oco) => (
                                    <tbody>
                                        <tr>
                                            <th>{oco.codigo}</th>
                                            <td>{oco.obs}</td>
                                            <td>{oco.ocorrencia}</td>
                                            <td>{new Date(oco.dataFinalizada).toLocaleDateString()}</td>
                                            <td>{oco.fun_atendente}</td>
                                            <td>{oco.cli_nome}</td>
                                            <td>{oco.abriuOS}</td>
                                        </tr>
                                    </tbody>
                                ))
                                : carregando ? <h1>Carregando Ocorrências...</h1> : <h1>Nenhuma ocorrência encontrada</h1>
                        }

                    </table>
                </div>
            </Container>
        </>
    );
}

export default OcorrenciasFinalizadas;