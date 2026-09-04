import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Plus,
  Search,
  BarChart3,
  Calendar,
  History,
  KanbanSquare,
} from 'lucide-react';

import api from '../../services/api';
import Button from '../../componentes/Button';
import Badge from '../../componentes/Badge';
import Input from '../../componentes/Input';
import Modal from '../../componentes/Modal';
import Burndown from '../../componentes/Burndown';
import Cronograma from '../../componentes/Cronograma';
import Create_Projeto_Scrum from '../Create_Projeto_Scrum';
import { useUsuario } from '../../context/UsuarioContext';

function Scrum() {
  const [projetos, setProjetos] = useState([]);
  const [projetos_filtrados, setProjetos_filtrados] = useState([]);
  const [modalAtivo, setModalAtivo] = useState(false);
  const [burndownAtivo, setBurndownAtivo] = useState(false);
  const [cronogramaAtivo, setCronogramaAtivo] = useState(false);
  const [loading, setLoading] = useState(true);

  const { fun_categoria } = useUsuario();
  const history = useHistory();

  async function fetchProjetosScrum() {
    try {
      setLoading(true);
      const response = await api.get('/projetos_scrum/EmAndamento');
      const data = response.data || [];
      setProjetos(data);
      setProjetos_filtrados(data);
    } catch (error) {
      console.error('Erro ao buscar projetos scrum:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjetosScrum();
  }, []);

  function filtrarPorProjeto(busca) {
    const termo = (busca || '').trim().toUpperCase();
    if (!termo) {
      setProjetos_filtrados(projetos);
      return;
    }
    const result = projetos.filter((projeto) => {
      const cliente = (projeto.cli_nome || '').toUpperCase();
      const codigo = String(projeto.ps_codigo || '').toUpperCase();
      const funcionario = (projeto.funcionario || '').toUpperCase();
      return cliente.includes(termo) || codigo.includes(termo) || funcionario.includes(termo);
    });
    setProjetos_filtrados(result);
  }

  function SelecionaProjeto(projeto) {
    history.push({
      pathname: '/quadroScrum',
      state: {
        cliente: projeto.cli_nome,
        projeto_id: projeto.ps_codigo,
        contrato: projeto.contrato,
      },
    });
  }

  function SelecionaProjetoRetrospectiva(projeto) {
    history.push({
      pathname: '/retrospectiva',
      state: {
        projeto_scrum: projeto.ps_codigo,
        cliente: projeto.cli_nome,
      },
    });
  }

  function renderStatusBadge(estado) {
    if (!estado) return <Badge variant="secondary" dot={true} size="sm">Sem status</Badge>;
    const upper = estado.toUpperCase();
    if (upper === 'A FAZER' || upper === 'A_FAZER') {
      return <Badge variant="warning" dot={true} size="sm">{estado}</Badge>;
    }
    if (upper === 'EM ANDAMENTO' || upper === 'ANDAMENTO' || upper === 'ABERTO') {
      return <Badge variant="indigo" dot={true} size="sm">{estado}</Badge>;
    }
    if (upper === 'REVISAO' || upper === 'REVISÃO') {
      return <Badge variant="destructive" dot={true} size="sm">{estado}</Badge>;
    }
    if (upper === 'ENTREGUE' || upper === 'CONCLUIDO' || upper === 'CONCLUÍDO' || upper === 'FINALIZADO') {
      return <Badge variant="success" dot={true} size="sm">{estado}</Badge>;
    }
    return <Badge variant="secondary" dot={true} size="sm">{estado}</Badge>;
  }

  return (
    <>
      {cronogramaAtivo && (
        <Modal activate={cronogramaAtivo} setActivate={setCronogramaAtivo}>
          <Cronograma />
        </Modal>
      )}

      {modalAtivo && (
        <Modal activate={modalAtivo} setActivate={setModalAtivo}>
          <Create_Projeto_Scrum />
        </Modal>
      )}

      {burndownAtivo && (
        <Modal activate={burndownAtivo} setActivate={setBurndownAtivo} altura="600px" largura="700px">
          <Burndown projeto_id={0} />
        </Modal>
      )}

      <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto p-4 sm:p-6 text-slate-900 dark:text-slate-100 animate-in fade-in duration-200">
        {/* Header da Página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Projetos Scrum
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Gerencie o backlog, sprints e entregas dos projetos em andamento
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="default"
              Icon={Calendar}
              tamanho_icone={14}
              onClick={() => setCronogramaAtivo(true)}
            >
              Cronograma
            </Button>
            <Button
              variant="outline"
              size="default"
              Icon={BarChart3}
              tamanho_icone={14}
              onClick={() => setBurndownAtivo(true)}
            >
              Burndown
            </Button>
            <Button
              variant="indigo"
              size="default"
              Icon={Plus}
              tamanho_icone={14}
              onClick={() => setModalAtivo(true)}
            >
              Novo Projeto
            </Button>
          </div>
        </div>

        {/* Barra de Busca */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-lg p-3 shadow-2xs">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar projeto ou cliente..."
              className="pl-9 h-8 text-xs"
              onChange={(e) => filtrarPorProjeto(e.target.value)}
              autoFocus={true}
            />
          </div>
        </div>

        {/* Tabela de Dados Linear */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-lg shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Cód. Projeto</th>
                  <th className="py-2.5 px-3 font-semibold">Cliente</th>
                  <th className="py-2.5 px-3 font-semibold">Data de Entrega</th>
                  <th className="py-2.5 px-3 font-semibold">Situação</th>
                  <th className="py-2.5 px-3 font-semibold">Responsável</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs">Carregando Projetos...</span>
                      </div>
                    </td>
                  </tr>
                ) : projetos_filtrados.length > 0 ? (
                  projetos_filtrados.map((projeto) => (
                    <tr
                      key={projeto.ps_codigo}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-800 dark:text-slate-200"
                    >
                      <td className="py-2 px-3 font-mono text-xs font-semibold text-slate-400">
                        #{projeto.ps_codigo}
                      </td>
                      <td className="py-2 px-3 text-xs font-medium text-slate-900 dark:text-slate-100">
                        {projeto.cli_nome}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {projeto.data_entrega
                          ? new Date(projeto.data_entrega).toLocaleDateString()
                          : 'Não informada'}
                      </td>
                      <td className="py-2 px-3">
                        {renderStatusBadge(projeto.estado)}
                      </td>
                      <td className="py-2 px-3 text-xs text-slate-600 dark:text-slate-400">
                        {projeto.funcionario || 'Não informado'}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="indigo"
                            Icon={KanbanSquare}
                            tamanho_icone={13}
                            onClick={() => SelecionaProjeto(projeto)}
                          >
                            Quadro Scrum
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            Icon={History}
                            tamanho_icone={13}
                            onClick={() => SelecionaProjetoRetrospectiva(projeto)}
                          >
                            Retrospectiva
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
                      Nenhum projeto encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Scrum;