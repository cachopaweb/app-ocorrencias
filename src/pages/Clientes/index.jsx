import React, { useState, useEffect } from 'react';
import { Search, Users } from 'lucide-react';
import api from '../../services/api';
import DetalhesCliente from '../../componentes/DetalhesCliente';
import Input from '../../componentes/Input';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  async function fetchData() {
    try {
      setCarregando(true);
      const response = await api.get('/Clientes');
      const data = response.data || [];
      setClientes(data);
      setClientesFiltrados(data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setClientes([]);
      setClientesFiltrados([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function filtrarPorCliente(termoBusca) {
    setBusca(termoBusca);
    if (!termoBusca || termoBusca.trim() === '') {
      setClientesFiltrados(clientes);
      return;
    }
    const termo = termoBusca.toUpperCase();
    const result = clientes.filter((cliente) =>
      (cliente.nome && cliente.nome.toUpperCase().includes(termo)) ||
      (cliente.razao && cliente.razao.toUpperCase().includes(termo)) ||
      (cliente.cnpj_cpf && cliente.cnpj_cpf.toUpperCase().includes(termo))
    );
    setClientesFiltrados(result);
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 sm:p-6 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
            Clientes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Consulte a base de clientes e acesse o histórico financeiro
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
          Total: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{clientesFiltrados.length}</span> {clientesFiltrados.length === 1 ? 'cliente' : 'clientes'}
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <Input
            type="text"
            placeholder="Busca por cliente, razão social ou CNPJ..."
            value={busca}
            onChange={(e) => filtrarPorCliente(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      {/* Grid de Cartões */}
      <div className="w-full">
        {carregando ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Carregando clientes...</span>
          </div>
        ) : clientesFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto py-2">
            {clientesFiltrados.map((cliente, index) => (
              <DetalhesCliente
                key={cliente.cnpj_cpf || cliente.contrato || index}
                cliente={cliente}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center gap-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Users className="w-10 h-10 text-slate-400" />
            <span className="text-base font-semibold text-slate-700 dark:text-slate-300">Nenhum cliente encontrado</span>
            <p className="text-xs text-slate-500">Tente ajustar o termo de pesquisa</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Clientes;