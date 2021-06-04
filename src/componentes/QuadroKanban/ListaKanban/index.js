import React, { useContext, useRef, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useHistory } from 'react-router';
import CardsKanban from '../CardsKanban';
import { useDrop } from 'react-dnd';
import swal from 'sweetalert'

import { Container } from './styles'
import BoardContext from '../context'
import api from '../../../services/api'
import { useUsuario } from '../../../context/UsuarioContext';


function ListaKanban({ data, listIndex }) {
  const history = useHistory();
  const [cards, setCards] = useState([]);
  const ref = useRef();
  const { setAtualizar, move } = useContext(BoardContext);
  const [funAtendente, setFunAtendente] = useState(0);
  const { cod_funcionario, login } = useUsuario();

  const criarOcorrencia = () => {
    history.push('/create')
  }

  async function fetchData(idOcorrencia) {
    const response = await api.get(`/Ocorrencias/${idOcorrencia}`);
    if (response.status === 200) {
      return response.data;
    } else {
      return {}
    }
  }

  async function Atender(idOcorrencia) {
    const request = {
      fun_codigo: cod_funcionario
    }
    const response = await api.put('/Ocorrencias/' + idOcorrencia, JSON.stringify(request));
    if (response.data.fun_codigo > 0) {
      setFunAtendente(response.data.fun_codigo)
    }
  }

  async function fecharOcorrencia(tempo, cod_ocorrencia) {
    const request = {
      fun_codigo: cod_funcionario,
      finalizada: 'S',
      tempoAtendimento: tempo
    }
    try {
      let response = await api.put('/Ocorrencias/' + cod_ocorrencia, JSON.stringify(request));
      if (response.data.fun_codigo > 0) {
        setAtualizar(true);
      } else {
        swal('Erro ao fechar Ocorrencia', '', 'error')
      }
    } catch (error) {
      swal('Erro ao fechar Ocorrencia', error, 'error');
    }
  }

  function finalizar(cod_ocorrencia) {
    swal("Informe o tempo de atendimento (em minutos):", {
      content: "input",
    })
      .then((value) => {
        if (value === '') {
          swal('Informe o tempo de atendimento corretamente', 'Informe o tempo de atendimento (em minutos):', 'warning')
          return;
        }
        let tempo = 0;
        try {
          tempo = parseInt(value);
        } catch (erro) {
          swal('É permitido somente números!', 'informe o tempo em números', 'warning')
          return;
        }
        if (tempo === 0) { swal("Tempo não informado!", 'Informe o tempo', "warning"); return; }
        if (tempo === 1) { swal('O Tempo deve ser maior que 1 min', 'Informe o tempo corretamente', 'warning'); return; }

        fecharOcorrencia(tempo, cod_ocorrencia);
      });
  }

  const [, dropCardOcorrencia] = useDrop({
    accept: 'CARD_OCORRENCIA',
    drop(item, monitor) {
      if (listIndex === 0) return;
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;
      const draggedIndex = item.index;
      const targetIndex = item.index;
      if (draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
        return;
      }

      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;

      const draggedOffset = monitor.getClientOffset();
      const draggedTop = draggedOffset.y - targetSize.top;

      if (draggedIndex < targetIndex && draggedTop < targetCenter) {
        return;
      }

      if (draggedIndex > targetIndex && draggedTop > targetCenter) {
        return;
      }

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex, 'CARD_OCORRENCIA');
      if (cards.length)
        setCards([...cards, item.data])
      else setCards([item.data])
      item.index = targetIndex;
      item.listIndex = targetListIndex;
      if (listIndex === 1) {
        swal({
          title: "Deseja Atender esta ocorrência?",
          text: "Click nas opções a seguir",
          icon: "warning",
          buttons: ['Cancelar', 'Atender'],
          dangerMode: true,
        })
          .then(async (isAtender) => {
            if (isAtender) {
              Atender(item.data.ocorrencia);
              setAtualizar(true)
            }
          });
      }
      if (listIndex === 2) {
        swal({
          title: "Deseja Fechar ou Abrir Scrum?",
          text: "Click nas opções a seguir",
          icon: "warning",
          buttons: ['Abrir Scrum', 'Finalizar'],
          dangerMode: true,
        })
          .then(async (isFinalizar) => {
            if (isFinalizar) {
              finalizar(item.data.ocorrencia);
              setAtualizar(true)
            } else {
              const data = await fetchData(item.data.ocorrencia);
              if (data.codigo > 0) {
                history.push({ pathname: '/quadroScrum', state: { cliente: data.cli_nome, projeto_id: data.projeto_scrum, contrato: data.contrato, ocorrencia: data.codigo } });
              }
            }
          });
      }
    },
  })

  const [, dropCardOS] = useDrop({
    accept: 'CARD_OS',
    drop(item, monitor) {
      //deletaVinculoSprint(item.data.bb_codigo);
    },
  })

  dropCardOcorrencia(dropCardOS(ref))

  return (
    <Container ref={ref}>
      <header>
        <h2>{data.title}</h2>
        {listIndex === 0 && (
          <button onClick={() => criarOcorrencia()}>
            <MdAdd size={24} color="#FFF" />
          </button>)}
      </header>
      {data.cards?.length > 0 && (
        <ul>
          {data.cards.map((card, index) =>
            <CardsKanban
              key={card?.id}
              data={card}
              index={index}
              listIndex={listIndex}
              color={card?.ocorrencia === 0 ? "#D3D3D3" : '#FFF'}
            />)}
        </ul>)
      }
    </Container>
  );
}

export default ListaKanban;