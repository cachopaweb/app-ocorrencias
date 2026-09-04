import React, { useState } from 'react';
import {
  Printer,
  Receipt,
  Calendar,
  FileCheck,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

import api from '../../services/api';
import Button from '../../componentes/Button';
import Badge from '../../componentes/Badge';
import Input from '../../componentes/Input';
import Modal from '../../componentes/Modal';
import { reaisPorExtenso } from '../../functions/utils';
import { Impressao } from '../../componentes/Recibos/printRecibo';
import './recibo.css';

function GeraRecibos() {
  const [modalRecibo, setModalRecibo] = useState(false);
  const [recibos, setRecibos] = useState([]);
  const [carregandoModal, setCarregandoModal] = useState(false);
  const [mesVal, setMesVal] = useState('');
  const [anoVal, setAnoVal] = useState('');

  function RecibosModalContent({ recibosList, onClose }) {
    const handlePrint = useReactToPrint({
      documentTitle: 'Recibos',
      content: () => document.getElementById('print'),
    });

    const totalValor = recibosList.reduce((acc, item) => acc + (parseFloat(item.valor) || 0), 0);

    return (
      <div className="flex flex-col gap-5">
        {/* Hidden area for print */}
        <div id="print" className="print-only">
          {recibosList.map((recibo, index) => (
            <div key={index} className="flex flex-col divide-y divide-dashed divide-slate-500">
              <Impressao dados={recibo} />
              <Impressao dados={recibo} />
            </div>
          ))}
        </div>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Recibos Prontos para Impressão
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Todos os recibos da competência selecionada foram processados
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400">Total de Recibos:</span>
            <Badge variant="indigo" size="md">
              <FileCheck className="w-3.5 h-3.5" />
              {recibosList.length} {recibosList.length === 1 ? 'cliente' : 'clientes'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400">Valor Total Estimado:</span>
            <span className="text-base font-bold text-slate-900 dark:text-slate-100">
              R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            variant="outline"
            nome="Fechar"
            onClick={onClose}
          />
          <Button
            variant="indigo"
            size="default"
            Icon={Printer}
            nome="Imprimir Todos os Recibos"
            onClick={handlePrint}
          />
        </div>
      </div>
    );
  }

  async function imprimirRecibos() {
    const elMes = document.getElementById('idMes');
    const elAno = document.getElementById('idAno');
    const mes = elMes ? elMes.value.toString().trim() : mesVal;
    const ano = elAno ? elAno.value.toString().trim() : anoVal;

    if (!mes || !ano) {
      alert('Por favor, informe o mês e o ano para gerar os recibos.');
      return;
    }

    setCarregandoModal(true);
    const ref = mes + '/' + ano;
    const sql = `SELECT CLI_NOME, CLI_ENDERECO, CID_NOME CLI_CIDADE, CLI_BAIRRO, HON_REFERENCIA, HON_VALOR, HON_TIPO, CONT_VENCIMENTO, 
                   REC_FAT FROM CLIENTES, CONTRATOS, HONORARIOS, RECEBIMENTOS, CIDADES WHERE HON_FAT = REC_FAT AND CLI_CODIGO = CONT_CLI 
                   AND CONT_CODIGO = HON_CONT AND CONT_ESTADO = 1 AND HON_TIPO = 'Mensalidade' AND CONT_RECIBO = 'SIM' 
                   AND (HON_REFERENCIA = '${ref}') AND HON_DATAC = '01/01/1900' AND CLI_CID = CID_CODIGO ORDER BY CLI_NOME`;
    const json = { sql: sql };
    const listaRecibos = [];

    try {
      const response = await api.post('/v1/dataset', json);
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((rec) => {
          listaRecibos.push({
            cliente: rec.CLI_NOME,
            endereco:
              (rec.CLI_ENDERECO ? rec.CLI_ENDERECO + ' - ' : '') +
              (rec.CLI_BAIRRO ? rec.CLI_BAIRRO + ' - ' : '') +
              rec.CLI_CIDADE,
            valor: rec.HON_VALOR,
            referencia: 'Mensalidade Ref. A ' + rec.HON_REFERENCIA,
            valortxt: reaisPorExtenso(rec.HON_VALOR),
            venc: rec.CONT_VENCIMENTO,
            codPix: rec.REC_FAT,
          });
        });
      }
      setRecibos(listaRecibos);
      setModalRecibo(true);
    } catch (error) {
      console.error('Erro ao buscar dados dos recibos:', error);
      alert('Erro ao carregar recibos. Verifique os dados e tente novamente.');
    } finally {
      setCarregandoModal(false);
    }
  }

  const keyDownMes = (event) => {
    if (event.key === 'Enter') {
      const edtAno = document.getElementById('idAno');
      if (edtAno) edtAno.focus();
    }
  };

  const keyDownAno = async (event) => {
    if (event.key === 'Enter') {
      await imprimirRecibos();
    }
  };

  return (
    <>
      <Modal
        activate={modalRecibo}
        setActivate={setModalRecibo}
        className="max-w-lg w-full"
      >
        {modalRecibo && (
          <RecibosModalContent
            recibosList={recibos}
            onClose={() => setModalRecibo(false)}
          />
        )}
      </Modal>

      <div className="w-full max-w-3xl mx-auto py-6 px-4 flex flex-col gap-6 transition-colors">
        {/* Header Corporativo */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <Printer className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Emissão de Recibos
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Geração em lote de recibos mensais com código PIX para impressão
              </p>
            </div>
          </div>
          <Badge variant="indigo" size="md">
            <Sparkles className="w-3.5 h-3.5" />
            Contratos Ativos
          </Badge>
        </div>

        {/* Card Formulário de Referência */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Período de Competência
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="idMes" className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Mês de Referência (MM)
              </label>
              <Input
                id="idMes"
                type="text"
                maxLength={2}
                placeholder="Ex: 05"
                value={mesVal}
                onChange={(e) => setMesVal(e.target.value)}
                onKeyDown={keyDownMes}
                className="h-11 font-mono text-base text-center tracking-wider"
              />
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Informe 2 dígitos (01 a 12)
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="idAno" className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Ano de Referência (AAAA ou AA)
              </label>
              <Input
                id="idAno"
                type="text"
                maxLength={4}
                placeholder="Ex: 24 ou 2024"
                value={anoVal}
                onChange={(e) => setAnoVal(e.target.value)}
                onKeyDown={keyDownAno}
                className="h-11 font-mono text-base text-center tracking-wider"
              />
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Ano da mensalidade a cobrar
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
            <Button
              variant="indigo"
              size="lg"
              Icon={Printer}
              nome={carregandoModal ? 'Carregando Recibos...' : 'Consultar e Gerar Recibos'}
              disabled={carregandoModal}
              onClick={() => imprimirRecibos()}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default GeraRecibos;