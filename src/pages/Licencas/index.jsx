import React, { useState, useEffect } from 'react';
import DatePicker from '../../componentes/DatePicker';
import { useLocation, useHistory } from 'react-router-dom';
import {
  KeyRound,
  ShieldAlert,
  Save,
  Calendar,
  Monitor,
  ArrowUpDown,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

import api from '../../services/api';
import Button from '../../componentes/Button';
import Badge from '../../componentes/Badge';
import Input from '../../componentes/Input';
import Modal from '../../componentes/Modal';
import swal from '@/lib/feedback';

function Licencas() {
  const [licencas, setLicencas] = useState([]);
  const [novaSenha, setNovaSenha] = useState('');
  const [dataLimite, setDataLimite] = useState(new Date());
  const [modalGerarAtivo, setModalGerarAtivo] = useState(false);
  const [licencaSelecionada, setLicencaSelecionada] = useState({});
  const { state } = useLocation();
  const history = useHistory();
  const [licencasVencer, setLicencasVencer] = useState(state?.licencasVencer || []);
  const [auxOrdData, setAuxOrdData] = useState(false);
  const [auxOrdDataVencer, setAuxOrdDataVencer] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function fetchLicencas() {
    setCarregando(true);
    try {
      const response = await api.get('/contrassenha');
      setLicencas(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar licenças:', error);
      setLicencas([]);
    } finally {
      setCarregando(false);
    }
  }

  function converterStringParaData(dataString) {
    if (!dataString) return new Date(0);
    const partes = String(dataString).split('/');
    if (partes.length < 3) return new Date(0);
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const ano = parseInt(partes[2], 10);
    return new Date(ano, mes, dia);
  }

  async function SubmitNovaLicenca(e) {
    e.preventDefault();
    if (!licencaSelecionada.codigo || licencaSelecionada.codigo === 0) {
      swal('Codigo do contrato é obrigatório!', 'Clique em gerar!', 'warning');
      return;
    }
    if (novaSenha === '') {
      swal('O campo Senha é obrigatório!', 'Informe a Senha!', 'warning');
      return;
    }
    try {
      const response = await api.post('/contrassenha', {
        senha: novaSenha,
        limite: dataLimite,
        codigo: licencaSelecionada.codigo,
      });
      if (response.status === 200) {
        swal('Contrassenha atualizada com sucesso!', 'Bom trabalho!', 'success');
        setModalGerarAtivo(false);
        history.push('/');
      } else {
        swal(`Erro ao atualizar contrassenha. ${response.data?.error || ''}`, 'Algo deu errado!', 'error');
      }
    } catch (error) {
      swal(`Erro ao atualizar contrassenha. ${error.message || ''}`, 'Algo deu errado!', 'error');
    }
  }

  const handleClickGerar = (licenca) => {
    setModalGerarAtivo(true);
    setLicencaSelecionada(licenca);
    setNovaSenha(licenca.senha || '');
  };

  function changeDataLimite(data) {
    setDataLimite(data);
  }

  useEffect(() => {
    fetchLicencas();
  }, []);

  useEffect(() => {
    if (licencas && licencas.length > 0) {
      const sorted = [...licencas].sort((a, b) =>
        auxOrdData
          ? converterStringParaData(a.data_limite) - converterStringParaData(b.data_limite)
          : converterStringParaData(b.data_limite) - converterStringParaData(a.data_limite)
      );
      setLicencas(sorted);
    }
  }, [auxOrdData]);

  useEffect(() => {
    if (licencasVencer && licencasVencer.length > 0) {
      const sorted = [...licencasVencer].sort((a, b) =>
        auxOrdDataVencer
          ? converterStringParaData(a.data_limite) - converterStringParaData(b.data_limite)
          : converterStringParaData(b.data_limite) - converterStringParaData(a.data_limite)
      );
      setLicencasVencer(sorted);
    }
  }, [auxOrdDataVencer]);

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
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/50">
              <KeyRound className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Gerar Nova Contrassenha
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                {licencaSelecionada.nome_cliente || 'Cliente'} &bull; Contrato #{licencaSelecionada.codigo}
              </p>
            </div>
          </div>

          <form onSubmit={SubmitNovaLicenca} className="flex flex-col gap-4">
            <div>
              <label
                className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1.5"
                htmlFor="senha"
              >
                Senha
              </label>
              <Input
                id="senha"
                type="text"
                placeholder="Informe a nova senha..."
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
                nome="Gerar"
              />
            </div>
          </form>
        </div>
      </Modal>

      <div className="w-full max-w-6xl mx-auto py-6 px-4 flex flex-col gap-6 transition-colors">
        {/* Header Principal */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <KeyRound className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Licenças e Contrassenhas
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Gestão de senhas de liberação, datas limite e quantidade de terminais autorizados
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="indigo" size="md">
              <ShieldCheck className="w-3.5 h-3.5" />
              {licencas.length} {licencas.length === 1 ? 'licença ativa' : 'licenças ativas'}
            </Badge>
          </div>
        </div>

        {/* Tabela Licenças a Vencer (Destaque se houver) */}
        {licencasVencer.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-sm overflow-hidden">
            <div className="bg-rose-50/70 dark:bg-rose-950/40 p-4 border-b border-rose-200/70 dark:border-rose-900/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <h2 className="text-base font-bold text-rose-900 dark:text-rose-200">
                  Licenças de Softwares a Vencer
                </h2>
              </div>
              <Badge variant="destructive" size="md">
                <AlertTriangle className="w-3.5 h-3.5" />
                {licencasVencer.length} a vencer
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Senha</th>
                    <th className="py-3 px-4">Contrassenha</th>
                    <th className="py-3 px-4">Data Uso</th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors select-none"
                      onClick={() => setAuxOrdDataVencer(!auxOrdDataVencer)}
                    >
                      <div className="flex items-center gap-1">
                        <span>Data Limite</span>
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                    <th className="py-3 px-4 text-center">Num PCs</th>
                    <th className="py-3 px-4 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {licencasVencer.map((licenca, index) => (
                    <tr
                      key={licenca.codigo || index}
                      className="hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-colors text-slate-800 dark:text-slate-200"
                    >
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                        #{licenca.codigo}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {licenca.nome_cliente}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                        {licenca.senha}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                        {licenca.contra_senha}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {String(licenca.data_uso).length > 0
                          ? new Date(licenca.data_uso).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold whitespace-nowrap">
                        <Badge variant="destructive" size="sm">
                          {licenca.data_limite}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center text-xs font-semibold">
                        <div className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Monitor className="w-3.5 h-3.5" />
                          <span>{licenca.pcs}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <Button
                          variant="destructive"
                          size="sm"
                          Icon={KeyRound}
                          nome="Gerar"
                          onClick={() => handleClickGerar(licenca)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabela de Licenças Ativas */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Licenças de Softwares Ativas
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Clique em "Data Limite" para inverter a ordenação
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Código</th>
                  <th className="py-3.5 px-4">Cliente</th>
                  <th className="py-3.5 px-4">Senha</th>
                  <th className="py-3.5 px-4">Contrassenha</th>
                  <th className="py-3.5 px-4">Data Uso</th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors select-none"
                    onClick={() => setAuxOrdData(!auxOrdData)}
                  >
                    <div className="flex items-center gap-1">
                      <span>Data Limite</span>
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 text-center">Num PCs</th>
                  <th className="py-3.5 px-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {carregando ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">Carregando licenças...</span>
                      </div>
                    </td>
                  </tr>
                ) : licencas.length > 0 ? (
                  licencas.map((licenca, index) => (
                    <tr
                      key={licenca.codigo || index}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors text-slate-800 dark:text-slate-200"
                    >
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                        #{licenca.codigo}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {licenca.nome_cliente}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                        {licenca.senha}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {licenca.contra_senha}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {String(licenca.data_uso).length > 0
                          ? new Date(licenca.data_uso).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-xs whitespace-nowrap">
                        <Badge variant="secondary" size="sm">
                          {licenca.data_limite}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center text-xs font-semibold">
                        <div className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Monitor className="w-3.5 h-3.5" />
                          <span>{licenca.pcs}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <Button
                          variant="indigo"
                          size="sm"
                          Icon={KeyRound}
                          nome="Gerar"
                          onClick={() => handleClickGerar(licenca)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-500 dark:text-slate-400">
                      Nenhuma licença cadastrada
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

export default Licencas;