import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Filter, 
  CheckCheck, 
  MessageSquare, 
  Plus, 
  AlertCircle, 
  AlertTriangle,
  Clock, 
  Layers, 
  Inbox, 
  Loader2 
} from 'lucide-react';

import PortalIA from '../../componentes/PortalIA';
import swal from '@/lib/feedback';
import Etiqueta from '../../componentes/Etiqueta';
import Card from '../../componentes/Card';
import api from '../../services/api';
import Button from '../../componentes/Button';
import { useUsuario } from '../../context/UsuarioContext';
import useContrassenhaVencer from '../../Hooks/useContrassenha';

function Ocorrencias() {
  const [listaOcorrencias, setListaOcorrencias] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoNotificacoes, setCarregandoNotificacoes] = useState(false);
  const [filtrado, setFiltrado] = useState(false);
  const [qtdOs, setQtdOs] = useState(0);
  const [qtdOcorrencias, setQtdOcorrencias] = useState(0);
  const [qtdScrum, setQtdScrum] = useState(0);
  const [qtdOrdensAtrasadas, SetQtdOrdensAtrasadas] = useState(0);
  const history = useHistory();
  const { cod_funcionario } = useUsuario();
  const contrassenhasVencer = useContrassenhaVencer();
  const [chatOpen, setChatOpen] = useState(false);

  async function fetchData() {
    setCarregando(true);
    try {
      const response = await api.get('/Ocorrencias');
      if (response.data && response.data.length > 0) {
        setListaOcorrencias(response.data);
      } else {
        setListaOcorrencias([]);
      }
    } catch (error) {
      console.error("Erro ao buscar ocorrências:", error);
      setListaOcorrencias([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  async function fetchNotificacoes() {
    setCarregandoNotificacoes(true);
    try {
      const responseOrdens = await api.get('/notificacoes/ordens');
      const { ordens } = responseOrdens.data;
      setQtdOs(ordens);
      ////
      const responseOcorrencias = await api.get('/notificacoes/ocorrencias');
      const { ocorrencias } = responseOcorrencias.data;
      setQtdOcorrencias(ocorrencias);
      ////
      const responseScrum = await api.get('/notificacoes/projetos_scrum');
      const { scrum } = responseScrum.data;
      setQtdScrum(scrum);
      ////
      const responseOrdensAtrasadas = await api.get('/notificacoes/ordensAtradas/1');
      const { ordensAtradas } = responseOrdensAtrasadas.data;
      SetQtdOrdensAtrasadas(ordensAtradas);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setCarregandoNotificacoes(false);
    }
  }

  async function filtrarPorUsuario() {
    if (!filtrado) {
      let lista = listaOcorrencias.filter((ocorrencia) => {
        return (ocorrencia.atendente === cod_funcionario);
      });
      setListaOcorrencias(lista);
      setFiltrado(true);
    } else {
      setFiltrado(false);
      fetchData();
    }
  }

  async function finalizarOcorrenciasNaoAtendidas() {
    const ocorrenciasNaoAtendidas = listaOcorrencias.filter((oco) => oco.atendente === 0 || oco.atendente === null);
    
    if (ocorrenciasNaoAtendidas.length === 0) {
      swal("Nenhuma ocorrência não atendida!", "Todas as ocorrências já foram atendidas.", "info");
      return;
    }

    swal({
      title: "Finalizar Ocorrências",
      text: `Tem certeza que deseja finalizar ${ocorrenciasNaoAtendidas.length} ocorrência(s) não atendida(s)? Será adicionado você como atendente e 10 minutos como tempo de atendimento.`,
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        setCarregando(true);
        let sucessos = 0;
        let erros = 0;

        for (const ocorrencia of ocorrenciasNaoAtendidas) {
          try {
            // Primeiro atende a ocorrência
            const requestAtender = {
              fun_codigo: cod_funcionario
            };
            await api.put(`/Ocorrencias/${ocorrencia.codigo}`, JSON.stringify(requestAtender));

            // Depois finaliza com 10 minutos
            const requestFinalizar = {
              fun_codigo: cod_funcionario,
              finalizada: 'S',
              tempoAtendimento: 10
            };
            const response = await api.put(`/Ocorrencias/${ocorrencia.codigo}`, JSON.stringify(requestFinalizar));
            
            if (response.data.fun_codigo > 0) {
              sucessos++;
            } else {
              erros++;
            }
          } catch (error) {
            erros++;
            console.error(`Erro ao finalizar ocorrência ${ocorrencia.codigo}:`, error);
          }
        }

        setCarregando(false);
        swal(
          `Processo Concluído!`,
          `${sucessos} ocorrência(s) finalizada(s) com sucesso. ${erros > 0 ? `${erros} erro(s) encontrado(s).` : ''}`,
          sucessos > 0 ? "success" : "error"
        ).then(() => {
          window.location.reload();
        });
      }
    });
  }

  const handleClickContrassenhaVencer = () => {
    history.push({ pathname: '/licencas', state: { licencasVencer: contrassenhasVencer } });
  };

  return (
    <div className="flex flex-col h-full gap-4 w-full max-w-7xl mx-auto p-4 sm:p-6 transition-colors">
      
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-lg shadow-2xs border border-slate-200/80 dark:border-slate-800/80 mb-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">Painel de Ocorrências</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Acompanhe e atenda os chamados em aberto</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {contrassenhasVencer.length > 0 && (
            <Button 
              variant="destructive"
              size="default"
              Icon={AlertTriangle} 
              nome={`Licenças a Vencer: ${contrassenhasVencer.length}`} 
              onClick={handleClickContrassenhaVencer} 
            />
          )}
          <Button 
            variant={filtrado ? "indigo" : "outline"}
            size="default"
            Icon={Filter} 
            nome={filtrado ? "Filtrado (Usuário)" : "Filtrar por Usuário"} 
            onClick={filtrarPorUsuario} 
          />
          <Button 
            variant="outline"
            size="default"
            Icon={CheckCheck} 
            nome="Finalizar Não Atendidas" 
            onClick={finalizarOcorrenciasNaoAtendidas} 
          />
          <Button 
            variant="outline"
            size="default"
            Icon={MessageSquare} 
            nome="Assistente IA" 
            onClick={() => setChatOpen(!chatOpen)} 
          />
          <Button 
            variant="indigo"
            size="default"
            Icon={Plus} 
            nome="Nova Ocorrência" 
            onClick={() => history.push('/create')} 
          />
        </div>
      </div>
      
      {/* Grid de Métricas */}
      {carregandoNotificacoes ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-24 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800/80 p-4 animate-pulse flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="w-20 h-3.5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="w-5 h-5 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
          <Etiqueta 
            key="1" 
            onClick={() => history.push('/ordensAndamento')} 
            percentual={qtdOs} 
            texto="Ordens"
          >
            <Clock className="w-4 h-4" />
          </Etiqueta>
          <Etiqueta 
            key="2" 
            onClick={() => history.push('/')} 
            percentual={qtdOcorrencias} 
            texto="Ocorrências"
          >
            <Inbox className="w-4 h-4" />
          </Etiqueta>
          <Etiqueta 
            key="3" 
            onClick={() => history.push('/scrum')} 
            percentual={qtdScrum} 
            texto="Projetos Scrum"
          >
            <Layers className="w-4 h-4" />
          </Etiqueta>
          <Etiqueta 
            key="4" 
            onClick={() => history.push('/ordensAndamento')} 
            percentual={qtdOrdensAtrasadas} 
            texto="Ordens Atrasadas"
          >
            <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
          </Etiqueta>
        </div>
      )}
        
      {/* Feed de Cards */}
      <div className="flex flex-col items-center gap-3 w-full pb-20">
        {carregando ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-medium">Aguarde, carregando ocorrências...</span>
          </div>
        ) : listaOcorrencias.length > 0 ? (
          listaOcorrencias.map((oco) => (
            <Card 
              key={oco.codigo}
              cliente={oco.cli_nome}
              contrato={oco.contrato}
              projeto_id={oco.projeto_scrum}
              ocorrencia={oco.obs}
              atendente={oco.atendente}
              nomeAtendente={oco.fun_atendente}
              cod_ocorrencia={oco.codigo}
              data={oco.data}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-14 px-4 text-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800/80 w-full max-w-4xl shadow-2xs">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg mb-3 text-slate-400 dark:text-slate-500">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Nenhuma ocorrência encontrada</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Não há chamados pendentes no momento. Clique em "Nova Ocorrência" para cadastrar um atendimento.
            </p>
          </div>
        )}
      </div>

      <PortalIA isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

export default Ocorrencias;