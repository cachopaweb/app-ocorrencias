import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  Receipt,
  Printer,
  DollarSign,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

import api from '../../services/api';
import Button from '../../componentes/Button';
import Badge from '../../componentes/Badge';
import Modal from '../../componentes/Modal';
import Recibo from '../../componentes/Recibos/recibo';
import { extraiDia, reaisPorExtenso } from '../../functions/utils';

function ContaReceber() {
  const [aReceber, setContaReceber] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [modalRecibo, setModalRecibo] = useState(false);
  const [recibo, setRecibo] = useState();
  const { state } = useLocation();
  const history = useHistory();
  const [total, SetTotal] = useState(0.0);

  function dataAtualFormatada() {
    const data = new Date();
    const dia = data.getDate().toString();
    const diaF = dia.length === 1 ? '0' + dia : dia;
    const mes = (data.getMonth() + 1).toString();
    const mesF = mes.length === 1 ? '0' + mes : mes;
    const anoF = data.getFullYear();
    return diaF + '/' + mesF + '/' + anoF;
  }

  async function fetchData() {
    setCarregando(true);
    const data1 = '01/01/1900';
    const data2 = dataAtualFormatada();
    try {
      const response = await api.get(`/Clientes/${state?.contrato}?data1=${data1}&data2=${data2}`);
      setContaReceber(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar contas a receber:', error);
      setContaReceber([]);
    } finally {
      setCarregando(false);
    }
  }

  function SomaTotal() {
    let soma = 0.0;
    aReceber.forEach((conta) => {
      soma += parseFloat(conta.valor) || 0;
    });
    SetTotal(soma);
  }

  function ImprimiRecibo(conta) {
    setRecibo({
      cliente: conta.nome,
      endereco: (conta.endereco || '') + ' - ' + (conta.cidade || ''),
      valor: conta.valor,
      referencia: 'Mensalidade Ref. A ' + conta.referencia,
      valortxt: reaisPorExtenso(conta.valor),
      venc: extraiDia(conta.vencimento),
      codPix: conta.codRecebimento,
    });
    setModalRecibo(true);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Modal
        activate={modalRecibo}
        setActivate={setModalRecibo}
        className="max-w-2xl w-full p-4"
      >
        {modalRecibo && recibo && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Receipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Visualização do Recibo
              </h3>
            </div>
            <Recibo recibo={recibo} />
          </div>
        )}
      </Modal>

      <div className="w-full max-w-5xl mx-auto py-6 px-4 flex flex-col gap-6 transition-colors">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => history.goBack()}
              title="Voltar"
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Contas a Receber
                </h1>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {state?.nome ? (
                  <>
                    Cliente: <strong className="text-slate-700 dark:text-slate-300">{state.nome}</strong>
                    {state?.contrato && (
                      <span className="ml-2 font-mono text-xs text-slate-400 dark:text-slate-500">
                        (Contrato #{state.contrato})
                      </span>
                    )}
                  </>
                ) : (
                  state?.contrato ? `Contrato #${state.contrato}` : 'Consulta de faturas e duplicatas pendentes'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" size="md">
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              {aReceber.length} {aReceber.length === 1 ? 'duplicata' : 'duplicatas'}
            </Badge>
          </div>
        </div>

        {/* Card da Tabela */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {carregando ? (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Carregando contas a receber...</span>
              </div>
            </div>
          ) : aReceber.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Duplicata</th>
                    <th className="py-3.5 px-4">Vencimento</th>
                    <th className="py-3.5 px-4">Valor</th>
                    <th className="py-3.5 px-4 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {aReceber.map((conta, index) => (
                    <tr
                      key={conta.duplicata || index}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors text-slate-800 dark:text-slate-200"
                    >
                      <td className="py-3.5 px-4 text-sm font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {conta.duplicata}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{new Date(conta.vencimento).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm">
                        <Badge variant="destructive" size="sm">
                          R$ {parseFloat(conta.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <Button
                          variant="indigo"
                          size="sm"
                          Icon={Printer}
                          nome="Imprimir Recibo"
                          onClick={() => ImprimiRecibo(conta)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
                  <tr>
                    <td colSpan="2" className="py-3.5 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Total Calculado:</span>
                        <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                          R$ {parseFloat(total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </td>
                    <td colSpan="2" className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        Icon={DollarSign}
                        nome="Calcular / Ver Total"
                        onClick={() => SomaTotal()}
                      />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400">
              <div className="flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Nada a receber
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Não existem pendências financeiras registradas para este cliente.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ContaReceber;