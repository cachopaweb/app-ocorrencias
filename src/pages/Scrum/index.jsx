import React, { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Plus,
  Search,
  BarChart3,
  Calendar,
  History,
  KanbanSquare,
  CheckCircle2,
} from 'lucide-react';

import api from '../../services/api';
import Button from '../../componentes/Button';
import Badge from '../../componentes/Badge';
import Input from '../../componentes/Input';
import Modal from '../../componentes/Modal';
import Burndown from '../../componentes/Burndown';
import Cronograma from '../../componentes/Cronograma';
import Create_Projeto_Scrum from '../Create_Projeto_Scrum';

function normalizarDataset(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && Object.keys(data).length > 0) return [data];
  return [];
}

function formatarDataSegura(valor) {
  if (!valor || valor === '0') return null;
  if (typeof valor === 'string') {
    const limpa = valor.trim();
    if (/^\d{2}\/\d{2}\/\d{4}/.test(limpa)) {
      return limpa.substring(0, 10);
    }
    if (/^\d{4}-\d{2}-\d{2}/.test(limpa)) {
      const [ano, mes, dia] = limpa.substring(0, 10).split('-');
      if (parseInt(ano, 10) < 1970) return null;
      return `${dia}/${mes}/${ano}`;
    }
  }
  const d = new Date(valor);
  if (isNaN(d.getTime()) || d.getFullYear() < 1970) return null;
  return d.toLocaleDateString('pt-BR');
}

