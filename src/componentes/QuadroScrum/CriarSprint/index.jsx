import React, { useState, useEffect, useContext } from 'react';
import { Save, X, Calendar, UploadCloud, Eye, Trash2, Rocket } from 'lucide-react';
import swal from '@/lib/feedback';
import DatePicker from '../../DatePicker';

import { Input, Select } from '../../Input';
import { Button } from '../../Button';
import api from '../../../services/api';
import Modal from '../../Modal';
import Dropzone from '../../DropZone';
import quadroContext from '../context';

function CriarSprint({ cliente, projeto_id = 0, setModalActivate, atualizar }) {
  const [prazoSprint, setPrazoSprint] = useState([]);
  const [tipoPrazoEscolhido, setTipoPrazoEscolhido] = useState(0);
  const [prioridade, setprioridade] = useState(0);
  const [descricao, setDescricao] = useState('');
  const [files, setFiles] = useState([]);
  const [imagemClicada, setImagemClicada] = useState({});
  const [modalAtivo, setModalAtivo] = useState(false);
  const [dataPrazoEntrega, setDataPrazoEntrega] = useState(new Date());
  const [diasPrazo, setDiasPrazo] = useState(0);
  const [loading, setLoading] = useState(false);
  const { setAtualizar } = useContext(quadroContext);

  async function fetchPrazoSprint() {
    try {
      const response = await api.get('/prazo_sprint');
      setPrazoSprint(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar prazos de sprint:', error);
    }
  }

  function adicionarDiasData(dias) {
    const hoje = new Date();
    const novaData = new Date(hoje);
    novaData.setDate(hoje.getDate() + parseInt(dias || 0, 10));
    return novaData;
  }

  function changeDataPrazoEntrega(date) {
    setDataPrazoEntrega(date);
  }

  function changePrazoSprint(dias) {
    const numDias = parseInt(dias, 10) || 0;
    setDiasPrazo(numDias);
    const novaData = adicionarDiasData(numDias);
    setDataPrazoEntrega(novaData);
  }

  function handleTipoPrazoChange(e) {
    const valor = e.target.value;
    setTipoPrazoEscolhido(valor);
    if (valor !== '0' && valor !== 0) {
      changePrazoSprint(valor);
    }
  }

  function abrirPreview(file) {
    setImagemClicada(file);
    setModalAtivo(true);
  }

  function removerArquivo(indexParaRemover, e) {
    if (e) e.stopPropagation();
    setFiles(prev => prev.filter((_, idx) => idx !== indexParaRemover));
  }

  async function submitEstoria(e) {
    e.preventDefault();
    if (Number(tipoPrazoEscolhido) === 0) {
      swal('Informe o tipo da Sprint!', 'Necessário para o intervalo de dias a ser entregue.', 'warning');
      return;
    }
    if (Number(prioridade) === 0) {
      swal('Informe uma prioridade!', 'Qual a prioridade do que está sendo pedido?', 'warning');
      return;
    }
    if (Number(projeto_id) === 0) {
      swal('Informe o projeto Scrum!', 'ID do Projeto é obrigatório.', 'warning');
      return;
    }

    let codigoSprint = 0;
    const dados = {
      Estado: 'A FAZER',
      Descricao: descricao,
      Cod_Projeto_Scrum: projeto_id,
      DataEntregaProgramacao: dataPrazoEntrega ? dataPrazoEntrega.toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
    };

    try {
      setLoading(true);
      const response = await api.post('/sprint', dados);
      codigoSprint = response.data?.BACKLOG_SPRINT || 0;
      if (codigoSprint > 0) {
        swal(`Sprint ${codigoSprint} criada com sucesso!`, 'Bom trabalho', 'success');
        setModalActivate(false);
        if (setAtualizar) setAtualizar(true);
        if (atualizar) atualizar();
      } else {
        swal(`Erro ao criar Sprint. Erro ${response.data?.error || ''}!`, 'Erro ao inserir', 'error');
      }
    } catch (error) {
      swal(`Erro ao criar Sprint. Erro ${error}!`, 'Algo deu errado', 'error');
    }

    if (codigoSprint > 0 && files.length > 0) {
      const data = new FormData();
      files.forEach((file, index) => {
        data.append(`Files[${index}]`, file, file.name);
      });

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };

      try {
        const response = await api.post(`/Upload/${codigoSprint}`, data, config);
        if (response.status !== 200) {
          swal(`Erro ao enviar arquivos da Sprint. Erro ${response.data?.error || ''}!`, 'Erro ao fazer upload', 'error');
        }
      } catch (error) {
        swal(`Erro ao fazer upload arquivos. Erro ${error}!`, 'Algo deu errado', 'error');
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPrazoSprint();
  }, []);

  return (
    <>
      <div className="w-full flex flex-col text-slate-800 dark:text-slate-100">
        {/* Header do modal */}
        <div className="flex items-start gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shrink-0">
            <Rocket className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
              Nova Sprint
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              Cliente: <span className="font-medium text-slate-700 dark:text-slate-300">{cliente || 'Não informado'}</span>
              {projeto_id ? ` • Projeto #${projeto_id}` : ''}
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={submitEstoria} className="flex flex-col gap-4">
          {/* Cliente (disabled) */}
          <div>
            <label htmlFor="cliente" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Cliente
            </label>
            <Input
              id="cliente"
              type="text"
              value={cliente || ''}
              disabled
              className="bg-slate-100 dark:bg-slate-800/60 cursor-not-allowed text-slate-600 dark:text-slate-400"
            />
          </div>

          {/* Tipo de Sprint e Data em Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tipoPrazo" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Tipo de Sprint
              </label>
              <Select
                id="tipoPrazo"
                value={tipoPrazoEscolhido}
                onChange={handleTipoPrazoChange}
              >
                <option value={0}>Informe o tipo da Sprint</option>
                {prazoSprint.map((prazo) => (
                  <option key={prazo.codigo} value={prazo.dias}>
                    {prazo.descricao}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="dataEntrega" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Data Prazo de Entrega
              </label>
              <div className="relative">
                <DatePicker
                  id="dataEntrega"
                  dateFormat="dd/MM/yyyy"
                  locale="pt-BR"
                  selected={dataPrazoEntrega}
                  onChange={changeDataPrazoEntrega}
                  className="flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-colors"
                  wrapperClassName="w-full"
                />
              </div>
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <label htmlFor="prioridade" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Prioridade
            </label>
            <Select
              id="prioridade"
              value={prioridade}
              onChange={(e) => setprioridade(Number(e.target.value))}
            >
              <option value={0}>Informe a Prioridade</option>
              <option value={1}>1 - BAIXA</option>
              <option value={2}>2 - MÉDIA</option>
              <option value={3}>3 - ALTA</option>
            </Select>
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="descricao" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Descrição
            </label>
            <Input
              id="descricao"
              type="text"
              placeholder="Informe uma descrição para a Sprint"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          {/* Área de Upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Anexos / Prints
            </label>
            <Dropzone setArquivos={setFiles} />

            {files && files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 max-h-36 overflow-y-auto p-1">
                {files.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="group relative w-16 h-16 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 cursor-pointer shadow-xs hover:border-indigo-500 transition-all"
                    onClick={() => abrirPreview(file)}
                  >
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-150"
                    />
                    <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button
                        type="button"
                        className="p-1 rounded bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors"
                        onClick={() => abrirPreview(file)}
                        title="Visualizar"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        className="p-1 rounded bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-rose-600 transition-colors"
                        onClick={(e) => removerArquivo(idx, e)}
                        title="Remover"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rodapé com ações */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-2">
            <Button
              type="button"
              variant="outline"
              Icon={X}
              onClick={() => setModalActivate(false)}
              nome="Cancelar"
            />
            <Button
              type="submit"
              variant="indigo"
              Icon={Save}
              disabled={loading}
              nome={loading ? 'Criando...' : 'Criar Sprint'}
            />
          </div>
        </form>
      </div>

      {/* Modal de Preview de Imagem */}
      {modalAtivo && (
        <Modal
          activate={modalAtivo}
          setActivate={setModalAtivo}
          className="max-w-2xl p-4"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                {imagemClicada.name || 'Visualização do anexo'}
              </span>
            </div>
            <div className="flex items-center justify-center max-h-[70vh] overflow-hidden rounded-lg bg-slate-950/5 dark:bg-slate-950/30">
              <img
                src={imagemClicada.preview}
                alt={imagemClicada.name || 'Preview'}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default CriarSprint;