import React, { useState, useEffect } from 'react';

import { Container, Floating } from './styles';
import Card from '../../componentes/Card';
import api from '../../services/api';
import Header from '../../componentes/Header';
import Button from '../../componentes/Button';
import { useHistory } from 'react-router-dom';
import { MdAdd, MdAccountBox } from 'react-icons/md'
import { useUsuario } from '../../context/UsuarioContext';

function Ocorrencias() {  
  const [listaOcorrencias, setListaOcorrencias] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [filtrado, setFiltrado] = useState(false);
  const [contrassenhasVencer, setContrassenhasVencer] = useState([]);
  const history = useHistory();
  const { cod_funcionario } = useUsuario();

  async function fetchData() {
    setCarregando(true);
    const response = await api.get('/Ocorrencias');  
    if (response.data.length > 0)
    {
      setListaOcorrencias(response.data);  
      setCarregando(false);
    }else{
      setCarregando(false);
    }
  }

  async function fetchContrassenhasVencer(){
    let diasVencer = 30;
    let response = await api.get(`/contrassenha?dias=${diasVencer}`);
    console.log(response.data)
    if (response.status === 200) {
      setContrassenhasVencer(response.data);
    }
  }

  useEffect(()=> {
    fetchData();
  }, []);

  useEffect(()=>{
    fetchContrassenhasVencer();
  }, [])

  function converteData(data){
    let arrayData = data.split('/');
    let date = new Date(parseInt(arrayData[2]+'20'), arrayData[0]-1, arrayData[1]);
    return date;    
  }

  async function filtrarPorUsuario(){
    if (!filtrado){
      let lista = await listaOcorrencias.filter((ocorrencia)=> {
        return (ocorrencia.atendente === cod_funcionario)
      });
      setListaOcorrencias(lista);
      setFiltrado(true);
    }else{
      setFiltrado(false);
      fetchData();
    }
  }

  const handleClickContrassenhaVencer = () =>{
    history.push({ pathname: '/licencas', state: { licencasVencer: contrassenhasVencer} });
  }
  
  return (
    <>
    <Header title={'Ocorrências'} />   
      <Floating style={{ marginBottom: 80}}>
        <Button Icon={MdAccountBox} nome={'Filtrar'} color={'black'} corTexto={'white'} click={()=> filtrarPorUsuario()} borderRadius={"18px"} />           
      </Floating>
      {contrassenhasVencer.length && <Floating style={{ marginBottom: 140}}>
        <Button Icon={MdAccountBox} nome={`Licenças a Vencer: ${contrassenhasVencer.length}`} color={'#F00'} corTexto={'#FFF'} click={handleClickContrassenhaVencer} borderRadius={"18px"} />           
      </Floating>}
      <Container>
          { 
              listaOcorrencias.length > 0 ? 
                listaOcorrencias.map(
                        oco => <Card key={oco.codigo} cliente={oco.cli_nome} contrato={oco.contrato} projeto_id={oco.projeto_scrum} ocorrencia={oco.obs} atendente={oco.atendente} nomeAtendente={oco.fun_atendente} cod_ocorrencia={oco.codigo} data={converteData(oco.data)} />
                ) 
              : 
              carregando ?
                <h1>Aguarde Carregando Ocorrencias...</h1>                   
                : <h1>Nenhuma ocorrencia encontrada</h1>
          }                 
      </Container>
      <Floating>
        {
          <Button Icon={MdAdd} tamanho_icone={40} borderRadius={"50%"} corTexto={"white"} click={()=> history.push('/create')} />          
        } 
      </Floating>
    </>
  );
}

export default Ocorrencias;