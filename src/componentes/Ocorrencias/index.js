import React, { useState, useEffect } from 'react';

import { Container } from './styles';
import Card from '../Card';
import api from '../../services/api';

function Ocorrencias() {  
  const [listaOcorrencias, setListaOcorrencias] = useState([]);
  const [atualizar, setAtualizar] = useState(false);
  async function fetchData() {
    const response = await api.get('/Ocorrencias');  
    setListaOcorrencias(response.data);  
  }
  useEffect(()=> {
    fetchData();
  }, [atualizar]);
  
  return (
    <Container>
        { 
            listaOcorrencias ? 
              listaOcorrencias.map(
                      oco => <Card atualizar={setAtualizar} key={oco.codigo} cliente={oco.cli_nome} ocorrencia={oco.obs} funcionario={oco.fun_nome} cod_ocorrencia={oco.codigo} />
              ) 
            : <h1>Carregando</h1>                   
        }
    </Container>
  );
}

export default Ocorrencias;