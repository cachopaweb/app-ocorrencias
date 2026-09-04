import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Save, 
  Filter, 
  Layers, 
  Eye, 
  Flame
} from 'lucide-react';

import api from '../../services/api';
import { useUsuario } from '../../context/UsuarioContext';
import Button from '../../componentes/Button';
import Badge from '../../componentes/Badge';
import { Textarea } from '../../componentes/Input';
import Modal from '../../componentes/Modal';
import swal from '@/lib/feedback';
import DatePicker from '../../componentes/DatePicker';
import OrdemDetalhe from '../OrdemDetalhe';

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
    const [filtroOrdens, setFiltroOrdens] = useState('todas');
    const [motivo, setMotivo] = useState('');

    async function CarregaDadosOrdens() {
        try {
            let response = await api.get('/Ordens');
            SetOrdens(response.data || []);
            setOrdensFiltrada(response.data || []);
            filtrarOrdens(response.data || []);
        } catch (error) {
            console.error("Erro ao carregar ordens:", error);
            SetOrdens([]);
            setOrdensFiltrada([]);
        }
    }

    function changePrazoEntrega(data) {
        setDataPrazoEntrega(new Date(data));
    }

    function modalPrazoEntrega(ord_codigo, prazoAnterior) {
        setOrdCodigo(ord_codigo);
        setDataAntiga(prazoAnterior ? new Date(prazoAnterior).toLocaleDateString('pt-BR') : '');
        setModalAtivo(true);
    }

    async function atualizarPrazoEntrega(e) {
        e.preventDefault();
        if (ordCodigo === 0) {
            swal('Código da Ordem é obrigatório!', 'Clique em uma ordem de serviço', 'warning');
            return;
        }
        let data = {
            Funcionario: cod_funcionario,
            Ordem: ordCodigo,
            PrazoAnterior: dataAntiga,
            PrazoNovo: dataPrazoEntrega.toLocaleDateString('pt-BR'),
            Motivo: motivo
        };
        try {
            let response = await api.put(`/Ordens/${ordCodigo}`, data);
            if (response.status === 201 || response.status === 200) {
                swal('Prazo de entrega atualizado com sucesso!', `Código histórico ${response.data?.Historico || ''}`, 'success');
                setDadosAlterados(true);
                setModalAtivo(false);
                setMotivo('');
            } else {
                swal('Erro ao atualizar prazo de entrega!', `Erro: ${response.data?.error || 'desconhecido'}`, 'error');
            }
        } catch (error) {
            swal('Erro ao atualizar prazo de entrega!', `Erro: ${error.message}`, 'error');
        }
    }

    useEffect(() => {
        CarregaDadosOrdens();
        setModalAtivo(false);
        setModalDetalhesAtivo(false);
        setDadosAlterados(false);
    }, [dadosAlterados]);

    const filtrarOrdens = (_ordens) => {
        if (!_ordens || _ordens.length === 0) {
            setOrdensFiltrada([]);
            return;
        }
        var filtrada = [];
        if (filtroOrdens === 'minhas_os') {
            if (fun_categoria && fun_categoria.substring(0, 8) === 'PROGRAMA') {
                filtrada = _ordens.filter((ordem) => (
                    ordem.programador && login && ordem.programador.substring(0, 5) === login.substring(0, 5)
                ));
            } else {
                filtrada = _ordens.filter((ordem) => (
                    ordem.fun_teste && login && ordem.fun_teste.substring(0, 5) === login.substring(0, 5)
                ));
            }
            setOrdensFiltrada(filtrada);
        } else {
            setOrdensFiltrada(_ordens);
        }
    };

    useEffect(() => {
        filtrarOrdens(ordens);
    }, [ordens, filtroOrdens]);

    const SelecionaOrdem = (ordem) => {
        setModalDetalhesAtivo(true);
        setOrdemSelecionada(ordem);
    };

    const corLinhaDestaqueSuporte = (estado) => {
        const estadoCores = { 'PROGRAMADA': '#900', 'TESTADA': '#008080', 'DEFAULT': '#FFF' };
        return estadoCores[estado] ?? estadoCores['DEFAULT'];
    };

    const corLinhaDestaqueProgramacao = (estado) => {
        const estadoCores = { 'ANALISADA': '#900', 'PROGRAMADA': '#008080', 'DEFAULT': '#FFF' };
        return estadoCores[estado] ?? estadoCores['DEFAULT'];
    };

    const ordemEmAtraso = (data) => {
        if (!data) return false;
        const dataHoje = new Date();
        const dataOS = new Date(data);
        return dataOS <= dataHoje;
    };

    const verificaDataHoje = (data) => {
        if (!data) return false;
        const dataHoje = new Date();
        const dataOS = new Date(data);
        return dataOS.getDate() === dataHoje.getDate()
            && dataOS.getMonth() === dataHoje.getMonth()
            && dataOS.getFullYear() === dataHoje.getFullYear();
    };

    const getPriorityBadge = (prioridade) => {
        if (!prioridade) return null;
        const p = prioridade.toUpperCase().trim();
        if (p === 'ALTA' || p === 'URGENTE' || p === 'CRITICA' || p === 'CRÍTICA') {
            return <Badge variant="destructive" size="sm" dot={true}>{prioridade}</Badge>;
        }
        if (p === 'MEDIA' || p === 'MÉDIA' || p === 'NORMAL') {
            return <Badge variant="warning" size="sm" dot={true}>{prioridade}</Badge>;
        }
        if (p === 'BAIXA') {
            return <Badge variant="secondary" size="sm" dot={true}>{prioridade}</Badge>;
        }
        return <Badge variant="outline" size="sm" dot={true}>{prioridade}</Badge>;
    };

    const getStatusBadge = (estado) => {
        if (!estado) return null;
        const e = estado.toUpperCase().trim();
        if (e === 'TESTADA' || e === 'ENTREGUE' || e === 'FINALIZADA') {
            return <Badge variant="success" size="sm" dot={true}>{estado}</Badge>;
        }
        if (e === 'PROGRAMADA' || e === 'EM ANDAMENTO' || e === 'DESENVOLVIMENTO') {
            return <Badge variant="indigo" size="sm" dot={true}>{estado}</Badge>;
        }
        if (e === 'ANALISADA' || e === 'PENDENTE' || e === 'ABERTA') {
            return <Badge variant="warning" size="sm" dot={true}>{estado}</Badge>;
        }
        return <Badge variant="secondary" size="sm" dot={true}>{estado}</Badge>;
    };

    function abreviaNome(nomeCompleto) {
        if (!nomeCompleto) return '-';
        const partes = String(nomeCompleto).trim().split(/\s+/);
        if (partes.length <= 2) return nomeCompleto;
        return `${partes[0]} ${partes[partes.length - 1]}`;
    }

    function primeiroNome(nomeCompleto) {
        if (!nomeCompleto) return '-';
        const partes = String(nomeCompleto).trim().split(/\s+/);
        return partes[0] || '-';
    }

    return (
        <div className="flex flex-col min-h-full gap-4 w-full max-w-full mx-auto p-4 sm:p-6 pb-12 transition-colors">
            {/* Modal Novo Prazo */}
            <Modal activate={modalAtivo} setActivate={setModalAtivo} className="max-w-md w-full">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Atualizar Prazo de Entrega</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">#OS-{ordCodigo} &bull; Prazo Anterior: {dataAntiga || 'Não definido'}</p>
                        </div>
                    </div>

                    <form onSubmit={atualizarPrazoEntrega} className="flex flex-col gap-4">
                        <div>
                            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5" htmlFor="prazo-entrega">
                                Novo Prazo de Entrega
                            </label>
                            <div className="w-full">
                                <DatePicker
                                    className="flex h-8 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-colors"
                                    dateFormat="dd/MM/yyyy"
                                    locale="pt-BR"
                                    selected={dataPrazoEntrega}
                                    onChange={changePrazoEntrega}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5" htmlFor="motivo">
                                Motivo da Alteração
                            </label>
                            <Textarea
                                id="motivo"
                                name="motivo"
                                placeholder="Descreva o motivo da alteração do prazo..."
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                rows={4}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <Button
                                type="button"
                                variant="outline"
                                nome="Cancelar"
                                onClick={() => setModalAtivo(false)}
                            />
                            <Button
                                type="submit"
                                variant="indigo"
                                Icon={Save}
                                nome="Salvar Prazo"
                            />
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal Detalhes da Ordem */}
            <Modal activate={modalDetalhesAtivo} setActivate={setModalDetalhesAtivo} className="max-w-4xl w-full">
                {modalDetalhesAtivo && <OrdemDetalhe ordem={ordemSelecionada} SetDadosAlterados={setDadosAlterados} />}
            </Modal>

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-lg shadow-2xs border border-slate-200/80 dark:border-slate-800/80">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                        <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        Ordens de Serviço em Andamento
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Monitore prazos, prioridades e equipe responsável
                    </p>
                </div>
            </div>

            {/* Barra de Filtros e Legenda */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Filtro */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <Filter className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Filtrar:</span>
                        </div>
                        <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200/80 dark:border-slate-700/80">
                            <button
                                type="button"
                                id="todas"
                                onClick={() => setFiltroOrdens('todas')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                                    filtroOrdens === 'todas'
                                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                            >
                                Todas
                            </button>
                            <button
                                type="button"
                                id="minhas_os"
                                onClick={() => setFiltroOrdens('minhas_os')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                                    filtroOrdens === 'minhas_os'
                                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                            >
                                Minhas Ordens
                            </button>
                        </div>
                    </div>

                    {/* Separador vertical */}
                    <div className="hidden md:block h-4 w-px bg-slate-200 dark:bg-slate-700" />

                    {/* Legenda Equipe */}
                    <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] uppercase font-mono">Equipe:</span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-1">A:</span> Quem Abriu
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                            <span className="font-bold text-amber-600 dark:text-amber-400 mr-1">T:</span> Quem Testará
                        </span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 mr-1">E:</span> Quem Entregará
                        </span>
                    </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Total: <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{ordensFiltrada.length}</span> {ordensFiltrada.length === 1 ? 'ordem' : 'ordens'}
                </div>
            </div>

            {/* Tabela de Dados */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800/80 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/90 dark:bg-slate-900/90 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="py-2.5 px-3">Data Entrega</th>
                                <th className="py-2.5 px-3">Ordem</th>
                                <th className="py-2.5 px-3">Cliente</th>
                                <th className="py-2.5 px-3">Data Abertura</th>
                                <th className="py-2.5 px-3 text-center">Situação</th>
                                <th className="py-2.5 px-3 text-center">Prioridade</th>
                                <th className="py-2.5 px-3">Programador</th>
                                <th className="py-2.5 px-3">Equipe</th>
                                <th className="py-2.5 px-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                            {ordensFiltrada.length > 0 ? (
                                ordensFiltrada.map((ordem, index) => {
                                    const isAtraso = ordemEmAtraso(ordem.novo_prazoe);
                                    const isHoje = verificaDataHoje(ordem.novo_prazoe);

                                    return (
                                        <tr
                                            key={ordem.ord_codigo || index}
                                            className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-800 dark:text-slate-200 border-b border-slate-200/70 dark:border-slate-800/80 ${
                                                isAtraso && !isHoje
                                                    ? 'bg-rose-50/25 dark:bg-rose-950/15'
                                                    : isAtraso && isHoje
                                                    ? 'bg-amber-50/25 dark:bg-amber-950/15'
                                                    : ''
                                            }`}
                                        >
                                            <td className={`py-2 px-3 text-xs whitespace-nowrap ${
                                                isAtraso && !isHoje
                                                    ? 'border-l-4 border-l-rose-500'
                                                    : isAtraso && isHoje
                                                    ? 'border-l-4 border-l-amber-500'
                                                    : 'border-l-4 border-l-transparent'
                                            }`}>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                                                    <span className="font-mono text-[11px]">{ordem.novo_prazoe ? new Date(ordem.novo_prazoe).toLocaleDateString('pt-BR') : '-'}</span>
                                                    {isAtraso && !isHoje && (
                                                        <Badge variant="destructive" size="sm" dot={true}>
                                                            Atrasada
                                                        </Badge>
                                                    )}
                                                    {isAtraso && isHoje && (
                                                        <Badge variant="warning" size="sm" dot={true}>
                                                            Entrega Hoje
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-2 px-3 text-xs font-mono font-semibold text-slate-400 whitespace-nowrap">
                                                #OS-{ordem.ord_codigo}
                                            </td>
                                            <td className="py-2 px-3 text-xs font-medium text-slate-900 dark:text-slate-100 max-w-[220px] truncate" title={ordem.cli_nome}>
                                                {ordem.cli_nome}
                                            </td>
                                            <td className="py-2 px-3 text-xs font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {ordem.dataAbertura ? new Date(ordem.dataAbertura).toLocaleDateString('pt-BR') : '-'}
                                            </td>
                                            <td className="py-2 px-3 text-xs text-center whitespace-nowrap">
                                                {getStatusBadge(ordem.estado)}
                                            </td>
                                            <td className="py-2 px-3 text-xs text-center whitespace-nowrap">
                                                {getPriorityBadge(ordem.prioridade)}
                                            </td>
                                            <td className="py-2 px-3 text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap font-medium" title={`Programador: ${ordem.programador || 'Não atribuído'}`}>
                                                {primeiroNome(ordem.programador)}
                                            </td>
                                            <td className="py-2 px-3 text-xs whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {ordem.quemAbriu && (
                                                        <span
                                                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 cursor-help"
                                                            title={`Quem Abriu: ${ordem.quemAbriu}`}
                                                        >
                                                            <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-1">A:</span>
                                                            {primeiroNome(ordem.quemAbriu)}
                                                        </span>
                                                    )}
                                                    {ordem.fun_teste && (
                                                        <span
                                                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 cursor-help"
                                                            title={`Quem Testará: ${ordem.fun_teste}`}
                                                        >
                                                            <span className="font-bold text-amber-600 dark:text-amber-400 mr-1">T:</span>
                                                            {primeiroNome(ordem.fun_teste)}
                                                        </span>
                                                    )}
                                                    {ordem.fun_entrega && (
                                                        <span
                                                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 cursor-help"
                                                            title={`Quem Entregará: ${ordem.fun_entrega}`}
                                                        >
                                                            <span className="font-bold text-emerald-600 dark:text-emerald-400 mr-1">E:</span>
                                                            {primeiroNome(ordem.fun_entrega)}
                                                        </span>
                                                    )}
                                                    {!ordem.quemAbriu && !ordem.fun_teste && !ordem.fun_entrega && (
                                                        <span className="text-slate-400 text-xs">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-2 px-3 text-xs text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        Icon={Eye}
                                                        tamanho_icone={13}
                                                        nome="Detalhes"
                                                        onClick={() => SelecionaOrdem(ordem)}
                                                    />
                                                    {fun_categoria && fun_categoria.substring(0, 8) === 'ADM' && (
                                                        <Button
                                                            variant="indigo"
                                                            size="sm"
                                                            Icon={Calendar}
                                                            tamanho_icone={13}
                                                            nome="Novo Prazo"
                                                            onClick={() => modalPrazoEntrega(ordem.ord_codigo, ordem.prazoEntrega || ordem.novo_prazoe)}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="py-12 text-center text-xs text-slate-500 dark:text-slate-400"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Clock className="w-6 h-6 text-slate-400" />
                                            <span className="font-medium">Nenhuma ordem de serviço em andamento encontrada</span>
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

export default OrdensAndamento;