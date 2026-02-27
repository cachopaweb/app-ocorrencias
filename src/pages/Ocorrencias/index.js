import React, { useState, useEffect } from 'react';
import { MdAlarm, MdAccountCircle, MdAssessment } from 'react-icons/md';
import PortalIA from '../../componentes/PortalIA';
import swal from 'sweetalert';

import { Container, ContainerEtiquetas, Floating } from './styles';
import Etiqueta from '../../componentes/Etiqueta';
import Card from '../../componentes/Card';
import api from '../../services/api';
import Header from '../../componentes/Header';
import Button from '../../componentes/Button';
import { useHistory } from 'react-router-dom';
import { MdAdd, MdAccountBox, MdTimelapse, MdCheckCircle } from 'react-icons/md'
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
    const response = await api.get('/Ocorrencias');
    if (response.data.length > 0) {
      setListaOcorrencias(response.data);
      setCarregando(false);
    } else {
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
    setCarregandoNotificacoes(false);
  }

  async function filtrarPorUsuario() {
    if (!filtrado) {
      let lista = await listaOcorrencias.filter((ocorrencia) => {
        return (ocorrencia.atendente === cod_funcionario)
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
  }

  return (
    <>
      <Header title={'Ocorrências'} />
      <Floating style={{ marginBottom: 80 }}>
        <Button Icon={MdAccountBox} nome={'Filtrar'} color={'black'} corTexto={'white'} click={() => filtrarPorUsuario()} borderRadius={"18px"} />
        <Button Icon={MdCheckCircle} nome={'Finalizar Não Atendidas'} color={'#27ae60'} corTexto={'white'} click={() => finalizarOcorrenciasNaoAtendidas()} borderRadius={"18px"} style={{ marginLeft: 10 }} />
        <Button Icon={MdAssessment} nome={'Chat'} color={'#1976d2'} corTexto={'#FFF'} click={() => setChatOpen(!chatOpen)} borderRadius={"18px"} style={{ marginLeft: 10 }} />
      </Floating>
      {contrassenhasVencer.length > 0 && <Floating style={{ marginBottom: 140 }}>
        <Button Icon={MdAccountBox} nome={`Licenças a Vencer: ${contrassenhasVencer.length}`} color={'#F00'} corTexto={'#FFF'} click={handleClickContrassenhaVencer} borderRadius={"18px"} />
      </Floating>}
      {carregandoNotificacoes ?
        <Container>
          <h1>Aguarde Carregando notificacões...</h1>
        </Container> :
        (
          <ContainerEtiquetas>
            <Etiqueta key="1" click={() => history.push('/ordensAndamento')} percentual={qtdOs} texto="Ordens" cor="rgb(98, 150, 138)" corTexto="#000"><MdAlarm /></Etiqueta>
            <Etiqueta key="2" click={() => history.push('/')} percentual={qtdOcorrencias} texto="Ocorrências" cor="rgb(255, 92, 89)" corTexto="#000"><MdAccountCircle /></Etiqueta>
            <Etiqueta key="3" click={() => history.push('/scrum')} percentual={qtdScrum} texto="Projetos Scrum" cor="rgb(45, 98, 147)" corTexto="#000"><MdAssessment /></Etiqueta>
            <Etiqueta key="4" click={() => history.push('/ordensAndamento')} percentual={qtdOrdensAtrasadas} texto="Ordens Atrasadas" cor="rgb(153, 0, 0)" corTexto="#FFF"><MdTimelapse /></Etiqueta>
          </ContainerEtiquetas>
        )}
      <Container>
        {
          listaOcorrencias.length > 0 ?
            listaOcorrencias.map(
              oco => <Card key={oco.codigo}
                cliente={oco.cli_nome}
                contrato={oco.contrato}
                projeto_id={oco.projeto_scrum}
                ocorrencia={oco.obs}
                atendente={oco.atendente}
                nomeAtendente={oco.fun_atendente}
                cod_ocorrencia={oco.codigo}
                data={oco.data}
              />
            )
            :
            carregando ?
              <h1>Aguarde Carregando Ocorrencias...</h1>
              : <h1>Nenhuma ocorrencia encontrada</h1>
        }
      </Container>
      <Floating>
        {
          <Button Icon={MdAdd} tamanho_icone={40} borderRadius={"50%"} corTexto={"white"} click={() => history.push('/create')} />
        }
      </Floating>

      <PortalIA isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}

export default Ocorrencias;