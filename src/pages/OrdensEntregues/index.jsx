import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Eye, 
  User, 
  ListFilter,
  CheckCheck
} from 'lucide-react';

import api from '../../services/api';
import Button from '../../componentes/Button';
import Badge from '../../componentes/Badge';
import Modal from '../../componentes/Modal';
import OrdemDetalhe from '../OrdemDetalhe';
import DetalhesCliente from '../../componentes/DetalhesCliente';

function OrdensEntregues() {
    const [ordens, SetOrdens] = useState([]);
    const [ordemSelecionada, setOrdemSelecionada] = useState({});
    const [modalDetalheOrdemAtivo, setModalDetalheOrdemAtivo] = useState(false);
    const [modalClienteAtivo, setModalClienteAtivo] = useState(false);
    const [contratoSelecionado, setContratoSelecionado] = useState(0);
    const [clienteSelecionado, setClienteSelecionado] = useState({});
    const [quantidade, setQuantidade] = useState(5);

    async function CarregaDadosOrdens() {
        try {
            let response = await api.get(`/Ordens/entregues/${quantidade}`);
            SetOrdens(response.data || []);
        } catch (error) {
            console.error("Erro ao carregar ordens entregues:", error);
            SetOrdens([]);
        }
    }

    useEffect(() => {
        SetOrdens([]);
        CarregaDadosOrdens();
        setModalDetalheOrdemAtivo(false);
        setModalClienteAtivo(false);
    }, [quantidade]);

    useEffect(() => {
        if (contratoSelecionado > 0) {
            mostraDadosCliente();
        }
    }, [contratoSelecionado]);

    const SelecionaOrdem = (ordem) => {
        setModalDetalheOrdemAtivo(true);
        setOrdemSelecionada(ordem);
    };

    const mostraDadosCliente = async () => {
        try {
            let response = await api.get(`/Clientes?contrato=${contratoSelecionado}`);
            if (response.data && response.data.length > 0) {
                setClienteSelecionado(response.data[0]);
                setModalClienteAtivo(true);
            }
        } catch (e) {
            console.error("Erro ao buscar dados do cliente:", e);
        }
    };

    const handleQuantidade = (qtd) => {
        setQuantidade(qtd);
    };

    return (
        <div className="flex flex-col h-full gap-6 w-full max-w-7xl mx-auto p-4 sm:p-6 transition-colors">
            {/* Modal Detalhe da Ordem */}
            <Modal activate={modalDetalheOrdemAtivo} setActivate={setModalDetalheOrdemAtivo} className="max-w-4xl w-full">
                {modalDetalheOrdemAtivo && <OrdemDetalhe ordem={ordemSelecionada} />}
            </Modal>

            {/* Modal Detalhes do Cliente */}
            <Modal activate={modalClienteAtivo} setActivate={setModalClienteAtivo} className="max-w-md w-full">
                {modalClienteAtivo && <DetalhesCliente cliente={clienteSelecionado} />}
            </Modal>

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
                        <CheckCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        Ordens Entregues
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Histórico de ordens de serviço finalizadas e entregues
                    </p>
                </div>
            </div>

            {/* Seletor de Paginação / Quantidade */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <ListFilter className="w-4 h-4" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Exibir quantidade:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {[5, 10, 20, 30, 40, 50].map((qtd) => (
                            <Button
                                key={qtd}
                                size="sm"
                                variant={quantidade === qtd ? "indigo" : "outline"}
                                onClick={() => handleQuantidade(qtd)}
                                className="min-w-[40px] text-xs font-semibold"
                            >
                                {qtd}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                    Carregando até <span className="font-semibold text-slate-800 dark:text-slate-200">{quantidade}</span> registros
                </div>
            </div>

            {/* Tabela de Dados */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="py-3.5 px-4">Data Entrega</th>
                                <th className="py-3.5 px-4">Ordem</th>
                                <th className="py-3.5 px-4">Cliente</th>
                                <th className="py-3.5 px-4 text-center">Status</th>
                                <th className="py-3.5 px-4">Data Abertura</th>
                                <th className="py-3.5 px-4">Programador</th>
                                <th className="py-3.5 px-4">Quem Abriu</th>
                                <th className="py-3.5 px-4">Quem Testará</th>
                                <th className="py-3.5 px-4">Quem Entregará</th>
                                <th className="py-3.5 px-4 text-center">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {ordens.length > 0 ? (
                                ordens.map((ordem, index) => (
                                    <tr
                                        key={ordem.ord_codigo || index}
                                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors text-slate-800 dark:text-slate-200"
                                    >
                                        <td className="py-3 px-4 text-sm font-medium whitespace-nowrap">
                                            {ordem.novo_prazoe ? new Date(ordem.novo_prazoe).toLocaleDateString('pt-BR') : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                            #{ordem.ord_codigo}
                                        </td>
                                        <td className="py-3 px-4 text-sm font-medium whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => setContratoSelecionado(ordem.contrato)}
                                                className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors hover:underline text-left cursor-pointer"
                                                title="Clique para ver dados do cliente"
                                            >
                                                <User className="w-3.5 h-3.5 shrink-0" />
                                                <span>{ordem.cli_nome}</span>
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center whitespace-nowrap">
                                            <Badge variant="success" size="sm" icon={CheckCircle2}>
                                                Entregue
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {ordem.dataAbertura ? new Date(ordem.dataAbertura).toLocaleDateString('pt-BR') : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {ordem.programador || '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {ordem.quemAbriu || '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {ordem.fun_teste || '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {ordem.fun_entrega || '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center whitespace-nowrap">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                Icon={Eye}
                                                nome="Detalhes"
                                                onClick={() => SelecionaOrdem(ordem)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <CheckCircle2 className="w-8 h-8 text-slate-400" />
                                            <span className="text-sm font-medium">Nenhuma ordem de serviço entregue encontrada</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrdensEntregues;