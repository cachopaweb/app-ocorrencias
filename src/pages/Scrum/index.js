import React, { useEffect, useState } from 'react';
import { MdAdd, MdAssignment, MdAutorenew } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Burndown from '../../componentes/Burndown';

import { Container, Pesquisa, Floating, Tabela, LinhaDestaque, Card } from './styles';
import Header from '../../componentes/Header';
import api from '../../services/api';
import Button from '../../componentes/Button';
import Modal from '../../componentes/Modal';
import Create_Projeto_Scrum from '../Create_Projeto_Scrum';
import { useUsuario } from '../../context/UsuarioContext';
import { MdShowChart } from 'react-icons/md';

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


function Scrum() {
    const classes = useStyles();
    const [projetos, setProjetos] = useState([]);
    const [projetos_filtrados, setProjetos_filtrados] = useState([]);
    const [modalAtivo, setModalAtivo] = useState(false);
    const { fun_categoria } = useUsuario();
    const history = useHistory();
    const [burndownAtivo, setBurndownAtivo] = useState(false);

    async function fetchProjetosScrum() {
        let response = await api.get('/projetos_scrum/EmAndamento');
        setProjetos(response.data);
        setProjetos_filtrados(response.data);
    }

    useEffect(() => {
        fetchProjetosScrum();
    }, [])

    function filtrarPorProjeto(busca) {
        let result = projetos.filter((projetos) => projetos.cli_nome.toUpperCase().includes(busca.toUpperCase()))
        setProjetos_filtrados(result);
    }

    function SelecionaProjeto(projeto) {
        history.push({ pathname: '/quadroScrum', state: { cliente: projeto.cli_nome, projeto_id: projeto.ps_codigo, contrato: projeto.contrato } })
    }

    function SelecionaProjetoRetrospectiva(projeto) {
        history.push({ pathname: '/retrospectiva', state: { projeto_scrum: projeto.ps_codigo, cliente: projeto.cli_nome } });
    }

    return (
        <>
            <Header title={"Scrum"} />
            {modalAtivo && <Modal activate={modalAtivo} setActivate={setModalAtivo}>
                <Create_Projeto_Scrum />
            </Modal>}
            {burndownAtivo && <Modal activate={burndownAtivo} setActivate={setBurndownAtivo} altura='600px' largura='700px'>
                <Burndown projeto_id={0} />
              </Modal>} 
            <Pesquisa>
                <div id="form">
                    <form>
                        <div className="form-group">
                            <label htmlFor="projetos">Projetos Scrum </label>
                            <input type="text" placeholder="Busca por Projeto" onChange={(e) => filtrarPorProjeto(e.target.value)} autoFocus={true} />
                        </div>
                    </form>
                </div>
            </Pesquisa>
            <Container>
                <Card>

                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Data Entrega</StyledTableCell>
                                    <StyledTableCell>Cód. Projeto</StyledTableCell>
                                    <StyledTableCell>Cliente</StyledTableCell>
                                    <StyledTableCell>Situação</StyledTableCell>
                                    <StyledTableCell>Funcionário</StyledTableCell>
                                    <StyledTableCell>Ação</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            {
                                projetos_filtrados.length > 0 ?
                                    projetos_filtrados.map((projeto) => (
                                        <TableBody>
                                            <TableRow>
                                                <StyledTableCell>{new Date(projeto.data_entrega).toLocaleDateString()}</StyledTableCell>
                                                <StyledTableCell>{projeto.ps_codigo}</StyledTableCell>
                                                <StyledTableCell>{projeto.cli_nome}</StyledTableCell>
                                                {(fun_categoria.substring(0, 8) === 'PROGRAMA') &&
                                                    <LinhaDestaque
                                                        cor={projeto.estado === 'A FAZER' ? '#900' : '#FFF'}
                                                        corTexto={projeto.estado === 'A FAZER' ? '#FFF' : '#000'}
                                                    >{projeto.estado}</LinhaDestaque>
                                                }
                                                {(fun_categoria.substring(0, 7) === 'SUPORTE') &&
                                                    <LinhaDestaque
                                                        cor={projeto.estado === 'REVISAO' ? '#900' : '#FFF'}
                                                        corTexto={projeto.estado === 'REVISAO' ? '#FFF' : '#000'}
                                                    >{projeto.estado}</LinhaDestaque>
                                                }
                                                <StyledTableCell>{projeto.funcionario}</StyledTableCell>
                                                <StyledTableCell><Button nome="Ver Detalhes" borderRadius="10px" color="#000" corTexto="#FFF" Icon={MdAssignment} click={() => SelecionaProjeto(projeto)} /></StyledTableCell>
                                                {/* <StyledTableCell><Button nome="Retrospectiva" borderRadius="10px" color="#000" corTexto="#FFF" Icon={MdAutorenew} click={() => SelecionaProjetoRetrospectiva(projeto)} /></StyledTableCell> */}
                                            </TableRow>
                                        </TableBody>
                                    ))
                                                                       
                                    : <h1>Carregando Ordens...</h1>
                            }
                        </Table>
                    </TableContainer>
                </Card>
                <Floating>
              {
               <>
                <Button Icon={MdShowChart} bottom={"40px"} tamanho_icone={40} borderRadius={"50%"} corTexto={"white"} click={() => setBurndownAtivo(!burndownAtivo)} /> 
                <Button Icon={MdAdd} tamanho_icone={40} borderRadius={"50%"} corTexto={"white"} click={() => setModalAtivo(true)} />
               </> 
              }
            </Floating>
            </Container>
        </>
    );
}

export default Scrum;