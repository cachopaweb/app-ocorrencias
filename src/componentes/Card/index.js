import React, { useState, useContext } from 'react';

import { Container } from './styles';
import Button from '../Button';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import { UsuarioContext } from '../../context/UsuarioContext';

function Card({ cliente, ocorrencia, atendente = 0, nomeAtendente, cod_ocorrencia}) {
  const history = useHistory();
  const [funAtendente, setFunAtendente] = useState(atendente);
  const [nome_atendente, setNome_Atendente] = useState(nomeAtendente);
  const { state } = useContext(UsuarioContext);
  const [fechada, setFechada] = useState(false);

  async function Atender(){
    const request = {
      fun_codigo: state.user.codigo
    }
    const response = await api.put('/Ocorrencias/'+cod_ocorrencia, JSON.stringify(request));
    if (response.data.fun_codigo > 0){
      setFunAtendente(response.data.fun_codigo)
      setNome_Atendente(state.user.nome);
    }
  }

  async function finalizar(){
    const request = {
      fun_codigo: state.user.codigo,
      finalizada: 'S'
    }
    const response = await api.put('/Ocorrencias/'+cod_ocorrencia, JSON.stringify(request));
    if (response.data.fun_codigo > 0){
      setFechada(true);
    }  
  }
  
  return fechada ? null
  :(
    
    <Container atendente={funAtendente}>
      <div className="content">
        <h3>{cliente}</h3>
        <p>{ocorrencia}</p> 
        {funAtendente ? <span>{nome_atendente}</span> : <span>Nao atendida</span>}     
      </div>
      <div className="actions">
        <Button click={Atender} nome={"Atender"} color={"white"} corTexto={"black"} borderRadius={'30px'} />
        <Button click={finalizar} nome={"Fechar"} color={"white"} corTexto={"black"} borderRadius={'30px'} />
      </div>
    </Container>
  );
}

export default Card;