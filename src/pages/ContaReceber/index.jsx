import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  Receipt,
  Printer,
  DollarSign,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  FileSpreadsheet,
  Archive
} from 'lucide-react';

import api from '../../services/api';
import Button from '../../componentes/Button';
import Badge from '../../componentes/Badge';
import Modal from '../../componentes/Modal';
import Recibo from '../../componentes/Recibos/recibo';
import { extraiDia, reaisPorExtenso } from '../../functions/utils';
import swal from '@/lib/feedback';

function normalizarDataset(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && Object.keys(data).length > 0) return [data];
  return [];
}

function formatarDataVencimento(valor) {
  if (!valor) return '-';
  if (typeof valor === 'string') {
    const limpa = valor.trim();
    if (/^\d{2}\/\d{2}\/\d{4}/.test(limpa)) {
      return limpa.substring(0, 10);
    }
    if (/^\d{4}-\d{2}-\d{2}/.test(limpa)) {
      const [ano, mes, dia] = limpa.substring(0, 10).split('-');
      return `${dia}/${mes}/${ano}`;
    }
  }
  const d = new Date(valor);
  return isNaN(d.getTime()) ? String(valor) : d.toLocaleDateString('pt-BR');
}

function isVencida(valor) {
  if (!valor) return false;
  let d = null;
  if (typeof valor === 'string') {
    const limpa = valor.trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(limpa)) {
      const [ano, mes, dia] = limpa.substring(0, 10).split('-').map(Number);
      d = new Date(ano, mes - 1, dia);
    } else if (/^\d{2}\/\d{2}\/\d{4}/.test(limpa)) {
      const [dia, mes, ano] = limpa.substring(0, 10).split('/').map(Number);
      d = new Date(ano, mes - 1, dia);
    }
  }
  if (!d) d = new Date(valor);
  if (isNaN(d.getTime())) return false;
  d.setHours(0, 0, 0, 0);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return d.getTime() < hoje.getTime();
}

