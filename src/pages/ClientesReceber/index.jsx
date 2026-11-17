import React, { useEffect, useState, useMemo, useCallback } from 'react';
import DatePicker from '../../componentes/DatePicker';
import { useHistory } from 'react-router-dom';
import {
  AlertCircle,
  KeyRound,
  Save,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  MessageCircle,
  Copy,
  Check,
  CheckCircle2,
  Search,
  Send,
  RefreshCw,
  Clock,
  FileText,
  FileSpreadsheet,
  Archive,
  Printer,
  UserX,
  Receipt,
  X
} from 'lucide-react';

import api from '../../services/api';
import Modal from '../../componentes/Modal';
import Button from '../../componentes/Button';
import Badge from '../../componentes/Badge';
import Input, { Textarea } from '../../componentes/Input';
import Recibo from '../../componentes/Recibos/recibo';
import { extraiDia, reaisPorExtenso } from '../../functions/utils';
import swal from '@/lib/feedback';

const STORAGE_KEY_AVISOS = 'portal_avisos_whatsapp_inadimplentes';
const WHATSAPP_EMPRESA_DISPLAY = '(67) 3467-3694';
const WHATSAPP_EMPRESA_WA = '556734673694';

function getHojeISO() {
  const d = new Date();
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function normalizarDataset(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && Object.keys(data).length > 0) return [data];
  return [];
}

function converterDataSegura(valor) {
  if (!valor || valor === '0') return null;
  if (valor instanceof Date) {
    if (isNaN(valor.getTime())) return null;
    const d = new Date(valor.getFullYear(), valor.getMonth(), valor.getDate());
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (typeof valor === 'string') {
    const limpa = valor.trim();
    if (limpa.length >= 10 && limpa[4] === '-' && limpa[7] === '-') {
      const ano = parseInt(limpa.substring(0, 4), 10);
      const mes = parseInt(limpa.substring(5, 7), 10) - 1;
      const dia = parseInt(limpa.substring(8, 10), 10);
      if (ano < 1970) return null;
      const d = new Date(ano, mes, dia);
      d.setHours(0, 0, 0, 0);
      return isNaN(d.getTime()) ? null : d;
    }
    if (limpa.length >= 10 && (limpa[2] === '/' || limpa[2] === '.') && (limpa[5] === '/' || limpa[5] === '.')) {
      const dia = parseInt(limpa.substring(0, 2), 10);
      const mes = parseInt(limpa.substring(3, 5), 10) - 1;
      const ano = parseInt(limpa.substring(6, 10), 10);
      if (ano < 1970) return null;
      const d = new Date(ano, mes, dia);
      d.setHours(0, 0, 0, 0);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(limpa);
    if (!isNaN(d.getTime()) && d.getFullYear() >= 1970) {
      d.setHours(0, 0, 0, 0);
      return d;
    }
  }
  return null;
}

function formatarDataBR(data) {
  if (!data || isNaN(data.getTime())) return '-';
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function calcularDiasAtraso(dataVencimento) {
  if (!dataVencimento || isNaN(dataVencimento.getTime())) return 0;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const diffMs = hoje.getTime() - dataVencimento.getTime();
  return Math.floor(diffMs / 86400000);
}

function formatarMoedaBR(valor) {
  return (parseFloat(valor) || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function normalizarTelefoneWhatsApp(telefone) {
  let digits = String(telefone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length >= 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  if (digits.length === 8 || digits.length === 9) {
    digits = `5567${digits}`;
  } else if ((digits.length === 10 || digits.length === 11) && !digits.startsWith('55')) {
    digits = `55${digits}`;
  }
  return digits;
}

function lerAvisadosHoje() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AVISOS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && parsed.data === getHojeISO() && parsed.avisados) {
      return parsed.avisados;
    }
  } catch {
    // ignore corrupted storage
  }
  return {};
}

function salvarAvisadosHoje(avisados) {
  try {
    localStorage.setItem(
      STORAGE_KEY_AVISOS,
      JSON.stringify({
        data: getHojeISO(),
        avisados,
      })
    );
  } catch {
    // ignore storage quota errors
  }
}

function montarMensagemCliente(cli) {
  const nome = cli.CLI_NOME || 'Cliente';
  const contrato = cli.CONT_CODIGO || '';
  const vencimento = cli.VENCIMENTO_FMT || '-';
  const dias = Math.max(0, cli.DIAS_ATRASO || 0);
  const valor = formatarMoedaBR(cli.VALOR);

  return `Olá, *${nome}*! Tudo bem?

Aqui é do setor financeiro da *Portal Software (Yuzuri & Lopes Ltda)*.
Consta em nosso sistema pendência financeira referente ao contrato *#${contrato}*, com vencimento em *${vencimento}* (*${dias} dias de atraso*), no valor de *R$ ${valor}*.

Para sua comodidade, a regularização também pode ser realizada via *PIX*:
🔑 *Chave PIX (CNPJ):* 05.557.971/0001-50
🏢 *Favorecido:* Yuzuri & Lopes Ltda

Pedimos a gentileza de enviar o comprovante ou entrar em contato pelo nosso WhatsApp financeiro *${WHATSAPP_EMPRESA_DISPLAY}* para atualização ou emissão de 2ª via do boleto.

_Caso o pagamento já tenha sido efetuado, por favor desconsidere este aviso._`;
}

function montarMensagemResumoEmpresa(listaClientes, diasMinimos) {
  const hojeFmt = formatarDataBR(new Date());
  const somaTotal = listaClientes.reduce((acc, c) => acc + (parseFloat(c.VALOR) || 0), 0);

  const linhas = listaClientes.map((cli, idx) => {
    const tel = cli.CLI_CELULAR || cli.CLI_FONE || 'Sem telefone';
    const qtd = cli.QTD_BOLETOS || 1;
    const labelBol = qtd === 1 ? '1 bol.' : `${qtd} bols.`;
    return `${idx + 1}. *${cli.CLI_NOME}* (Contrato #${cli.CONT_CODIGO}) | ${labelBol} | Venc.: ${cli.VENCIMENTO_FMT} (${Math.max(0, cli.DIAS_ATRASO)}d) | *R$ ${formatarMoedaBR(cli.VALOR)}* | Tel: ${tel}`;
  });

  return `*Resumo de Clientes Inadimplentes (${diasMinimos}+ dias de atraso)*
Data: ${hojeFmt}
Total de clientes: *${listaClientes.length}*
Valor total em aberto: *R$ ${formatarMoedaBR(somaTotal)}*

${linhas.length > 0 ? linhas.join('\n') : 'Nenhum cliente inadimplente encontrado neste filtro.'}

WhatsApp financeiro para atendimento/comprovantes: ${WHATSAPP_EMPRESA_DISPLAY}`;
}

export default function ClientesReceber() {
  const [clientesDevedores, setClientesDevedores] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [diasMinimos, setDiasMinimos] = useState(5);
  const [busca, setBusca] = useState('');
  const [filtroAviso, setFiltroAviso] = useState('TODOS'); // 'TODOS' | 'PENDENTES' | 'AVISADOS'
  const [avisadosHoje, setAvisadosHoje] = useState(() => lerAvisadosHoje());

  // Modal Contrassenha
  const [clienteSelecionado, setClienteSelecionado] = useState({});
  const [novaSenha, setNovaSenha] = useState('');
  const [dataLimite, setDataLimite] = useState(new Date());
  const [modalGerarAtivo, setModalGerarAtivo] = useState(false);

  // Modal WhatsApp
  const [modalWhatsAppAberto, setModalWhatsAppAberto] = useState(false);
  const [modoWhatsApp, setModoWhatsApp] = useState('cliente'); // 'cliente' | 'resumo'
  const [clienteWhatsApp, setClienteWhatsApp] = useState(null);
  const [telefoneDestino, setTelefoneDestino] = useState('');
  const [mensagemWhatsApp, setMensagemWhatsApp] = useState('');
  const [copiado, setCopiado] = useState(false);

  // Modal Pendências (Faturas Vencidas / A Vencer)
  const [modalPendenciasAberto, setModalPendenciasAberto] = useState(false);
  const [clientePendencias, setClientePendencias] = useState(null);
  const [faturasCliente, setFaturasCliente] = useState([]);
  const [carregandoFaturas, setCarregandoFaturas] = useState(false);
  const [incluirAVencer, setIncluirAVencer] = useState(false);

  // Modal Recibo
  const [modalRecibo, setModalRecibo] = useState(false);
  const [recibo, setRecibo] = useState(null);

  const history = useHistory();

  const fetchClientesDevedores = useCallback(async (diasParam) => {
    const dias = Math.max(1, parseInt(diasParam, 10) || 5);
    setCarregando(true);
    const sql = `SELECT
                    CT.CONT_CODIGO,
                    C.CLI_NOME,
                    CID.CID_NOME,
                    C.CLI_FONE,
                    C.CLI_CELULAR,
                    (SELECT FIRST 1 L.LIC_CODIGO FROM LICENCAS L WHERE L.LIC_CLI = C.CLI_CODIGO ORDER BY L.LIC_CODIGO DESC) AS LIC_CODIGO,
                    (SELECT FIRST 1 L.LIC_SENHA FROM LICENCAS L WHERE L.LIC_CLI = C.CLI_CODIGO ORDER BY L.LIC_CODIGO DESC) AS LIC_SENHA,
                    MIN(R.REC_VENCIMENTO) AS PRIMEIRO_VENCIMENTO,
                    COUNT(R.REC_CODIGO) AS QTD_BOLETOS,
                    SUM(R.REC_VALOR) AS VALOR,
                    SUM(R.REC_JUROS) AS REC_JUROS,
                    SUM(R.REC_DESCONTOS) AS DESCONTOS
                FROM RECEBIMENTOS R
                JOIN FATURAMENTOS F ON R.REC_FAT = F.FAT_CODIGO
                JOIN CLIENTES C ON F.FAT_CLI = C.CLI_CODIGO
                JOIN CONTRATOS CT ON CT.CONT_CLI = C.CLI_CODIGO
                LEFT JOIN CIDADES CID ON C.CLI_CID = CID.CID_CODIGO
                WHERE 
                    CT.CONT_ESTADO = 1
                    AND R.REC_ESTADO = 1
                    AND (R.REC_SITUACAO >= 0 AND R.REC_SITUACAO < 3)
                    AND R.REC_VENCIMENTO <= DATEADD(-${dias} DAY TO CURRENT_DATE)
                    AND R.REC_VALOR > 0
                GROUP BY 
                    CT.CONT_CODIGO,
                    C.CLI_CODIGO,
                    C.CLI_NOME,
                    CID.CID_NOME,
                    C.CLI_FONE,
                    C.CLI_CELULAR
                HAVING
                    SUM(R.REC_VALOR) > 0
                ORDER BY 
                    MIN(R.REC_VENCIMENTO) ASC,
                    C.CLI_NOME ASC;`;
    try {
      const response = await api.post('v1/dataset', { sql });
      const rows = normalizarDataset(response.data);

      const processados = rows.map((row) => {
        const contCodigo = row.CONT_CODIGO ?? row.cont_codigo ?? 0;
        const vencRaw = row.PRIMEIRO_VENCIMENTO ?? row.primeiro_vencimento ?? '';
        const dtVenc = converterDataSegura(vencRaw);
        return {
          CONT_CODIGO: contCodigo,
          CLI_NOME: row.CLI_NOME ?? row.cli_nome ?? '',
          CID_NOME: row.CID_NOME ?? row.cid_nome ?? '',
          CLI_FONE: row.CLI_FONE ?? row.cli_fone ?? '',
          CLI_CELULAR: row.CLI_CELULAR ?? row.cli_celular ?? '',
          LIC_CODIGO: row.LIC_CODIGO ?? row.lic_codigo ?? 0,
          LIC_SENHA: row.LIC_SENHA ?? row.lic_senha ?? '',
          PRIMEIRO_VENCIMENTO: vencRaw,
          VENCIMENTO_FMT: formatarDataBR(dtVenc),
          DIAS_ATRASO: Math.max(0, calcularDiasAtraso(dtVenc)),
          QTD_BOLETOS: Number(row.QTD_BOLETOS ?? row.qtd_boletos ?? 1),
          VALOR: parseFloat(row.VALOR ?? row.valor ?? 0) || 0,
          REC_JUROS: parseFloat(row.REC_JUROS ?? row.rec_juros ?? 0) || 0,
          DESCONTOS: parseFloat(row.DESCONTOS ?? row.descontos ?? 0) || 0,
        };
      });

      setClientesDevedores(processados);
    } catch (error) {
      console.error('Error fetching clientes devedores:', error);
      setClientesDevedores([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    fetchClientesDevedores(diasMinimos);
  }, [diasMinimos, fetchClientesDevedores]);

  const contadoresAviso = useMemo(() => {
    let avisados = 0;
    let pendentes = 0;
    clientesDevedores.forEach((cli) => {
      if (avisadosHoje[String(cli.CONT_CODIGO)]) {
        avisados++;
      } else {
        pendentes++;
      }
    });
    return {
      todos: clientesDevedores.length,
      avisados,
      pendentes,
    };
  }, [clientesDevedores, avisadosHoje]);

  const clientesFiltrados = useMemo(() => {
    const termo = (busca || '').trim().toUpperCase();
    return clientesDevedores.filter((cli) => {
      const estaAvisado = Boolean(avisadosHoje[String(cli.CONT_CODIGO)]);
      if (filtroAviso === 'PENDENTES' && estaAvisado) return false;
      if (filtroAviso === 'AVISADOS' && !estaAvisado) return false;

      if (!termo) return true;
      return (
        String(cli.CLI_NOME || '').toUpperCase().includes(termo) ||
        String(cli.CID_NOME || '').toUpperCase().includes(termo) ||
        String(cli.CONT_CODIGO || '').toUpperCase().includes(termo)
      );
    });
  }, [clientesDevedores, busca, filtroAviso, avisadosHoje]);

  const valorTotalDevedor = useMemo(
    () => clientesFiltrados.reduce((acc, cli) => acc + (parseFloat(cli.VALOR) || 0), 0),
    [clientesFiltrados]
  );

  // Modal Pendências: faturas filtradas e total calculado automaticamente
  const faturasVencidasCount = useMemo(
    () => faturasCliente.filter((f) => f.vencida).length,
    [faturasCliente]
  );

  const faturasExibidasModal = useMemo(() => {
    if (incluirAVencer) return faturasCliente;
    return faturasCliente.filter((f) => f.vencida);
  }, [faturasCliente, incluirAVencer]);

  const totalPendenciasModal = useMemo(
    () => faturasExibidasModal.reduce((acc, f) => acc + (parseFloat(f.valor) || 0), 0),
    [faturasExibidasModal]
  );

  async function abrirModalPendencias(cli) {
    setClientePendencias(cli);
    setIncluirAVencer(false);
    setModalPendenciasAberto(true);
    setCarregandoFaturas(true);
    setFaturasCliente([]);

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
                    CT.CONT_CODIGO = ${Number(cli.CONT_CODIGO)}
                    AND CT.CONT_ESTADO = 1
                    AND R.REC_ESTADO = 1
                    AND (R.REC_SITUACAO >= 0 AND R.REC_SITUACAO < 3)
                    AND R.REC_VALOR > 0
                ORDER BY
                    R.REC_VENCIMENTO ASC,
                    R.REC_CODIGO ASC`;
    try {
      const response = await api.post('v1/dataset', { sql });
      const rows = normalizarDataset(response.data).map((row) => {
        const vencRaw = row.REC_VENCIMENTO ?? row.rec_vencimento ?? '';
        const dtVenc = converterDataSegura(vencRaw);
        const dias = calcularDiasAtraso(dtVenc);
        return {
          codRecebimento: Number(row.REC_CODIGO ?? row.rec_codigo ?? 0),
          duplicata: row.REC_DUPLICATA ?? row.rec_duplicata ?? '',
          valor: parseFloat(row.REC_VALOR ?? row.rec_valor ?? 0) || 0,
          juros: parseFloat(row.REC_JUROS ?? row.rec_juros ?? 0) || 0,
          descontos: parseFloat(row.REC_DESCONTOS ?? row.rec_descontos ?? 0) || 0,
          valorpg: parseFloat(row.VALORPG ?? row.valorpg ?? 0) || 0,
          vencimento: vencRaw,
          vencimentoFmt: formatarDataBR(dtVenc),
          diasAtraso: dias,
          vencida: dias > 0,
          tipo: row.REC_TIPO ?? row.rec_tipo ?? '',
          referencia: row.HON_REFERENCIA ?? row.hon_referencia ?? '',
          nome: row.CLI_NOME ?? row.cli_nome ?? cli.CLI_NOME ?? '',
          endereco: row.CLI_ENDERECO ?? row.cli_endereco ?? '',
          cidade: row.CID_NOME ?? row.cid_nome ?? cli.CID_NOME ?? '',
        };
      });
      setFaturasCliente(rows);
    } catch (err) {
      console.error('Erro ao buscar pendências do cliente:', err);
      setFaturasCliente([]);
    } finally {
      setCarregandoFaturas(false);
    }
  }

  function imprimirReciboFatura(fatura) {
    setRecibo({
      cliente: fatura.nome,
      endereco: (fatura.endereco || '') + (fatura.cidade ? ' - ' + fatura.cidade : ''),
      valor: fatura.valor,
      referencia: 'Mensalidade Ref. A ' + (fatura.referencia || fatura.duplicata),
      valortxt: reaisPorExtenso(fatura.valor),
      venc: extraiDia(fatura.vencimento),
      codPix: fatura.codRecebimento,
    });
    setModalRecibo(true);
  }

  function arquivarFatura(fatura) {
    swal({
      title: 'Arquivar fatura?',
      text: `Deseja arquivar a fatura ${fatura.duplicata || '#' + fatura.codRecebimento} no valor de R$ ${formatarMoedaBR(fatura.valor)}?`,
      icon: 'warning',
      buttons: ['Cancelar', 'Arquivar'],
      dangerMode: true,
    }).then(async (confirmar) => {
      if (!confirmar) return;
      try {
        const sql = `UPDATE RECEBIMENTOS SET REC_SITUACAO = 3 WHERE REC_CODIGO = ${Number(fatura.codRecebimento)}`;
        await api.post('v1/dataset', { sql });
        setFaturasCliente((prev) => prev.filter((item) => item.codRecebimento !== fatura.codRecebimento));
        fetchClientesDevedores(diasMinimos);
        swal('Fatura arquivada com sucesso!', 'A situação da fatura foi alterada para arquivada.', 'success');
      } catch (err) {
        swal('Erro ao arquivar fatura', err.message || 'Falha ao atualizar no banco de dados', 'error');
      }
    });
  }

  function inativarCliente(cli) {
    swal({
      title: 'Inativar cliente?',
      text: `Deseja realmente inativar o contrato #${cli.CONT_CODIGO} de "${cli.CLI_NOME}"? O contrato passará para situação inativa (CONT_ESTADO = 2).`,
      icon: 'warning',
      buttons: ['Cancelar', 'Inativar Cliente'],
      dangerMode: true,
    }).then(async (confirmar) => {
      if (!confirmar) return;
      try {
        const sql = `UPDATE CONTRATOS SET CONT_ESTADO = 2 WHERE CONT_CODIGO = ${Number(cli.CONT_CODIGO)}`;
        await api.post('v1/dataset', { sql });
        setClientesDevedores((prev) => prev.filter((item) => Number(item.CONT_CODIGO) !== Number(cli.CONT_CODIGO)));
        swal('Cliente inativado!', `Contrato #${cli.CONT_CODIGO} marcado como inativo.`, 'success');
      } catch (err) {
        swal('Erro ao inativar cliente', err.message || 'Falha ao atualizar contrato no banco de dados', 'error');
      }
    });
  }

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
        codigo: clienteSelecionado.LIC_CODIGO,
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

  function abrirModalWhatsAppCliente(cli) {
    const telefonePreferencial = cli.CLI_CELULAR || cli.CLI_FONE || '';
    setModoWhatsApp('cliente');
    setClienteWhatsApp(cli);
    setTelefoneDestino(normalizarTelefoneWhatsApp(telefonePreferencial));
    setMensagemWhatsApp(montarMensagemCliente(cli));
    setCopiado(false);
    setModalWhatsAppAberto(true);
  }

  function abrirModalResumoEmpresa() {
    const baseLista = clientesFiltrados.length > 0 ? clientesFiltrados : clientesDevedores;
    setModoWhatsApp('resumo');
    setClienteWhatsApp(null);
    setTelefoneDestino(WHATSAPP_EMPRESA_WA);
    setMensagemWhatsApp(montarMensagemResumoEmpresa(baseLista, diasMinimos));
    setCopiado(false);
    setModalWhatsAppAberto(true);
  }

  async function copiarMensagemWhatsApp() {
    if (!mensagemWhatsApp) return;
    try {
      await navigator.clipboard.writeText(mensagemWhatsApp);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      swal('Não foi possível copiar automaticamente', 'Selecione o texto na caixa e copie manualmente.', 'warning');
    }
  }

  function desmarcarAvisado(contCodigo) {
    const chave = String(contCodigo);
    const atualizado = { ...lerAvisadosHoje() };
    delete atualizado[chave];
    salvarAvisadosHoje(atualizado);
    setAvisadosHoje(atualizado);
  }

  function confirmarEnvioWhatsApp() {
    const numeroLimpo = normalizarTelefoneWhatsApp(telefoneDestino);
    if (!numeroLimpo || numeroLimpo.length < 10) {
      swal(
        'Telefone inválido',
        'Informe um número de WhatsApp válido com DDD (ex: 67999999999) antes de enviar.',
        'warning'
      );
      return;
    }

    const url = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagemWhatsApp)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    if (modoWhatsApp === 'cliente' && clienteWhatsApp?.CONT_CODIGO) {
      const agora = new Date();
      const horaFmt = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
      const atualizados = {
        ...lerAvisadosHoje(),
        [String(clienteWhatsApp.CONT_CODIGO)]: horaFmt,
      };
      salvarAvisadosHoje(atualizados);
      setAvisadosHoje(atualizados);
    }

    setModalWhatsAppAberto(false);
  }

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

      {/* Modal Visualizar Recibo */}
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

      {/* Modal Ver Pendências (Faturas Vencidas / A Vencer) */}
      <Modal
        activate={modalPendenciasAberto}
        setActivate={setModalPendenciasAberto}
        className="max-w-3xl w-full"
      >
        <div className="flex flex-col gap-4">
          {/* Header Modal Pendências */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 pr-8">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Pendências Financeiras
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {clientePendencias?.CLI_NOME} &bull; Contrato #{clientePendencias?.CONT_CODIGO}
                </p>
              </div>
            </div>

            {/* Toggle Vencidas vs Todas em Aberto */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setIncluirAVencer(false)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  !incluirAVencer
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Vencidas ({faturasVencidasCount})
              </button>
              <button
                type="button"
                onClick={() => setIncluirAVencer(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  incluirAVencer
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Todas em Aberto ({faturasCliente.length})
              </button>
            </div>
          </div>

          {/* Conteúdo Tabela de Faturas */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {carregandoFaturas ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                <div className="w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-medium">Carregando faturas em aberto...</span>
              </div>
            ) : faturasExibidasModal.length > 0 ? (
              <div className="overflow-x-auto max-h-[52vh] overflow-y-auto scrollbar-thin">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800/70 text-[11px] font-semibold uppercase text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Duplicata</th>
                      <th className="py-2.5 px-3">Vencimento</th>
                      <th className="py-2.5 px-3 text-right">Valor</th>
                      <th className="py-2.5 px-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                    {faturasExibidasModal.map((fatura, idx) => (
                      <tr
                        key={fatura.codRecebimento || idx}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-3">
                          <div className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                            {fatura.duplicata || `#${fatura.codRecebimento}`}
                          </div>
                          {fatura.referencia && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              Ref.: {fatura.referencia}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-700 dark:text-slate-300">
                              {fatura.vencimentoFmt}
                            </span>
                            {fatura.vencida ? (
                              <Badge variant="destructive" size="sm">
                                {fatura.diasAtraso}d atraso
                              </Badge>
                            ) : (
                              <Badge variant="secondary" size="sm">
                                A vencer
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono font-semibold text-slate-900 dark:text-slate-100">
                          R$ {formatarMoedaBR(fatura.valor)}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <Button
                              variant="indigo"
                              size="sm"
                              Icon={Printer}
                              nome="Recibo"
                              onClick={() => imprimirReciboFatura(fatura)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              Icon={Archive}
                              nome="Arquivar"
                              onClick={() => arquivarFatura(fatura)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                <span className="text-sm font-medium">
                  {incluirAVencer
                    ? 'Nenhuma fatura em aberto encontrada para este cliente.'
                    : 'Nenhuma fatura vencida encontrada.'}
                </span>
              </div>
            )}
          </div>

          {/* Rodapé com Total Calculado Automaticamente */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Total ({faturasExibidasModal.length} {faturasExibidasModal.length === 1 ? 'fatura' : 'faturas'}):
              </span>
              <span className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
                R$ {formatarMoedaBR(totalPendenciasModal)}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              nome="Fechar"
              onClick={() => setModalPendenciasAberto(false)}
            />
          </div>
        </div>
      </Modal>

      {/* Modal Prévia e Envio WhatsApp */}
      <Modal
        activate={modalWhatsAppAberto}
        setActivate={setModalWhatsAppAberto}
        className="max-w-2xl w-full"
      >
        <div className="flex flex-col gap-4">
          {/* Header do Modal */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 pr-8">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-900/50 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {modoWhatsApp === 'cliente'
                  ? 'Enviar Aviso de Cobrança no WhatsApp'
                  : `Resumo Geral para o WhatsApp da Empresa ${WHATSAPP_EMPRESA_DISPLAY}`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {modoWhatsApp === 'cliente' && clienteWhatsApp
                  ? `${clienteWhatsApp.CLI_NOME} • Contrato #${clienteWhatsApp.CONT_CODIGO}`
                  : `Lista consolidada dos clientes com ${diasMinimos}+ dias de atraso`}
              </p>
            </div>
          </div>

          {/* Card Resumo do Cliente */}
          {modoWhatsApp === 'cliente' && clienteWhatsApp && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
              <div>
                <span className="block text-[10px] uppercase font-semibold text-slate-400">
                  Venc. Mais Antigo
                </span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {clienteWhatsApp.VENCIMENTO_FMT}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-semibold text-slate-400">
                  Atraso
                </span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                  {clienteWhatsApp.DIAS_ATRASO} dia(s)
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-semibold text-slate-400">
                  Boletos em Aberto
                </span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {clienteWhatsApp.QTD_BOLETOS}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-semibold text-slate-400">
                  Valor Total
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  R$ {formatarMoedaBR(clienteWhatsApp.VALOR)}
                </span>
              </div>
            </div>
          )}

          {/* Telefone de Destino */}
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="telefoneDestino"
                className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                Número WhatsApp de Destino (DDI + DDD + Número)
              </label>

              {modoWhatsApp === 'cliente' && clienteWhatsApp && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {clienteWhatsApp.CLI_CELULAR && (
                    <button
                      type="button"
                      onClick={() => setTelefoneDestino(normalizarTelefoneWhatsApp(clienteWhatsApp.CLI_CELULAR))}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      Usar Celular: {clienteWhatsApp.CLI_CELULAR}
                    </button>
                  )}
                  {clienteWhatsApp.CLI_FONE && (
                    <button
                      type="button"
                      onClick={() => setTelefoneDestino(normalizarTelefoneWhatsApp(clienteWhatsApp.CLI_FONE))}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Usar Fone: {clienteWhatsApp.CLI_FONE}
                    </button>
                  )}
                </div>
              )}
            </div>
            <Input
              id="telefoneDestino"
              type="text"
              placeholder="Ex: 5567999999999"
              value={telefoneDestino}
              onChange={(e) => setTelefoneDestino(e.target.value)}
              className="font-mono"
            />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {modoWhatsApp === 'cliente'
                ? `O link abrirá o WhatsApp Web conectado no aparelho da empresa (${WHATSAPP_EMPRESA_DISPLAY}) já pronto para enviar ao cliente.`
                : `Será enviado diretamente para o WhatsApp da empresa ${WHATSAPP_EMPRESA_DISPLAY}.`}
            </span>
          </div>

          {/* Mensagem Editável */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="mensagemWhatsApp"
              className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Prévia da Mensagem (Editável)
            </label>
            <Textarea
              id="mensagemWhatsApp"
              rows={10}
              value={mensagemWhatsApp}
              onChange={(e) => setMensagemWhatsApp(e.target.value)}
              className="text-xs leading-relaxed font-sans"
            />
          </div>

          {/* Ações */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              Icon={copiado ? Check : Copy}
              nome={copiado ? 'Texto Copiado!' : 'Copiar Texto'}
              onClick={copiarMensagemWhatsApp}
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                nome="Cancelar"
                onClick={() => setModalWhatsAppAberto(false)}
              />
              <Button
                type="button"
                variant="success"
                Icon={Send}
                nome="Enviar via WhatsApp"
                onClick={confirmarEnvioWhatsApp}
              />
            </div>
          </div>
        </div>
      </Modal>

      <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto p-4 sm:p-6 transition-colors">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
              <DollarSign className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
              Clientes a Receber
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Inadimplentes com {diasMinimos}+ dias de atraso &bull; Avisos via WhatsApp Financeiro{' '}
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {WHATSAPP_EMPRESA_DISPLAY}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
              Total: <span className="font-bold text-slate-800 dark:text-slate-200">{clientesFiltrados.length}</span>{' '}
              {clientesFiltrados.length === 1 ? 'cliente' : 'clientes'}
            </div>
            <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
              Total Devedor:{' '}
              <span className="font-bold">R$ {formatarMoedaBR(valorTotalDevedor)}</span>
            </div>
            <Button
              variant="success"
              size="default"
              Icon={MessageCircle}
              nome={`Resumo no Whats (${WHATSAPP_EMPRESA_DISPLAY})`}
              onClick={abrirModalResumoEmpresa}
              disabled={carregando || clientesDevedores.length === 0}
            />
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Busca e Dias mínimos */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Buscar por cliente, cidade ou contrato..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/70">
              <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                Atraso &ge;
              </span>
              <input
                type="number"
                min={1}
                max={365}
                value={diasMinimos}
                onChange={(e) => setDiasMinimos(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-14 h-7 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-xs font-mono font-semibold text-center text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">dias</span>
              <div className="hidden sm:flex items-center gap-1 ml-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                {[5, 10, 15, 30].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiasMinimos(d)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                      Number(diasMinimos) === d
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              Icon={RefreshCw}
              nome="Atualizar"
              onClick={() => fetchClientesDevedores(diasMinimos)}
              disabled={carregando}
              className="h-9"
            />
          </div>

          {/* Abas de Status de Aviso */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setFiltroAviso('TODOS')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filtroAviso === 'TODOS'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Todos ({contadoresAviso.todos})
            </button>
            <button
              type="button"
              onClick={() => setFiltroAviso('PENDENTES')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filtroAviso === 'PENDENTES'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Pendentes ({contadoresAviso.pendentes})
            </button>
            <button
              type="button"
              onClick={() => setFiltroAviso('AVISADOS')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filtroAviso === 'AVISADOS'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Avisados Hoje ({contadoresAviso.avisados})
            </button>
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
                  <th className="py-3.5 px-4">Vencimento / Atraso</th>
                  <th className="py-3.5 px-4 text-right">Valor Devedor</th>
                  <th className="py-3.5 px-4">Contatos</th>
                  <th className="py-3.5 px-4">Status Aviso</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {carregando ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">Carregando clientes inadimplentes...</span>
                      </div>
                    </td>
                  </tr>
                ) : clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((cli, index) => {
                    const horaAviso = avisadosHoje[String(cli.CONT_CODIGO)];
                    const temTelefone = Boolean(cli.CLI_CELULAR || cli.CLI_FONE);
                    return (
                      <tr
                        key={cli.CONT_CODIGO || index}
                        className={`transition-colors text-slate-800 dark:text-slate-200 ${
                          horaAviso
                            ? 'bg-emerald-50/30 dark:bg-emerald-950/10 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20'
                            : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          #{cli.CONT_CODIGO}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {cli.CLI_NOME}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{cli.CID_NOME || '-'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-700 dark:text-slate-300">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{cli.VENCIMENTO_FMT}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge variant="destructive" size="sm">
                              {cli.DIAS_ATRASO} {cli.DIAS_ATRASO === 1 ? 'dia' : 'dias'}
                            </Badge>
                            {cli.QTD_BOLETOS > 1 && (
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                ({cli.QTD_BOLETOS} boletos)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-right whitespace-nowrap">
                          <Badge variant="destructive" size="sm">
                            R$ {formatarMoedaBR(cli.VALOR)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {temTelefone ? (
                            <div className="flex flex-col gap-0.5 font-mono">
                              {cli.CLI_CELULAR && (
                                <span className="text-slate-800 dark:text-slate-200 font-medium">
                                  Cel: {cli.CLI_CELULAR}
                                </span>
                              )}
                              {cli.CLI_FONE && (
                                <span className="text-slate-500 dark:text-slate-400">
                                  Tel: {cli.CLI_FONE}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Sem telefone</span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {horaAviso ? (
                            <div className="inline-flex items-center gap-1">
                              <Badge variant="success" size="sm" icon={CheckCircle2}>
                                Avisado hoje às {horaAviso}
                              </Badge>
                              <button
                                type="button"
                                onClick={() => desmarcarAvisado(cli.CONT_CODIGO)}
                                title="Desmarcar aviso de hoje"
                                className="p-0.5 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <Badge variant="secondary" size="sm" dot>
                              Pendente
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <Button
                              variant="indigo"
                              size="sm"
                              Icon={FileSpreadsheet}
                              nome="Pendências"
                              onClick={() => abrirModalPendencias(cli)}
                            />
                            <Button
                              variant={horaAviso ? 'outline' : 'success'}
                              size="sm"
                              Icon={MessageCircle}
                              nome={horaAviso ? 'Reenviar' : 'Whats'}
                              onClick={() => abrirModalWhatsAppCliente(cli)}
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              Icon={KeyRound}
                              nome="Bloquear"
                              onClick={() => handleClickGerar(cli)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              Icon={UserX}
                              nome="Inativar"
                              onClick={() => inativarCliente(cli)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-8 h-8 text-emerald-500" />
                        <span className="text-sm font-medium">
                          Nenhum cliente inadimplente com {diasMinimos}+ dias de atraso neste filtro
                        </span>
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
