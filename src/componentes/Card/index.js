import React from 'react';

import { Container } from './styles';
import Button from '../Button';

function Card({ cliente, ocorrencia}) {
  return (
    <Container>
      <div className="content">
        <h3>{cliente}</h3>
        <p>{ocorrencia}</p>        
      </div>
      <div className="actions">
        <Button nome={"Atender"} color={"white"} corTexto={"black"} />
        <Button nome={"Fechar"} color={"white"} corTexto={"black"} />
      </div>
    </Container>);
}

export default Card;