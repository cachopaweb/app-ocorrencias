import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { Container, Label, Preview, Thumb, ThumbInner } from './styles';
import { useState, useRef, useContext, useEffect } from 'react';
import QuadroScrumContext from '../context';
import CardSprintBacklog from '../CardSprintBacklog';
import api from '../../../services/api';
import { useHistory } from 'react-router-dom';
import Button from '../../Button';
import { MdClose } from 'react-icons/md';
import { useUsuario } from '../../../context/UsuarioContext';
import Modal from '../../Modal';
import { MdDelete } from 'react-icons/md'

import swal from 'sweetalert';

function CardsBacklog({ backlogs, listIndex, dataEntrega }) {
  return (
    backlogs.map((backlog, index) => <CardSprintBacklog key={index} index={index} listIndex={listIndex} data={backlog} dataEntrega={dataEntrega} />)
  );
}


export default function CardSprint({ data, index, listIndex, cliente, contrato }) {
  const [backlogs, setBacklogs] = useState(data.backlogs);
  const [modalAtivo, setModalAtivo] = useState(false);
  const [imagemClicada, setImagemClicada] = useState({});
  const ref = useRef();
  const { move, setAtualizar } = useContext(QuadroScrumContext);
  const history = useHistory();
  const { cod_funcionario } = useUsuario();
  const [files, setFiles] = useState([]);

  async function fetchArquivos() {
    try {
      let response = await api.get(`/Ordens/Arquivos/${data.id}`);
      if (response.status === 200)
        setFiles(response.data);
    } catch (error) {
      console.log(error)
    }
  }

  function abrirPreview(file) {
    setImagemClicada(file);
    setModalAtivo(true)
  }

  useEffect(() => {
    fetchArquivos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'CARD_SPRINT', index, listIndex, data },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  async function criarVinculoSprintBacklog(codBacklog, codSprint) {
    await api.post(`/sprint_backlog/${codSprint}`, { Codigo: codBacklog });
    setAtualizar(true);
  }

  const [, dropRef] = useDrop({
    accept: 'CARD',
    drop(item, monitor) {
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;
      const draggedIndex = item.index;
      const targetIndex = index;
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

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex, 'CARD');
      if (backlogs.length)
        setBacklogs([...backlogs, item.data])
      else setBacklogs([item.data])
      item.index = targetIndex;
      item.listIndex = targetListIndex;
      criarVinculoSprintBacklog(item.data.id, data.id);
    },
  })

  dragRef(dropRef(ref));

  function abrirOrdemServico() {
    let ocorrencia = "";
    let codigos_ocorrencias = [];
    data.backlogs.map((backlog) => {
      ocorrencia += backlog.content + "\n";
      codigos_ocorrencias.push(backlog.ocorrencia);
    });


    var prioridade = 1;
    if (backlogs[0].labels[0] === 'green') { prioridade = 1 }
    if (backlogs[0].labels[0] === 'blue') { prioridade = 2 }
    if (backlogs[0].labels[0] === 'red') { prioridade = 3 }
    history.push({ pathname: '/aberturaOS', state: { cliente: cliente, contrato: contrato, ocorrencia, cod_ocorrencia: codigos_ocorrencias[0], funAtendente: cod_funcionario, dataEntrega: data.dataEntrega, prioridade: prioridade, codSprint: data.id } })
  }

  const handleDeleteSprint = async (id) => {
    console.log(id)
    const response = await api.delete(`/sprint/${id}`);
    console.log(response)
    return (response.status === 204);
  }

  const onDelete = (id) => {
    swal({
      title: "Deseja excluir esta Sprint?",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          const isDeleted = handleDeleteSprint(id);
          if (isDeleted) {
            swal("Sprint excluida com sucesso", {
              icon: "success",
            });
            setAtualizar();
          } else {
            swal("Falha ao deletar Sprint!", { icon: "warning" })
          }
        }
      });
  }

  return (
    <>
      <Container ref={ref} isDragging={isDragging}>
        <header>
          {data.labels.map(label => <Label key={label} color={label} />)}
          <strong>
            <p>
              <span><strong>Data Entrega: </strong></span>
              {new Date(data.dataEntrega).toLocaleDateString()}
            </p>
            <p>
              <span><strong>Data Sprint: </strong></span>
              {new Date(data.data).toLocaleDateString()}
            </p>
            <p>
              <span><strong>Data Ent. Real: </strong></span>
              {new Date(data.dataEntregaReal).toLocaleDateString()}
            </p>
          </strong>
        </header>
        <p>{data.content}</p>
        {
          backlogs.length > 0 ?
            (
              <CardsBacklog key={backlogs} backlogs={backlogs} listIndex={listIndex} dataEntrega={data.dataEntrega} />

            )
            : <h3>Aguardando Backlogs...</h3>
        }
        <Preview>
          {
            files?.map(file =>
              <Thumb onClick={() => abrirPreview(file)}>
                <ThumbInner>
                  <img key={file.nome} src={`data:image/jpeg;base64,${file.base64}`} alt={file.nome} />
                </ThumbInner>
              </Thumb>
            )
          }
        </Preview>
        <Button Icon={MdClose} nome={"Abrir OS"} color={"#7FA66D"} corTexto={"white"} borderRadius={'30px'} click={() => abrirOrdemServico()} disabled={data.ordem > 0 || backlogs.length === 0} />
        <button onClick={() => onDelete(data.id)}><MdDelete size={20} color='red' /></button>
      </Container>
      {
        modalAtivo &&
        <Modal activate={modalAtivo} setActivate={setModalAtivo} altura="auto" largura="auto">
          <img key={imagemClicada.nome} src={`data:image/jpeg;base64,${imagemClicada.base64}`} alt={imagemClicada.nome} />
        </Modal>
      }
    </>
  );
}