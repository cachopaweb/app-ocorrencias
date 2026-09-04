import React, { useState, useEffect } from 'react';
import { 
  Edit3, 
  Save, 
  CheckCircle2, 
  Send, 
  Paperclip, 
  Calendar, 
  User, 
  FileText, 
  X,
  Layers,
  AlertCircle
} from 'lucide-react';

import Badge from '../../componentes/Badge';
import { Input, Select, Textarea } from '../../componentes/Input';
import Button from '../../componentes/Button';
import Modal from '../../componentes/Modal';
import api from '../../services/api';
import swal from '@/lib/feedback';
import { useUsuario } from '../../context/UsuarioContext';

function OrdemDetalhe({ ordem: propOrdem, SetDadosAlterados, location }) {
  const ordem = propOrdem || location?.state?.ordem || {};
  const { fun_categoria, cod_funcionario } = useUsuario();
  const [emEdicao, setEmEdicao] = useState(false);
  const [ocorrencia, setOcorrencia] = useState(ordem.ocorrencia || '');
  const [finalizarOS, setfinalizarOS] = useState(false);
  const [entregarOS, setEntregarOS] = useState(false);
  const [laudo, setLaudo] = useState('');
  const [tipo_entrega, setTipo_Entrega] = useState('REMOTA');
  const [modalAtivo, setModalAtivo] = useState(false);
  const [imagemClicada, setImagemClicada] = useState({});
  const [files, setFiles] = useState([]);

  async function fetchArquivos() {
    if (!ordem || !ordem.sprint) return;
    try {
      let response = await api.get(`/Ordens/Arquivos/${ordem.sprint}`);
      setFiles(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar arquivos:", error);
      setFiles([]);
    }
  }

  function abrirPreview(file) {
    setImagemClicada(file);
    setModalAtivo(true);
  }

  useEffect(() => {
    if (ordem && ordem.sprint) {
      fetchArquivos();
    }
  }, [ordem]);

  useEffect(() => {
    if (ordem) {
      setOcorrencia(ordem.ocorrencia || '');
    }
  }, [ordem?.ocorrencia, ordem?.ord_codigo]);

  function Editar() {
    setEmEdicao(true);
  }

  async function Salvar() {
    try {
      let response = await api.put(`/Ordens/${ordem.ord_codigo}/AtualizaOrdens`, { ocorrencia });
      if (response.status === 200) {
        swal('Ordem Atualizada com sucesso!', 'Tudo ok', 'success');
        setEmEdicao(false);
        if (SetDadosAlterados) SetDadosAlterados(true);
      } else {
        swal('Falha ao atualizar ordem!', 'Falha', 'error');
      }
    } catch (error) {
      swal(`Erro ao atualizar ordem ${error}`, 'Erro', 'error');
    }
  }

  async function finalizarOrdem(e) {
    if (e) e.preventDefault();
    if (!laudo || laudo.trim() === '') {
      swal('O laudo é obrigatório!', 'Informe o Laudo', 'warning');
      return;
    }
    try {
      let response = await api.put(`/Ordens/${ordem.ord_codigo}/finalizar`, {
        estado: fun_categoria?.substring(0, 8) === 'PROGRAMA' ? 'PROGRAMADA' : 'TESTADA',
        laudo: laudo,
        funcionario: cod_funcionario
      });
      if (response.status === 200) {
        swal('Ordem finalizada com sucesso!', 'Tudo ok', 'success');
        setEmEdicao(false);
        setfinalizarOS(false);
        setLaudo('');
        if (SetDadosAlterados) SetDadosAlterados(true);
      } else {
        swal('Falha ao finalizar ordem!', 'Falha', 'error');
      }
    } catch (error) {
      swal(`Erro ao finalizar a OS ${ordem.ord_codigo}!`, `Erro ${error}`, 'error');
    }
  }

  // Alias for backward compatibility
  const handleFinalizarOS = finalizarOrdem;

  async function entregarOrdem(e) {
    if (e) e.preventDefault();
    if (!laudo || laudo.trim() === '') {
      swal('O laudo é obrigatório!', 'Informe o Laudo', 'warning');
      return;
    }
    if (!tipo_entrega && fun_categoria === 'SUPORTE') {
      swal('Tipo de Entrega é obrigatório!', 'Informe o Tipo de Entrega', 'warning');
      return;
    }
    try {
      let response = await api.put(`/Ordens/${ordem.ord_codigo}/finalizar`, {
        estado: "ENTREGUE",
        laudo: laudo,
        funcionario: cod_funcionario,
        tipo_entrega: tipo_entrega
      });
      if (response.status === 200) {
        swal('Ordem entregue com sucesso!', 'Tudo ok', 'success');
        setEmEdicao(false);
        setEntregarOS(false);
        setLaudo('');
        if (SetDadosAlterados) SetDadosAlterados(true);
      } else {
        swal('Falha ao entregar ordem!', 'Falha', 'error');
      }
    } catch (error) {
      swal(`Erro ao entregar a OS ${ordem.ord_codigo}!`, `Erro ${error}`, 'error');
    }
  }

  // Alias for backward compatibility
  const handleEntregarOS = entregarOrdem;

  function getEstadoBadgeVariant(estado) {
    switch (estado?.toUpperCase()) {
      case 'ENTREGUE':
        return 'success';
      case 'PROGRAMANDO':
      case 'TESTANDO':
        return 'warning';
      case 'PROGRAMADA':
      case 'TESTADA':
      case 'ANALISADA':
        return 'default';
      case 'ABERTA':
        return 'destructive';
      default:
        return 'secondary';
    }
  }

  if (!ordem || (!ordem.ord_codigo && !ordem.cli_nome)) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400 max-w-4xl w-full mx-auto">
        <AlertCircle className="w-8 h-8 text-amber-500" />
        <p className="text-sm">Nenhuma ordem de serviço selecionada.</p>
      </div>
    );
  }

  return (
    <>
      {/* Modal Finalizar OS */}
      {finalizarOS && (
        <Modal
          activate={finalizarOS}
          setActivate={setfinalizarOS}
          altura="auto"
          largura={540}
        >
          <form onSubmit={finalizarOrdem} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                Finalizar Ordem #{ordem.ord_codigo}
              </h3>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="laudoFinalizacao" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Laudo Técnico
              </label>
              <Textarea
                id="laudoFinalizacao"
                name="laudo"
                rows={5}
                value={laudo}
                onChange={(e) => setLaudo(e.target.value)}
                placeholder="Descreva o laudo técnico da finalização..."
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                Icon={X}
                nome="Cancelar"
                onClick={() => {
                  setLaudo('');
                  setfinalizarOS(false);
                }}
              />
              <Button
                type="submit"
                variant="success"
                Icon={CheckCircle2}
                nome="Finalizar"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Entregar OS */}
      {entregarOS && (
        <Modal
          activate={entregarOS}
          setActivate={setEntregarOS}
          altura="auto"
          largura={540}
        >
          <form onSubmit={entregarOrdem} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Send className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                Entregar Ordem #{ordem.ord_codigo}
              </h3>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tipo_entrega" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tipo de Entrega
              </label>
              <Select
                id="tipo_entrega"
                value={tipo_entrega}
                onChange={(e) => setTipo_Entrega(e.target.value)}
              >
                <option value="REMOTA">REMOTA</option>
                <option value="PRESENCIAL">PRESENCIAL</option>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="laudoEntrega" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Laudo de Entrega
              </label>
              <Textarea
                id="laudoEntrega"
                name="laudo"
                rows={5}
                value={laudo}
                onChange={(e) => setLaudo(e.target.value)}
                placeholder="Informe as observações da entrega..."
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                Icon={X}
                nome="Cancelar"
                onClick={() => {
                  setLaudo('');
                  setEntregarOS(false);
                }}
              />
              <Button
                type="submit"
                variant="indigo"
                Icon={Send}
                nome="Confirmar Entrega"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Preview de Imagem */}
      {modalAtivo && (
        <Modal
          activate={modalAtivo}
          setActivate={setModalAtivo}
          altura="auto"
          largura="auto"
          className="max-w-4xl"
        >
          <div className="flex flex-col items-center gap-3">
            {imagemClicada.nome && (
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {imagemClicada.nome}
              </span>
            )}
            <img
              key={imagemClicada.nome}
              src={`data:image/jpeg;base64,${imagemClicada.base64}`}
              alt={imagemClicada.nome || 'Anexo da OS'}
              className="max-h-[75vh] w-auto rounded-lg object-contain shadow-sm"
            />
          </div>
        </Modal>
      )}

      {/* Card Principal de Detalhes da OS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6 text-slate-800 dark:text-slate-100 max-w-4xl w-full mx-auto">
        {/* Header do Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Ordem de Serviço #{ordem.ord_codigo}
                </h2>
                {ordem.estado && (
                  <Badge variant={getEstadoBadgeVariant(ordem.estado)}>
                    {ordem.estado}
                  </Badge>
                )}
                {Boolean(ordem.sprint) && (
                  <Badge variant="outline" icon={Layers}>
                    Sprint #{ordem.sprint}
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                {ordem.cli_nome || 'Cliente não informado'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            {ordem.programador && (
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700">
                <User className="w-4 h-4 text-indigo-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{ordem.programador}</span>
              </div>
            )}
            {ordem.prazoEntrega && (
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{ordem.prazoEntrega}</span>
              </div>
            )}
          </div>
        </div>

        {/* Área de Descrição / Ocorrência */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-500" />
              Descrição da Ocorrência
            </span>
            {!emEdicao && (
              <Button
                variant="outline"
                size="sm"
                Icon={Edit3}
                nome="Editar Descrição"
                onClick={Editar}
              />
            )}
          </div>

          {emEdicao ? (
            <div className="flex flex-col gap-3">
              <Textarea
                id="ocorrenciaEdicao"
                value={ocorrencia}
                onChange={(e) => setOcorrencia(e.target.value)}
                rows={6}
                placeholder="Descreva a ocorrência..."
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  Icon={X}
                  nome="Cancelar Edição"
                  onClick={() => {
                    setOcorrencia(ordem.ocorrencia || '');
                    setEmEdicao(false);
                  }}
                />
                <Button
                  variant="indigo"
                  Icon={Save}
                  nome="Salvar"
                  onClick={Salvar}
                />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
              {ordem.ocorrencia || 'Nenhuma descrição detalhada informada.'}
            </div>
          )}
        </div>

        {/* Laudos Técnico (Programação e Teste se existirem) */}
        {(Boolean(ordem.laudo_programacao) || Boolean(ordem.laudo_teste)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            {Boolean(ordem.laudo_programacao) && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  Laudo Programação
                </span>
                <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  {ordem.laudo_programacao}
                </p>
              </div>
            )}
            {Boolean(ordem.laudo_teste) && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Laudo Teste
                </span>
                <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  {ordem.laudo_teste}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Galeria de Anexos */}
        {files && files.length > 0 && (
          <div className="flex flex-col gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-indigo-500" />
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                Anexos da Sprint ({files.length})
              </h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {files.map((file, idx) => (
                <button
                  key={file.nome || idx}
                  type="button"
                  onClick={() => abrirPreview(file)}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-100 dark:bg-slate-800"
                  title={file.nome}
                >
                  <img
                    src={`data:image/jpeg;base64,${file.base64}`}
                    alt={file.nome || 'Anexo'}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Barra de Ações de Fluxo da OS */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="secondary"
            Icon={CheckCircle2}
            nome="Finalizar OS"
            onClick={() => setfinalizarOS(true)}
            disabled={
              (ordem.estado === 'PROGRAMADA' && fun_categoria?.substring(0, 8) === 'PROGRAMA') ||
              (ordem.estado === 'TESTADA' && fun_categoria === 'SUPORTE')
            }
          />

          {fun_categoria === 'SUPORTE' && (
            <Button
              variant="indigo"
              Icon={Send}
              nome="Entregar OS"
              onClick={() => setEntregarOS(true)}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default OrdemDetalhe;