function ContaReceber() {
  const [aReceber, setContaReceber] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [modalRecibo, setModalRecibo] = useState(false);
  const [recibo, setRecibo] = useState(null);
  const { state } = useLocation();
  const history = useHistory();

  const fetchData = useCallback(async () => {
    if (!state?.contrato) {
      setContaReceber([]);
      return;
    }
    setCarregando(true);
    const sql = `SELECT
                    R.REC_CODIGO,
                    R.REC_DUPLICATA,
                    R.REC_VALOR,
                    R.REC_JUROS,
                    R.REC_DESCONTOS,
                    R.REC_VENCIMENTO,
                    R.REC_TIPO,
                    R.REC_SITUACAO,
                    CT.CONT_CODIGO,
                    C.CLI_NOME,
                    C.CLI_ENDERECO,
                    C.CLI_BAIRRO,
                    CID.CID_NOME,
                    (SELECT FIRST 1 H.HON_REFERENCIA FROM HONORARIOS H WHERE H.HON_FAT = F.FAT_CODIGO) AS HON_REFERENCIA,
                    COALESCE((SELECT SUM(RP.RP_DINHEIRO + RP.RP_CHEQUE) FROM REC_PGM RP WHERE RP.RP_REC = R.REC_CODIGO), 0) AS VALORPG
                FROM RECEBIMENTOS R
                JOIN FATURAMENTOS F ON F.FAT_CODIGO = R.REC_FAT
                JOIN CLIENTES C ON C.CLI_CODIGO = F.FAT_CLI
                JOIN CONTRATOS CT ON CT.CONT_CLI = C.CLI_CODIGO
                LEFT JOIN CIDADES CID ON CID.CID_CODIGO = C.CLI_CID
                WHERE
                    CT.CONT_CODIGO = ${Number(state.contrato)}
                    AND CT.CONT_ESTADO = 1
                    AND R.REC_ESTADO = 1
                    AND (R.REC_SITUACAO >= 0 AND R.REC_SITUACAO < 3)
                    AND R.REC_VALOR > 0
                ORDER BY
                    R.REC_VENCIMENTO ASC,
                    R.REC_CODIGO ASC`;
    try {
      const response = await api.post('/v1/dataset', { sql });
      const rows = normalizarDataset(response.data).map((row) => ({
        contrato: row.CONT_CODIGO ?? row.cont_codigo ?? state.contrato,
        codRecebimento: Number(row.REC_CODIGO ?? row.rec_codigo ?? 0),
        nome: row.CLI_NOME ?? row.cli_nome ?? state?.nome ?? '',
        valorpg: parseFloat(row.VALORPG ?? row.valorpg ?? 0) || 0,
        duplicata: row.REC_DUPLICATA ?? row.rec_duplicata ?? '',
        valor: parseFloat(row.REC_VALOR ?? row.rec_valor ?? 0) || 0,
        juros: parseFloat(row.REC_JUROS ?? row.rec_juros ?? 0) || 0,
        descontos: parseFloat(row.REC_DESCONTOS ?? row.rec_descontos ?? 0) || 0,
        vencimento: row.REC_VENCIMENTO ?? row.rec_vencimento ?? '',
        tipo: row.REC_TIPO ?? row.rec_tipo ?? '',
        referencia: row.HON_REFERENCIA ?? row.hon_referencia ?? '',
        endereco: row.CLI_ENDERECO ?? row.cli_endereco ?? '',
        bairro: row.CLI_BAIRRO ?? row.cli_bairro ?? '',
        cidade: row.CID_NOME ?? row.cid_nome ?? '',
      }));
      setContaReceber(rows);
    } catch (error) {
      console.error('Erro ao buscar contas a receber:', error);
      setContaReceber([]);
    } finally {
      setCarregando(false);
    }
  }, [state?.contrato, state?.nome]);

  const totalCalculado = useMemo(() => {
    return aReceber.reduce((soma, conta) => soma + (parseFloat(conta.valor) || 0), 0);
  }, [aReceber]);

  function ImprimiRecibo(conta) {
    setRecibo({
      cliente: conta.nome,
      endereco: (conta.endereco || '') + (conta.cidade ? ' - ' + conta.cidade : ''),
      valor: conta.valor,
      referencia: 'Mensalidade Ref. A ' + (conta.referencia || conta.duplicata),
      valortxt: reaisPorExtenso(conta.valor),
      venc: extraiDia(conta.vencimento),
      codPix: conta.codRecebimento,
    });
    setModalRecibo(true);
  }

  function arquivarFatura(conta) {
    swal({
      title: 'Arquivar fatura?',
      text: `Deseja arquivar a duplicata ${conta.duplicata || '#' + conta.codRecebimento} (R$ ${parseFloat(conta.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})?`,
      icon: 'warning',
      buttons: ['Cancelar', 'Arquivar'],
      dangerMode: true,
    }).then(async (confirmar) => {
      if (!confirmar) return;
      try {
        const sql = `UPDATE RECEBIMENTOS SET REC_SITUACAO = 3 WHERE REC_CODIGO = ${Number(conta.codRecebimento)}`;
        await api.post('/v1/dataset', { sql });
        setContaReceber((prev) => prev.filter((item) => item.codRecebimento !== conta.codRecebimento));
        swal('Fatura arquivada com sucesso!', 'A situação foi alterada para arquivada.', 'success');
      } catch (err) {
        swal('Erro ao arquivar fatura', err.message || 'Falha ao atualizar no banco de dados', 'error');
      }
    });
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
            <Badge variant="destructive" size="md">
              <DollarSign className="w-3.5 h-3.5" />
              Total: R$ {totalCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {aReceber.map((conta, index) => {
                    const vencida = isVencida(conta.vencimento);
                    return (
                      <tr
                        key={conta.codRecebimento || conta.duplicata || index}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors text-slate-800 dark:text-slate-200"
                      >
                        <td className="py-3.5 px-4 text-sm font-mono font-semibold text-slate-900 dark:text-slate-100">
                          <div>{conta.duplicata || `#${conta.codRecebimento}`}</div>
                          {conta.referencia && (
                            <div className="text-[11px] font-sans font-normal text-slate-500 dark:text-slate-400">
                              Ref.: {conta.referencia}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="font-mono">{formatarDataVencimento(conta.vencimento)}</span>
                            {vencida ? (
                              <Badge variant="destructive" size="sm">Vencida</Badge>
                            ) : (
                              <Badge variant="secondary" size="sm">A vencer</Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-sm">
                          <Badge variant={vencida ? 'destructive' : 'warning'} size="sm">
                            R$ {parseFloat(conta.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-2">
                            <Button
                              variant="indigo"
                              size="sm"
                              Icon={Printer}
                              nome="Imprimir Recibo"
                              onClick={() => ImprimiRecibo(conta)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              Icon={Archive}
                              nome="Arquivar"
                              onClick={() => arquivarFatura(conta)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
                  <tr>
                    <td colSpan="4" className="py-3.5 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Total em Aberto ({aReceber.length} {aReceber.length === 1 ? 'fatura' : 'faturas'}):</span>
                        </div>
                        <span className="font-bold text-base text-slate-900 dark:text-slate-100 font-mono">
                          R$ {totalCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
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
