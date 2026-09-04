import React, { useState, useEffect } from 'react';
import DatePicker from '../../componentes/DatePicker';
import { Calendar, Search, User } from 'lucide-react';
import { Button } from '../../componentes/Button';
import { Select } from '../../componentes/Input';
import api from '../../services/api';

function FiltroData({ funcSubmitted, dataInic, dataFin, setCodContrato, ocutarBuscaClientes = false }) {
  const [dataInicial, setDataInicial] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());
  const [clientes, setClientes] = useState([]);
  const [PorCliente, setPorCliente] = useState(false);

  function changeDataInicial(date) {
    setDataInicial(date);
    if (dataInic) dataInic(date);
  }

  function changeDataFinal(date) {
    setDataFinal(date);
    if (dataFin) dataFin(date);
  }

  function changeContrato(contrato) {
    if (setCodContrato) setCodContrato(contrato);
  }

  useEffect(() => {
    if (!ocutarBuscaClientes) {
      getClientes();
    }
  }, [ocutarBuscaClientes]);

  async function getClientes() {
    try {
      const response = await api.get('/Clientes');
      const data = response.data || [];
      setClientes(data);
      if (data.length > 0 && setCodContrato) {
        setCodContrato(data[0].contrato);
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  }

  return (
    <form
      onSubmit={funcSubmitted}
      className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 mb-4"
    >
      <div className="flex flex-wrap items-end gap-4 flex-1">
        {/* Data Inicial */}
        <div className="flex flex-col gap-1.5 min-w-[150px] flex-1 sm:flex-initial">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            Data Inicial
          </label>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            selected={dataInicial}
            onChange={changeDataInicial}
            disabled={PorCliente}
            className="flex h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            wrapperClassName="w-full"
          />
        </div>

        {/* Data Final */}
        <div className="flex flex-col gap-1.5 min-w-[150px] flex-1 sm:flex-initial">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            Data Final
          </label>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            selected={dataFinal}
            onChange={changeDataFinal}
            disabled={PorCliente}
            className="flex h-9 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            wrapperClassName="w-full"
          />
        </div>

        {/* Filtro por Cliente */}
        {!ocutarBuscaClientes && (
          <div className="flex flex-wrap items-end gap-3 flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 pb-2">
              <input
                id="porClienteCheckbox"
                type="checkbox"
                checked={PorCliente}
                onChange={() => setPorCliente(!PorCliente)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900 cursor-pointer"
              />
              <label
                htmlFor="porClienteCheckbox"
                className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none whitespace-nowrap"
              >
                Por Cliente
              </label>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
              <label htmlFor="clientes" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                Cliente
              </label>
              {clientes.length > 0 ? (
                <Select
                  id="clientes"
                  disabled={!PorCliente}
                  onChange={(e) => changeContrato(e.target.value)}
                  className="h-9 py-1 text-sm"
                >
                  {clientes.map((cliente) => (
                    <option key={cliente.contrato} value={cliente.contrato}>
                      {cliente.nome}
                    </option>
                  ))}
                </Select>
              ) : (
                <span className="text-xs text-slate-500 dark:text-slate-400 py-2">Carregando clientes...</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Botão de Busca */}
      {!ocutarBuscaClientes && (
        <div className="self-end">
          <Button
            type="submit"
            variant="indigo"
            Icon={Search}
            nome="Buscar"
            size="sm"
            className="h-9 px-4 shadow-sm"
          />
        </div>
      )}
    </form>
  );
}

export default FiltroData;