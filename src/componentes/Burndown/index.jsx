import React, { useEffect, useState } from 'react';
import {
  TrendingDown,
  Loader2,
  CheckCircle2,
  Clock,
  Activity,
  Target,
  BarChart3
} from 'lucide-react';
import api from '../../services/api';
import Graficos from '../Graficos';
import FiltroData from '../FiltroData';
import Badge from '../Badge';

function Burndown({ projeto_id }) {
  const [carregando, setCarregando] = useState(false);
  const [dadosfinal, setDadosFinal] = useState([]);
  const [dataInicial, setDataInicial] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());

  const [totalOcorrencias, setTotalOcorrencias] = useState(0);
  const [totalDatasFinalizadas, setTotalDatasFinalizadas] = useState(0);
  const [itensPendentes, setItensPendentes] = useState(0);
  const [statusInfo, setStatusInfo] = useState({
    label: 'Sem Dados',
    variant: 'secondary',
    descricao: 'Carregando dados da sprint...'
  });

  function converteStringParaData(dataString) {
    if (!dataString || dataString === '0' || dataString === '') {
      return null;
    }
    if (dataString instanceof Date) {
      return isNaN(dataString.getTime()) ? null : dataString;
    }
    if (typeof dataString === 'string') {
      // Formato YYYY-MM-DD ou ISO
      if (dataString.length >= 10 && dataString[4] === '-' && dataString[7] === '-') {
        const ano = parseInt(dataString.substring(0, 4), 10);
        const mes = parseInt(dataString.substring(5, 7), 10) - 1;
        const dia = parseInt(dataString.substring(8, 10), 10);
        const data = new Date(ano, mes, dia);
        data.setHours(0, 0, 0, 0);
        return isNaN(data.getTime()) ? null : data;
      }
      // Formato DD/MM/YYYY
      if (dataString.length >= 10 && dataString[2] === '/' && dataString[5] === '/') {
        const dia = parseInt(dataString.substring(0, 2), 10);
        const mes = parseInt(dataString.substring(3, 5), 10) - 1;
        const ano = parseInt(dataString.substring(6, 10), 10);
        const data = new Date(ano, mes, dia);
        data.setHours(0, 0, 0, 0);
        return isNaN(data.getTime()) ? null : data;
      }
      const data = new Date(dataString);
      if (!isNaN(data.getTime())) {
        data.setHours(0, 0, 0, 0);
        return data;
      }
    }
    return null;
  }

  function converteDatas(listaDatas) {
    if (!Array.isArray(listaDatas)) return [];
    const retorno = [];
    for (let i = 0; i < listaDatas.length; i++) {
      const d = converteStringParaData(listaDatas[i]);
      if (d) retorno.push(d);
    }
    return retorno;
  }

  function converteDataParaString(data) {
    if (!data || isNaN(data.getTime())) return '';
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear().toString();
    return `${dia}/${mes}/${ano}`;
  }

  function formataDataCurta(data) {
    if (!data || isNaN(data.getTime())) return '';
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`;
  }

  function proximosDias(data, dias) {
    if (data && !isNaN(data.getTime())) {
      return new Date(data.getTime() + dias * 86400000);
    }
    return null;
  }

  function maiorData(datas) {
    if (!datas || datas.length === 0) return null;
    let retorno = datas[0];
    for (let i = 1; i < datas.length; i++) {
      if (retorno && datas[i] && retorno.getTime() < datas[i].getTime()) {
        retorno = datas[i];
      }
    }
    return retorno;
  }

  function menorData(datas) {
    if (!datas || datas.length === 0) return null;
    let retorno = datas[0];
    for (let i = 1; i < datas.length; i++) {
      if (retorno && datas[i] && retorno.getTime() > datas[i].getTime()) {
        retorno = datas[i];
      }
    }
    return retorno;
  }

  function calculateDateDiff(start, end) {
    if (!start || !end) return 0;
    return Math.abs(end.getTime() - start.getTime()) / 86400000;
  }

  function listaDatasString(lista) {
    if (!Array.isArray(lista)) return [];
    return lista
      .filter((d) => d != null && !isNaN(d.getTime()))
      .map((d) => converteDataParaString(d));
  }

  function calcularRitmoStatus(total, finalizadas, startDate, endDate) {
    if (total === 0) {
      return {
        label: 'Sem Dados',
        variant: 'secondary',
        descricao: 'Nenhuma tarefa cadastrada no período'
      };
    }

    if (finalizadas >= total) {
      return {
        label: 'Concluído',
        variant: 'success',
        descricao: 'Todas as tarefas foram entregues'
      };
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (startDate && hoje.getTime() < startDate.getTime()) {
      return {
        label: 'Planejado',
        variant: 'secondary',
        descricao: 'Sprint ainda não iniciada'
      };
    }

    if (endDate && hoje.getTime() > endDate.getTime()) {
      return {
        label: 'Atrasado',
        variant: 'destructive',
        descricao: 'Prazo final da sprint ultrapassado'
      };
    }

    if (startDate && endDate && endDate.getTime() > startDate.getTime()) {
      const progressoTempo = (hoje.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime());
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
          descricao: 'Pequena divergência do ritmo ideal'
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

  function insereDadosTabela(datasRealConvertidas, datasIdealConvertidas) {
    const totalTarefas = datasIdealConvertidas.length;
    if (totalTarefas === 0) {
      return [];
    }

    // Ordenação cronológica
    const sortedIdeal = [...datasIdealConvertidas].sort((a, b) => a.getTime() - b.getTime());
    const sortedReal = [...datasRealConvertidas].sort((a, b) => a.getTime() - b.getTime());

    let startDate = sortedIdeal[0];
    let endDate = sortedIdeal[sortedIdeal.length - 1];

    if (!startDate || isNaN(startDate.getTime())) {
      startDate = dataInicial || new Date();
    }
    if (!endDate || isNaN(endDate.getTime())) {
      endDate = dataFinal || new Date();
    }

    if (endDate.getTime() <= startDate.getTime()) {
      endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
    }

    const startMs = startDate.getTime();
    const endMs = endDate.getTime();
    const totalDuration = endMs - startMs;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const diffDays = Math.max(1, Math.round(totalDuration / (1000 * 60 * 60 * 24)));
    const stepDays = diffDays > 60 ? Math.ceil(diffDays / 40) : 1;

    const maxRealDate = sortedReal.length > 0 ? sortedReal[sortedReal.length - 1] : null;
    const cutoffMs = Math.max(hoje.getTime(), maxRealDate ? maxRealDate.getTime() : 0);

    const pontos = [];
    const curr = new Date(startDate);

    while (curr.getTime() <= endDate.getTime()) {
      const dObj = new Date(curr);
      const currMs = dObj.getTime();

      // Linha Ideal: Decréscimo linear do totalTarefas até 0
      const progress = totalDuration > 0 ? (currMs - startMs) / totalDuration : 1;
      const idealVal = Math.max(0, +(totalTarefas * (1 - progress)).toFixed(1));

      // Linha Real: Total - concluídas até a data
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

    // Garante que a data final seja incluída caso tenha havido salto de dias
    if (pontos.length > 0 && pontos[pontos.length - 1].dataObj.getTime() < endDate.getTime()) {
      const currMs = endDate.getTime();
      let realVal = null;
      if (currMs <= cutoffMs) {
        const concluidasAteData = sortedReal.filter((d) => d.getTime() <= currMs).length;
        realVal = Math.max(0, totalTarefas - concluidasAteData);
      }
      pontos.push({
        data: formataDataCurta(endDate),
        dataObj: endDate,
        ideal: 0,
        real: realVal,
      });
    }

    return pontos;
  }

  async function fetchBurndownProjeto() {
    setCarregando(true);
    try {
      const idParam = projeto_id !== undefined && projeto_id !== null ? projeto_id : 0;
      const d1 = dataInicial instanceof Date ? dataInicial.toLocaleDateString() : dataInicial;
      const d2 = dataFinal instanceof Date ? dataFinal.toLocaleDateString() : dataFinal;

      const response = await api.get(
        `/Burndown/${idParam}?data1=${d1}&data2=${d2}`
      );
      const dados = response.data || {};
      const datasIdeal = dados?.ideais || [];
      const datasReal = dados?.reais || [];

      // Converte as datas
      const datasRealConvertidas = converteDatas(datasReal);
      const datasIdealConvertidas = converteDatas(datasIdeal);

      const totalOco = datasIdealConvertidas.length;
      const totalFin = datasRealConvertidas.length;
      const pendentes = Math.max(0, totalOco - totalFin);

      setTotalOcorrencias(totalOco);
      setTotalDatasFinalizadas(totalFin);
      setItensPendentes(pendentes);

      // Ordenação para cálculo de status
      const sortedIdeal = [...datasIdealConvertidas].sort((a, b) => a.getTime() - b.getTime());
      const sDate = sortedIdeal[0] || dataInicial;
      const eDate = sortedIdeal[sortedIdeal.length - 1] || dataFinal;

      setStatusInfo(calcularRitmoStatus(totalOco, totalFin, sDate, eDate));

      // Monta os pontos do gráfico
      const pontosGrafico = insereDadosTabela(datasRealConvertidas, datasIdealConvertidas);
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
  }, [dataInicial, dataFinal, projeto_id]);

  return (
    <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Gráfico Burndown
              </h3>
              {projeto_id !== undefined && projeto_id !== 0 && (
                <Badge variant="outline" size="sm" className="font-mono">
                  Projeto #{projeto_id}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Acompanhe a evolução do escopo ideal versus real da sprint
            </p>
          </div>
        </div>
      </div>

      {/* Filtro de datas */}
      <FiltroData dataInic={setDataInicial} dataFin={setDataFinal} ocutarBuscaClientes />

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
              Total de itens planejados
            </p>
          </div>
        </div>

        {/* Entregas Realizadas */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Entregas Realizadas
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
              Itens Pendentes
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
              Tarefas restantes no escopo
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
              Progresso do Escopo
            </span>
          </div>
        </div>

        {carregando ? (
          <div className="flex flex-col items-center justify-center h-[380px] gap-3 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium">Aguarde, calculando e carregando burndown...</span>
          </div>
        ) : (
          <Graficos dados={dadosfinal} />
        )}
      </div>
    </div>
  );
}

export default Burndown;