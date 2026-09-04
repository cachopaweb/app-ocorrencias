import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  FileCheck2, 
  UserX, 
  ServerCrash, 
  Code2, 
  HelpCircle, 
  ListFilter, 
  PhoneCall, 
  Layers, 
  BarChart3, 
  PieChart, 
  Inbox, 
  Loader2 
} from 'lucide-react';
import swal from '@/lib/feedback';

import api from '../../services/api';
import FiltroData from '../../componentes/FiltroData';
import Etiqueta from '../../componentes/Etiqueta';
import { DonutTiposOcorrencias, DonutTiposOrdemOcorrencia, Graficos, Tabela } from '../../componentes/Graficos2';
import { tipo_erro } from '../../constants';

function OcorrenciasFinalizadas() {
  const [ocorrencias, SetOcorrencias] = useState([]);
  const [ocorrenciasFiltro, setOcorrenciasFiltro] = useState([]);
  const [dataInicial, setDataInicial] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());
  const [codContrato, setCodContrato] = useState(0);
  const [OrdensGeradas, setOrdensGeradas] = useState(0);
  const [ErroUsuario, setErroUsuario] = useState(0);
  const [ErroSistema, setErroSistema] = useState(0);
  const [ProgramacaoNova, setProgramacaoNova] = useState(0);
  const [DuvidaUsuario, setDuvidaUsuario] = useState(0);
  const [Outros, setOutros] = useState(0);
  const [ligacaoDeRotina, setLigacaoDeRotina] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [dadosGrafico, setDadosGrafico] = useState({});
  const [dadosDonutUm, setDadosDonutUm] = useState({});
  const [dadosDonutDois, setDadosDonutDois] = useState({});
  const [dadosTabela, setDadosTabela] = useState({});

  async function ContaOrdens(auxOcorrencias) {
    let erroSistemaPorc = 0;
    let erroUsuarioPorc = 0;
    let progNovaPorc = 0;
    let duvidaUsuarioPorc = 0;
    let outrosPorc = 0;
    let ligacaoDeRotinaPorc = 0;
    let erroSistemaOrdem = 0;
    let implementacaNovaOrdem = 0;
    let outrosOrdem = 0;

    let totalOcorrencias = auxOcorrencias.length;
    if (totalOcorrencias === 0) {
      setOrdensGeradas(0);
      setErroSistema(0);
      setErroUsuario(0);
      setProgramacaoNova(0);
      setDuvidaUsuario(0);
      setOutros(0);
      setLigacaoDeRotina(0);
      setDadosDonutUm({ labels: [], datasets: [] });
      setDadosDonutDois({ labels: [], datasets: [] });
      return;
    }

    // ordens geradas
    let gerouOrdens = auxOcorrencias.filter((oco) => {
      return oco.abriuOS === 'SIM';
    });

    gerouOrdens.forEach((ordem) => {
      if (ordem.ocorrencia === 'ERRO DE SISTEMA') {
        erroSistemaOrdem++;
      } else if (ordem.ocorrencia === 'IMPLEMENTACAO NOVA') {
        implementacaNovaOrdem++;
      } else if (ordem.ocorrencia === 'OUTROS') {
        outrosOrdem++;
      }
    });

    let numOrdensGeradas = gerouOrdens.length;
    setOrdensGeradas((numOrdensGeradas / totalOcorrencias) * 100);

    // erro de sistema
    let erroSistema = ContaTipoOcorrencia('ERRO DE SISTEMA', auxOcorrencias);
    if (erroSistema > 0) {
      erroSistemaPorc = (erroSistema / totalOcorrencias) * 100;
      setErroSistema(erroSistemaPorc);
    } else {
      setErroSistema(0);
    }

    // erro de usuario
    let erroUsuario = ContaTipoOcorrencia('ERRO DE USUARIO', auxOcorrencias);
    if (erroUsuario > 0) {
      erroUsuarioPorc = (erroUsuario / totalOcorrencias) * 100;
      setErroUsuario(erroUsuarioPorc);
    } else {
      setErroUsuario(0);
    }

    // implementacao nova
    let progNova = ContaTipoOcorrencia('IMPLEMENTACAO NOVA', auxOcorrencias);
    if (progNova > 0) {
      progNovaPorc = (progNova / totalOcorrencias) * 100;
      setProgramacaoNova(progNovaPorc);
    } else {
      setProgramacaoNova(0);
    }

    // duvida usuario
    let duvida = ContaTipoOcorrencia('DUVIDA USUARIO', auxOcorrencias);
    if (duvida > 0) {
      duvidaUsuarioPorc = (duvida / totalOcorrencias) * 100;
      setDuvidaUsuario(duvidaUsuarioPorc);
    } else {
      setDuvidaUsuario(0);
    }

    // outros
    let outros = ContaTipoOcorrencia('OUTROS', auxOcorrencias);
    if (outros > 0) {
      outrosPorc = (outros / totalOcorrencias) * 100;
      setOutros(outrosPorc);
    } else {
      setOutros(0);
    }

    // ligacao de rotina
    let ligacaoRotina = ContaTipoOcorrencia('LIGAÇÃO DE ROTINA', auxOcorrencias);
    if (ligacaoRotina > 0) {
      ligacaoDeRotinaPorc = (ligacaoRotina / totalOcorrencias) * 100;
      setLigacaoDeRotina(ligacaoDeRotinaPorc);
    } else {
      setLigacaoDeRotina(0);
    }

    setDadosDonutUm({
      labels: [
        'ERRO DE SISTEMA',
        'ERRO DE USUARIO',
        'IMPLEMENTACAO NOVA',
        'DUVIDA USUARIO',
        'OUTROS',
        'LIGAÇÃO DE ROTINA'
      ],
      datasets: [
        {
          label: 'Percentual',
          data: [
            erroSistemaPorc,
            erroUsuarioPorc,
            progNovaPorc,
            duvidaUsuarioPorc,
            outrosPorc,
            ligacaoDeRotinaPorc
          ],
          backgroundColor: [
            '#6366f1',
            '#ec4899',
            '#f43f5e',
            '#10b981',
            '#06b6d4',
            '#8b5cf6'
          ]
        }
      ]
    });

    setDadosDonutDois({
      labels: ['ERRO DE SISTEMA', 'IMPLEMENTAÇÃO NOVA', 'OUTROS'],
      datasets: [
        {
          label: 'Ordens',
          data: [erroSistemaOrdem, implementacaNovaOrdem, outrosOrdem],
          backgroundColor: ['#6366f1', '#ec4899', '#f43f5e']
        }
      ]
    });
  }

  async function carregaDadosTabela(auxOcorrencias) {
    let totalOcorrencias = auxOcorrencias.length;
    let gerouOrdens = auxOcorrencias.filter((oco) => oco.abriuOS === 'SIM');
    let numOrdensGeradas = gerouOrdens.length;

    setDadosTabela({
      ordens: numOrdensGeradas,
      ocorrencias: totalOcorrencias
    });
  }

  function MontaDadosGrafico() {
    let dados = {
      labels: [
        'ERRO DE SISTEMA',
        'ERRO DE USUARIO',
        'IMPLEMENTACAO NOVA',
        'DUVIDA USUARIO',
        'OUTROS',
        'LIGAÇÃO DE ROTINA'
      ],
      datasets: [
        {
          label: 'ERRO DE SISTEMA',
          backgroundColor: 'rgba(99, 102, 241, 0.85)',
          borderWidth: 1,
          data: [ErroSistema, 0, 0, 0, 0, 0]
        },
        {
          label: 'ERRO DE USUARIO',
          backgroundColor: 'rgba(236, 72, 153, 0.85)',
          borderWidth: 1,
          data: [0, ErroUsuario, 0, 0, 0, 0]
        },
        {
          label: 'IMPLEMENTACAO NOVA',
          backgroundColor: 'rgba(244, 63, 94, 0.85)',
          borderWidth: 1,
          data: [0, 0, ProgramacaoNova, 0, 0, 0]
        },
        {
          label: 'DUVIDA USUARIO',
          backgroundColor: 'rgba(16, 185, 129, 0.85)',
          borderWidth: 1,
          data: [0, 0, 0, DuvidaUsuario, 0, 0]
        },
        {
          label: 'OUTROS',
          backgroundColor: 'rgba(6, 182, 212, 0.85)',
          borderWidth: 1,
          data: [0, 0, 0, 0, Outros, 0]
        },
        {
          label: 'LIGAÇÃO DE ROTINA',
          backgroundColor: 'rgba(139, 92, 246, 0.85)',
          borderWidth: 1,
          data: [0, 0, 0, 0, 0, ligacaoDeRotina]
        }
      ]
    };
    setDadosGrafico(dados);
  }

  function ContaTipoOcorrencia(tipo, auxOcorrencias) {
    let contador = auxOcorrencias.filter((oco) => oco.ocorrencia === tipo);
    return contador.length;
  }

  function FiltrarPorTipoErro(tipo) {
    if (tipo === -1) {
      SetOcorrencias(ocorrenciasFiltro);
      return;
    }
    let erro = tipo_erro[tipo];
    if (!erro) return;
    let ocorrenciasfiltrada = ocorrenciasFiltro.filter((oco) => {
      return oco.ocorrencia === String(erro.tipo).toUpperCase();
    });
    SetOcorrencias(ocorrenciasfiltrada);
  }

  async function CarregaDadosOcorrencias() {
    setCarregando(true);
    try {
      let response = await api.get('/OcorrenciasFinalizadas');
      const dados = response.data || [];
      await carregaDadosTabela(dados);
      SetOcorrencias(dados);
      setOcorrenciasFiltro(dados);
      await ContaOrdens(dados);
    } catch (error) {
      console.error('Erro ao carregar dados de ocorrências:', error);
      swal('Erro', 'Não foi possível carregar as ocorrências', 'error');
    } finally {
      setCarregando(false);
    }
  }

  async function CarregaDadosOcorrenciasFiltrada() {
    setCarregando(true);
    try {
      let response = '';
      if (codContrato === 0) {
        response = await api.get(
          `/OcorrenciasFinalizadas?dataInicial=${dataInicial.toLocaleDateString()}&dataFinal=${dataFinal.toLocaleDateString()}`
        );
      } else {
        response = await api.get(`/OcorrenciasFinalizadas?contrato=${codContrato}`);
      }
      const dados = response.data || [];
      SetOcorrencias(dados);
      setOcorrenciasFiltro(dados);
      await carregaDadosTabela(dados);
      await ContaOrdens(dados);
    } catch (error) {
      console.error('Erro ao filtrar ocorrências:', error);
      swal('Erro', 'Não foi possível buscar as ocorrências filtradas', 'error');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    CarregaDadosOcorrencias();
  }, []);

  useEffect(() => {
    MontaDadosGrafico();
  }, [ErroSistema, ErroUsuario, ProgramacaoNova, DuvidaUsuario, Outros, ligacaoDeRotina]);

  function handleFiltro(e) {
    e.preventDefault();
    CarregaDadosOcorrenciasFiltrada();
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 w-full">
      {/* Header da Página */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            Ocorrências Finalizadas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Métricas de atendimento, tipos de erros e histórico consolidado
          </p>
        </div>
      </div>

      {/* Filtro de Dados */}
      <div className="mb-6">
        <FiltroData
          funcSubmitted={handleFiltro}
          dataInic={setDataInicial}
          dataFin={setDataFinal}
          setCodContrato={setCodContrato}
        />
      </div>

      {/* Seção de Métricas / Etiquetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
        <Etiqueta
          click={() => FiltrarPorTipoErro(-1)}
          texto="Ordens Geradas"
          percentual={OrdensGeradas}
        >
          <FileCheck2 className="w-5 h-5" />
        </Etiqueta>
        <Etiqueta
          click={() => FiltrarPorTipoErro(0)}
          texto="Erro Usuário"
          percentual={ErroUsuario}
        >
          <UserX className="w-5 h-5" />
        </Etiqueta>
        <Etiqueta
          click={() => FiltrarPorTipoErro(1)}
          texto="Erro Sistema"
          percentual={ErroSistema}
        >
          <ServerCrash className="w-5 h-5" />
        </Etiqueta>
        <Etiqueta
          click={() => FiltrarPorTipoErro(2)}
          texto="Prog. Nova"
          percentual={ProgramacaoNova}
        >
          <Code2 className="w-5 h-5" />
        </Etiqueta>
        <Etiqueta
          click={() => FiltrarPorTipoErro(3)}
          texto="Dúvida Usuário"
          percentual={DuvidaUsuario}
        >
          <HelpCircle className="w-5 h-5" />
        </Etiqueta>
        <Etiqueta
          click={() => FiltrarPorTipoErro(4)}
          texto="Outros"
          percentual={Outros}
        >
          <ListFilter className="w-5 h-5" />
        </Etiqueta>
        <Etiqueta
          click={() => FiltrarPorTipoErro(5)}
          texto="Ligação Rotina"
          percentual={ligacaoDeRotina}
        >
          <PhoneCall className="w-5 h-5" />
        </Etiqueta>
      </div>

      {/* Seção de Gráficos e Tabela de Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Tabela de Resumo */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Resumo Consolidado
            </h2>
          </div>
          {carregando ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              <span className="text-sm">Carregando métricas...</span>
            </div>
          ) : (
            <Tabela data={dadosTabela} />
          )}
        </div>

        {/* Gráfico de Barras Horizontais */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Estatísticas de Ocorrências
            </h2>
          </div>
          <Graficos
            titulo="Distribuição de Ocorrências"
            tipo="horizontalBar"
            data={dadosGrafico}
          />
        </div>
      </div>

      {/* Gráficos Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Percentual por Tipo de Ocorrência
            </h2>
          </div>
          <DonutTiposOcorrencias data={dadosDonutUm} />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Ordens de Serviço por Tipo
            </h2>
          </div>
          <DonutTiposOrdemOcorrencia data={dadosDonutDois} />
        </div>
      </div>

      {/* Listagem de Ocorrências Finalizadas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Histórico de Ocorrências
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detalhamento dos atendimentos concluídos
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
            {ocorrencias.length} {ocorrencias.length === 1 ? 'ocorrência' : 'ocorrências'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <th className="py-3.5 px-4">Código</th>
                <th className="py-3.5 px-4">Ocorrência</th>
                <th className="py-3.5 px-4">Tipo Erro</th>
                <th className="py-3.5 px-4">Data Finalização</th>
                <th className="py-3.5 px-4">Quem Atendeu</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4 text-center">Abriu OS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {carregando ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
                      <span className="text-sm font-medium">Carregando ocorrências...</span>
                    </div>
                  </td>
                </tr>
              ) : ocorrencias.length > 0 ? (
                ocorrencias.map((oco) => (
                  <tr
                    key={oco.codigo}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-xs text-slate-600 dark:text-slate-400">
                      #{oco.codigo}
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-slate-100 max-w-xs break-words">
                      {oco.obs}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {oco.ocorrencia}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {oco.dataFinalizada ? new Date(oco.dataFinalizada).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {oco.fun_atendente || '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-slate-100 font-medium">
                      {oco.cli_nome || '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {oco.abriuOS === 'SIM' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                          SIM
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          NÃO
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox className="w-8 h-8 text-slate-400" />
                      <span className="text-sm font-medium">Nenhuma ocorrência encontrada</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OcorrenciasFinalizadas;