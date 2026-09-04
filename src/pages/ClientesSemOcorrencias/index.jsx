import React, { useState, useEffect } from 'react';
import { UserCheck, PlusCircle, Calendar, Clock, Phone, UserX, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import Button from '../../componentes/Button';
import Badge from '../../componentes/Badge';
import Modal from '../../componentes/Modal';
import CreateOcorrencias from '../CreateOcorrencias';

function ClientesSemOcorrencias() {
  const [ClientesSemOcorrencias, SetClientesSemOcorrencias] = useState([]);
  const [modalAberturaOcorrencia, setModalAberturaOcorrencia] = useState(false);
  const [projetoScrumSelecionado, setProjetoScrumSelecionado] = useState(0);
  const [reabrir, setReabrir] = useState(false);
  const [quantidade, setQuantidade] = useState(5);
  const [carregando, setCarregando] = useState(true);

  async function CarregaDadosOrdens() {
    try {
      setCarregando(true);
      const response = await api.get(`/Clientes/SemOcorrencias?qtd=${quantidade}`);
      SetClientesSemOcorrencias(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes sem ocorrências:', error);
      SetClientesSemOcorrencias([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    SetClientesSemOcorrencias([]);
    CarregaDadosOrdens();
    setModalAberturaOcorrencia(false);
  }, [quantidade, reabrir]);

  const handleQuantidade = (qtd) => {
    setQuantidade(qtd);
  };

  const abrirOcorrencia = (projeto_scrum) => {
    setProjetoScrumSelecionado(projeto_scrum);
    setModalAberturaOcorrencia(true);
  };

  return (
    <>
      <Modal
        activate={modalAberturaOcorrencia}
        setActivate={setModalAberturaOcorrencia}
        altura="auto"
        largura={700}
        className="max-w-3xl w-full p-2 sm:p-4"
      >
        {modalAberturaOcorrencia && (
          <CreateOcorrencias
            codigo_projeto_scrum={projetoScrumSelecionado}
            retornarPara={() => setReabrir(!reabrir)}
          />
        )}
      </Modal>

      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 sm:p-6 transition-colors">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
              <UserCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
              Clientes Sem Ocorrências
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Clientes que não registraram chamados no período de 90 dias
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
            Total listado: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{ClientesSemOcorrencias.length}</span>
          </div>
        </div>

        {/* Barra de Filtro / Quantidade */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quantidade de registros:</span>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700/80">
              {[5, 10, 20, 30, 40, 50].map((qtd) => (
                <button
                  key={qtd}
                  type="button"
                  onClick={() => handleQuantidade(qtd)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    quantidade === qtd
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {qtd}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela de Dados */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Celular</th>
                  <th className="py-3.5 px-4">Telefone</th>
                  <th className="py-3.5 px-4">Data Últ. Ocorrência</th>
                  <th className="py-3.5 px-4">Func. Atendeu</th>
                  <th className="py-3.5 px-4 text-center">Tempo Sem Chamado</th>
                  <th className="py-3.5 px-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {carregando ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">Carregando clientes sem ocorrências...</span>
                      </div>
                    </td>
                  </tr>
                ) : ClientesSemOcorrencias.length > 0 ? (
                  ClientesSemOcorrencias.map((so, index) => (
                    <tr
                      key={so.contrato || index}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors text-slate-800 dark:text-slate-200"
                    >
                      <td className="py-3 px-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {so.nome}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {so.celular || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {so.fone || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{so.data_ultima_ocorrencia ? (new Date(so.data_ultima_ocorrencia).toString() !== 'Invalid Date' ? new Date(so.data_ultima_ocorrencia).toLocaleDateString('pt-BR') : so.data_ultima_ocorrencia) : '-'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {so.fun_atendimento || '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-center whitespace-nowrap">
                        <Badge variant="warning" size="sm" icon={Clock}>
                          {so.tempo ? `${so.tempo} dias` : '+90 dias'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-center whitespace-nowrap">
                        <Button
                          variant="indigo"
                          size="sm"
                          Icon={PlusCircle}
                          nome="Abrir Ocorrência"
                          onClick={() => abrirOcorrencia(so.cod_projeto_scrum)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <UserX className="w-8 h-8 text-slate-400" />
                        <span className="text-sm font-medium">Nenhum cliente sem ocorrências encontrado no período selecionado</span>
                      </div>
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

export default ClientesSemOcorrencias;