function Scrum() {
  const [projetos, setProjetos] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroSituacao, setFiltroSituacao] = useState('ANDAMENTO'); // 'ANDAMENTO' | 'ENTREGUE' | 'TODOS'
  const [modalAtivo, setModalAtivo] = useState(false);
  const [burndownConfig, setBurndownConfig] = useState({
    ativo: false,
    projeto_id: 0,
    cliente: '',
  });
  const [cronogramaAtivo, setCronogramaAtivo] = useState(false);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  async function fetchProjetosScrum() {
    try {
      setLoading(true);
      const sql = `SELECT PS.PS_CODIGO, C.CLI_NOME, PS.PS_NOME, CT.CONT_CODIGO, BS.BS_CODIGO, BS.BS_DESCRICAO, BS.BS_ESTADO, BS.BS_DATA_ENT_PROG, CASE WHEN BS.BS_ESTADO = 'ENTREGUE' THEN COALESCE(BS.BS_DATA_ENT_REAL, O.ORD_DATAE, BS.BS_DATA_ENT_PROG) ELSE BS.BS_DATA_ENT_REAL END AS BS_DATA_ENT_REAL, (SELECT FIRST 1 FUN_NOME FROM FUNCIONARIOS JOIN BACKLOG_P ON BP_FUN = FUN_CODIGO JOIN BS_BP ON BB_BS = BS.BS_CODIGO AND BB_BP = BP_CODIGO ORDER BY BB_CODIGO) AS FUNCIONARIO FROM PROJETO_SCRUM PS JOIN BACKLOG_SPRINT BS ON PS.PS_CODIGO = BS.BS_PS LEFT JOIN ORDENS O ON O.ORD_SPRINT = BS.BS_CODIGO JOIN CONTRATOS CT ON CT.CONT_CODIGO = PS.PS_CONT JOIN CLIENTES C ON C.CLI_CODIGO = CT.CONT_CLI ORDER BY BS.BS_DATA_ENT_PROG DESC, BS.BS_CODIGO DESC`;

      const response = await api.post('/v1/dataset', { sql });
      const rows = normalizarDataset(response.data);

      // Deduplica por BS_CODIGO para evitar linhas duplicadas quando há mais de uma OS
      const mapa = new Map();
      rows.forEach((r) => {
        const bsCodigo = Number(r.BS_CODIGO ?? r.bs_codigo ?? 0);
        const psCodigo = Number(r.PS_CODIGO ?? r.ps_codigo ?? 0);
        const chave = bsCodigo > 0 ? `bs_${bsCodigo}` : `ps_${psCodigo}`;
        if (!mapa.has(chave)) {
          mapa.set(chave, {
            bs_codigo: bsCodigo,
            bs_descricao: r.BS_DESCRICAO ?? r.bs_descricao ?? '',
            ps_codigo: psCodigo,
            cli_nome: r.CLI_NOME ?? r.cli_nome ?? '',
            ps_nome: r.PS_NOME ?? r.ps_nome ?? '',
            contrato: Number(r.CONT_CODIGO ?? r.cont_codigo ?? r.contrato ?? 0),
            estado: String(r.BS_ESTADO ?? r.bs_estado ?? '').trim(),
            data_entrega: r.BS_DATA_ENT_PROG ?? r.bs_data_ent_prog ?? '',
            data_entrega_real: r.BS_DATA_ENT_REAL ?? r.bs_data_ent_real ?? '',
            funcionario: r.FUNCIONARIO ?? r.funcionario ?? '',
          });
        }
      });

      setProjetos(Array.from(mapa.values()));
    } catch (error) {
      console.error('Erro ao buscar projetos scrum via dataset, usando fallback:', error);
      try {
        const fallback = await api.get('/projetos_scrum/EmAndamento');
        setProjetos(fallback.data || []);
      } catch (e) {
        console.error('Erro no fallback:', e);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjetosScrum();
  }, []);

  const contadores = useMemo(() => {
    let andamento = 0;
    let entregue = 0;
    projetos.forEach((p) => {
      const upper = (p.estado || '').toUpperCase();
      if (upper === 'ENTREGUE' || upper === 'CONCLUIDO' || upper === 'CONCLUÍDO') {
        entregue++;
      } else {
        andamento++;
      }
    });
    return { andamento, entregue, todos: projetos.length };
  }, [projetos]);

  const projetos_filtrados = useMemo(() => {
    const termo = (busca || '').trim().toUpperCase();
    return projetos.filter((projeto) => {
      const upperEstado = (projeto.estado || '').toUpperCase();
      const ehEntregue =
        upperEstado === 'ENTREGUE' ||
        upperEstado === 'CONCLUIDO' ||
        upperEstado === 'CONCLUÍDO';

      if (filtroSituacao === 'ANDAMENTO' && ehEntregue) return false;
      if (filtroSituacao === 'ENTREGUE' && !ehEntregue) return false;

      if (!termo) return true;
      const cliente = (projeto.cli_nome || '').toUpperCase();
      const codigo = String(projeto.ps_codigo || '').toUpperCase();
      const funcionario = (projeto.funcionario || '').toUpperCase();
      const descricao = (projeto.bs_descricao || '').toUpperCase();
      return (
        cliente.includes(termo) ||
        codigo.includes(termo) ||
        funcionario.includes(termo) ||
        descricao.includes(termo)
      );
    });
  }, [projetos, busca, filtroSituacao]);

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

  function abrirBurndownProjeto(projeto) {
    setBurndownConfig({
      ativo: true,
      projeto_id: projeto ? projeto.ps_codigo : 0,
      cliente: projeto ? projeto.cli_nome : '',
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

      {burndownConfig.ativo && (
        <Modal
          activate={burndownConfig.ativo}
          setActivate={(val) => setBurndownConfig((prev) => ({ ...prev, ativo: val }))}
          altura="auto"
          largura="920px"
        >
          <Burndown
            projeto_id={burndownConfig.projeto_id}
            cliente={burndownConfig.cliente}
          />
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
              Gerencie o backlog, sprints em andamento, entregas concluídas e o Burndown dos projetos
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
              onClick={() => abrirBurndownProjeto(null)}
            >
              Burndown Geral
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

        {/* Barra de Busca e Filtro de Situação */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-lg p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar projeto, sprint, cliente ou responsável..."
              className="pl-9 h-8 text-xs"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              autoFocus={true}
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFiltroSituacao('ANDAMENTO')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                filtroSituacao === 'ANDAMENTO'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Em Andamento ({contadores.andamento})
            </button>
            <button
              type="button"
              onClick={() => setFiltroSituacao('ENTREGUE')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                filtroSituacao === 'ENTREGUE'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Finalizadas ({contadores.entregue})
            </button>
            <button
              type="button"
              onClick={() => setFiltroSituacao('TODOS')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                filtroSituacao === 'TODOS'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Todas ({contadores.todos})
            </button>
          </div>
        </div>

        {/* Tabela de Dados Linear */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-lg shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="font-mono text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Cód. Projeto</th>
                  <th className="py-2.5 px-3 font-semibold">Cliente / Sprint</th>
                  <th className="py-2.5 px-3 font-semibold">Meta Programada</th>
                  <th className="py-2.5 px-3 font-semibold">Conclusão Real</th>
                  <th className="py-2.5 px-3 font-semibold">Situação</th>
                  <th className="py-2.5 px-3 font-semibold">Responsável</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs">Carregando Projetos...</span>
                      </div>
                    </td>
                  </tr>
                ) : projetos_filtrados.length > 0 ? (
                  projetos_filtrados.map((projeto, idx) => {
                    const dataProgStr = formatarDataSegura(projeto.data_entrega);
                    const dataRealStr = formatarDataSegura(projeto.data_entrega_real);
                    return (
                      <tr
                        key={projeto.bs_codigo ? `bs-${projeto.bs_codigo}` : `${projeto.ps_codigo}-${idx}`}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-800 dark:text-slate-200"
                      >
                        <td className="py-2 px-3 font-mono text-xs font-semibold text-slate-400">
                          #{projeto.ps_codigo}
                        </td>
                        <td className="py-2 px-3">
                          <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                            {projeto.cli_nome}
                          </div>
                          {projeto.bs_descricao && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              Sprint #{projeto.bs_codigo}: {projeto.bs_descricao}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {dataProgStr || 'Não informada'}
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap">
                          {dataRealStr ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {dataRealStr}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500">—</span>
                          )}
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
                              variant="outline"
                              Icon={BarChart3}
                              tamanho_icone={13}
                              onClick={() => abrirBurndownProjeto(projeto)}
                            >
                              Burndown
                            </Button>
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-xs text-slate-500 dark:text-slate-400">
                      Nenhum projeto ou sprint encontrado para este filtro.
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
