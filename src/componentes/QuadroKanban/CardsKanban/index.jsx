import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Badge } from '../../Badge';
import { Drawer } from '../../Drawer';
import { Button } from '../../Button';
import {
    Calendar,
    Clock,
    User,
    AlertCircle,
    GripVertical,
    ChevronDown,
    ChevronUp,
    Building2,
    ArrowDownToLine,
    ExternalLink,
    FileText,
    Layers
} from 'lucide-react';

function formatPrazo(prazoRaw) {
    if (!prazoRaw) return null;
    let d;
    if (typeof prazoRaw === 'string' && prazoRaw.includes('/')) {
        const parts = prazoRaw.split('/');
        if (parts.length === 3) {
            d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        }
    } else if (typeof prazoRaw === 'string' && prazoRaw.includes('-')) {
        const clean = prazoRaw.split('T')[0];
        const parts = clean.split('-');
        if (parts.length === 3) {
            d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        }
    } else {
        d = new Date(prazoRaw);
    }

    if (!d || isNaN(d.getTime())) {
        return { text: String(prazoRaw), status: 'future' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const formatted = `${day}/${month}/${year}`;

    const diffTime = target.getTime() - today.getTime();
    if (diffTime < 0) {
        return { text: formatted, status: 'late' };
    }
    if (diffTime === 0) {
        return { text: 'Hoje', status: 'today' };
    }
    return { text: formatted, status: 'future' };
}

function CardsKanban({ data, index, listIndex, color }) {
    const [expandido, setExpandido] = useState(false);
    const [drawerAberto, setDrawerAberto] = useState(false);

    const [{ isDragging }, dragRef] = useDrag({
        item: { type: 'CARD_OCORRENCIA', index, listIndex, data },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOverCard }, dropRef] = useDrop({
        accept: 'CARD_OCORRENCIA',
        collect: monitor => ({
            isOverCard: monitor.isOver({ shallow: true }),
        }),
    });

    const dragDropRef = (node) => {
        dragRef(node);
        dropRef(node);
    };

    const chamadoId = data?.ordem > 0 
        ? `#OS ${data.ordem}` 
        : data?.ocorrencia > 0 
            ? `#Ocorrência ${data.ocorrencia}` 
            : `#${data?.id || ''}`;

    const isAltaPrioridade = data?.labels?.includes('red') || data?.prioridade === 1;
    const prazoInfo = formatPrazo(data?.dataEntrega);

    return (
        <>
            {/* Slot tracejado de inserção ao arrastar sobre o card */}
            {isOverCard && !isDragging && (
                <div className="border-2 border-dashed border-indigo-500 dark:border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/70 rounded-lg h-12 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 animate-pulse my-1">
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span className="font-mono text-[11px]">Encaixar aqui</span>
                </div>
            )}

            {/* Card Principal Linear */}
            <div 
                ref={dragDropRef} 
                onClick={() => setDrawerAberto(true)}
                className={
                    isDragging 
                        ? "border-2 border-dashed border-indigo-400 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 opacity-60 rounded-lg shadow-none cursor-grabbing p-3 mb-2"
                        : "relative mb-2 rounded-lg border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 shadow-2xs hover:border-slate-400/80 dark:hover:border-slate-600 transition-colors cursor-pointer p-3 flex flex-col gap-1.5 group select-none"
                }
            >
                {/* Linha 1: Topo do Card - Identificador + Prioridade + Prazo */}
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {chamadoId}
                        </span>

                        {isAltaPrioridade && (
                            <Badge variant="destructive" size="sm" dot={true}>
                                Alta
                            </Badge>
                        )}

                        {prazoInfo && (
                            prazoInfo.status === 'late' ? (
                                <Badge variant="destructive" size="sm" icon={AlertCircle}>
                                    {prazoInfo.text}
                                </Badge>
                            ) : prazoInfo.status === 'today' ? (
                                <Badge variant="warning" size="sm" icon={Clock}>
                                    Hoje
                                </Badge>
                            ) : (
                                <Badge variant="outline" size="sm" icon={Calendar}>
                                    {prazoInfo.text}
                                </Badge>
                            )
                        )}
                    </div>
                </div>

                {/* Linha 2: Cliente */}
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                    {data?.titulo || data?.cliNome || data?.cli_nome || 'Cliente não informado'}
                </div>

                {/* Linha 3: Conteúdo / Descrição com Expansão Inline */}
                {data?.content && (
                    <div className="flex flex-col items-start">
                        <p className={`text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed whitespace-pre-wrap ${expandido ? "!line-clamp-none" : ""}`}>
                            {data.content}
                        </p>
                        {data.content.length > 90 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandido(!expandido);
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mt-0.5 cursor-pointer"
                            >
                                {expandido ? (
                                    <><span>Ver menos</span><ChevronUp className="w-3 h-3" /></>
                                ) : (
                                    <><span>Ver mais</span><ChevronDown className="w-3 h-3" /></>
                                )}
                            </button>
                        )}
                    </div>
                )}

                {/* Linha 4: Rodapé do Card */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <div className="inline-flex items-center gap-1.5 truncate">
                        <User className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                        <span className="truncate max-w-[170px]">{data?.user || 'Não atribuído'}</span>
                    </div>
                    <GripVertical className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
            </div>

            {/* Inspector Lateral Drawer */}
            <Drawer 
                isOpen={drawerAberto} 
                onClose={() => setDrawerAberto(false)} 
                title={chamadoId} 
                width="max-w-xl"
                footer={
                    <div className="flex justify-end items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setDrawerAberto(false)}>
                            Fechar
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-4">
                    {/* Cabeçalho do Drawer com badges */}
                    <div className="flex items-center gap-2 flex-wrap pb-3 border-b border-slate-200 dark:border-slate-800">
                        <Badge variant="secondary" size="md">
                            {chamadoId}
                        </Badge>

                        {isAltaPrioridade && (
                            <Badge variant="destructive" size="md" dot={true}>
                                Alta Prioridade
                            </Badge>
                        )}

                        {prazoInfo && (
                            prazoInfo.status === 'late' ? (
                                <Badge variant="destructive" size="md" icon={AlertCircle}>
                                    Atrasada: {prazoInfo.text}
                                </Badge>
                            ) : prazoInfo.status === 'today' ? (
                                <Badge variant="warning" size="md" icon={Clock}>
                                    Hoje
                                </Badge>
                            ) : (
                                <Badge variant="outline" size="md" icon={Calendar}>
                                    {prazoInfo.text}
                                </Badge>
                            )
                        )}
                    </div>

                    {/* Seção de Metadados: Cliente e Responsável */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/80 dark:border-slate-800">
                            <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">Cliente</span>
                                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                                    {data?.titulo || data?.cliNome || data?.cli_nome || 'Cliente não informado'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/80 dark:border-slate-800">
                            <User className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">Responsável</span>
                                <span className="text-xs font-semibold font-mono text-slate-900 dark:text-slate-100 truncate">
                                    {data?.user || 'Não atribuído'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Seção de Descrição */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>Descrição do Chamado</span>
                        </div>
                        <div className="font-sans text-xs leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 p-4 rounded-md border border-slate-200 dark:border-slate-800 whitespace-pre-wrap max-h-[350px] overflow-y-auto scrollbar-thin">
                            {data?.content || 'Nenhuma descrição disponível.'}
                        </div>
                    </div>
                </div>
            </Drawer>
        </>
    );
}

export default React.memo(CardsKanban);