import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Header from '../../componentes/Header';
import { MdAssignment, MdSave } from 'react-icons/md';

import { Container, LinhaDestaque } from './styles';
import { useUsuario } from '../../context/UsuarioContext';
import Button from '../../componentes/Button';
import { MdAlarmAdd } from 'react-icons/md';
import swal from '@sweetalert/with-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import pt_br from 'date-fns/locale/pt-BR';
import Modal from '../../componentes/Modal';
import OrdemDetalhe from '../OrdemDetalhe';

registerLocale('pt-BR', pt_br);

function OrdensAndamento() {
    const [ordens, SetOrdens] = useState([]);
    const [ordemSelecionada, setOrdemSelecionada] = useState({});
    const [ordensFiltrada, setOrdensFiltrada] = useState([]);
    const { cod_funcionario, login, fun_categoria } = useUsuario();
    const [dataPrazoEntrega, setDataPrazoEntrega] = useState(new Date());
    const [dadosAlterados, setDadosAlterados] = useState(false);
    const [modalAtivo, setModalAtivo] = useState(false);
    const [modalDetalhesAtivo, setModalDetalhesAtivo] = useState(false);
    const [ordCodigo, setOrdCodigo] = useState(0);
    const [dataAntiga, setDataAntiga] = useState('');
    const [filtroOrdens, setFiltroOrdens] = useState('minhas_os');

    async function CarregaDadosOrdens() {
        let response = await api.get('/Ordens');
        SetOrdens(response.data);
        setOrdensFiltrada(response.data)
        filtrarOrdens(response.data)
    }

    function changePrazoEntrega(data) {
        setDataPrazoEntrega(new Date(data));
    }

    function modalPrazoEntrega(ord_codigo, prazoAnterior) {
        setOrdCodigo(ord_codigo);
        setDataAntiga(new Date(prazoAnterior).toLocaleDateString());
        setModalAtivo(true)
    }

    async function atualizarPrazoEntrega(e) {
        e.preventDefault();
        if (ordCodigo === 0) { swal('Codigo da Ordem é obrigatório!', 'Click em uma ordem de serviço', 'warning'); return; }
        let data = {
            Funcionario: cod_funcionario,
            Ordem: ordCodigo,
            PrazoAnterior: dataAntiga,
            PrazoNovo: dataPrazoEntrega.toLocaleDateString()
        }
        let response = await api.put(`/Ordens/${ordCodigo}`, data);
        if (response.status === 203) {
            swal('Prazo entrega atualizado com sucesso!', `Código histórico ${response.data.Historico}`, 'success')
            setDadosAlterados(true)
        } else {
            swal('Erro ao atualizar prazo de entrega!', `erro ${response.data.error}`, 'error')
        }
    }


    useEffect(() => {
        CarregaDadosOrdens();
        setModalAtivo(false);
        setModalDetalhesAtivo(false);
        setDadosAlterados(false)
    }, [dadosAlterados])

    const filtrarOrdens = (_ordens) => {
        if (_ordens.length === 0) return;
        var filtrada = [];
        if (filtroOrdens === 'minhas_os') {
            if (fun_categoria.substring(0, 8) === 'PROGRAMA') {
                filtrada = _ordens.filter((ordem) => (
                    ordem.programador.substring(0, 5) === login.substring(0, 5)
                ));
            } else {
                filtrada = _ordens.filter((ordem) => (
                    ordem.fun_teste.substring(0, 5) === login.substring(0, 5)
                ));
            }
            setOrdensFiltrada(filtrada);
        } else {
            setOrdensFiltrada(_ordens);
        }
    }

    useEffect(() => {
        filtrarOrdens(ordens)
    }, [ordens, filtroOrdens])

    const SelecionaOrdem = (ordem) => {
        setModalDetalhesAtivo(true)
        setOrdemSelecionada(ordem)
    }

    return (
        <>
            <Header title={'Em Andamento'} />
            <Modal activate={modalAtivo} setActivate={setModalAtivo} altura={'auto'} largura={'auto'}>
                <form id="form" onSubmit={atualizarPrazoEntrega}>
                    <div className="form-group">
                        <label htmlFor="prazo-entrega">Novo prazo de Entrega</label>
                        <div>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataPrazoEntrega} onChange={changePrazoEntrega} />
                            <Button color="black" corTexto="white" nome="Salvar" Icon={MdSave} tamanho_icone={20} borderRadius="10px" />
                        </div>
                    </div>
                </form>
            </Modal>

            <Modal activate={modalDetalhesAtivo} setActivate={setModalDetalhesAtivo} altura={'auto'} largura={'auto'}>
                {modalDetalhesAtivo && <OrdemDetalhe ordem={ordemSelecionada} SetDadosAlterados={setDadosAlterados} />}
            </Modal>

            <Container>
                <div className="card">
                    <h1>Ordens de Serviço em Andamento</h1>
                    <div className="form">
                        <form id="form">
                            <div className="form-group">
                                <div className="input-control">
                                    <label htmlFor="minhas_os">Minhas Ordens</label>
                                    <input type="radio" name="filtro" id="minhas_os" value={filtroOrdens} onChange={() => setFiltroOrdens('minhas_os')} checked={filtroOrdens === 'minhas_os'} />
                                </div>
                                <div className="input-control">
                                    <label htmlFor="todas">Todas</label>
                                    <input type="radio" name="filtro" id="todas" value={filtroOrdens} onChange={() => setFiltroOrdens('todas')} checked={filtroOrdens === 'todas'} />
                                </div>
                            </div>
                        </form>
                    </div>
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
                                <th>Quem Testará</th>
                                <th>Quem Entregará</th>
                                <th>Ação</th>
                                {cod_funcionario === 19 && <th>Novo Prazo</th>}
                            </tr>
                        </thead>
                        {
                            ordensFiltrada.length > 0 ?
                                ordensFiltrada.map((ordem) => (
                                    <tbody>
                                        <tr>
                                            <th>{new Date(ordem.novo_prazoe).toLocaleDateString()}</th>
                                            <td>{ordem.ord_codigo}</td>
                                            <td>{ordem.cli_nome}</td>
                                            <td>{new Date(ordem.dataAbertura).toLocaleDateString()}</td>
                                            {(fun_categoria.substring(0, 8) === 'PROGRAMA') &&
                                                <LinhaDestaque
                                                    cor={ordem.estado === 'ANALISADA' ? '#900' : '#FFF'}
                                                    corTexto={ordem.estado === 'ANALISADA' ? '#FFF' : '#000'}
                                                >{ordem.estado}</LinhaDestaque>
                                            }
                                            {(fun_categoria.substring(0, 7) === 'SUPORTE') &&
                                                <LinhaDestaque
                                                    cor={ordem.estado === 'PROGRAMADA' ? '#900' : '#FFF'}
                                                    corTexto={ordem.estado === 'PROGRAMADA' ? '#FFF' : '#000'}
                                                >{ordem.estado}</LinhaDestaque>
                                            }
                                            <td>{ordem.prioridade}</td>
                                            <td>{ordem.programador}</td>
                                            <td>{ordem.quemAbriu}</td>
                                            <td>{ordem.fun_teste}</td>
                                            <td>{ordem.fun_entrega}</td>
                                            <td><Button nome="Ver Detalhes" borderRadius="10px" color="#000" corTexto="#FFF" Icon={MdAssignment} click={() => SelecionaOrdem(ordem)} /></td>
                                            {cod_funcionario === 19 && <td><Button click={() => modalPrazoEntrega(ordem.ord_codigo, ordem.prazoEntrega)} Icon={MdAlarmAdd} nome="Novo Prazo" borderRadius={"18px"} color={"black"} corTexto={"white"} /></td>}
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