import React from 'react';

import { Container } from './styles';

function Button({click, nome, color, corTexto, borderRadius, Icon, tamanho_icone = 15}) {
  return (
    <Container color={color} corTexto={corTexto} borderRadius={borderRadius}>
        <button onClick={click}><Icon size={tamanho_icone} /> {nome}</button>
    </Container>
  );
}

export default Button;