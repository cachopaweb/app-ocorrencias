import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Filter,
  Calendar,
  Users,
  FileCheck,
  RefreshCw,
  PieChart as PieChartIcon,
  BarChart3,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  GitBranch,
  CalendarDays,
  HelpCircle,
  Inbox,
  Loader2,
  ChevronDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

import api from '../../services/api';
import DatePicker from '../../componentes/DatePicker';
import { Button } from '../../componentes/Button';
import { Select } from '../../componentes/Input';
import Badge from '../../componentes/Badge';

// Cores para os gráficos de tipos de ocorrências
const TIPO_COLORS = {
  'ERRO DE SISTEMA': '#f43f5e',      // Rose
  'ERRO DE USUARIO': '#f59e0b',      // Amber
  'IMPLEMENTACAO NOVA': '#6366f1',   // Indigo
  'DUVIDA USUARIO': '#10b981',       // Emerald
  'LIGAÇÃO DE ROTINA': '#8b5cf6',    // Purple
  'LIGACAO DE ROTINA': '#8b5cf6',
  'OUTROS': '#06b6d4',               // Cyan
  'NÃO INFORMADO': '#94a3b8'        // Slate
};

const DEFAULT_COLOR = '#6366f1';

// Função utilitária para converter strings variadas em objeto Date válido
function parseData(dateVal) {
  if (!dateVal || dateVal === '0' || dateVal === '') return null;
  if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? null : dateVal;

  if (typeof dateVal === 'string') {
    const s = dateVal.trim();
    // Formato YYYY-MM-DD ou ISO
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
      const parts = s.substring(0, 10).split('-');
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return isNaN(d.getTime()) ? null : d;
    }
    // Formato DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}/.test(s)) {
      const parts = s.substring(0, 10).split('/');
      const d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
      return isNaN(d.getTime()) ? null : d;
    }
    const parsed = new Date(s);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

