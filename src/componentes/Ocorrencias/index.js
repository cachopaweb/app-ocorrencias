import React, { useState, useEffect } from 'react';

import { Container } from './styles';
import Card from '../Card';
import api from '../../services/api';

function Ocorrencias() {  
  const [listaOcorrencias, setListaOcorrencias] = useState([]);
 
  async function fetchData() {
    const response = await api.get('/Ocorrencias');  
    setListaOcorrencias(response.data);  
  }
  useEffect(()=> {
    fetchData();
  }, []);
  
  return (
    <Container>
        { 
            listaOcorrencias ? 
              listaOcorrencias.map(
                      oco => <Card key={oco.projeto_Scrum} cliente={oco.cli_nome} ocorrencia={oco.obs} />
              ) 
            : <h1>Carregando</h1>                   
        }
    </Container>
  );
}

export default Ocorrencias;