import React, { useState, useEffect, useContext } from 'react';

import { Container } from './styles';
import Card from '../Card';
import api from '../../services/api';
import Button from '../Button';
import { useHistory } from 'react-router-dom';
import { UsuarioContext } from '../../context/UsuarioContext';

function Ocorrencias() {  
  const [listaOcorrencias, setListaOcorrencias] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const history = useHistory();

  async function fetchData() {
    setCarregando(true);
    const response = await api.get('/Ocorrencias');  
    if (response.data.length > 0)
      setListaOcorrencias(response.data);  
    else{
      setCarregando(false);
    }
  }
  useEffect(()=> {
    fetchData();
  }, []);


  
  return (
    <Container>
        { 
            listaOcorrencias.length > 0 ? 
              listaOcorrencias.map(
                      oco => <Card key={oco.codigo} cliente={oco.cli_nome} ocorrencia={oco.obs} atendente={oco.atendente} nomeAtendente={oco.fun_atendente} cod_ocorrencia={oco.codigo} />
              ) 
            : 
            carregando ?
              <h1>Aguarde Carregando Ocorrencias...</h1>                   
              : <h1>Nenhuma ocorrencia encontrada</h1>
        }
        {
          <Button nome={"Nova Ocorrencia"} borderRadius={"30px"} corTexto={"white"} click={()=> history.push('/create')} />
        }        
    </Container>
  );
}

export default Ocorrencias;