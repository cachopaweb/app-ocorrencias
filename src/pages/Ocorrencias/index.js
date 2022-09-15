import React, { useState, useEffect } from 'react';
import { MdAlarm, MdAccountCircle, MdAssessment } from 'react-icons/md';

import { Container, ContainerEtiquetas, Floating } from './styles';
import Etiqueta from '../../componentes/Etiqueta';
import Card from '../../componentes/Card';
import api from '../../services/api';
import Header from '../../componentes/Header';
import Button from '../../componentes/Button';
import { useHistory } from 'react-router-dom';
import { MdAdd, MdAccountBox, MdTimelapse } from 'react-icons/md'
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

  function converteData(data) {
    let arrayData = data.split('/');
    let date = new Date(parseInt(arrayData[2] + '20'), arrayData[0] - 1, arrayData[1]);
    return date;
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

  const handleClickContrassenhaVencer = () => {
    history.push({ pathname: '/licencas', state: { licencasVencer: contrassenhasVencer } });
  }

  return (
    <>
      <Header title={'Ocorrências'} />
      <Floating style={{ marginBottom: 80 }}>
        <Button Icon={MdAccountBox} nome={'Filtrar'} color={'black'} corTexto={'white'} click={() => filtrarPorUsuario()} borderRadius={"18px"} />
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
            <Etiqueta key="2" click={() => history.push('/ocorrencias')} percentual={qtdOcorrencias} texto="Ocorrências" cor="rgb(255, 92, 89)" corTexto="#000"><MdAccountCircle /></Etiqueta>
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
    </>
  );
}

export default Ocorrencias;