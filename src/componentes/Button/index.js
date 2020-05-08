import React from 'react';

import { Container } from './styles';

function Button({nome, color, corTexto, borderRadius}) {
  return (
    <Container color={color} corTexto={corTexto} borderRadius={borderRadius}>
        <button>{nome}</button>
    </Container>
  );
}

export default Button;