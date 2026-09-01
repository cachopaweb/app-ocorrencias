import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdAssignment } from 'react-icons/md';

import { Container, Paginacao } from './styles';
import Button from '../../componentes/Button';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import pt_br from 'date-fns/locale/pt-BR';
import Modal from '../../componentes/Modal';
import OrdemDetalhe from '../OrdemDetalhe';

import DetalhesCliente from '../../componentes/DetalhesCliente';

registerLocale('pt-BR', pt_br);

function OrdensEntregues() {
    const [ordens, SetOrdens] = useState([]);
    const [ordemSelecionada, setOrdemSelecionada] = useState({});
    const [modalDetalheOrdemAtivo, setModalDetalheOrdemAtivo] = useState(false);
    const [modalClienteAtivo, setModalClienteAtivo] = useState(false);
    const [contratoSelecionado, setContratoSelecionado] = useState(0);
    const [clienteSelecionado, setClienteSelecionado] = useState({});
    const [quantidade, setQuantidade] = useState(5);

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

    const paginacaoClass = (qtd) => `text-black float-left px-4 py-2 no-underline rounded-[5px] cursor-pointer ${quantidade === qtd ? 'bg-[#4CAF50] text-white' : 'hover:bg-[#ddd]'}`;

    return (
        <>
            <Modal activate={modalDetalheOrdemAtivo} setActivate={setModalDetalheOrdemAtivo} altura={'auto'} largura={'auto'}>
                {modalDetalheOrdemAtivo && <OrdemDetalhe ordem={ordemSelecionada} />}
            </Modal>

            <Modal activate={modalClienteAtivo} setActivate={setModalClienteAtivo} altura={'300px'} largura={'300px'}>
                {modalClienteAtivo && <DetalhesCliente cliente={clienteSelecionado} />}
            </Modal>

            <Container className="flex justify-center items-center w-full pb-[30px] overflow-y-auto">
                <div className="p-2 bg-white mt-[50px] rounded-lg shadow-[0_2px_2px_2px_rgba(0,0,0,0.15),0_10px_20px_-10px_rgba(0,0,0,0.1)] text-black max-w-[1200px]">
                    <h1>Ordens de Serviço Entregues</h1>
                    <Paginacao className="inline-block mb-4 overflow-hidden">
                        <a className={paginacaoClass(5)} onClick={() => handleQuantidade(5)}>5</a>
                        <a className={paginacaoClass(10)} onClick={() => handleQuantidade(10)}>10</a>
                        <a className={paginacaoClass(20)} onClick={() => handleQuantidade(20)}>20</a>
                        <a className={paginacaoClass(30)} onClick={() => handleQuantidade(30)}>30</a>
                        <a className={paginacaoClass(40)} onClick={() => handleQuantidade(40)}>40</a>
                        <a className={paginacaoClass(50)} onClick={() => handleQuantidade(50)}>50</a>
                    </Paginacao>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-[#ddd] border-collapse">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Data Entrega</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Ordem</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Cliente</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Data Abertura</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Programador</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Quem Abriu</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Quem Testará</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Quem Entregará</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                ordens.length > 0 ?
                                    ordens.map((ordem, index) => (
                                        <tr key={ordem.ord_codigo} className={index % 2 === 0 ? "bg-gray-100" : "bg-white hover:bg-gray-50"}>
                                            <td className="py-2 px-4 text-sm">{new Date(ordem.novo_prazoe).toLocaleDateString()}</td>
                                            <td className="py-2 px-4 text-sm">{ordem.ord_codigo}</td>
                                            <td className="py-2 px-4 text-sm cursor-pointer" onClick={(e) => setContratoSelecionado(ordem.contrato)}>{ordem.cli_nome}</td>
                                            <td className="py-2 px-4 text-sm">{new Date(ordem.dataAbertura).toLocaleDateString()}</td>
                                            <td className="py-2 px-4 text-sm">{ordem.programador}</td>
                                            <td className="py-2 px-4 text-sm">{ordem.quemAbriu}</td>
                                            <td className="py-2 px-4 text-sm">{ordem.fun_teste}</td>
                                            <td className="py-2 px-4 text-sm">{ordem.fun_entrega}</td>
                                            <td className="py-2 px-4 text-sm"><Button nome="Ver Detalhes" borderRadius="10px" color="#000" corTexto="#FFF" Icon={MdAssignment} click={() => SelecionaOrdem(ordem)} /></td>
                                        </tr>
                                    ))
                                    : <tr><td colSpan="9" className="py-4 text-center font-bold">Carregando Ordens...</td></tr>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default OrdensEntregues;