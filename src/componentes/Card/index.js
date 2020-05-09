import React from 'react';

import { Container } from './styles';
import Button from '../Button';
import api from '../../services/api';

function Card({ atualizar, cliente, ocorrencia, funcionario, cod_ocorrencia}) {
  async function Atender(){
    const request = {
      fun_codigo: 1
    }
    const response = await api.put('/Ocorrencias/'+cod_ocorrencia, JSON.stringify(request));
    alert('Atualizado para o atendente: '+response.data.fun_codigo);
    atualizar(true);
  }

  async function finalizar(){
    const request = {
      fun_codigo: 1,
      finalizada: 'S'
    }
    const response = await api.put('/Ocorrencias/'+cod_ocorrencia, JSON.stringify(request));
    alert('Ocorrencia finalizada: '+response.data.fun_codigo);
    atualizar(true);
  }
  return (
    <Container>
      <div className="content">
        <h3>{cliente}</h3>
        <p>{ocorrencia}</p>  
        <span>{funcionario}</span>      
      </div>
      <div className="actions">
        <Button click={Atender} nome={"Atender"} color={"white"} corTexto={"black"} borderRadius={'30px'} />
        <Button click={finalizar} nome={"Fechar"} color={"white"} corTexto={"black"} borderRadius={'30px'} />
      </div>
    </Container>);
}

export default Card;