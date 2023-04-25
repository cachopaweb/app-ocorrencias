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

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CreateOcorrencias from '../CreateOcorrencias';

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

function ClientesSemOcorrencias() {
    const classes = useStyles();
    const [ClientesSemOcorrencias, SetClientesSemOcorrencias] = useState([]);
    const [modalAberturaOcorrencia, setModalAberturaOcorrencia] = useState(false);
    const [projetoScrumSelecionado, setProjetoScrumSelecionado] = useState(0);
    const [reabrir, setReabrir] = useState(false)
    const [quantidade, setQuantidade] = useState(5);

    async function CarregaDadosOrdens() {
        let response = await api.get(`/Clientes/SemOcorrencias?qtd=${quantidade}`);
        SetClientesSemOcorrencias(response.data);
    }

    useEffect(() => {
        SetClientesSemOcorrencias([]);
        CarregaDadosOrdens();
        setModalAberturaOcorrencia(false);        
    }, [quantidade, reabrir])

    const handleQuantidade = (qtd) => {
        setQuantidade(qtd);
    }

    const abrirOcorrencia = (projeto_scrum) => {
        setProjetoScrumSelecionado(projeto_scrum);
        setModalAberturaOcorrencia(true);
    }

    return (
        <>
            <Header title={'Clientes Sem Ocorrências'} />

            <Modal activate={modalAberturaOcorrencia} setActivate={setModalAberturaOcorrencia} altura={'300px'} largura={'300px'}>
                {modalAberturaOcorrencia && <CreateOcorrencias codigo_projeto_scrum={projetoScrumSelecionado} retornarPara={()=> setReabrir(!reabrir)} />}
            </Modal>

            <Container>
                <div className="card">
                    <h1>Clientes que não tiveram ocorrências no período de 90 dias</h1>
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
                                    <StyledTableCell>Cliente</StyledTableCell>
                                    <StyledTableCell>Celular</StyledTableCell>
                                    <StyledTableCell>Telefone</StyledTableCell>
                                    <StyledTableCell>Data Ult. Ocorrência</StyledTableCell>
                                    <StyledTableCell>Func. Atendeu</StyledTableCell>
                                    <StyledTableCell>Tempo</StyledTableCell>
                                    <StyledTableCell>Ação</StyledTableCell>

                                </TableRow>
                            </TableHead>
                            {
                                ClientesSemOcorrencias.length > 0 ?
                                    ClientesSemOcorrencias.map((so) => (
                                        <TableBody key={so.contrato}>
                                            <TableRow>
                                                <StyledTableCell>{so.nome}</StyledTableCell>
                                                <StyledTableCell>{so.celular}</StyledTableCell>
                                                <StyledTableCell>{so.fone}</StyledTableCell>
                                                <StyledTableCell>{so.data_ultima_ocorrencia}</StyledTableCell>
                                                <StyledTableCell>{so.fun_atendimento}</StyledTableCell>
                                                <StyledTableCell>{so.tempo}</StyledTableCell>
                                                <StyledTableCell><Button nome="Abrir Ocorrência" borderRadius="10px" color="#000" corTexto="#FFF" Icon={MdAssignment} click={() => abrirOcorrencia(so.cod_projeto_scrum)} /></StyledTableCell>
                                            </TableRow>
                                        </TableBody>
                                    ))
                                    : <h1>Carregando clientes sem ocorrências...</h1>
                            }

                        </Table>
                    </TableContainer>
                </div>
            </Container>
        </>
    );
}

export default ClientesSemOcorrencias;