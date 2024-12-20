import React, { useState, useEffect } from 'react';
import { MdAlarm, MdAccountCircle, MdAssessment, MdAlarmAdd, MdQuestionAnswer, MdReorder, MdPhoneIphone } from 'react-icons/md';
import swal from 'sweetalert';

import { Container, ContainerEtiquetas, ContainerGrafico, ContainerBuscaGrafico } from './styles';
import api from '../../services/api';
import Header from '../../componentes/Header';
import FiltroData from '../../componentes/FiltroData';
import Etiqueta from '../../componentes/Etiqueta';
import { DonutTiposOcorrencias, DonutTiposOrdemOcorrencia, Graficos, Tabela } from '../../componentes/Graficos2';
import { tipo_erro } from '../../constants';
import './../../tail.css'

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
    const [ligacaoDeRotina, setLigacaoDeRotina] = useState(0);
    const [carregando, setCarregando] = useState(false);
    const [dadosGrafico, setDadosGrafico] = useState({});
    const [dadosDonutUm, setDadosDonutUm] = useState({});
    const [dadosDonutDois, setDadosDonutDois] = useState({});
    const [dadosTabela, setDadosTabela] = useState({});

    async function ContaOrdens(auxOcorrencias) {

        let erroSistemaPorc = 0;
        let erroUsuarioPorc = 0;
        let progNovaPorc = 0;
        let duvidaUsuarioPorc = 0;
        let outrosPorc = 0;
        let ligacaoDeRotinaPorc = 0;
        let erroSistemaOrdem = 0;
        let implementacaNovaOrdem = 0;
        let outrosOrdem = 0;

        let totalOcorrencias = auxOcorrencias.length;
        //ordens geradas
        let gerouOrdens = auxOcorrencias.filter((oco) => {
            return oco.abriuOS === 'SIM'
        });

        gerouOrdens.forEach(ordem => {
            if(ordem.ocorrencia === 'ERRO DE SISTEMA')
            {
                erroSistemaOrdem++;
            }
            else if(ordem.ocorrencia === 'IMPLEMENTACAO NOVA')
            {
                implementacaNovaOrdem++;
            }
            else if(ordem.ocorrencia === 'OUTROS')
            {
                outrosOrdem++;
            }
        });

        let numOrdensGeradas = gerouOrdens.length;
        setOrdensGeradas((numOrdensGeradas / totalOcorrencias) * 100);
        //erro de usuario
        let erroSistema = ContaTipoOcorrencia('ERRO DE SISTEMA', auxOcorrencias);
        if (erroSistema > 0) {
            erroSistemaPorc = (erroSistema / totalOcorrencias) * 100;
            setErroSistema(erroSistemaPorc);
        }

        let erroUsuario = ContaTipoOcorrencia('ERRO DE USUARIO', auxOcorrencias);
        if (erroUsuario > 0) {
            erroUsuarioPorc = (erroUsuario / totalOcorrencias) * 100;
            setErroUsuario(erroUsuarioPorc);
        }
        let progNova = ContaTipoOcorrencia('IMPLEMENTACAO NOVA', auxOcorrencias);
        if (progNova > 0) {
            progNovaPorc = (progNova / totalOcorrencias) * 100;
            setProgramacaoNova(progNovaPorc);
        }

        let duvida = ContaTipoOcorrencia('DUVIDA USUARIO', auxOcorrencias);
        if (duvida > 0) {
            duvidaUsuarioPorc = (duvida / totalOcorrencias) * 100;
            setDuvidaUsuario(duvidaUsuarioPorc);
        }

        let outros = ContaTipoOcorrencia('OUTROS', auxOcorrencias);
        if (outros > 0) {
            outrosPorc = (outros / totalOcorrencias) * 100;
            setOutros(outrosPorc);
        }

        let ligacaoRotina = ContaTipoOcorrencia('LIGAÇÃO DE ROTINA', auxOcorrencias);
        if (ligacaoRotina > 0) {
            ligacaoDeRotinaPorc = (ligacaoRotina / totalOcorrencias) * 100;
            setLigacaoDeRotina(ligacaoDeRotinaPorc);
        }


        setDadosDonutUm({
            labels: ['ERRO DE SISTEMA', 'ERRO DE USUARIO', 'IMPLEMENTACAO NOVA', 'DUVIDA USUARIO', 'OUTROS', 'LIGAÇÃO DE ROTINA'],
            datasets: [
                {
                    label: 'Percentual',
                    data: [erroSistemaPorc, erroUsuarioPorc, progNovaPorc, duvidaUsuarioPorc, outrosPorc, ligacaoDeRotinaPorc],
                    backgroundColor: ['#000000cc', '#ff00ebcc', '#ff0000cc', '#00ff19cc', '#220b80cc'],
                },
            ],
        });

        setDadosDonutDois({
            labels: ['ERRO DE SISTEMA', 'IMPLEMENTAÇÃO NOVA', 'OUTROS'],
            datasets: [
                {
                    label: '',
                    data: [erroSistemaOrdem, implementacaNovaOrdem, outrosOrdem],
                    backgroundColor: ['#000000cc', '#ff00ebcc', '#ff0000cc'],
                },
            ],
        })
    }

    async function carregaDadosTabela(auxOcorrencias) {

        let totalOcorrencias = auxOcorrencias.length;
        //ordens geradas
        let gerouOrdens = auxOcorrencias.filter((oco) => {
            return oco.abriuOS === 'SIM'
        });
        let numOrdensGeradas = gerouOrdens.length;

        setDadosTabela({
            ordens: numOrdensGeradas,
            ocorrencias: totalOcorrencias
        })
    }

    function MontaDadosGrafico() {
        let dados = {
            labels: ['ERRO DE SISTEMA', 'ERRO DE USUARIO', 'IMPLEMENTACAO NOVA', 'DUVIDA USUARIO', 'OUTROS', 'LIGAÇÃO DE ROTINA'],
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
                {
                    label: 'LIGAÇÃO DE ROTINA',
                    backgroundColor: 'rgba(34, 11, 128, 0.8)',
                    borderWidth: 1,
                    data: [0, 0, 0, 0, ligacaoDeRotina]
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
        await carregaDadosTabela(response.data);
        SetOcorrencias(response.data);
        setOcorrenciasFiltro(response.data);
        await ContaOrdens(response.data);
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
        await ContaOrdens(response.data);
        setCarregando(false)
    }

    useEffect(() => {
        CarregaDadosOcorrencias();
    }, [])

    useEffect(() => {
        if (carregando) {
            swal('Aguarde...', 'Carregando dados de ocorrencias', 'info')
        } else {
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
            <div className='flex-col space-y-10'>
                <ContainerBuscaGrafico>
                    <div className='flex-col'>
                        {carregando ? <> </> :

                            <Tabela data={dadosTabela} />
                        }
                        <FiltroData funcSubmitted={handleFiltro} dataInic={setDataInicial} dataFin={setDataFinal} setCodContrato={setCodContrato} />
                    </div>
                    <ContainerGrafico>
                        <Graficos titulo="Estatísticas de Ocorrências" tipo="horizontalBar" data={dadosGrafico} />
                    </ContainerGrafico>
                </ContainerBuscaGrafico>

                { /*
                <ContainerEtiquetas>
                    <Etiqueta key="1" click={() => FiltrarPorTipoErro(-1)} texto="Ordens Geradas" percentual={OrdensGeradas} cor="rgba(255, 255, 255, 0.8)" corTexto="#000"><MdAlarm /></Etiqueta>
                    <Etiqueta key="2" click={() => FiltrarPorTipoErro(0)} texto="Erro Usuário" percentual={ErroUsuario} cor="rgba(255, 0, 235, 0.8)" corTexto="#000"><MdAccountCircle /></Etiqueta>
                    <Etiqueta key="3" click={() => FiltrarPorTipoErro(1)} texto="Erro Sistema" percentual={ErroSistema} cor="rgba(0, 0, 0, 0.8)" corTexto="#FFF"><MdAssessment /></Etiqueta>
                    <Etiqueta key="4" click={() => FiltrarPorTipoErro(2)} texto="Programação Nova" percentual={ProgramacaoNova} cor="rgba(255, 0, 0, 0.8)" corTexto="#FFF"><MdAlarmAdd /></Etiqueta>
                    <Etiqueta key="5" click={() => FiltrarPorTipoErro(3)} texto="Dúvidas do Usuário" percentual={DuvidaUsuario} cor="rgba(0, 255, 25, 0.8)" corTexto="#000"><MdQuestionAnswer /></Etiqueta>
                    <Etiqueta key="6" click={() => FiltrarPorTipoErro(4)} texto="Outros" percentual={Outros} cor="rgba(0, 255, 255, 0.8)" corTexto="#000"><MdReorder /></Etiqueta>
                    <Etiqueta key="7" click={() => FiltrarPorTipoErro(5)} texto="Ligação de Rotina" percentual={ligacaoDeRotina} cor="rgba(34, 11, 128, 0.8)" corTexto="#FFF"><MdPhoneIphone /></Etiqueta>
                </ContainerEtiquetas>
                */}

                {carregando ? <></> :
                <div className='flex flex-row'>
                    <ContainerGrafico>
                        <DonutTiposOcorrencias data={dadosDonutUm} />

                    </ContainerGrafico>
                    <ContainerGrafico>
                        <DonutTiposOrdemOcorrencia data={dadosDonutDois} />

                    </ContainerGrafico>
                </div>
                }
                </div>
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