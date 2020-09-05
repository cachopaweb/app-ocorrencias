import React from 'react';

import { Container } from './styles';

export default function Etiqueta({texto, percentual, cor, corTexto, click, children}) {
  return (
      <Container cor={cor} corTexto={corTexto} onClick={click}>
          <p>{children}</p>
          <p><strong>{texto}</strong></p> 
          <strong id="percent">{`${parseFloat(percentual).toFixed(0)}%`}</strong>
      </Container>
  );
}

 