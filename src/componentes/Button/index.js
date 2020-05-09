import React from 'react';

import { Container } from './styles';

function Button({click, nome, color, corTexto, borderRadius}) {
  return (
    <Container color={color} corTexto={corTexto} borderRadius={borderRadius}>
        <button onClick={click}>{nome}</button>
    </Container>
  );
}

export default Button;