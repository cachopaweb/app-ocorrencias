import React, { useEffect, useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import '@fullcalendar/common/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';

import { Calendar as CalendarIcon, Layers, UserCheck, Clock, CheckCircle2 } from 'lucide-react';

import Modal from '../Modal';
import api from '../../services/api';
import OrdemDetalhe from '../../pages/OrdemDetalhe';
import Card from '../Card';
import { useUsuario } from '../../context/UsuarioContext';

const ptBrLocale = {
    code: 'pt-br',
    week: {
        dow: 0,
        doy: 4
    },
    buttonText: {
        prev: '‹ Anterior',
        next: 'Próximo ›',
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        list: 'Compromissos',
    },
    weekText: 'Sm',
    allDayText: 'Dia inteiro',
    moreLinkText: (n) => `+ mais ${n}`,
    noEventsText: 'Não há eventos para mostrar',
};

function Calendario() {
    const [listaOcorrencias, setListaOcorrencias] = useState([]);
    const [listaOrdens, setListaOrdens] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [modalOrdens, setModalOrdens] = useState(false);
    const [modalOcorrencias, setModalOcorrencias] = useState(false);
    const [ordemSelecionada, setOrdemSelecionada] = useState({});
    const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState({});
    const [filtroEventos, setFiltroEventos] = useState('minhas_os');
    const { fun_categoria, login } = useUsuario();

    const findOrdemById = (id) => {
        const ordemResult = listaOrdens.find((ordem) => String(ordem.ord_codigo) === String(id)) || {};
        setOrdemSelecionada(ordemResult);
    };

    const findOcorrenciaById = (id) => {
        const ocorrenciaResult = listaOcorrencias.find((ocorrencia) => String(ocorrencia.codigo) === String(id)) || {};
        setOcorrenciaSelecionada(ocorrenciaResult);
    };

    function converteData(data) {
        if (!data) return '';
        let arrayData = data.split('/');
        if (arrayData.length < 3) return data;
        let date = `${parseInt('20' + arrayData[2])}-${String(arrayData[0]).padStart(2, '0')}-${String(arrayData[1]).padStart(2, '0')}`;
        return date;
    }

    const corLinhaDestaqueSuporte = (estado) => {
        const estadoCores = { 'PROGRAMADA': '#900', 'TESTADA': '#008080', 'DEFAULT': '#FFF' };
        return estadoCores[estado] ?? estadoCores['DEFAULT'];
    };

    const corLinhaDestaqueProgramacao = (estado) => {
        const estadoCores = { 'ANALISADA': '#900', 'PROGRAMADA': '#008080', 'DEFAULT': '#FFF' };
        return estadoCores[estado] ?? estadoCores['DEFAULT'];
    };

    async function fetchOcorrencias() {
        setCarregando(true);
        try {
            const response = await api.get('/Ocorrencias');
            if (response.data && Array.isArray(response.data)) {
                setListaOcorrencias(response.data);
            }
        } catch (error) {
            console.error('Erro ao buscar ocorrências:', error);
        } finally {
            setCarregando(false);
        }
    }

    async function fetchOrdens() {
        setCarregando(true);
        try {
            const response = await api.get('/Ordens');
            if (response.data && Array.isArray(response.data)) {
                setListaOrdens(response.data);
            }
        } catch (error) {
            console.error('Erro ao buscar ordens:', error);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        fetchOcorrencias();
        fetchOrdens();
    }, []);

    const todosEventos = useMemo(() => {
        const eventosOrdens = listaOrdens.map((ord) => {
            const ehProgramacao = fun_categoria?.substring(0, 8) === 'PROGRAMA';
            const cor = ehProgramacao ? corLinhaDestaqueProgramacao(ord.estado) : corLinhaDestaqueSuporte(ord.estado);
            const textoCor = ehProgramacao
                ? (ord.estado === 'ANALISADA' || ord.estado === 'PROGRAMADA' ? '#FFF' : '#000')
                : (ord.estado === 'PROGRAMADA' || ord.estado === 'TESTADA' ? '#FFF' : '#000');

            return {
                id: String(ord.ord_codigo),
                title: `OS ${ord.ord_codigo} - ${ord.cli_nome || ''}`,
                date: converteData(ord.novo_prazoe),
                programador: ord.programador,
                fun_teste: ord.fun_teste,
                backgroundColor: cor,
                borderColor: cor,
                textColor: textoCor,
                extendedProps: {
                    tipo: 'OS',
                    codigo: ord.ord_codigo,
                    cliente: ord.cli_nome,
                    estado: ord.estado,
                }
            };
        });

        const eventosOcorrencias = listaOcorrencias.map((oco) => ({
            id: String(oco.codigo),
            title: `OCO ${oco.codigo} - ${oco.cli_nome || ''}`,
            date: converteData(oco.data),
            programador: '',
            fun_teste: oco.fun_atendente,
            extendedProps: {
                tipo: 'OCO',
                codigo: oco.codigo,
                cliente: oco.cli_nome,
            }
        }));

        return [...eventosOrdens, ...eventosOcorrencias];
    }, [listaOrdens, listaOcorrencias, fun_categoria]);

    const eventosExibidos = useMemo(() => {
        if (filtroEventos === 'minhas_os') {
            const ehProgramacao = fun_categoria?.substring(0, 8) === 'PROGRAMA';
            return todosEventos.filter((evento) => {
                if (evento.extendedProps?.tipo === 'OS') {
                    if (ehProgramacao) {
                        return evento.programador?.substring(0, 5) === login?.substring(0, 5);
                    } else {
                        return evento.fun_teste?.substring(0, 5) === login?.substring(0, 5);
                    }
                }
                return evento.fun_teste?.substring(0, 5) === login?.substring(0, 5);
            });
        }
        return todosEventos;
    }, [todosEventos, filtroEventos, fun_categoria, login]);

    const totalMinhas = useMemo(() => {
        const ehProgramacao = fun_categoria?.substring(0, 8) === 'PROGRAMA';
        return todosEventos.filter((evento) => {
            if (evento.extendedProps?.tipo === 'OS') {
                if (ehProgramacao) {
                    return evento.programador?.substring(0, 5) === login?.substring(0, 5);
                } else {
                    return evento.fun_teste?.substring(0, 5) === login?.substring(0, 5);
                }
            }
            return evento.fun_teste?.substring(0, 5) === login?.substring(0, 5);
        }).length;
    }, [todosEventos, fun_categoria, login]);

    const totalTodas = todosEventos.length;

    const renderEventContent = (eventInfo) => {
        const tipo = eventInfo.event.extendedProps?.tipo || (String(eventInfo.event.title).startsWith('OS') ? 'OS' : 'OCO');
        const id = eventInfo.event.extendedProps?.codigo || eventInfo.event.id;
        const cliente = eventInfo.event.extendedProps?.cliente || String(eventInfo.event.title).replace(/^(OS|OCO)\s*\d+\s*-\s*/, '');

        if (tipo === 'OS') {
            return (
                <div
                    title={`OS #${id} - ${cliente}`}
                    className="flex items-center gap-1.5 px-2 py-0.5 w-full overflow-hidden text-[11px] leading-tight rounded-md bg-indigo-50/90 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 border border-indigo-200/70 dark:border-indigo-800/60 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer shadow-xs group"
                >
                    <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)] group-hover:scale-110 transition-transform" />
                    <span className="font-mono font-bold tracking-tight text-indigo-600 dark:text-indigo-400 shrink-0">
                        #OS-{id}
                    </span>
                    <span className="truncate opacity-90 font-medium text-slate-700 dark:text-slate-300">
                        {cliente}
                    </span>
                </div>
            );
        }

        return (
            <div
                title={`OCO #${id} - ${cliente}`}
                className="flex items-center gap-1.5 px-2 py-0.5 w-full overflow-hidden text-[11px] leading-tight rounded-md bg-emerald-50/90 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 border border-emerald-200/70 dark:border-emerald-800/60 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer shadow-xs group"
            >
                <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] group-hover:scale-110 transition-transform" />
                <span className="font-mono font-bold tracking-tight text-emerald-600 dark:text-emerald-400 shrink-0">
                    #OCO-{id}
                </span>
                <span className="truncate opacity-90 font-medium text-slate-700 dark:text-slate-300">
                    {cliente}
                </span>
            </div>
        );
    };

    const handleEvents = () => {};

    const handleEventClick = (clickInfo) => {
        const tipo = clickInfo.event.extendedProps?.tipo || (String(clickInfo.event.title).startsWith('OS') ? 'OS' : 'OCO');
        const id = clickInfo.event.id;
        if (tipo === 'OS') {
            findOrdemById(id);
            setModalOrdens(true);
        } else if (tipo === 'OCO') {
            findOcorrenciaById(id);
            setModalOcorrencias(true);
        }
    };

    return (
        <div className="w-full flex flex-col pb-12 space-y-6">
            {/* Header Moderno */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs shrink-0">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Calendário de Ordens e Ocorrências
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Cronograma mensal e semanal de prazos e chamados em aberto
                        </p>
                    </div>
                </div>
            </div>

            {/* Segmented Control & Legenda */}
            <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-card border border-border rounded-xl shadow-xs">
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                    <button
                        type="button"
                        onClick={() => setFiltroEventos('minhas_os')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-all ${
                            filtroEventos === 'minhas_os'
                                ? 'bg-white dark:bg-slate-900 text-foreground shadow-xs font-semibold'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Minhas Tarefas</span>
                        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${
                            filtroEventos === 'minhas_os'
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800/50'
                                : 'bg-slate-200 dark:bg-slate-700 text-muted-foreground'
                        }`}>
                            {totalMinhas}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setFiltroEventos('todas')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-all ${
                            filtroEventos === 'todas'
                                ? 'bg-white dark:bg-slate-900 text-foreground shadow-xs font-semibold'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        <span>Todas as Tarefas</span>
                        <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${
                            filtroEventos === 'todas'
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800/50'
                                : 'bg-slate-200 dark:bg-slate-700 text-muted-foreground'
                        }`}>
                            {totalTodas}
                        </span>
                    </button>
                </div>

                {/* Legenda com status dots luminosos */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Ordens de Serviço (OS)</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Ocorrências (OCO)</span>
                    </div>
                </div>
            </div>

            {/* Modal de Ordens */}
            <Modal activate={modalOrdens} setActivate={setModalOrdens} altura={'auto'} largura={'auto'}>
                {modalOrdens && <OrdemDetalhe ordem={ordemSelecionada} />}
            </Modal>

            {/* Modal de Ocorrências */}
            <Modal activate={modalOcorrencias} setActivate={setModalOcorrencias} altura={'auto'} largura={'auto'}>
                {modalOcorrencias && (
                    <Card
                        key={ocorrenciaSelecionada.codigo}
                        cliente={ocorrenciaSelecionada.cli_nome}
                        contrato={ocorrenciaSelecionada.contrato}
                        projeto_id={ocorrenciaSelecionada.projeto_scrum}
                        ocorrencia={ocorrenciaSelecionada.obs}
                        atendente={ocorrenciaSelecionada.atendente}
                        nomeAtendente={ocorrenciaSelecionada.fun_atendente}
                        cod_ocorrencia={ocorrenciaSelecionada.codigo}
                        data={converteData(ocorrenciaSelecionada.data)}
                    />
                )}
            </Modal>

            {/* Grid do Calendário */}
            <div className="w-full bg-card p-4 sm:p-6 rounded-xl border border-border shadow-xs">
                {carregando ? (
                    <div className="py-24 flex flex-col justify-center items-center gap-3 text-muted-foreground">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-medium animate-pulse">Carregando dados do calendário...</p>
                    </div>
                ) : (
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        eventContent={renderEventContent}
                        eventsSet={handleEvents}
                        events={eventosExibidos}
                        eventClick={handleEventClick}
                        locales={[ptBrLocale]}
                        locale="pt-br"
                        weekends={true}
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        buttonText={{
                            today: 'Hoje',
                            month: 'Mês',
                            week: 'Semana',
                            day: 'Dia',
                            prev: '‹ Anterior',
                            next: 'Próximo ›'
                        }}
                        headerToolbar={{
                            left: 'prev next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default Calendario;