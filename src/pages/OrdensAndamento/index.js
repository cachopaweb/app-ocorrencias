import React, { useState, useEffect } from 'react';
import { Container } from './styles';
import api from '../../services/api';
import Header from '../../componentes/Header';
import { MdAssignment, MdSave } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useUsuario } from '../../context/UsuarioContext';
import Button from '../../componentes/Button';
import { MdAlarmAdd } from 'react-icons/md';
import swal from '@sweetalert/with-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import pt_br from 'date-fns/locale/pt-BR';

registerLocale('pt-BR', pt_br);

function OrdensAndamento() {
    const [ordens, SetOrdens] = useState([]);
    const { cod_funcionario } = useUsuario();
    const [dataPrazoEntrega, setDataPrazoEntrega] = useState(new Date());

    async function CarregaDadosOcorrencias() {
        let response = await api.get('/Ordens');
        SetOrdens(response.data);
    }

    function changePrazoEntrega(date) {
        setDataPrazoEntrega(date);
    }

    function modalPrazoEntrega(ord_codigo, prazoAnterior) {
        swal(
            {
                text: "Informe o novo prazo de Entrega!",
                buttons: {
                    cancel: "Close",
                },
                content: (
                    <div className="card">
                        <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataPrazoEntrega} onChange={changePrazoEntrega} />
                        <button onClick={() => atualizarPrazoEntrega(ord_codigo, prazoAnterior)}><MdSave /> Salvar</button>
                    </div>
                )
            }
        );
    }

    async function atualizarPrazoEntrega(ord_codigo, prazoAnterior) {
        let data = {
            Funcionario: cod_funcionario,
            Ordem: ord_codigo,
            PrazoAnterior: prazoAnterior,
            PrazoNovo: dataPrazoEntrega.toLocaleDateString()
        }
        let response = await api.put(`/Ordens/${ord_codigo}`, data);
        if (!response.data.error) {
            swal('Prazo entrega atualizado com sucesso!', `Código histórico ${response.data.Historico}`, 'success')
        }
    }

    useEffect(() => {
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
                                {cod_funcionario === 19 && <th>Novo Prazo</th>}
                            </tr>
                        </thead>
                        {
                            ordens.length > 0 ?
                                ordens.map((ordem) => (
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
                                            <td><Link to={{ pathname: '/ordemDetalhe', state: { ordem: ordem } }}><MdAssignment color={'black'} /> Ver Detalhes</Link></td>
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