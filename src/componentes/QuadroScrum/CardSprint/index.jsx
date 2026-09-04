import React, { useState, useRef, useContext, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useHistory } from 'react-router-dom';
import { Trash2, Calendar, Paperclip, ExternalLink } from 'lucide-react';
import swal from '@/lib/feedback';

import QuadroScrumContext from '../context';
import CardSprintBacklog from '../CardSprintBacklog';
import api from '../../../services/api';
import Button from '../../Button';
import Badge from '../../Badge';
import Modal from '../../Modal';
import { useUsuario } from '../../../context/UsuarioContext';
import { cn } from '../../../lib/utils';

function CardsBacklog({ backlogs, listIndex, dataEntrega }) {
  return backlogs.map((backlog, index) => (
    <CardSprintBacklog
      key={backlog.id || backlog.bb_codigo || index}
      index={index}
      listIndex={listIndex}
      data={backlog}
      dataEntrega={dataEntrega}
    />
  ));
}

export default function CardSprint({ data, index, listIndex, cliente, contrato }) {
  const [backlogs, setBacklogs] = useState(data.backlogs || []);
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
      if (response.status === 200) {
        setFiles(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function abrirPreview(file) {
    setImagemClicada(file);
    setModalAtivo(true);
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
      if (backlogs.length) {
        setBacklogs([...backlogs, item.data]);
      } else {
        setBacklogs([item.data]);
      }
      item.index = targetIndex;
      item.listIndex = targetListIndex;
      criarVinculoSprintBacklog(item.data.id, data.id);
    },
  });

  dragRef(dropRef(ref));

  function abrirOrdemServico() {
    let ocorrencia = "";
    let codigos_ocorrencias = [];
    (data.backlogs || backlogs).forEach((backlog) => {
      ocorrencia += backlog.content + "\n";
      codigos_ocorrencias.push(backlog.ocorrencia);
    });

    var prioridade = 1;
    if (backlogs[0]?.labels?.[0] === 'green') { prioridade = 1; }
    if (backlogs[0]?.labels?.[0] === 'blue') { prioridade = 2; }
    if (backlogs[0]?.labels?.[0] === 'red') { prioridade = 3; }
    history.push({
      pathname: '/aberturaOS',
      state: {
        cliente: cliente,
        contrato: contrato,
        ocorrencia,
        cod_ocorrencia: codigos_ocorrencias[0],
        funAtendente: cod_funcionario,
        dataEntrega: data.dataEntrega,
        prioridade: prioridade,
        codSprint: data.id
      }
    });
  }

  const handleDeleteSprint = async (id) => {
    try {
      const response = await api.delete(`/sprint/${id}`);
      return (response.status === 204);
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const onDelete = (id) => {
    swal({
      title: "Deseja excluir esta Sprint?",
      text: "",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async (willDelete) => {
      if (willDelete) {
        const isDeleted = await handleDeleteSprint(id);
        if (isDeleted) {
          swal("Sprint excluída com sucesso", {
            icon: "success",
          });
          setAtualizar(true);
        } else {
          swal("Falha ao deletar Sprint!", { icon: "warning" });
        }
      }
    });
  };

  return (
    <>
      <div 
        ref={ref} 
        className={cn(
          "relative mb-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all group text-slate-800 dark:text-slate-100 select-none",
          isDragging && "border-2 border-dashed border-indigo-400 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 opacity-60 rounded-xl shadow-none cursor-grabbing"
        )}
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="default" size="sm" className="font-semibold">
              Sprint #{data.id}
            </Badge>
            {data.labels && data.labels.map((label, idx) => (
              <span 
                key={idx} 
                className="w-2.5 h-2.5 rounded-full inline-block shrink-0 ring-1 ring-black/5 dark:ring-white/10"
                style={{ backgroundColor: label }}
                title={`Prioridade: ${label}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            {files && files.length > 0 && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full"
                title={`${files.length} anexo(s)`}
              >
                <Paperclip className="w-3 h-3" />
                {files.length}
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(data.id);
              }}
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ml-1"
              title="Excluir Sprint"
              aria-label="Excluir Sprint"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Datas */}
        <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400 mb-2">
          {data.dataEntrega && (
            <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <span>Entrega: {new Date(data.dataEntrega).toLocaleDateString()}</span>
            </div>
          )}
          {data.data && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span>Início: {new Date(data.data).toLocaleDateString()}</span>
            </div>
          )}
          {data.dataEntregaReal && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Entregue em: {new Date(data.dataEntregaReal).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Descrição */}
        {data.content && (
          <p className="text-xs text-slate-700 dark:text-slate-300 my-2 leading-relaxed whitespace-pre-wrap">
            {data.content}
          </p>
        )}

        {/* Backlogs vinculados */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <span>Estórias / Backlogs</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
              {backlogs.length}
            </span>
          </div>
          {backlogs.length > 0 ? (
            <CardsBacklog backlogs={backlogs} listIndex={listIndex} dataEntrega={data.dataEntrega} />
          ) : (
            <div className="text-center py-2.5 px-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500 italic">
              Arraste estórias aqui para vincular
            </div>
          )}
        </div>

        {/* Anexos */}
        {files && files.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-2">
              Anexos ({files.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="w-14 h-14 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs hover:scale-105 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer bg-slate-50 dark:bg-slate-800 p-0.5"
                  onClick={() => abrirPreview(file)}
                  title={file.nome || 'Visualizar anexo'}
                >
                  <img
                    className="w-full h-full object-cover rounded-md"
                    src={`data:image/jpeg;base64,${file.base64}`}
                    alt={file.nome || 'Anexo'}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rodapé / Ação */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant={data.ordem > 0 ? "secondary" : "indigo"}
            size="sm"
            className="w-full justify-center text-xs font-semibold"
            Icon={ExternalLink}
            onClick={() => abrirOrdemServico()}
            disabled={data.ordem > 0 || backlogs.length === 0}
          >
            {data.ordem > 0 ? "OS já Aberta" : "Abrir OS"}
          </Button>
        </div>
      </div>

      {/* Modal de Preview de Anexo */}
      {modalAtivo && (
        <Modal activate={modalAtivo} setActivate={setModalAtivo} className="max-w-2xl p-4">
          <div className="flex flex-col items-center">
            {imagemClicada.nome && (
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 self-start">
                {imagemClicada.nome}
              </h4>
            )}
            <img
              key={imagemClicada.nome}
              src={`data:image/jpeg;base64,${imagemClicada.base64}`}
              alt={imagemClicada.nome || 'Anexo'}
              className="rounded-lg max-h-[75vh] w-auto max-w-full object-contain border border-slate-200 dark:border-slate-700"
            />
          </div>
        </Modal>
      )}
    </>
  );
}