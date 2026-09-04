import React, { useState, useEffect } from 'react';
import {
  Layers,
  FileText,
  ChevronLeft,
  ChevronRight,
  Database,
  Calendar,
  Sparkles
} from 'lucide-react';

import UploadFile from '../../componentes/UploadFile';
import api from '../../services/api';
import Button from '../../componentes/Button';
import Badge from '../../componentes/Badge';

function Ncm() {
  const [ncms, setNcms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getNcm = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/ncm?page=${page + 1}&limit=${rowsPerPage}`);
      const data = response.data || [];
      setNcms(data);
    } catch (error) {
      console.error('Erro ao buscar NCMs:', error);
      setNcms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNcm();
  }, [page, rowsPerPage]);

  const getTotalNcms = async () => {
    try {
      const response = await api.get('/ncm/total');
      const data = response.data;
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Erro ao buscar total de NCMs:', error);
      setTotal(0);
    }
  };

  useEffect(() => {
    getTotalNcms();
  }, []);

  const totalPages = Math.ceil(total / rowsPerPage) || 1;
  const startItem = total === 0 ? 0 : page * rowsPerPage + 1;
  const endItem = Math.min((page + 1) * rowsPerPage, total);

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 flex flex-col gap-6 transition-colors">
      {/* Header Corporativo */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Tabela NCM & Alíquotas IBPT
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Consulta de Nomenclatura Comum do Mercosul e alíquotas tributárias vigentes
            </p>
          </div>
        </div>
        <Badge variant="indigo" size="md">
          <Database className="w-3.5 h-3.5" />
          Total: {total.toLocaleString('pt-BR')} registros
        </Badge>
      </div>

      {/* Componente de Upload / Importação */}
      <UploadFile />

      {/* Card da Tabela de NCM */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {!isLoading ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Código</th>
                    <th className="py-3.5 px-4">NCM</th>
                    <th className="py-3.5 px-4">Exceção</th>
                    <th className="py-3.5 px-4">Tabela</th>
                    <th className="py-3.5 px-4">Descrição</th>
                    <th className="py-3.5 px-4 text-right">Alíq. Fed. Nac.</th>
                    <th className="py-3.5 px-4 text-right">Alíq. Fed. Imp.</th>
                    <th className="py-3.5 px-4 text-right">Alíq. Est.</th>
                    <th className="py-3.5 px-4 text-right">Alíq. Mun.</th>
                    <th className="py-3.5 px-4">Chave IBPT</th>
                    <th className="py-3.5 px-4">Fim Vigência</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {ncms.length > 0 ? (
                    ncms.map((ncm, index) => (
                      <tr
                        key={ncm.codigo || index}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors text-slate-800 dark:text-slate-200"
                      >
                        <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                          #{ncm.codigo}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                          {ncm.ncm}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">
                          {ncm.excecao || '-'}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">
                          {ncm.tabela}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-800 dark:text-slate-200 max-w-xs truncate" title={ncm.descricao}>
                          {ncm.descricao}
                        </td>
                        <td className="py-3 px-4 text-xs text-right text-slate-600 dark:text-slate-400 font-mono">
                          {ncm.aliqFedNac != null ? `${ncm.aliqFedNac}%` : '-'}
                        </td>
                        <td className="py-3 px-4 text-xs text-right text-slate-600 dark:text-slate-400 font-mono">
                          {ncm.aliqFedImp != null ? `${ncm.aliqFedImp}%` : '-'}
                        </td>
                        <td className="py-3 px-4 text-xs text-right text-slate-600 dark:text-slate-400 font-mono">
                          {ncm.aliqEst != null ? `${ncm.aliqEst}%` : '-'}
                        </td>
                        <td className="py-3 px-4 text-xs text-right text-slate-600 dark:text-slate-400 font-mono">
                          {ncm.aliqMun != null ? `${ncm.aliqMun}%` : '-'}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                          {ncm.chaveIbpt || '-'}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {ncm.fimVigencia ? new Date(ncm.fimVigencia).toLocaleDateString('pt-BR') : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="py-12 text-center text-slate-500 dark:text-slate-400">
                        Não há NCMs cadastrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Barra de Paginação */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Linhas por página:
                </span>
                <select
                  className="h-8 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                >
                  {[5, 10, 25, 35, 50, 100].map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Exibindo <span className="font-semibold text-slate-900 dark:text-slate-100">{startItem}</span> - <span className="font-semibold text-slate-900 dark:text-slate-100">{endItem}</span> de <span className="font-semibold text-slate-900 dark:text-slate-100">{total}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => handleChangePage(Math.max(0, page - 1))}
                    Icon={ChevronLeft}
                    nome="Anterior"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(page + 1) * rowsPerPage >= total}
                    onClick={() => handleChangePage(page + 1)}
                    Icon={ChevronRight}
                    nome="Próxima"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Carregando Tabela de NCMs...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Ncm;