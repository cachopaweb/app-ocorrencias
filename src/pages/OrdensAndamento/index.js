import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Header from '../../componentes/Header';
import { MdAssignment, MdSave } from 'react-icons/md';

import { ColorAnimationPusing, Container, LinhaDestaque } from './styles';
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

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

registerLocale('pt-BR', pt_br);

function OrdensAndamento() {
    const classes = useStyles();
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
    const [motivo, setMotivo] = useState('');

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
            PrazoNovo: dataPrazoEntrega.toLocaleDateString(),
            Motivo: motivo
        }
        let response = await api.put(`/Ordens/${ordCodigo}`, data);
        if (response.status === 201) {
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

    const corLinhaDestaqueSuporte = (estado) => {
        const estadoCores = { 'PROGRAMADA': '#900', 'TESTADA': '#008080', 'DEFAULT': '#FFF' };
        return estadoCores[estado] ?? estadoCores['DEFAULT'];
    }

    const corLinhaDestaqueProgramacao = (estado) => {
        const estadoCores = { 'ANALISADA': '#900', 'PROGRAMADA': '#008080', 'DEFAULT': '#FFF' };
        return estadoCores[estado] ?? estadoCores['DEFAULT'];
    }

    const ordemEmAtraso = (data) => {
        const dataHoje = new Date();
        const dataOS = new Date(data);
        return dataOS <= dataHoje;
    }

    const verificaDataHoje = (data) => {
        const dataHoje = new Date();
        const dataOS = new Date(data);
        return dataOS.getDate() === dataHoje.getDate()
            && dataOS.getMonth() === dataHoje.getMonth()
            && dataOS.getFullYear() === dataHoje.getFullYear()
    }

    return (
        <>
            <Header title={'Em Andamento'} />
            <Modal activate={modalAtivo} setActivate={setModalAtivo}>
                <Container>
                    <div className="card">
                        <form id="form" onSubmit={atualizarPrazoEntrega}>
                            <div className="form-group">
                                <label htmlFor="prazo-entrega">Novo prazo de Entrega</label>
                                <div>
                                    <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataPrazoEntrega} onChange={changePrazoEntrega} />
                                    <textarea name="motivo" id="motivo" onChange={(e) => setMotivo(e.target.value)}></textarea><br />
                                    <Button color="black" corTexto="white" nome="Salvar" Icon={MdSave} tamanho_icone={20} borderRadius="10px" />
                                </div>
                            </div>
                        </form>
                    </div>
                </Container>
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
                    <TableContainer component={Paper}>
                        <Table className={classes.table} size="large" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Data Entrega</StyledTableCell>
                                    <StyledTableCell>Ordem</StyledTableCell>
                                    <StyledTableCell>Cliente</StyledTableCell>
                                    <StyledTableCell>Data Abertura</StyledTableCell>
                                    <StyledTableCell>Situação</StyledTableCell>
                                    <StyledTableCell>Prioridade</StyledTableCell>
                                    <StyledTableCell>Programador</StyledTableCell>
                                    <StyledTableCell>Quem Abriu</StyledTableCell>
                                    <StyledTableCell>Quem Testará</StyledTableCell>
                                    <StyledTableCell>Quem Entregará</StyledTableCell>
                                    <StyledTableCell>Ação</StyledTableCell>
                                    {(fun_categoria.substring(0, 8) === 'ADM') && <th>Novo Prazo</th>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    ordensFiltrada.length > 0 ?
                                        ordensFiltrada.map((ordem) => (
                                            ordemEmAtraso(ordem.novo_prazoe) ?
                                                (<ColorAnimationPusing key={ordem.ord_codigo} hoje={verificaDataHoje(ordem.novo_prazoe)}>
                                                    <StyledTableCell>{new Date(ordem.novo_prazoe).toLocaleDateString()}</StyledTableCell>
                                                    <StyledTableCell>{ordem.ord_codigo}</StyledTableCell>
                                                    <StyledTableCell>{ordem.cli_nome}</StyledTableCell>
                                                    <StyledTableCell>{new Date(ordem.dataAbertura).toLocaleDateString()}</StyledTableCell>
                                                    {((fun_categoria.substring(0, 8) === 'PROGRAMA')) &&
                                                        <LinhaDestaque
                                                            cor={corLinhaDestaqueProgramacao(ordem.estado)}
                                                            corTexto={ordem.estado === 'ANALISADA' || ordem.estado == 'PROGRAMADA' ? '#FFF' : '#000'}
                                                        >{ordem.estado}</LinhaDestaque>
                                                    }
                                                    {((fun_categoria.substring(0, 7) === 'SUPORTE') || (fun_categoria.substring(0, 8) === 'ADM')) &&
                                                        <LinhaDestaque
                                                            cor={corLinhaDestaqueSuporte(ordem.estado)}
                                                            corTexto={ordem.estado === 'PROGRAMADA' || ordem.estado === 'TESTADA' ? '#FFF' : '#000'}
                                                        >{ordem.estado}</LinhaDestaque>
                                                    }
                                                    <StyledTableCell>{ordem.prioridade}</StyledTableCell>
                                                    <StyledTableCell>{ordem.programador}</StyledTableCell>
                                                    <StyledTableCell>{ordem.quemAbriu}</StyledTableCell>
                                                    <StyledTableCell>{ordem.fun_teste}</StyledTableCell>
                                                    <StyledTableCell>{ordem.fun_entrega}</StyledTableCell>
                                                    <StyledTableCell><Button nome="Ver Detalhes" borderRadius="10px" color="#000" corTexto="#FFF" Icon={MdAssignment} click={() => SelecionaOrdem(ordem)} /></StyledTableCell>
                                                    {(fun_categoria.substring(0, 8) === 'ADM') && <StyledTableCell><Button click={() => modalPrazoEntrega(ordem.ord_codigo, ordem.prazoEntrega)} Icon={MdAlarmAdd} nome="Novo Prazo" borderRadius={"18px"} color={"black"} corTexto={"white"} /></StyledTableCell>}
                                                </ColorAnimationPusing>)
                                                : (
                                                    <TableRow>
                                                        <StyledTableCell>{new Date(ordem.novo_prazoe).toLocaleDateString()}</StyledTableCell>
                                                        <StyledTableCell>{ordem.ord_codigo}</StyledTableCell>
                                                        <StyledTableCell>{ordem.cli_nome}</StyledTableCell>
                                                        <StyledTableCell>{new Date(ordem.dataAbertura).toLocaleDateString()}</StyledTableCell>
                                                        {((fun_categoria.substring(0, 8) === 'PROGRAMA')) &&
                                                            <LinhaDestaque
                                                                cor={corLinhaDestaqueProgramacao(ordem.estado)}
                                                                corTexto={ordem.estado === 'ANALISADA' || ordem.estado == 'PROGRAMADA' ? '#FFF' : '#000'}
                                                            >{ordem.estado}</LinhaDestaque>
                                                        }
                                                        {((fun_categoria.substring(0, 7) === 'SUPORTE') || (fun_categoria.substring(0, 8) === 'ADM')) &&
                                                            <LinhaDestaque
                                                                cor={corLinhaDestaqueSuporte(ordem.estado)}
                                                                corTexto={ordem.estado === 'PROGRAMADA' || ordem.estado === 'TESTADA' ? '#FFF' : '#000'}
                                                            >{ordem.estado}</LinhaDestaque>
                                                        }
                                                        <StyledTableCell>{ordem.prioridade}</StyledTableCell>
                                                        <StyledTableCell>{ordem.programador}</StyledTableCell>
                                                        <StyledTableCell>{ordem.quemAbriu}</StyledTableCell>
                                                        <StyledTableCell>{ordem.fun_teste}</StyledTableCell>
                                                        <StyledTableCell>{ordem.fun_entrega}</StyledTableCell>
                                                        <StyledTableCell><Button nome="Ver Detalhes" borderRadius="10px" color="#000" corTexto="#FFF" Icon={MdAssignment} click={() => SelecionaOrdem(ordem)} /></StyledTableCell>
                                                        {(fun_categoria.substring(0, 8) === 'ADM') && <StyledTableCell><Button click={() => modalPrazoEntrega(ordem.ord_codigo, ordem.prazoEntrega)} Icon={MdAlarmAdd} nome="Novo Prazo" borderRadius={"18px"} color={"black"} corTexto={"white"} /></StyledTableCell>}
                                                    </TableRow>
                                                )
                                        ))
                                        : <h1>Carregando Ordens...</h1>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Container>
        </>
    );
}

export default OrdensAndamento;