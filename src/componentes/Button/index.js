import React from 'react';

import { Container } from './styles';

function Button({click, nome, color, corTexto, borderRadius, Icon, tamanho_icone = 15, disabled}) {
  return (
    <Container color={disabled? "gray": color} corTexto={corTexto} borderRadius={borderRadius} >
        <button onClick={click} disabled={disabled}><Icon size={tamanho_icone} /> {nome}</button>
    </Container>
  );
}

export default Button;