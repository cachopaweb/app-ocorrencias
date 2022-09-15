import React, { useState } from 'react';
import UploadFile from '../../componentes/UploadFile'
import Header from '../../componentes/Header'
import { useEffect } from 'react';
import api from '../../services/api';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TablePagination } from '@material-ui/core';

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


function Ncm() {
    const classes = useStyles();
    const [ncms, setNcms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [total, setTotal] = React.useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getNcm = async () => {
        setIsLoading(true);
        const response = await api.get(`/ncm?page=${page + 1}&limit=${rowsPerPage}`);
        const data = response.data;
        setNcms(data);
        setIsLoading(false);
    }

    useEffect(() => {
        getNcm();
    }, [page, rowsPerPage]);

    const getTotalNcms = async () => {
        const response = await api.get('/ncm/total');
        const data = response.data;
        setTotal(data.total);
    }

    useEffect(() => {
        getTotalNcms();
    }, []);


    return (
        <>
            <Header title={'Ocorrências'} />
            <UploadFile />
            <div style={{ margin: '10px' }}>
                <Paper className={classes.table}>
                    {!isLoading ?
                        (<>
                            <TableContainer component={Paper} style={{ padding: '10px' }}>
                                <Table className={classes.table} size="large" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Código</StyledTableCell>
                                            <StyledTableCell>Ncm</StyledTableCell>
                                            <StyledTableCell>Exceção</StyledTableCell>
                                            <StyledTableCell>Tabela</StyledTableCell>
                                            <StyledTableCell>Descrição</StyledTableCell>
                                            <StyledTableCell>Aliq. Fed. Nac.</StyledTableCell>
                                            <StyledTableCell>Aliq. Fed. Imp.</StyledTableCell>
                                            <StyledTableCell>Aliq. Est.</StyledTableCell>
                                            <StyledTableCell>Aliq. Mun.</StyledTableCell>
                                            <StyledTableCell>Chave</StyledTableCell>
                                            <StyledTableCell>Fim Vigência</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    {
                                        ncms.length > 0 ?
                                            ncms.map((ncm) => (
                                                <TableBody>
                                                    <TableRow>
                                                        <StyledTableCell>{ncm.codigo}</StyledTableCell>
                                                        <StyledTableCell>{ncm.ncm}</StyledTableCell>
                                                        <StyledTableCell>{ncm.excecao}</StyledTableCell>
                                                        <StyledTableCell>{ncm.tabela}</StyledTableCell>
                                                        <StyledTableCell>{ncm.descricao}</StyledTableCell>
                                                        <StyledTableCell>{ncm.aliqFedNac}</StyledTableCell>
                                                        <StyledTableCell>{ncm.aliqFedImp}</StyledTableCell>
                                                        <StyledTableCell>{ncm.aliqEst}</StyledTableCell>
                                                        <StyledTableCell>{ncm.aliqMun}</StyledTableCell>
                                                        <StyledTableCell>{ncm.chaveIbpt}</StyledTableCell>
                                                        <StyledTableCell>{new Date(ncm.fimVigencia).toLocaleDateString()}</StyledTableCell>
                                                    </TableRow>
                                                </TableBody>
                                            ))
                                            : <h1>Não há NCMs cadastrados</h1>
                                    }

                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 35, 50, 100]}
                                component="div"
                                count={total}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </>) :
                        <h1>Carregando Tabela de NCMs...</h1>
                    }
                </Paper>
            </div>
        </>
    );
}

export default Ncm;