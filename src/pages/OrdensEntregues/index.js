import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Header from '../../componentes/Header';
import { MdAssignment } from 'react-icons/md';

import { Container, Paginacao } from './styles';
import Button from '../../componentes/Button';
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
import DetalhesCliente from '../../componentes/DetalhesCliente';

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

function OrdensEntregues() {
    const classes = useStyles();
    const [ordens, SetOrdens] = useState([]);
    const [ordemSelecionada, setOrdemSelecionada] = useState({});
    const [modalDetalheOrdemAtivo, setModalDetalheOrdemAtivo] = useState(false);
    const [modalClienteAtivo, setModalClienteAtivo] = useState(false);
    const [contratoSelecionado, setContratoSelecionado] = useState(0);
    const [clienteSelecionado, setClienteSelecionado] = useState({});
    const [quantidade, setQuantidade] = useState(10);

    async function CarregaDadosOrdens() {
        let response = await api.get(`/Ordens/entregues/${quantidade}`);
        SetOrdens(response.data);
    }

    useEffect(() => {
        SetOrdens([]);
        CarregaDadosOrdens();
        setModalDetalheOrdemAtivo(false);
        setModalClienteAtivo(false);
    }, [quantidade])

    useEffect(() => {
        if (contratoSelecionado > 0) {
            mostraDadosCliente();
        }
    }, [contratoSelecionado])


    const SelecionaOrdem = (ordem) => {
        setModalDetalheOrdemAtivo(true);
        setOrdemSelecionada(ordem)
    }

    const mostraDadosCliente = async () => {
        try {
            let response = await api.get(`/Clientes?contrato=${contratoSelecionado}`);
            setClienteSelecionado(response.data[0]);
            setModalClienteAtivo(true);
        } catch (e) {
            console.log(e)
        }
    }

    const handleQuantidade = (qtd) => {
        setQuantidade(qtd);
    }

    return (
        <>
            <Header title={'Ordens Entregues'} />

            <Modal activate={modalDetalheOrdemAtivo} setActivate={setModalDetalheOrdemAtivo} altura={'auto'} largura={'auto'}>
                {modalDetalheOrdemAtivo && <OrdemDetalhe ordem={ordemSelecionada} />}
            </Modal>

            <Modal activate={modalClienteAtivo} setActivate={setModalClienteAtivo} altura={'300px'} largura={'300px'}>
                {modalClienteAtivo && <DetalhesCliente cliente={clienteSelecionado} />}
            </Modal>

            <Container>
                <div className="card">
                    <h1>Ordens de Serviço Entregues</h1>
                    <Paginacao>
                        <a className={quantidade === 5 ? 'active' : ''} onClick={() => handleQuantidade(5)}>5</a>
                        <a className={quantidade === 10 ? 'active' : ''} onClick={() => handleQuantidade(10)}>10</a>
                        <a className={quantidade === 20 ? 'active' : ''} onClick={() => handleQuantidade(20)}>20</a>
                        <a className={quantidade === 30 ? 'active' : ''} onClick={() => handleQuantidade(30)}>30</a>
                        <a className={quantidade === 40 ? 'active' : ''} onClick={() => handleQuantidade(40)}>40</a>
                        <a className={quantidade === 50 ? 'active' : ''} onClick={() => handleQuantidade(50)}>50</a>
                    </Paginacao>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} size="large" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Data Entrega</StyledTableCell>
                                    <StyledTableCell>Ordem</StyledTableCell>
                                    <StyledTableCell>Cliente</StyledTableCell>
                                    <StyledTableCell>Data Abertura</StyledTableCell>
                                    <StyledTableCell>Programador</StyledTableCell>
                                    <StyledTableCell>Quem Abriu</StyledTableCell>
                                    <StyledTableCell>Quem Testará</StyledTableCell>
                                    <StyledTableCell>Quem Entregará</StyledTableCell>
                                    <StyledTableCell>Ação</StyledTableCell>

                                </TableRow>
                            </TableHead>
                            {
                                ordens.length > 0 ?
                                    ordens.map((ordem) => (
                                        <TableBody key={ordem.ord_codigo}>
                                            <TableRow>
                                                <StyledTableCell>{new Date(ordem.novo_prazoe).toLocaleDateString()}</StyledTableCell>
                                                <StyledTableCell>{ordem.ord_codigo}</StyledTableCell>
                                                <StyledTableCell style={{ cursor: 'pointer' }} onClick={(e) => setContratoSelecionado(ordem.contrato)}>{ordem.cli_nome}</StyledTableCell>
                                                <StyledTableCell>{new Date(ordem.dataAbertura).toLocaleDateString()}</StyledTableCell>
                                                <StyledTableCell>{ordem.programador}</StyledTableCell>
                                                <StyledTableCell>{ordem.quemAbriu}</StyledTableCell>
                                                <StyledTableCell>{ordem.fun_teste}</StyledTableCell>
                                                <StyledTableCell>{ordem.fun_entrega}</StyledTableCell>
                                                <StyledTableCell><Button nome="Ver Detalhes" borderRadius="10px" color="#000" corTexto="#FFF" Icon={MdAssignment} click={() => SelecionaOrdem(ordem)} /></StyledTableCell>
                                            </TableRow>
                                        </TableBody>
                                    ))
                                    : <h1>Carregando Ordens...</h1>
                            }

                        </Table>
                    </TableContainer>
                </div>
            </Container>
        </>
    );
}

export default OrdensEntregues;