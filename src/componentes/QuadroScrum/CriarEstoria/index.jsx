import React, { useState, useEffect, useContext } from 'react';
import { Save, X, FileText, Layers } from 'lucide-react';
import swal from '@/lib/feedback';

import { Input, Select, Textarea } from '../../Input';
import { Button } from '../../Button';
import api from '../../../services/api';
import { useUsuario } from '../../../context/UsuarioContext';
import quadroContext from '../context';

function CriarEstoria({ cliente, projeto_id = 0, setModalActivate, cod_ocorrencia = 0, atualizar }) {
  const [prioridade, setprioridade] = useState(2);
  const [ocorrencia, setOcorrencia] = useState(cod_ocorrencia);
  const [estoria, setEstoria] = useState('');
  const { cod_funcionario } = useUsuario();
  const [ocorrencias, setOcorrencias] = useState([]);
  const [titulo, setTitulo] = useState('');
  const { setAtualizar } = useContext(quadroContext);
  const [loading, setLoading] = useState(false);

  async function submitEstoria(e) {
    e.preventDefault();
    if (Number(prioridade) === 0) {
      swal('Informe uma prioridade!', 'Qual a prioridade do que está sendo pedido?', 'warning');
      return;
    }
    if (!estoria || estoria.trim() === '') {
      swal('Informe uma estória!', 'Descreva o que o cliente pede.', 'warning');
      return;
    }
    if (Number(projeto_id) === 0) {
      swal('Informe o projeto Scrum!', 'ID do Projeto é obrigatório.', 'warning');
      return;
    }
    if (Number(ocorrencia) === 0) {
      swal('Informe uma ocorrência!', 'ID da ocorrência é obrigatório.', 'warning');
      return;
    }

    const dados = {
      Descricao: estoria,
      Necessidade: prioridade,
      Estado: 'ABERTO',
      Cod_Projeto_Scrum: projeto_id,
      Funcionario: cod_funcionario,
      ocorrencia,
      titulo,
    };

    try {
      setLoading(true);
      const response = await api.post('/backlog', dados);
      if (response.data && response.data.BACKLOG > 0) {
        swal(`Estória ${response.data.BACKLOG} criada com sucesso!`, 'Bom trabalho', 'success');
        setModalActivate(false);
        if (setAtualizar) setAtualizar(true);
        if (atualizar) atualizar();
      } else {
        swal(`Erro ao criar Estória. Erro ${response.data?.error || ''}!`, 'Erro ao inserir', 'error');
      }
    } catch (error) {
      swal(`Erro ao criar Estória. Erro ${error}!`, 'Algo deu errado', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function fetchOcorrencias() {
    try {
      const response = await api.get(`/Ocorrencias?projeto_id=${projeto_id}`);
      setOcorrencias(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar ocorrências:', error);
    }
  }

  useEffect(() => {
    fetchOcorrencias();
  }, []);

  return (
    <div className="w-full flex flex-col text-slate-800 dark:text-slate-100">
      {/* Header do modal */}
      <div className="flex items-start gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
            Novo Backlog / Estória
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

        {/* Prioridade e Ocorrência em Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div>
            <label htmlFor="ocorrencia" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Ocorrência
            </label>
            <Select
              id="ocorrencia"
              value={ocorrencia}
              onChange={(e) => setOcorrencia(e.target.value)}
            >
              <option value={0}>Informe a Ocorrência</option>
              {ocorrencias.map((oco) => (
                <option key={oco.codigo} value={oco.codigo}>
                  {`${oco.codigo} - ${oco.obs || oco.descricao || 'Ocorrência'}`}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Título
          </label>
          <Input
            id="titulo"
            type="text"
            placeholder="Resumo do item ou funcionalidade"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        {/* Estória / Descrição */}
        <div>
          <label htmlFor="estoria" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Estória / Descrição
          </label>
          <Textarea
            id="estoria"
            rows={4}
            placeholder="Descreva detalhadamente o que o cliente pede..."
            value={estoria}
            onChange={(e) => setEstoria(e.target.value)}
          />
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
            nome={loading ? 'Salvando...' : 'Salvar Estória'}
          />
        </div>
      </form>
    </div>
  );
}

export default CriarEstoria;