// Formatar Date para DD/MM/YYYY
function formatarData(dateVal) {
  const d = parseData(dateVal);
  if (!d) return '-';
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Formatar minutos em string legível (ex: "45 min" ou "1h 30m")
function formatarTempo(minutos) {
  if (!minutos || minutos <= 0) return '0 min';
  if (minutos < 60) return `${Math.round(minutos)} min`;
  const horas = Math.floor(minutos / 60);
  const rest = Math.round(minutos % 60);
  return rest > 0 ? `${horas}h ${rest}m` : `${horas}h`;
}

// Custom Tooltip Recharts para manter a estética do sistema
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-sm text-white p-3 rounded-xl shadow-xl border border-slate-700/80 text-xs flex flex-col gap-1.5 min-w-[170px] z-50">
        {label && (
          <div className="font-semibold text-slate-200 border-b border-slate-700/60 pb-1 mb-0.5">
            {label}
          </div>
        )}
        {payload.map((entry, index) => {
          if (entry.value === null || entry.value === undefined) return null;
          return (
            <div key={`tooltip-item-${index}`} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                  style={{ backgroundColor: entry.color || entry.stroke || entry.fill || DEFAULT_COLOR }}
                />
                <span className="truncate max-w-[120px]">{entry.name}:</span>
              </span>
              <span className="font-mono font-bold text-white tabular-nums">
                {entry.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

// Componente de Card de KPI do Topo
function KpiCard({ titulo, valor, subtexto, icone: Icon, corIcone = "text-indigo-600 dark:text-indigo-400", corBg = "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-900/40", onClick, ativo = false }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 sm:p-5 transition-all bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-indigo-400/80 dark:hover:border-indigo-600' : ''
      } ${ativo ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-200/80 dark:border-slate-800/80'}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {titulo}
        </span>
        <div className={`p-2.5 rounded-xl border ${corBg} ${corIcone} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-mono tabular-nums">
          {valor}
        </div>
        {subtexto && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {subtexto}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DashboardOcorrencias() {
  const history = useHistory();

  // Estados dos filtros
  const [periodoPreset, setPeriodoPreset] = useState('30d');
  const [dataInicial, setDataInicial] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [dataFinal, setDataFinal] = useState(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  });
  const [clienteFiltro, setClienteFiltro] = useState('TODOS');
  const [statusFiltro, setStatusFiltro] = useState('TODOS'); // 'TODOS', 'ABERTAS', 'FINALIZADAS', 'GEROU_OS', 'SEM_OS', 'SEM_ATENDENTE'
  const [visaoOperacional, setVisaoOperacional] = useState('conversao'); // 'conversao' | 'dias'

  // Dados brutos da API
  const [ocorrenciasAbertas, setOcorrenciasAbertas] = useState([]);
  const [ocorrenciasFinalizadas, setOcorrenciasFinalizadas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  // Carregar lista de clientes para o filtro
  const carregarClientes = useCallback(async () => {
    try {
      const resp = await api.get('/Clientes');
      setClientes(resp.data || []);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
    }
  }, []);

  // Carregar ocorrências da API
  const carregarDados = useCallback(async () => {
    setAtualizando(true);
    try {
      const [respAbertas, respFinalizadas] = await Promise.allSettled([
        api.get('/Ocorrencias'),
        api.get('/OcorrenciasFinalizadas')
      ]);

      if (respAbertas.status === 'fulfilled' && Array.isArray(respAbertas.value.data)) {
        setOcorrenciasAbertas(respAbertas.value.data);
      } else {
        setOcorrenciasAbertas([]);
      }

      if (respFinalizadas.status === 'fulfilled' && Array.isArray(respFinalizadas.value.data)) {
        setOcorrenciasFinalizadas(respFinalizadas.value.data);
      } else {
        setOcorrenciasFinalizadas([]);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregarClientes();
    carregarDados();
  }, [carregarClientes, carregarDados]);

  // Manipular predefinições de período
  const handlePresetChange = (preset) => {
    setPeriodoPreset(preset);
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);

    if (preset === 'hoje') {
      const dInic = new Date();
      dInic.setHours(0, 0, 0, 0);
      setDataInicial(dInic);
      setDataFinal(hoje);
    } else if (preset === '7d') {
      const dInic = new Date();
      dInic.setDate(dInic.getDate() - 7);
      dInic.setHours(0, 0, 0, 0);
      setDataInicial(dInic);
      setDataFinal(hoje);
    } else if (preset === '30d') {
      const dInic = new Date();
      dInic.setDate(dInic.getDate() - 30);
      dInic.setHours(0, 0, 0, 0);
      setDataInicial(dInic);
      setDataFinal(hoje);
    } else if (preset === 'mes') {
      const dInic = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      dInic.setHours(0, 0, 0, 0);
      setDataInicial(dInic);
      setDataFinal(hoje);
    } else if (preset === 'ano') {
      const dInic = new Date(hoje.getFullYear(), 0, 1);
      dInic.setHours(0, 0, 0, 0);
      setDataInicial(dInic);
      setDataFinal(hoje);
    } else if (preset === 'todos') {
      const dInic = new Date(2020, 0, 1);
      setDataInicial(dInic);
      setDataFinal(hoje);
    }
  };

  // Normalização e unificação das ocorrências com status claro
  const todasOcorrencias = useMemo(() => {
    const abertasNorm = ocorrenciasAbertas.map((o) => ({
      ...o,
      status: 'ABERTA',
      isFinalizada: false,
      parsedDate: parseData(o.data),
      tipoNormalizado: (o.ocorrencia || 'OUTROS').trim().toUpperCase(),
      tempoAtend: Number(o.tempoAtendimento || 0),
      gerouOS: String(o.abriuOS).toUpperCase() === 'SIM'
    }));

    const finalizadasNorm = ocorrenciasFinalizadas.map((o) => ({
      ...o,
      status: 'FINALIZADA',
      isFinalizada: true,
      parsedDate: parseData(o.data),
      tipoNormalizado: (o.ocorrencia || 'OUTROS').trim().toUpperCase(),
      tempoAtend: Number(o.tempoAtendimento || 0),
      gerouOS: String(o.abriuOS).toUpperCase() === 'SIM'
    }));

    return [...abertasNorm, ...finalizadasNorm];
  }, [ocorrenciasAbertas, ocorrenciasFinalizadas]);

  // Aplicar filtros de data e cliente
  const ocorrenciasFiltradas = useMemo(() => {
    return todasOcorrencias.filter((o) => {
      // Filtro de data
      if (o.parsedDate) {
        if (dataInicial && o.parsedDate < dataInicial) return false;
        if (dataFinal && o.parsedDate > dataFinal) return false;
      }

      // Filtro de cliente
      if (clienteFiltro !== 'TODOS') {
        const contratoStr = String(o.contrato || '').trim();
        const filtroStr = String(clienteFiltro).trim();
        if (contratoStr !== filtroStr) return false;
      }

      return true;
    });
  }, [todasOcorrencias, dataInicial, dataFinal, clienteFiltro]);

  // Cálculos de KPIs consolidados
  const kpis = useMemo(() => {
    const total = ocorrenciasFiltradas.length;
    const abertas = ocorrenciasFiltradas.filter((o) => !o.isFinalizada).length;
    const semAtendente = ocorrenciasFiltradas.filter((o) => !o.isFinalizada && (!o.atendente || o.atendente === 0)).length;
    const finalizadas = ocorrenciasFiltradas.filter((o) => o.isFinalizada).length;
    const geraramOS = ocorrenciasFiltradas.filter((o) => o.gerouOS).length;
    const resolvidasDireto = ocorrenciasFiltradas.filter((o) => o.isFinalizada && !o.gerouOS).length;

    const taxaResolucao = total > 0 ? ((finalizadas / total) * 100).toFixed(1) : '0.0';
    const taxaOS = total > 0 ? ((geraramOS / total) * 100).toFixed(1) : '0.0';
    const taxaRetencaoSuporte = finalizadas > 0 
      ? ((resolvidasDireto / finalizadas) * 100).toFixed(1) 
      : '0.0';

    return {
      total,
      abertas,
      semAtendente,
      finalizadas,
      geraramOS,
      resolvidasDireto,
      taxaResolucao,
      taxaOS,
      taxaRetencaoSuporte
    };
  }, [ocorrenciasFiltradas]);

  // Agrupamento para Gráfico de Rosca: Tipos de Ocorrência
  const dadosTiposOcorrencia = useMemo(() => {
    const mapa = {};
    ocorrenciasFiltradas.forEach((o) => {
      const tipo = o.tipoNormalizado || 'OUTROS';
      mapa[tipo] = (mapa[tipo] || 0) + 1;
    });

    const total = ocorrenciasFiltradas.length;
    const items = Object.entries(mapa).map(([nome, valor]) => {
      const percentual = total > 0 ? ((valor / total) * 100).toFixed(1) : 0;
      return {
        name: nome,
        value: valor,
        percentual: Number(percentual),
        color: TIPO_COLORS[nome] || DEFAULT_COLOR
      };
    });

    // Ordenar decrescente
    return items.sort((a, b) => b.value - a.value);
  }, [ocorrenciasFiltradas]);

  // Agrupamento para Gráfico Temporal (Tendência)
  const dadosEvolucaoTemporal = useMemo(() => {
    const mapa = {};

    ocorrenciasFiltradas.forEach((o) => {
      if (!o.parsedDate) return;
      const chave = formatarData(o.parsedDate);

      if (!mapa[chave]) {
        mapa[chave] = {
          data: chave,
          timestamp: o.parsedDate.getTime(),
          total: 0,
          finalizadas: 0,
          abertas: 0,
          gerouOS: 0
        };
      }

      mapa[chave].total += 1;
      if (o.isFinalizada) {
        mapa[chave].finalizadas += 1;
      } else {
        mapa[chave].abertas += 1;
      }
      if (o.gerouOS) {
        mapa[chave].gerouOS += 1;
      }
    });

    return Object.values(mapa).sort((a, b) => a.timestamp - b.timestamp);
  }, [ocorrenciasFiltradas]);

  // Agrupamento para Gráfico: Top Clientes por Demanda
  const dadosTopClientes = useMemo(() => {
    const mapa = {};
    ocorrenciasFiltradas.forEach((o) => {
      const nome = o.cli_nome ? o.cli_nome.trim() : (o.contrato ? `Contrato ${o.contrato}` : 'Não Identificado');
      if (!mapa[nome]) {
        mapa[nome] = { nome, total: 0, finalizadas: 0, gerouOS: 0 };
      }
      mapa[nome].total += 1;
      if (o.isFinalizada) mapa[nome].finalizadas += 1;
      if (o.gerouOS) mapa[nome].gerouOS += 1;
    });

    return Object.values(mapa)
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [ocorrenciasFiltradas]);

  // Agrupamento de Resolução Direta vs Conversão em O.S. (Impacto em Desenvolvimento)
  const dadosConversaoOS = useMemo(() => {
    const total = ocorrenciasFiltradas.length;
    const finalizadas = ocorrenciasFiltradas.filter((o) => o.isFinalizada);
    const totalFinalizadas = finalizadas.length;

    const geraramOS = ocorrenciasFiltradas.filter((o) => o.gerouOS);
    const totalOS = geraramOS.length;
    const resolvidasSemOS = ocorrenciasFiltradas.filter((o) => o.isFinalizada && !o.gerouOS).length;

    // Motivos das ocorrências que geraram OS
    const motivosOS = {};
    geraramOS.forEach((o) => {
      const tipo = o.tipoNormalizado || 'OUTROS';
      motivosOS[tipo] = (motivosOS[tipo] || 0) + 1;
    });

    const listaMotivosOS = Object.entries(motivosOS)
      .map(([tipo, qtd]) => ({
        tipo,
        quantidade: qtd,
        percentual: totalOS > 0 ? ((qtd / totalOS) * 100).toFixed(1) : '0.0',
        cor: TIPO_COLORS[tipo] || DEFAULT_COLOR
      }))
      .sort((a, b) => b.quantidade - a.quantidade);

    const taxaRetencaoSuporte = totalFinalizadas > 0 
      ? ((resolvidasSemOS / totalFinalizadas) * 100).toFixed(1) 
      : (total > 0 ? (((total - totalOS) / total) * 100).toFixed(1) : '0.0');

    const taxaConversaoOS = total > 0 
      ? ((totalOS / total) * 100).toFixed(1) 
      : '0.0';

    return {
      total,
      totalOS,
      resolvidasSemOS,
      taxaRetencaoSuporte,
      taxaConversaoOS,
      listaMotivosOS
    };
  }, [ocorrenciasFiltradas]);

  // Agrupamento por Dia da Semana (Picos de Demanda)
  const dadosDiasSemana = useMemo(() => {
    const abreviados = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const nomesCompletos = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const contagem = [0, 0, 0, 0, 0, 0, 0];
    const finalizadas = [0, 0, 0, 0, 0, 0, 0];

    ocorrenciasFiltradas.forEach((o) => {
      if (o.parsedDate) {
        const dia = o.parsedDate.getDay();
        contagem[dia] += 1;
        if (o.isFinalizada) finalizadas[dia] += 1;
      }
    });

    // Ordenar de Segunda a Domingo (fluxo corporativo padrão)
    const ordem = [1, 2, 3, 4, 5, 6, 0];
    const lista = ordem.map((d) => ({
      dia: abreviados[d],
      nomeCompleto: nomesCompletos[d],
      total: contagem[d],
      finalizadas: finalizadas[d]
    }));

    let diaPico = lista[0];
    lista.forEach((item) => {
      if (item.total > diaPico.total) diaPico = item;
    });

    return { lista, diaPico };
  }, [ocorrenciasFiltradas]);

  // Ocorrências para exibição na lista recente (aplicando statusFiltro)
  const ocorrenciasExibicao = useMemo(() => {
    return ocorrenciasFiltradas
      .filter((o) => {
        if (statusFiltro === 'ABERTAS') return !o.isFinalizada;
        if (statusFiltro === 'FINALIZADAS') return o.isFinalizada;
        if (statusFiltro === 'GEROU_OS') return o.gerouOS;
        if (statusFiltro === 'SEM_OS') return o.isFinalizada && !o.gerouOS;
        if (statusFiltro === 'SEM_ATENDENTE') return !o.isFinalizada && (!o.atendente || o.atendente === 0);
        return true;
      })
      .sort((a, b) => {
        const tA = a.parsedDate ? a.parsedDate.getTime() : 0;
        const tB = b.parsedDate ? b.parsedDate.getTime() : 0;
        return tB - tA;
      })
      .slice(0, 15);
  }, [ocorrenciasFiltradas, statusFiltro]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 transition-colors">
      
      {/* Header com Ações e Título */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Dashboard de Ocorrências
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Visão executiva, métricas de atendimento e indicadores de qualidade
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <Button
            variant="outline"
            size="default"
            Icon={RefreshCw}
            disabled={atualizando}
            nome={atualizando ? "Atualizando..." : "Atualizar"}
            onClick={carregarDados}
            className={atualizando ? "animate-pulse" : ""}
          />
          <Button
            variant="indigo"
            size="default"
            Icon={ArrowUpRight}
            nome="Ver Lista Completa"
            onClick={() => history.push('/')}
          />
        </div>
      </div>

      {/* Barra de Filtros Interativos */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-indigo-500" />
            <span>Filtros do Painel</span>
          </div>

          {/* Presets Rápidos de Período */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'hoje', label: 'Hoje' },
              { id: '7d', label: '7 Dias' },
              { id: '30d', label: '30 Dias' },
              { id: 'mes', label: 'Este Mês' },
              { id: 'ano', label: 'Este Ano' },
              { id: 'todos', label: 'Todos' },
              { id: 'custom', label: 'Custom' }
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetChange(preset.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  periodoPreset === preset.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs de Datas e Seletor de Cliente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          {/* Data Inicial */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              Data Inicial
            </label>
            <DatePicker
              selected={dataInicial}
              onChange={(date) => {
                setDataInicial(date);
                setPeriodoPreset('custom');
              }}
              dateFormat="dd/MM/yyyy"
              className="flex h-9 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Data Final */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              Data Final
            </label>
            <DatePicker
              selected={dataFinal}
              onChange={(date) => {
                setDataFinal(date);
                setPeriodoPreset('custom');
              }}
              dateFormat="dd/MM/yyyy"
              className="flex h-9 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filtro de Cliente */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              Cliente / Contrato
            </label>
            <Select
              value={clienteFiltro}
              onChange={(e) => setClienteFiltro(e.target.value)}
              className="h-9 py-1 text-xs"
            >
              <option value="TODOS">Todos os Clientes</option>
              {clientes.map((c) => (
                <option key={c.contrato} value={c.contrato}>
                  {c.nome} ({c.contrato})
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Cards de Métricas Principais (KPIs) */}
      {carregando ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <KpiCard
            titulo="Total de Ocorrências"
            valor={kpis.total}
            subtexto={`No período filtrado`}
            icone={Layers}
            onClick={() => setStatusFiltro('TODOS')}
            ativo={statusFiltro === 'TODOS'}
            corIcone="text-indigo-600 dark:text-indigo-400"
            corBg="bg-indigo-50 dark:bg-indigo-950/60 border-indigo-100 dark:border-indigo-900/40"
          />

          <KpiCard
            titulo="Em Aberto"
            valor={kpis.abertas}
            subtexto={kpis.semAtendente > 0 ? `${kpis.semAtendente} sem atendente` : "Todas em atendimento"}
            icone={AlertCircle}
            onClick={() => setStatusFiltro(kpis.semAtendente > 0 ? 'SEM_ATENDENTE' : 'ABERTAS')}
            ativo={statusFiltro === 'ABERTAS' || statusFiltro === 'SEM_ATENDENTE'}
            corIcone="text-amber-600 dark:text-amber-400"
            corBg="bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900/40"
          />

          <KpiCard
            titulo="Finalizadas"
            valor={kpis.finalizadas}
            subtexto={`${kpis.taxaResolucao}% de taxa de resolução`}
            icone={CheckCircle2}
            onClick={() => setStatusFiltro('FINALIZADAS')}
            ativo={statusFiltro === 'FINALIZADAS'}
            corIcone="text-emerald-600 dark:text-emerald-400"
            corBg="bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-900/40"
          />

          <KpiCard
            titulo="Geraram O.S."
            valor={kpis.geraramOS}
            subtexto={`${kpis.taxaOS}% escaladas p/ dev`}
            icone={FileCheck}
            onClick={() => setStatusFiltro('GEROU_OS')}
            ativo={statusFiltro === 'GEROU_OS'}
            corIcone="text-rose-600 dark:text-rose-400"
            corBg="bg-rose-50 dark:bg-rose-950/60 border-rose-100 dark:border-rose-900/40"
          />

          <KpiCard
            titulo="Resolução Direta (N1)"
            valor={kpis.resolvidasDireto}
            subtexto={`${kpis.taxaRetencaoSuporte}% resolvidas sem gerar O.S.`}
            icone={ShieldCheck}
            onClick={() => setStatusFiltro('SEM_OS')}
            ativo={statusFiltro === 'SEM_OS'}
            corIcone="text-violet-600 dark:text-violet-400"
            corBg="bg-violet-50 dark:bg-violet-950/60 border-violet-100 dark:border-violet-900/40"
          />
        </div>
      )}

      {/* Grid de Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfico 1: Evolução Temporal de Chamados (8 colunas) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col justify-between min-h-[380px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Evolução Temporal dos Chamados
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Volume diário de ocorrências abertas, concluídas e que viraram OS
                </p>
              </div>
            </div>
          </div>

          {dadosEvolucaoTemporal.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 text-xs gap-2">
              <Inbox className="w-8 h-8 opacity-40" />
              <span>Nenhum chamado no período selecionado</span>
            </div>
          ) : (
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={dadosEvolucaoTemporal}
                  margin={{ top: 10, right: 12, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="corTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="corFinalizadas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" vertical={false} />
                  <XAxis dataKey="data" stroke="#94a3b8" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Ocorrências"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#corTotal)"
                    dot={{ r: 3, fill: '#6366f1' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="finalizadas"
                    name="Finalizadas"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#corFinalizadas)"
                    dot={{ r: 3, fill: '#10b981' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Gráfico 2: Distribuição por Tipo de Ocorrência (5 colunas) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col justify-between min-h-[380px]">
          <div className="flex items-center gap-2 mb-2">
            <PieChartIcon className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Distribuição por Categoria
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Proporção por motivo e tipo de ocorrência
              </p>
            </div>
          </div>

          {dadosTiposOcorrencia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 text-xs gap-2">
              <Inbox className="w-8 h-8 opacity-40" />
              <span>Sem dados de tipos de ocorrências</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-full h-[200px]">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={dadosTiposOcorrencia}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {dadosTiposOcorrencia.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legenda customizada com percentual */}
              <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 max-h-[110px] overflow-y-auto scrollbar-thin">
                {dadosTiposOcorrencia.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] px-1.5 py-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate text-slate-700 dark:text-slate-300 font-medium capitalize">
                        {item.name.toLowerCase()}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 shrink-0">
                      {item.percentual}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid Secundário: Top Clientes e Desempenho dos Atendentes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Clientes com mais Ocorrências (6 colunas) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Top Clientes com Mais Chamados
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Clientes com maior demanda de suporte no período
                </p>
              </div>
            </div>
          </div>

          {dadosTopClientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 text-xs gap-2">
              <Inbox className="w-8 h-8 opacity-40" />
              <span>Sem dados de clientes</span>
            </div>
          ) : (
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  layout="vertical"
                  data={dadosTopClientes}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 11 }} tickLine={false} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="nome"
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    width={110}
                    tickFormatter={(val) => (val.length > 14 ? `${val.substring(0, 14)}...` : val)}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar dataKey="total" name="Total Ocorrências" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="gerouOS" name="Virou OS" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Conversão em O.S. & Fluxo Semanal (6 colunas) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex flex-col justify-between min-h-[380px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Conversão em O.S. & Demanda
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Resolução direta vs escaladas para desenvolvimento
                </p>
              </div>
            </div>

            {/* Alternador de visualização: Conversão em OS vs Dias da Semana */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setVisaoOperacional('conversao')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  visaoOperacional === 'conversao'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Impacto em O.S.
              </button>
              <button
                type="button"
                onClick={() => setVisaoOperacional('dias')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  visaoOperacional === 'dias'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Dias da Semana
              </button>
            </div>
          </div>

          {visaoOperacional === 'conversao' ? (
            <div className="flex flex-col justify-between h-full gap-3 py-1">
              {/* Cards de Resumo da Conversão */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                  <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Suporte Direto
                  </div>
                  <div className="text-xl font-bold font-mono text-emerald-900 dark:text-emerald-100 mt-0.5">
                    {dadosConversaoOS.resolvidasSemOS}
                  </div>
                  <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                    {dadosConversaoOS.taxaRetencaoSuporte}% sem abrir O.S.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
                  <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                    Escaladas p/ Dev
                  </div>
                  <div className="text-xl font-bold font-mono text-rose-900 dark:text-rose-100 mt-0.5">
                    {dadosConversaoOS.totalOS}
                  </div>
                  <div className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-0.5">
                    {dadosConversaoOS.taxaConversaoOS}% viraram O.S.
                  </div>
                </div>
              </div>

              {/* Detalhamento dos Motivos das O.S. Geradas */}
              <div>
                <h4 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Motivos das Ordens de Serviço Abertas
                </h4>
                {dadosConversaoOS.listaMotivosOS.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                    Nenhuma ordem de serviço gerada no período
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto scrollbar-thin pr-1">
                    {dadosConversaoOS.listaMotivosOS.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 truncate">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: item.cor }}
                            />
                            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize truncate">
                              {item.tipo.toLowerCase()}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100 shrink-0">
                            {item.quantidade} OS ({item.percentual}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(item.percentual, item.quantidade > 0 ? 4 : 0)}%`,
                              backgroundColor: item.cor
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between h-full">
              <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={dadosDiasSemana.lista}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" vertical={false} />
                    <XAxis dataKey="dia" stroke="#94a3b8" tick={{ fontSize: 11 }} tickLine={false} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomChartTooltip />} />
                    <Bar dataKey="total" name="Total Chamados" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="finalizadas" name="Finalizados" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {dadosDiasSemana.diaPico && dadosDiasSemana.diaPico.total > 0 && (
                <div className="mt-2 p-2.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium">
                    <CalendarDays className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Pico de demanda semanal:</span>
                    <strong className="font-semibold">{dadosDiasSemana.diaPico.nomeCompleto}</strong>
                  </div>
                  <span className="font-mono font-bold tabular-nums">
                    {dadosDiasSemana.diaPico.total} chamados
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabela de Ocorrências Recentes do Período */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Últimas Ocorrências Registradas
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Listagem detalhada das ocorrências filtradas (exibindo até 15 registros)
              </p>
            </div>
          </div>

          {/* Filtro de Status Rápido na Tabela */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto">
            {[
              { id: 'TODOS', label: 'Todas' },
              { id: 'ABERTAS', label: 'Em Aberto' },
              { id: 'FINALIZADAS', label: 'Finalizadas' },
              { id: 'SEM_OS', label: 'Resolvidas Direto' },
              { id: 'GEROU_OS', label: 'Virou O.S.' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFiltro(st.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  statusFiltro === st.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {ocorrenciasExibicao.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500 text-xs gap-2">
            <Inbox className="w-8 h-8 opacity-40" />
            <span>Nenhuma ocorrência encontrada para este filtro</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Cód</th>
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">Tipo / Motivo</th>
                  <th className="py-2.5 px-3">Responsável</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Gerou O.S.?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {ocorrenciasExibicao.map((oco) => (
                  <tr
                    key={oco.codigo || Math.random()}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-600 dark:text-slate-400">
                      #{oco.codigo}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {formatarData(oco.parsedDate)}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100 max-w-[180px] truncate">
                      {oco.cli_nome || (oco.contrato ? `Contrato ${oco.contrato}` : '-')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${TIPO_COLORS[oco.tipoNormalizado] || DEFAULT_COLOR}15`,
                          color: TIPO_COLORS[oco.tipoNormalizado] || DEFAULT_COLOR
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: TIPO_COLORS[oco.tipoNormalizado] || DEFAULT_COLOR }}
                        />
                        {oco.tipoNormalizado}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 max-w-[140px] truncate">
                      {oco.fun_atendente || (oco.atendente ? `Atendente #${oco.atendente}` : (
                        <span className="text-amber-500 font-medium italic">Não atribuído</span>
                      ))}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {oco.isFinalizada ? (
                        <Badge variant="success" size="sm">Finalizada</Badge>
                      ) : oco.gerouOS ? (
                        <Badge variant="destructive" size="sm">Virou OS</Badge>
                      ) : (
                        <Badge variant="warning" size="sm">Em Aberto</Badge>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {oco.gerouOS ? (
                        <Badge variant="destructive" size="sm">Sim (O.S.)</Badge>
                      ) : (
                        <Badge variant="secondary" size="sm">Não</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
