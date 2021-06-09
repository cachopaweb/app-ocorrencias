import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";

import Header from '../Header';
import Modal from '../Modal';
import { Container, Centralizar } from './styles';
import api from '../../services/api';
import OrdemDetalhe from '../../pages/OrdemDetalhe';
import Card from '../Card';

function Calendario() {
    const [listaOcorrencias, setListaOcorrencias] = useState([]);
    const [listaOrdens, setListaOrdens] = useState([])
    const [carregando, setCarregando] = useState(false);
    const [eventosIniciais, setEventosIniciais] = useState([]);
    const [modalOrdens, setModalOrdens] = useState(false);
    const [modalOcorrencias, setModalOcorrencias] = useState(false);
    const [ordemSelecionada, setOrdemSelecionada] = useState({});
    const [ocorrenciaSelecionada, setOcorrenciaSelecionada] = useState({});

    const findOrdemById = (id) => {
        let ordemResult = {};
        for (const ordem of listaOrdens) {
            if (ordem.ord_codigo == id) {
                ordemResult = ordem;
                break;
            }
        }
        setOrdemSelecionada(ordemResult);
    }

    const findOcorrenciaById = (id) => {
        let ocorrenciaResult = {};
        for (const ocorrencia of listaOcorrencias) {
            if (ocorrencia.codigo == id) {
                ocorrenciaResult = ocorrencia;
                break;
            }
        }
        setOcorrenciaSelecionada(ocorrenciaResult);
    }

    async function fetchOcorrencias() {
        setCarregando(true);
        const response = await api.get('/Ocorrencias');
        if (response.data.length > 0) {
            setListaOcorrencias(response.data);
            const eventos = response.data.map((oco) => {
                return {
                    id: oco.codigo,
                    title: `OCO ${oco.codigo} - ${oco.cli_nome}`,
                    date: converteData(oco.data)
                }
            });
            carregaEventosIniciais(eventos);
            setCarregando(false);
        } else {
            setCarregando(false);
        }
    }

    async function fetchOrdens() {
        setCarregando(true);
        const response = await api.get('/Ordens');
        if (response.data.length > 0) {
            setListaOrdens(response.data);
            const eventos = response.data.map((ord) => {
                return {
                    id: ord.ord_codigo,
                    title: `OS ${ord.ord_codigo} - ${ord.cli_nome}`,
                    date: converteData(ord.novo_prazoe)
                }
            });
            carregaEventosIniciais(eventos);
            setCarregando(false);
        } else {
            setCarregando(false);
        }
    }

    useEffect(() => {
        fetchOcorrencias()
    }, [])

    useEffect(() => {
        fetchOrdens()
    }, [])

    function createEventId() {
        return Math.floor(Math.random() * 100);
    }

    const handleDateSelect = (selectInfo) => {
        let title = prompt('Informe um titulo para o Evento!')

        if (title) {
            const data = {
                id: createEventId(),
                titulo: title,
                dataInicio: selectInfo.startStr,
                dataFim: selectInfo.endStr
            };
            criaEvento(selectInfo, data);
        }
    }

    const criaEvento = (selectInfo, data) => {
        let { id, titulo, dataInicio, dataFim } = data;
        let calendarApi = selectInfo.view.calendar
        calendarApi.addEvent({
            id: id,
            title: titulo,
            start: dataInicio,
            end: dataFim,
            allDay: selectInfo.allDay
        })
    }

    function converteData(data) {
        let arrayData = data.split('/');
        let date = `${parseInt('20' + arrayData[2])}-${String(arrayData[0]).padStart(2, '0')}-${arrayData[1]}`;
        return date;
    }

    const carregaEventosIniciais = (eventos) => {
        setEventosIniciais(state => [...state, ...eventos]);
    }

    const renderEventContent = (eventInfo) => {
        return (
            <>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </>
        )
    }

    const handleEvents = (events) => {
        console.log(events)
    }

    const handleEventClick = (clickInfo) => {
        let tipoEvento = String(clickInfo.event.title).substr(0, 3).trim();
        if (tipoEvento === 'OS') {
            findOrdemById(clickInfo.event.id);
            setModalOrdens(true)
        }
        if (tipoEvento === 'OCO') {
            findOcorrenciaById(clickInfo.event.id);
            setModalOcorrencias(true)
        }
    }

    return (
        <>
            <Header title='Calendário' />
            <Modal activate={modalOrdens} setActivate={setModalOrdens} altura={'auto'} largura={'auto'}>
                {modalOrdens && <OrdemDetalhe ordem={ordemSelecionada} />}
            </Modal>
            <Modal activate={modalOcorrencias} setActivate={setModalOcorrencias} altura={'auto'} largura={'auto'}>
                {modalOcorrencias && <Card key={ocorrenciaSelecionada.codigo}
                    cliente={ocorrenciaSelecionada.cli_nome}
                    contrato={ocorrenciaSelecionada.contrato}
                    projeto_id={ocorrenciaSelecionada.projeto_scrum}
                    ocorrencia={ocorrenciaSelecionada.obs}
                    atendente={ocorrenciaSelecionada.atendente}
                    nomeAtendente={ocorrenciaSelecionada.fun_atendente}
                    cod_ocorrencia={ocorrenciaSelecionada.codigo}
                    data={converteData(ocorrenciaSelecionada.data)}
                />}
            </Modal>
            <Container>
                {carregando ?
                    <Centralizar>Carregando dados...</Centralizar>
                    :
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        // select={handleDateSelect}
                        eventContent={renderEventContent}
                        eventsSet={handleEvents}
                        events={eventosIniciais}
                        eventClick={handleEventClick}
                        locale='pt-br'
                        weekends={true}
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                    />}
            </Container>
        </>
    );
}

export default Calendario;