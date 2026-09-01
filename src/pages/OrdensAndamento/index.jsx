import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdAssignment, MdSave, MdAlarmAdd } from 'react-icons/md';

import { useUsuario } from '../../context/UsuarioContext';
import Button from '../../componentes/Button';
import swal from '@sweetalert/with-react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
            <style>{`
                @keyframes colorNoDia {
                    0% { background-color: #47B071; }
                    50% { background-color: #FFFFFF; }
                    100% { background-color: #47B071; }
                }
                @keyframes colorAtrasada {
                    0% { background-color: #F77777; }
                    50% { background-color: #FFFFFF; }
                    100% { background-color: #F77777; }
                }
                .animate-hoje { animation: colorNoDia 2s infinite; }
                .animate-atrasada { animation: colorAtrasada 2s infinite; }
                .react-datepicker-wrapper { width: 100%; }
            `}</style>
            <Modal activate={modalAtivo} setActivate={setModalAtivo}>
                <div className="flex justify-center items-center w-full pb-[30px] overflow-y-auto">
                    <div className="p-2 bg-white mt-[50px] rounded-lg shadow-[0px_2px_2px_2px_rgba(0,0,0,0.15),_0px_10px_20px_-10px_rgba(0,0,0,0.1)] text-black max-w-[1200px] w-full mx-4">
                        <form id="form" className="py-5 m-0 w-full" onSubmit={atualizarPrazoEntrega}>
                            <div className="flex flex-col mb-2.5">
                                <label className="mb-1" htmlFor="prazo-entrega">Novo prazo de Entrega</label>
                                <div>
                                    <DatePicker className="w-full text-[1.1em] my-1 h-5" dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataPrazoEntrega} onChange={changePrazoEntrega} />
                                    <textarea className="h-[150px] w-full my-1.5" name="motivo" id="motivo" onChange={(e) => setMotivo(e.target.value)}></textarea><br />
                                    <Button color="black" corTexto="white" nome="Salvar" Icon={MdSave} tamanho_icone={20} borderRadius="10px" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>

            <Modal activate={modalDetalhesAtivo} setActivate={setModalDetalhesAtivo} altura={'auto'} largura={'auto'}>
                {modalDetalhesAtivo && <OrdemDetalhe ordem={ordemSelecionada} SetDadosAlterados={setDadosAlterados} />}
            </Modal>

            <div className="flex justify-center items-center w-full pb-[30px] overflow-y-auto">
                <div className="p-2 bg-white mt-[50px] rounded-lg shadow-[0px_2px_2px_2px_rgba(0,0,0,0.15),_0px_10px_20px_-10px_rgba(0,0,0,0.1)] text-black max-w-[1200px] w-full mx-4">
                    <h1 className="text-2xl font-bold mb-4">Ordens de Serviço em Andamento</h1>
                    <div className="form">
                        <form id="form" className="py-5 m-0 w-full bg-white rounded-lg shadow-[0px_2px_2px_2px_rgba(0,0,0,0.15),_0px_10px_20px_-10px_rgba(0,0,0,0.1)] p-5 mb-4">
                            <div className="flex mb-2.5">
                                <div className="p-1.5 text-base flex items-center mr-4">
                                    <label className="mb-1 mr-2" htmlFor="minhas_os">Minhas Ordens</label>
                                    <input className="text-[1.1em] my-1" type="radio" name="filtro" id="minhas_os" value={filtroOrdens} onChange={() => setFiltroOrdens('minhas_os')} checked={filtroOrdens === 'minhas_os'} />
                                </div>
                                <div className="p-1.5 text-base flex items-center">
                                    <label className="mb-1 mr-2" htmlFor="todas">Todas</label>
                                    <input className="text-[1.1em] my-1" type="radio" name="filtro" id="todas" value={filtroOrdens} onChange={() => setFiltroOrdens('todas')} checked={filtroOrdens === 'todas'} />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-300 border-collapse">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Data Entrega</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Ordem</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Cliente</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Data Abertura</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Situação</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Prioridade</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Programador</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Quem Abriu</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Quem Testará</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Quem Entregará</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Ação</th>
                                    {(fun_categoria.substring(0, 8) === 'ADM') && <th className="py-2 px-4 text-left font-semibold text-sm">Novo Prazo</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ordensFiltrada.length > 0 ?
                                        ordensFiltrada.map((ordem, index) => {
                                            const isAtraso = ordemEmAtraso(ordem.novo_prazoe);
                                            const trClass = isAtraso 
                                                ? (verificaDataHoje(ordem.novo_prazoe) ? 'animate-hoje' : 'animate-atrasada') 
                                                : (index % 2 === 0 ? "bg-gray-100" : "bg-white hover:bg-gray-50");
                                            
                                            return (
                                                <tr key={ordem.ord_codigo} className={trClass}>
                                                    <td className="py-2 px-4 text-sm">{new Date(ordem.novo_prazoe).toLocaleDateString()}</td>
                                                    <td className="py-2 px-4 text-sm">{ordem.ord_codigo}</td>
                                                    <td className="py-2 px-4 text-sm">{ordem.cli_nome}</td>
                                                    <td className="py-2 px-4 text-sm">{new Date(ordem.dataAbertura).toLocaleDateString()}</td>
                                                    {((fun_categoria.substring(0, 8) === 'PROGRAMA')) &&
                                                        <td 
                                                            className="rounded-lg text-center flex justify-center items-center h-[50px] self-center py-2 px-4 text-sm"
                                                            style={{ 
                                                                backgroundColor: corLinhaDestaqueProgramacao(ordem.estado), 
                                                                color: ordem.estado === 'ANALISADA' || ordem.estado === 'PROGRAMADA' ? '#FFF' : '#000' 
                                                            }}
                                                        >
                                                            {ordem.estado}
                                                        </td>
                                                    }
                                                    {((fun_categoria.substring(0, 7) === 'SUPORTE') || (fun_categoria.substring(0, 8) === 'ADM')) &&
                                                        <td 
                                                            className="rounded-lg text-center flex justify-center items-center h-[50px] self-center py-2 px-4 text-sm"
                                                            style={{ 
                                                                backgroundColor: corLinhaDestaqueSuporte(ordem.estado), 
                                                                color: ordem.estado === 'PROGRAMADA' || ordem.estado === 'TESTADA' ? '#FFF' : '#000' 
                                                            }}
                                                        >
                                                            {ordem.estado}
                                                        </td>
                                                    }
                                                    <td className="py-2 px-4 text-sm">{ordem.prioridade}</td>
                                                    <td className="py-2 px-4 text-sm">{ordem.programador}</td>
                                                    <td className="py-2 px-4 text-sm">{ordem.quemAbriu}</td>
                                                    <td className="py-2 px-4 text-sm">{ordem.fun_teste}</td>
                                                    <td className="py-2 px-4 text-sm">{ordem.fun_entrega}</td>
                                                    <td className="py-2 px-4 text-sm"><Button nome="Ver Detalhes" borderRadius="10px" color="#000" corTexto="#FFF" Icon={MdAssignment} click={() => SelecionaOrdem(ordem)} /></td>
                                                    {(fun_categoria.substring(0, 8) === 'ADM') && <td className="py-2 px-4 text-sm"><Button click={() => modalPrazoEntrega(ordem.ord_codigo, ordem.prazoEntrega)} Icon={MdAlarmAdd} nome="Novo Prazo" borderRadius={"18px"} color={"black"} corTexto={"white"} /></td>}
                                                </tr>
                                            )
                                        })
                                        : <tr><td colSpan="12" className="py-4 text-center font-bold">Carregando Ordens...</td></tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrdensAndamento;