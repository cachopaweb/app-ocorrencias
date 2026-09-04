import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js';

function DonutTiposOcorrencias({ data }) {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || !data.datasets) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          rectangle: {
            borderWidth: 2,
          }
        },
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            fontSize: 11
          }
        },
        title: {
          display: true,
          text: 'Ocorrências por Tipo',
          fontSize: 14,
          fontStyle: 'bold'
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <div className="relative w-full h-[300px] flex items-center justify-center">
      <canvas ref={canvasRef} id="donutUm" />
    </div>
  );
}

function DonutTiposOrdemOcorrencia({ data }) {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || !data.datasets) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          rectangle: {
            borderWidth: 2,
          }
        },
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            fontSize: 11
          }
        },
        title: {
          display: true,
          text: 'Ordens por Tipo',
          fontSize: 14,
          fontStyle: 'bold'
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <div className="relative w-full h-[300px] flex items-center justify-center">
      <canvas ref={canvasRef} id="donutDois" />
    </div>
  );
}

function Tabela({ data }) {
  const ocorrencias = data?.ocorrencias || 0;
  const ordens = data?.ordens || 0;
  const porcentagemOrdens = ocorrencias > 0 ? ((ordens / ocorrencias) * 100).toFixed(1) : '0.0';

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Quantidade</th>
            <th className="px-4 py-3">Percentual</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm font-medium">
          <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
            <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-semibold">Ocorrências</td>
            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{ocorrencias}</td>
            <td className="px-4 py-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                100%
              </span>
            </td>
          </tr>
          <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
            <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-semibold">Ordens de Serviço</td>
            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{ordens}</td>
            <td className="px-4 py-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                {porcentagemOrdens}%
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Graficos({ titulo, tipo = 'horizontalBar', data }) {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data || !data.datasets) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: tipo,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          rectangle: {
            borderWidth: 1,
          }
        },
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            fontSize: 11
          }
        },
        title: {
          display: true,
          text: titulo,
          fontSize: 14,
          fontStyle: 'bold'
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, tipo, titulo]);

  return (
    <div className="relative w-full h-[300px] flex items-center justify-center">
      <canvas ref={canvasRef} id="canvas" />
    </div>
  );
}

export { Graficos, Tabela, DonutTiposOcorrencias, DonutTiposOrdemOcorrencia };