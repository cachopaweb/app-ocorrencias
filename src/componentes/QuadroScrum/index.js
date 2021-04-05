import React, { useState } from 'react';
import BoardContext from './context';
import { Centralizar, Container, Floating } from './styles';
import Lista from '../Lista';
import produce from 'immer';
import Header from '../Header';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import api from '../../services/api';
import Button from '../../componentes/Button';
import Burndown from '../Burndown';
import Modal from '../Modal';
import { MdShowChart } from 'react-icons/md';
import swal from 'sweetalert';

export default function QuadroScrum() {
  const [lista, setLista] = useState([]);
  const { state } = useLocation();
  const { cliente, projeto_id, contrato, ocorrencia } = state;
  const [burndownAtivo, setBurndownAtivo] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [atualizar, setAtualizar] = useState(false);

  async function fetchQuadroScrum() {
    try {
      setLista([]);
      setCarregando(true)
      let response = await api.get(`/quadroScrum?projeto_id=${projeto_id}`);
      setCarregando(false)
      setLista(response.data);
    } catch (error) {
      setCarregando(false)
      swal(error, 'erro', error)
    }
  }


  useEffect(() => {
    fetchQuadroScrum();
    setAtualizar(false);
  }, [atualizar]);

  function move(fromList, toList, from, to, type) {
    setLista(produce(lista, draft => {
      const dragged = draft[fromList].cards[from];
      draft[fromList].cards.splice(from, 1);
      if (type === 'CARD_SPRINT') {
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
    carregando ?
      (
        <Centralizar>
          <h1>Aguarde, carregando projeto Scrum...</h1>
        </Centralizar>
      ) : (
        <BoardContext.Provider value={{ lista, move, setAtualizar }}>          
          <Header title={`Scrum ${cliente}`} />
          {
            burndownAtivo && (
              <Modal activate={burndownAtivo} setActivate={setBurndownAtivo} altura={'70%'} largura={'80%'}>
                <Burndown projeto_id={projeto_id} />
              </Modal>
            )
          }
          <Container>
            {
              lista.length > 0 &&
              lista.map((lista, index) => <Lista key={lista.title}
                index={index}
                data={lista}
                cliente={cliente}
                projeto_id={projeto_id}
                contrato={contrato}
                ocorrencia={ocorrencia}
              />)
            }
            <Floating>
              {
                <Button Icon={MdShowChart} tamanho_icone={40} borderRadius={"50%"} corTexto={"white"} click={() => setBurndownAtivo(!burndownAtivo)} />
              }
            </Floating>            
          </Container>          
        </BoardContext.Provider>)
  );
}
