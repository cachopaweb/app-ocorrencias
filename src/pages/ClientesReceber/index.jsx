import React, { useEffect, useState } from 'react';
import DatePicker from '../../componentes/DatePicker';
import { useLocation, useHistory } from 'react-router-dom';
import {
  AlertCircle,
  KeyRound,
  Save,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  Lock,
  X
} from 'lucide-react';

import api from '../../services/api';
import Modal from '../../componentes/Modal';
import Button from '../../componentes/Button';
import Badge from '../../componentes/Badge';
import Input from '../../componentes/Input';
import swal from '@/lib/feedback';

export default function ClientesReceber() {
  const [clientesDevedores, setClientesDevedores] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState({});
  const [novaSenha, setNovaSenha] = useState('');
  const [dataLimite, setDataLimite] = useState(new Date());
  const [modalGerarAtivo, setModalGerarAtivo] = useState(false);
  const { state } = useLocation();
  const history = useHistory();

  const fetchClientesDevedores = async () => {
    setCarregando(true);
    const sql = `SELECT
                    CONT_CODIGO,
                    CLI_NOME,
                    CID_NOME,
                    CLI_FONE,
                    CLI_CELULAR,
                    LIC_CODIGO,
                    LIC_SENHA,
                    SUM(REC_VALOR) AS VALOR,
                    SUM(REC_JUROS) AS REC_JUROS,
                    SUM(REC_DESCONTOS) AS DESCONTOS
                FROM RECEBIMENTOS
                JOIN FATURAMENTOS ON REC_FAT = FAT_CODIGO
                JOIN CLIENTES ON FAT_CLI = CLI_CODIGO
                JOIN CONTRATOS ON CONT_CLI = CLI_CODIGO
                JOIN HONORARIOS ON HON_FAT = FAT_CODIGO
                JOIN CIDADES ON CLI_CID = CID_CODIGO
                JOIN LICENCAS ON LIC_CLI = CLI_CODIGO
                WHERE 
                    CONT_ESTADO = 1
                    AND REC_ESTADO = 1
                    AND (REC_SITUACAO >= 0 AND REC_SITUACAO < 2)
                    AND REC_VENCIMENTO <= DATEADD(-10 DAY TO CURRENT_DATE)
                GROUP BY 
                    CONT_CODIGO,
                    CLI_NOME,
                    CID_NOME,
                    CLI_FONE,
                    CLI_CELULAR,
                    LIC_CODIGO,
                    LIC_SENHA
                ORDER BY 
                    CLI_NOME;`;
    try {
      const response = await api.post('v1/dataset', { sql: sql });
      const data = response.data || [];
      setClientesDevedores(data);
    } catch (error) {
      console.error('Error fetching clientes devedores:', error);
      setClientesDevedores([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleClickGerar = (cliente) => {
    setModalGerarAtivo(true);
    setClienteSelecionado(cliente);
    setNovaSenha(cliente.LIC_SENHA || '');
  };

  function changeDataLimite(data) {
    setDataLimite(data);
  }

  async function SubmitNovaLicenca(e) {
    e.preventDefault();
    if (!clienteSelecionado.LIC_CODIGO || clienteSelecionado.LIC_CODIGO === 0) {
      swal('Código da licença é obrigatório!', 'Clique em gerar novamente!', 'warning');
      return;
    }
    if (novaSenha === '') {
      swal('O campo Senha é obrigatório!', 'Informe a Senha!', 'warning');
      return;
    }
    try {
      let response = await api.post('/contrassenha', {
        senha: novaSenha,
        limite: dataLimite,
        codigo: clienteSelecionado.LIC_CODIGO
      });
      if (response.status === 200) {
        swal('Contrassenha atualizada com sucesso!', 'Bom trabalho!', 'success');
        setModalGerarAtivo(false);
        history.push('/');
      } else {
        swal(`Erro ao atualizar contrassenha. ${response.data?.error || ''}`, 'Algo deu errado!', 'error');
      }
    } catch (err) {
      swal('Erro ao atualizar contrassenha.', err.message || 'Algo deu errado!', 'error');
    }
  }

  useEffect(() => {
    fetchClientesDevedores();
  }, []);

  const valorTotalDevedor = clientesDevedores.reduce((acc, cli) => acc + (parseFloat(cli.VALOR) || 0), 0);

  return (
    <>
      {/* Modal Gerar Contrassenha */}
      <Modal
        activate={modalGerarAtivo}
        setActivate={setModalGerarAtivo}
        className="max-w-md w-full"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/50">
              <KeyRound className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Gerar Contrassenha
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                {clienteSelecionado.CLI_NOME} &bull; Contrato #{clienteSelecionado.CONT_CODIGO}
              </p>
            </div>
          </div>

          <form onSubmit={SubmitNovaLicenca} className="flex flex-col gap-4">
            <div>
              <label
                className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1.5"
                htmlFor="senha"
              >
                Senha / Nova Senha
              </label>
              <Input
                id="senha"
                type="text"
                placeholder="Informe a senha..."
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1.5"
                htmlFor="dataLimite"
              >
                Data Limite
              </label>
              <DatePicker
                id="dataLimite"
                dateFormat="dd/MM/yyyy"
                locale="pt-BR"
                selected={dataLimite}
                onChange={changeDataLimite}
                className="flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                wrapperClassName="w-full"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                nome="Cancelar"
                onClick={() => setModalGerarAtivo(false)}
              />
              <Button
                type="submit"
                variant="indigo"
                Icon={Save}
                nome="Salvar Contrassenha"
              />
            </div>
          </form>
        </div>
      </Modal>

      <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 sm:p-6 transition-colors">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
              <DollarSign className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
              Clientes a Receber
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Relatório de clientes com pendências financeiras e geração de contrassenha
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
              Total: <span className="font-bold text-slate-800 dark:text-slate-200">{clientesDevedores.length}</span> {clientesDevedores.length === 1 ? 'cliente' : 'clientes'}
            </div>
            <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
              Total Devedor: <span className="font-bold">
                R$ {valorTotalDevedor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Tabela de Dados */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Contrato</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Cidade</th>
                  <th className="py-3.5 px-4 text-right">Valor Devedor</th>
                  <th className="py-3.5 px-4">Telefone</th>
                  <th className="py-3.5 px-4">Celular</th>
                  <th className="py-3.5 px-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {carregando ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">Carregando clientes devedores...</span>
                      </div>
                    </td>
                  </tr>
                ) : clientesDevedores.length > 0 ? (
                  clientesDevedores.map((cli, index) => {
                    const telefones = [cli.CLI_FONE, cli.CLI_CELULAR].filter(Boolean).join(' / ');
                    return (
                      <tr
                        key={cli.CONT_CODIGO || index}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors text-slate-800 dark:text-slate-200"
                      >
                        <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          #{cli.CONT_CODIGO}
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {cli.CLI_NOME}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{cli.CID_NOME || '-'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-right whitespace-nowrap">
                          <Badge variant="destructive" size="sm">
                            R$ {parseFloat(cli.VALOR || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {cli.CLI_FONE || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {cli.CLI_CELULAR || '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-center whitespace-nowrap">
                          <Button
                            variant="destructive"
                            size="sm"
                            Icon={KeyRound}
                            nome="Bloquear / Gerar"
                            onClick={() => handleClickGerar(cli)}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-8 h-8 text-emerald-500" />
                        <span className="text-sm font-medium">Nenhum cliente com pendências a receber</span>
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