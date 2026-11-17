import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  TrendingDown,
  Loader2,
  CheckCircle2,
  Clock,
  Activity,
  Target,
  BarChart3,
  Calendar,
  ListChecks,
  Filter
} from 'lucide-react';
import api from '../../services/api';
import Graficos from '../Graficos';
import DatePicker from '../DatePicker';
import Badge from '../Badge';
import { Select } from '../Input';

function normalizarDataset(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && Object.keys(data).length > 0) return [data];
  return [];
}

function converteStringParaData(dataString) {
  if (!dataString || dataString === '0' || dataString === '') {
    return null;
  }
  if (dataString instanceof Date) {
    if (isNaN(dataString.getTime())) return null;
    const d = new Date(dataString.getFullYear(), dataString.getMonth(), dataString.getDate());
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (typeof dataString === 'string') {
    const limpa = dataString.trim();
    // Formato YYYY-MM-DD ou ISO
    if (limpa.length >= 10 && limpa[4] === '-' && limpa[7] === '-') {
      const ano = parseInt(limpa.substring(0, 4), 10);
      const mes = parseInt(limpa.substring(5, 7), 10) - 1;
      const dia = parseInt(limpa.substring(8, 10), 10);
      if (ano < 1970) return null;
      const data = new Date(ano, mes, dia);
      data.setHours(0, 0, 0, 0);
      return isNaN(data.getTime()) ? null : data;
    }
    // Formato DD/MM/YYYY ou DD.MM.YYYY
    if (limpa.length >= 10 && (limpa[2] === '/' || limpa[2] === '.') && (limpa[5] === '/' || limpa[5] === '.')) {
      const dia = parseInt(limpa.substring(0, 2), 10);
      const mes = parseInt(limpa.substring(3, 5), 10) - 1;
      const ano = parseInt(limpa.substring(6, 10), 10);
      if (ano < 1970) return null;
      const data = new Date(ano, mes, dia);
      data.setHours(0, 0, 0, 0);
      return isNaN(data.getTime()) ? null : data;
    }
    const data = new Date(limpa);
    if (!isNaN(data.getTime()) && data.getFullYear() >= 1970) {
      data.setHours(0, 0, 0, 0);
      return data;
    }
  }
  return null;
}

function converteDataParaString(data) {
  if (!data || isNaN(data.getTime())) return '—';
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear().toString();
  return `${dia}/${mes}/${ano}`;
}

function converteDataParaSQL(data) {
  if (!data || isNaN(data.getTime())) return '';
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function formataDataCurta(data) {
  if (!data || isNaN(data.getTime())) return '';
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}`;
}

function Burndown({ projeto_id: propProjetoId, cliente: propCliente }) {
  const location = useLocation();
  const initialProjetoId =
    propProjetoId !== undefined && propProjetoId !== null
      ? Number(propProjetoId)
      : Number(location?.state?.projeto_id || 0);
  const initialCliente = propCliente || location?.state?.cliente || '';

  const [projetoSelecionado, setProjetoSelecionado] = useState(initialProjetoId);
  const [projetosLista, setProjetosLista] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [dadosfinal, setDadosFinal] = useState([]);
  const [sprintsDetalhe, setSprintsDetalhe] = useState([]);

  // Quando abre em um projeto específico, traz todas as sprints dele por padrão.
  // Quando abre no Burndown Geral (projeto = 0), filtra pelos últimos 90 dias até +30 dias por padrão.
  const [usarFiltroData, setUsarFiltroData] = useState(initialProjetoId === 0);
  const [dataInicial, setDataInicial] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [dataFinal, setDataFinal] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [totalOcorrencias, setTotalOcorrencias] = useState(0);
  const [totalDatasFinalizadas, setTotalDatasFinalizadas] = useState(0);
  const [itensPendentes, setItensPendentes] = useState(0);
  const [statusInfo, setStatusInfo] = useState({
    label: 'Sem Dados',
    variant: 'secondary',
    descricao: 'Carregando dados da sprint...'
  });

  useEffect(() => {
    if (propProjetoId !== undefined && propProjetoId !== null) {
      const novoId = Number(propProjetoId);
      setProjetoSelecionado(novoId);
      setUsarFiltroData(novoId === 0);
    }
  }, [propProjetoId]);

  useEffect(() => {
    async function carregarListaProjetos() {
      try {
        const res = await api.get('/projetos_scrum');
        if (Array.isArray(res.data)) {
          setProjetosLista(res.data);
        }
      } catch (err) {
        console.warn('Não foi possível carregar lista de projetos para filtro:', err);
      }
    }
    if (!propProjetoId || Number(propProjetoId) === 0) {
      carregarListaProjetos();
    }
  }, [propProjetoId]);

  function calcularRitmoStatus(total, finalizadas, startDate, idealEndDate) {
    if (total === 0) {
      return {
        label: 'Sem Dados',
        variant: 'secondary',
        descricao: 'Nenhuma sprint encontrada para o escopo selecionado'
      };
    }

    if (finalizadas >= total) {
      return {
        label: 'Concluído',
        variant: 'success',
        descricao: 'Todas as sprints do escopo foram entregues'
      };
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (startDate && hoje.getTime() < startDate.getTime()) {
      return {
        label: 'Planejado',
        variant: 'secondary',
        descricao: 'Sprints planejadas ainda não iniciadas'
      };
    }

    if (idealEndDate && hoje.getTime() > idealEndDate.getTime()) {
      return {
        label: 'Atrasado',
        variant: 'destructive',
        descricao: 'Prazo programado da sprint ultrapassado'
      };
    }

    if (startDate && idealEndDate && idealEndDate.getTime() > startDate.getTime()) {
      const progressoTempo =
        (hoje.getTime() - startDate.getTime()) / (idealEndDate.getTime() - startDate.getTime());
      const idealRestante = total * (1 - progressoTempo);
      const pendentes = total - finalizadas;

      if (pendentes <= idealRestante) {
        return {
          label: 'No Prazo',
          variant: 'success',
          descricao: 'Ritmo de entregas dentro do esperado'
        };
      } else if (pendentes <= idealRestante + Math.ceil(total * 0.15)) {
        return {
          label: 'Atenção',
          variant: 'warning',
          descricao: 'Pequena divergência em relação ao ritmo ideal'
        };
      } else {
        return {
          label: 'Atrasado',
          variant: 'destructive',
          descricao: 'Entregas abaixo do ritmo planejado'
        };
      }
    }

    return {
      label: 'Em Andamento',
      variant: 'default',
      descricao: 'Sprint ativa em progresso'
    };
  }

  function construirPontosBurndown( datasInicioConvertidas, datasIdealConvertidas, datasRealConvertidas ) {
    const totalTarefas = datasIdealConvertidas.length;
    if (totalTarefas === 0) {
      return [];
    }

    const sortedInicios = [...datasInicioConvertidas].sort((a, b) => a.getTime() - b.getTime());
    const sortedIdeal = [...datasIdealConvertidas].sort((a, b) => a.getTime() - b.getTime());
    const sortedReal = [...datasRealConvertidas].sort((a, b) => a.getTime() - b.getTime());

    // Data inicial do gráfico: menor data entre início da sprint (BS_DATA_SPRINT), entrega ideal ou entrega real
    const candidatosInicio = [
      sortedInicios[0],
      sortedIdeal[0],
      sortedReal[0],
    ].filter((d) => d && !isNaN(d.getTime()));

    let startDate =
      candidatosInicio.length > 0
        ? new Date(Math.min(...candidatosInicio.map((d) => d.getTime())))
        : new Date();
    startDate.setHours(0, 0, 0, 0);

    // Data final ideal: maior data de entrega programada (BS_DATA_ENT_PROG)
    let idealEndDate = sortedIdeal[sortedIdeal.length - 1]
      ? new Date(sortedIdeal[sortedIdeal.length - 1])
      : new Date(startDate);
    idealEndDate.setHours(0, 0, 0, 0);

    if (idealEndDate.getTime() <= startDate.getTime()) {
      idealEndDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
    }

    // Se houve entregas reais após o prazo ideal, estende o eixo X até a maior entrega real
    const maxRealDate = sortedReal.length > 0 ? sortedReal[sortedReal.length - 1] : null;
    let chartEndDate = new Date(idealEndDate);
    if (maxRealDate && maxRealDate.getTime() > chartEndDate.getTime()) {
      chartEndDate = new Date(maxRealDate);
    }

    const startMs = startDate.getTime();
    const idealEndMs = idealEndDate.getTime();
    const idealDuration = Math.max(24 * 60 * 60 * 1000, idealEndMs - startMs);
    const totalChartDuration = Math.max(24 * 60 * 60 * 1000, chartEndDate.getTime() - startMs);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const diffDays = Math.max(1, Math.round(totalChartDuration / (1000 * 60 * 60 * 24)));
    const stepDays = diffDays > 60 ? Math.ceil(diffDays / 40) : 1;

    // Até onde a linha Real deve ser plotada:
    // Se todas as tarefas já foram concluídas, plota até a data da última conclusão (ou fim do gráfico);
    // Caso contrário, plota até hoje (ou até a maior data real concluída).
    const todasConcluidas = sortedReal.length >= totalTarefas;
    const cutoffMs = todasConcluidas
      ? Math.max(maxRealDate ? maxRealDate.getTime() : hoje.getTime(), idealEndMs)
      : Math.max(hoje.getTime(), maxRealDate ? maxRealDate.getTime() : 0);

    const pontos = [];

    // Se já houve entregas no próprio primeiro dia (startDate), adiciona um ponto inicial de partida ("Início") com o escopo cheio
    const concluidasNoPrimeiroDia = sortedReal.filter((d) => d.getTime() <= startMs).length;
    if (concluidasNoPrimeiroDia > 0) {
      pontos.push({
        data: `Início (${formataDataCurta(startDate)})`,
        dataObj: new Date(startMs - 1000),
        ideal: totalTarefas,
        real: totalTarefas,
      });
    }

    const curr = new Date(startDate);
    while (curr.getTime() <= chartEndDate.getTime()) {
      const dObj = new Date(curr);
      const currMs = dObj.getTime();

      // Linha Ideal: decréscimo linear de startDate (totalTarefas) até idealEndDate (0)
      const progress = currMs >= idealEndMs ? 1 : Math.max(0, (currMs - startMs) / idealDuration);
      const idealVal = Math.max(0, +(totalTarefas * (1 - progress)).toFixed(1));

      // Linha Real: totalTarefas menos sprints entregues até esta data
      let realVal = null;
      if (currMs <= cutoffMs) {
        const concluidasAteData = sortedReal.filter((d) => d.getTime() <= currMs).length;
        realVal = Math.max(0, totalTarefas - concluidasAteData);
      }

      pontos.push({
        data: formataDataCurta(dObj),
        dataObj: dObj,
        ideal: idealVal,
        real: realVal,
      });

      curr.setDate(curr.getDate() + stepDays);
    }

    // Garante que a data final do gráfico esteja incluída quando stepDays > 1
    if (pontos.length > 0 && pontos[pontos.length - 1].dataObj.getTime() < chartEndDate.getTime()) {
      const currMs = chartEndDate.getTime();
      const progress = currMs >= idealEndMs ? 1 : Math.max(0, (currMs - startMs) / idealDuration);
      const idealVal = Math.max(0, +(totalTarefas * (1 - progress)).toFixed(1));
      let realVal = null;
      if (currMs <= cutoffMs) {
        const concluidasAteData = sortedReal.filter((d) => d.getTime() <= currMs).length;
        realVal = Math.max(0, totalTarefas - concluidasAteData);
      }
      pontos.push({
        data: formataDataCurta(chartEndDate),
        dataObj: chartEndDate,
        ideal: idealVal,
        real: realVal,
      });
    }

    return pontos;
  }

  async function fetchBurndownProjeto() {
    setCarregando(true);
    try {
      const idParam = Number(projetoSelecionado) || 0;
      const whereClauses = [];

      if (idParam > 0) {
        whereClauses.push(`BS.BS_PS = ${idParam}`);
      }

      if (usarFiltroData && dataInicial && dataFinal) {
        const sqlD1 = converteDataParaSQL(dataInicial);
        const sqlD2 = converteDataParaSQL(dataFinal);
        if (sqlD1 && sqlD2) {
          whereClauses.push(
            `(BS.BS_DATA_SPRINT BETWEEN '${sqlD1}' AND '${sqlD2}' OR BS.BS_DATA_ENT_PROG BETWEEN '${sqlD1}' AND '${sqlD2}')`
          );
        }
      }

      const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
      const sql = `SELECT BS.BS_CODIGO, BS.BS_DESCRICAO, BS.BS_DATA_SPRINT, BS.BS_DATA_ENT_PROG, BS.BS_ESTADO, BS.BS_DATA_ENT_REAL, O.ORD_CODIGO, O.ORD_DATAE, CASE WHEN BS.BS_ESTADO = 'ENTREGUE' THEN COALESCE(BS.BS_DATA_ENT_REAL, O.ORD_DATAE, BS.BS_DATA_ENT_PROG) ELSE BS.BS_DATA_ENT_REAL END AS DATA_CONCLUSAO_REAL, PS.PS_CODIGO, PS.PS_NOME, C.CLI_NOME FROM BACKLOG_SPRINT BS LEFT JOIN ORDENS O ON O.ORD_SPRINT = BS.BS_CODIGO LEFT JOIN PROJETO_SCRUM PS ON PS.PS_CODIGO = BS.BS_PS LEFT JOIN CONTRATOS CT ON CT.CONT_CODIGO = PS.PS_CONT LEFT JOIN CLIENTES C ON C.CLI_CODIGO = CT.CONT_CLI ${whereSQL} ORDER BY BS.BS_DATA_ENT_PROG, BS.BS_CODIGO`;

      const response = await api.post('/v1/dataset', { sql });
      const rows = normalizarDataset(response.data);

      // Deduplica por BS_CODIGO caso haja mais de uma OS vinculada à mesma sprint
      const mapaSprints = new Map();
      rows.forEach((r) => {
        const codigo = Number(r.BS_CODIGO ?? r.bs_codigo ?? 0);
        if (!codigo) return;

        const estado = String(r.BS_ESTADO ?? r.bs_estado ?? '').trim().toUpperCase();
        const dtInicio = converteStringParaData(r.BS_DATA_SPRINT ?? r.bs_data_sprint);
        const dtIdeal = converteStringParaData(r.BS_DATA_ENT_PROG ?? r.bs_data_ent_prog);
        const dtRealResolvida = converteStringParaData(
          r.DATA_CONCLUSAO_REAL ??
            r.data_conclusao_real ??
            r.BS_DATA_ENT_REAL ??
            r.bs_data_ent_real ??
            (estado === 'ENTREGUE' ? (r.ORD_DATAE ?? r.ord_datae ?? r.BS_DATA_ENT_PROG ?? r.bs_data_ent_prog) : null)
        );

        const item = {
          codigo,
          descricao: r.BS_DESCRICAO ?? r.bs_descricao ?? `Sprint #${codigo}`,
          estado: estado || 'A FAZER',
          dataInicio: dtInicio,
          dataIdeal: dtIdeal,
          dataReal: estado === 'ENTREGUE' ? (dtRealResolvida || dtIdeal || dtInicio) : dtRealResolvida,
          entregue: estado === 'ENTREGUE' || Boolean(dtRealResolvida),
          ordem: Number(r.ORD_CODIGO ?? r.ord_codigo ?? 0),
          ps_codigo: Number(r.PS_CODIGO ?? r.ps_codigo ?? idParam),
          cli_nome: r.CLI_NOME ?? r.cli_nome ?? initialCliente ?? '',
        };

        if (!mapaSprints.has(codigo)) {
          mapaSprints.set(codigo, item);
        } else {
          const existente = mapaSprints.get(codigo);
          if (!existente.dataReal && item.dataReal) {
            mapaSprints.set(codigo, item);
          }
        }
      });

      const listaSprints = Array.from(mapaSprints.values());
      setSprintsDetalhe(listaSprints);

      const datasInicioConvertidas = listaSprints
        .map((s) => s.dataInicio || s.dataIdeal)
        .filter((d) => d && !isNaN(d.getTime()));

      const datasIdealConvertidas = listaSprints
        .map((s) => s.dataIdeal || s.dataInicio)
        .filter((d) => d && !isNaN(d.getTime()));

      const datasRealConvertidas = listaSprints
        .filter((s) => s.entregue && s.dataReal && !isNaN(s.dataReal.getTime()))
        .map((s) => s.dataReal);

      const totalOco = listaSprints.length;
      const totalFin = datasRealConvertidas.length;
      const pendentes = Math.max(0, totalOco - totalFin);

      setTotalOcorrencias(totalOco);
      setTotalDatasFinalizadas(totalFin);
      setItensPendentes(pendentes);

      const sortedInicios = [...datasInicioConvertidas].sort((a, b) => a.getTime() - b.getTime());
      const sortedIdeal = [...datasIdealConvertidas].sort((a, b) => a.getTime() - b.getTime());
      const sDate = sortedInicios[0] || sortedIdeal[0] || dataInicial;
      const eDate = sortedIdeal[sortedIdeal.length - 1] || dataFinal;

      setStatusInfo(calcularRitmoStatus(totalOco, totalFin, sDate, eDate));

      const pontosGrafico = construirPontosBurndown(
        datasInicioConvertidas,
        datasIdealConvertidas,
        datasRealConvertidas
      );
      setDadosFinal(pontosGrafico);
    } catch (error) {
      console.error('Erro ao buscar dados do Burndown:', error);
      setStatusInfo({
        label: 'Erro',
        variant: 'destructive',
        descricao: 'Falha ao carregar dados do servidor'
      });
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    fetchBurndownProjeto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projetoSelecionado, usarFiltroData, dataInicial, dataFinal]);

  const nomeClienteExibicao = useMemo(() => {
    if (initialCliente && Number(projetoSelecionado) === Number(initialProjetoId)) {
      return initialCliente;
    }
    const proj = projetosLista.find((p) => Number(p.ps_codigo) === Number(projetoSelecionado));
    return proj?.cli_nome || '';
  }, [initialCliente, initialProjetoId, projetoSelecionado, projetosLista]);

  function renderEstadoSprintBadge(estado) {
    const upper = String(estado || '').toUpperCase();
    if (upper === 'ENTREGUE' || upper === 'CONCLUIDO' || upper === 'CONCLUÍDO') {
      return <Badge variant="success" dot size="sm">ENTREGUE</Badge>;
    }
    if (upper === 'REVISAO' || upper === 'REVISÃO') {
      return <Badge variant="destructive" dot size="sm">{estado}</Badge>;
    }
    if (upper === 'EM ANDAMENTO' || upper === 'ANDAMENTO') {
      return <Badge variant="indigo" dot size="sm">{estado}</Badge>;
    }
    return <Badge variant="warning" dot size="sm">{estado || 'A FAZER'}</Badge>;
  }

  return (
    <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Gráfico Burndown
              </h3>
              {Number(projetoSelecionado) > 0 ? (
                <Badge variant="outline" size="sm" className="font-mono">
                  Projeto #{projetoSelecionado}
                </Badge>
              ) : (
                <Badge variant="secondary" size="sm">
                  Visão Geral
                </Badge>
              )}
              {nomeClienteExibicao && (
                <Badge variant="indigo" size="sm">
                  {nomeClienteExibicao}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Acompanhe a evolução do escopo ideal versus entregas reais das sprints
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros Inteligente */}
      <div className="flex flex-wrap items-end justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <div className="flex flex-wrap items-end gap-3 flex-1">
          {/* Seletor de Projeto quando aberto no modo Geral */}
          {(!propProjetoId || Number(propProjetoId) === 0) && projetosLista.length > 0 && (
            <div className="flex flex-col gap-1 min-w-[220px] flex-1 sm:flex-initial">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-indigo-500" />
                Projeto Scrum
              </label>
              <Select
                value={projetoSelecionado}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setProjetoSelecionado(val);
                  setUsarFiltroData(val === 0);
                }}
                className="h-9 py-1 text-xs"
              >
                <option value={0}>Todos os Projetos</option>
                {projetosLista.map((p) => (
                  <option key={p.ps_codigo} value={p.ps_codigo}>
                    #{p.ps_codigo} - {p.cli_nome}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {/* Checkbox para ativar/desativar filtro de período */}
          <div className="flex items-center gap-2 h-9 px-2">
            <input
              id="toggleFiltroPeriodoBurndown"
              type="checkbox"
              checked={usarFiltroData}
              onChange={(e) => setUsarFiltroData(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900 cursor-pointer"
            />
            <label
              htmlFor="toggleFiltroPeriodoBurndown"
              className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
            >
              Filtrar por período
            </label>
          </div>

          {usarFiltroData && (
            <>
              <div className="flex flex-col gap-1 min-w-[140px]">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-500" />
                  Data Inicial
                </label>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  locale="pt-BR"
                  selected={dataInicial}
                  onChange={(d) => d && setDataInicial(d)}
                  className="flex h-8 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100"
                  wrapperClassName="w-full"
                />
              </div>

              <div className="flex flex-col gap-1 min-w-[140px]">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-500" />
                  Data Final
                </label>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  locale="pt-BR"
                  selected={dataFinal}
                  onChange={(d) => d && setDataFinal(d)}
                  className="flex h-8 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-900 dark:text-slate-100"
                  wrapperClassName="w-full"
                />
              </div>
            </>
          )}
        </div>

        {!usarFiltroData && Number(projetoSelecionado) > 0 && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            Exibindo todo o histórico de sprints do projeto #{projetoSelecionado}
          </span>
        )}
      </div>

      {/* Cards de KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Escopo Total */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Escopo Total
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {totalOcorrencias}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Total de sprints planejadas
            </p>
          </div>
        </div>

        {/* Entregas Realizadas */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sprints Finalizadas
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {totalDatasFinalizadas}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {totalOcorrencias > 0
                ? `${Math.round((totalDatasFinalizadas / totalOcorrencias) * 100)}% concluído`
                : '0% concluído'}
            </p>
          </div>
        </div>

        {/* Itens Pendentes */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sprints Pendentes
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">
              {itensPendentes}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Restantes no escopo
            </p>
          </div>
        </div>

        {/* Ritmo / Status */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Ritmo / Status
            </span>
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center mt-0.5 mb-1">
              <Badge variant={statusInfo.variant} size="md">
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1" title={statusInfo.descricao}>
              {statusInfo.descricao}
            </p>
          </div>
        </div>
      </div>

      {/* Exibição do Gráfico / Loading */}
      <div className="rounded-xl bg-white dark:bg-slate-900/50 p-3 sm:p-4 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Progresso do Escopo (Ideal vs Real)
            </span>
          </div>
        </div>

        {carregando ? (
          <div className="flex flex-col items-center justify-center h-[340px] gap-3 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium">Aguarde, calculando e carregando burndown...</span>
          </div>
        ) : (
          <Graficos dados={dadosfinal} />
        )}
      </div>

      {/* Resumo / Lista de Sprints e Datas de Conclusão */}
      {!carregando && sprintsDetalhe.length > 0 && (
        <div className="rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Detalhamento das Sprints ({sprintsDetalhe.length})
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {totalDatasFinalizadas} concluída(s) · {itensPendentes} pendente(s)
            </span>
          </div>
          <div className="overflow-x-auto max-h-[240px] overflow-y-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/60 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 sticky top-0">
                <tr>
                  <th className="py-2 px-3 font-semibold">Sprint</th>
                  {Number(projetoSelecionado) === 0 && (
                    <th className="py-2 px-3 font-semibold">Cliente / Projeto</th>
                  )}
                  <th className="py-2 px-3 font-semibold">Início</th>
                  <th className="py-2 px-3 font-semibold">Meta Programada</th>
                  <th className="py-2 px-3 font-semibold">Conclusão Real</th>
                  <th className="py-2 px-3 font-semibold">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs">
                {sprintsDetalhe.map((sp) => {
                  const entregueComAtraso =
                    sp.entregue &&
                    sp.dataReal &&
                    sp.dataIdeal &&
                    sp.dataReal.getTime() > sp.dataIdeal.getTime();
                  return (
                    <tr
                      key={sp.codigo}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-semibold text-slate-400">
                            #{sp.codigo}
                          </span>
                          <span className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                            {sp.descricao}
                          </span>
                        </div>
                      </td>
                      {Number(projetoSelecionado) === 0 && (
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                          {sp.cli_nome ? `${sp.cli_nome} (#${sp.ps_codigo})` : `#${sp.ps_codigo}`}
                        </td>
                      )}
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {converteDataParaString(sp.dataInicio)}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {converteDataParaString(sp.dataIdeal)}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] whitespace-nowrap">
                        {sp.entregue && sp.dataReal ? (
                          <span
                            className={
                              entregueComAtraso
                                ? 'text-amber-600 dark:text-amber-400 font-semibold'
                                : 'text-emerald-600 dark:text-emerald-400 font-semibold'
                            }
                          >
                            {converteDataParaString(sp.dataReal)}
                            {entregueComAtraso ? ' (após prazo)' : ''}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">Pendente</span>
                        )}
                      </td>
                      <td className="py-2 px-3">{renderEstadoSprintBadge(sp.estado)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Burndown;
