import React, { useEffect, useState } from 'react';
import produce from 'immer';
import { Kanban, Loader2, CheckCircle2, Clock, Layers } from 'lucide-react';
import { Badge } from '../Badge';

import api from '../../services/api';
import ListaCards from './ListaKanban';
import BoardContext from './context';
import { useUsuario } from '../../context/UsuarioContext';

function QuadroKanban() {
    const [listaCards, setListaCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [atualizar, setAtualizar] = useState(false);
    const { login, fun_categoria, cod_funcionario } = useUsuario();

    function montaCards(item, funcionario, estadoProgramacao, estadoSuporte) {
        const { cliNome, ordNovoPrazoe, ordCodigo, prioridade, ordOcorrencia, ordFun3, ordFun4, ordEstado } = item;
        if (String(fun_categoria).substring(0, 5) === 'PROGR' && ordFun3 === funcionario && ordEstado === estadoProgramacao) {
            return {
                content: ordOcorrencia,
                id: ordCodigo,
                labels: [prioridade === 1 ? 'red' : 'green'],
                user: login,
                dataEntrega: ordNovoPrazoe,
                ocorrencia: 0,
                ordem: ordCodigo,
                titulo: cliNome
            };
        }
        if (String(fun_categoria).substring(0, 5) === 'SUPOR' && ordFun4 === funcionario && ordEstado === estadoSuporte) {
            return {
                content: ordOcorrencia,
                id: ordCodigo,
                labels: [prioridade === 1 ? 'red' : 'green'],
                user: login,
                dataEntrega: ordNovoPrazoe,
                ocorrencia: 0,
                ordem: ordCodigo,
                titulo: cliNome
            };
        }
    }

    function formatOrdensToCards(listaAntiga, listaOrdens) {
        let cardsFazer = [];
        let cardsFazendo = [];
        let cardsFeito = [];
        let listaAtual = [...listaAntiga];
        let ordens = listaOrdens.filter(item => (item.ordFun3 == cod_funcionario));
        cardsFazer = ordens.map(item => montaCards(item, cod_funcionario, 'ANALISADA', 'PROGRAMADA'))
            .filter(item => item !== undefined);

        cardsFazendo = ordens.map(item => montaCards(item, cod_funcionario, 'PROGRAMANDO', 'TESTANDO'))
            .filter(item => item !== undefined);

        cardsFeito = ordens.map(item => montaCards(item, cod_funcionario, 'PROGRAMADA', 'TESTADA'))
            .filter(item => item !== undefined);

        const novaLista = listaAtual.map(item => {
            if (item.title === 'A Fazer') {
                item.cards = [...item.cards, ...cardsFazer];
            }
            if (item.title === 'Fazendo') {
                item.cards = [...item.cards, ...cardsFazendo];
            }
            if (item.title === 'Feito') {
                item.cards = [...item.cards, ...cardsFeito];
            }
            return item;
        });

        return novaLista;
    }

    async function carregarDadosKanban() {
        setLoading(true);
        try {
            const [respOcorrencias, respOrdens] = await Promise.all([
                api.get('/quadroKanban/Ocorrencias'),
                api.get('/quadroKanban/Ordens')
            ]);
            let colunas = Array.isArray(respOcorrencias.data) ? respOcorrencias.data : [];
            if (respOrdens.status === 200 && Array.isArray(respOrdens.data)) {
                colunas = formatOrdensToCards(colunas, respOrdens.data);
            }
            setListaCards(colunas);
        } catch (error) {
            console.error('Erro ao carregar dados do Kanban:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDadosKanban();
        setAtualizar(false);
    }, [atualizar]);

    const move = React.useCallback((fromList, toList, from, to, type) => {
        setListaCards(produce(draft => {
            const dragged = draft[fromList].cards[from];
            draft[fromList].cards.splice(from, 1);
            if (type === 'CARD_OCORRENCIA') {
                if (draft[toList].cards.length > 0) {
                    draft[toList].cards.splice(to, 0, dragged);
                } else {
                    draft[toList].cards.push(dragged);
                }
            }
        }));
    }, []);

    const totalItens = Array.isArray(listaCards)
        ? listaCards.reduce((acc, col) => acc + (col?.cards?.length || 0), 0)
        : 0;

    const fazendoItens = Array.isArray(listaCards)
        ? (listaCards.find(c => c?.title?.toLowerCase().includes('fazendo'))?.cards?.length 
           ?? listaCards[1]?.cards?.length 
           ?? 0)
        : 0;

    const feitoItens = Array.isArray(listaCards)
        ? (listaCards.find(c => c?.title?.toLowerCase().includes('feito'))?.cards?.length 
           ?? listaCards[2]?.cards?.length 
           ?? 0)
        : 0;

    return (
        <BoardContext.Provider value={{ listaCards, move, setAtualizar }}>
            <div className="flex flex-col gap-5">
                {/* Header & Mini KPIs */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
                            <Kanban className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                Quadro Kanban
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Fluxo visual de ocorrências e ordens de serviço em tempo real
                            </p>
                        </div>
                    </div>

                    {/* Mini KPIs em estilo técnico Linear */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Total */}
                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
                            <Layers className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500">Total:</span>
                                <span className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">{totalItens}</span>
                            </div>
                        </div>

                        {/* Fazendo / Em Andamento */}
                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)] shrink-0" />
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500">Em Andamento:</span>
                                <span className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">{fazendoItens}</span>
                            </div>
                        </div>

                        {/* Feito / Concluídos */}
                        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] shrink-0" />
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500">Concluídos:</span>
                                <span className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">{feitoItens}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Container Horizontal Kanban */}
                <div className="flex gap-4 pb-6 overflow-x-auto min-h-[calc(100vh-220px)] items-start scrollbar-thin">
                    {loading ? (
                        <div className="py-24 w-full flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
                            <span className="text-xs font-mono">Carregando quadro kanban...</span>
                        </div>
                    ) : (
                        listaCards?.length > 0 &&
                        listaCards.map((lista, index) => (
                            <ListaCards 
                                key={index}
                                data={lista}
                                listIndex={index} 
                            />
                        ))
                    )}
                </div>
            </div>
        </BoardContext.Provider>
    );
}

export default QuadroKanban;