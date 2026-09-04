import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Inbox } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-sm text-white p-3 rounded-xl shadow-xl border border-slate-700/80 text-xs flex flex-col gap-1.5 min-w-[170px]">
        <div className="font-semibold text-slate-200 border-b border-slate-700/60 pb-1 mb-0.5 flex items-center justify-between">
          <span>Data</span>
          <span className="text-white font-mono font-bold">{label}</span>
        </div>
        {payload.map((entry, index) => {
          if (entry.value === null || entry.value === undefined) return null;
          return (
            <div key={`tooltip-item-${index}`} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: entry.color || entry.stroke || '#6366f1' }}
                />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white">
                {entry.value} {entry.value === 1 ? 'item' : 'itens'}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

function Graficos({ dados }) {
  const chartData = Array.isArray(dados) ? dados : (dados?.data || []);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[380px] text-slate-400 dark:text-slate-500 text-sm">
        <Inbox className="w-8 h-8 mb-2 opacity-40" />
        <span>Nenhum dado disponível para o período selecionado</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[380px]">
      <ResponsiveContainer width="100%" height={380}>
        <AreaChart
          data={chartData}
          margin={{ top: 12, right: 16, left: -16, bottom: 4 }}
        >
          <defs>
            <linearGradient id="realGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="idealGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-slate-200 dark:stroke-slate-800"
            vertical={false}
          />

          <XAxis
            dataKey="data"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            stroke="#94a3b8"
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1', opacity: 0.5 }}
            className="text-slate-500 dark:text-slate-400"
          />

          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            stroke="#94a3b8"
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1', opacity: 0.5 }}
            className="text-slate-500 dark:text-slate-400"
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="top"
            align="center"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
          />

          <Area
            type="monotone"
            dataKey="real"
            name="Real (Restante)"
            stroke="#6366f1"
            strokeWidth={3}
            fill="url(#realGradient)"
            dot={{ r: 3, fill: '#6366f1', strokeWidth: 1 }}
            activeDot={{ r: 6, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
            connectNulls={false}
          />

          <Line
            type="linear"
            dataKey="ideal"
            name="Ideal (Planejado)"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 4, fill: '#94a3b8', stroke: '#ffffff', strokeWidth: 1 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Graficos;