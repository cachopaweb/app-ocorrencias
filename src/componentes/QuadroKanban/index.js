import React, { useEffect, useState } from 'react';
import produce from 'immer';

import api from '../../services/api';
import Header from '../Header';
import ListaCards from './ListaKanban'
import { Container, Centralizar } from './styles';
import BoardContext from './context';
import { useUsuario } from '../../context/UsuarioContext';

function QuadroKanban() {
    const [listaCards, setListaCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [atualizar, setAtualizar] = useState(false);
    const { login, fun_categoria, cod_funcionario } = useUsuario();

    async function fetchKanbanOcorrencias() {
        try {
            const response = await api.get('/quadroKanban/Ocorrencias');
            if (response.status === 200) {
                setListaCards(response.data);
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

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
            }
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
            }
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
                item.cards = [...item.cards, ...cardsFazer]
            }
            if (item.title === 'Fazendo') {
                item.cards = [...item.cards, ...cardsFazendo]
            }
            if (item.title === 'Feito') {
                item.cards = [...item.cards, ...cardsFeito]
            }
            return item;
        });
        console.log('novalista', novaLista)
        return novaLista;
    }

    async function fetchKanbanOrdens() {
        try {
            const response = await api.get('/quadroKanban/Ordens');
            if (response.status === 200) {
                setLoading(true)
                setListaCards(lista => [...lista, formatOrdensToCards(lista, response.data)]);
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchKanbanOcorrencias();
        fetchKanbanOrdens();
        setAtualizar(false);
    }, [atualizar]);

    function move(fromList, toList, from, to, type) {
        setListaCards(produce(listaCards, draft => {
            const dragged = draft[fromList].cards[from];
            draft[fromList].cards.splice(from, 1);
            if (type === 'CARD_OCORRENCIA') {
                if (draft[toList].cards.length > 0) {
                    draft[toList].cards.splice(to, 0, dragged)
                } else {
                    draft[toList].cards.push(dragged)
                }
            }
        }
        ))
    }

    return (
        <BoardContext.Provider value={{ listaCards, move, setAtualizar }}>
            <Header title='Quadro Kanban' />
            <Container>
                {loading ? <Centralizar>Carregando dados...</Centralizar> :
                    listaCards?.length > 0 &&
                    listaCards.map((lista, index) =>
                        <ListaCards key={index}
                            data={lista}
                            listIndex={index} />)
                }
            </Container>
        </BoardContext.Provider>
    );
}

export default QuadroKanban;