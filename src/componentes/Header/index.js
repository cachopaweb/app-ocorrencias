import React, { useContext } from 'react';

import { Container } from './styles';
import { UsuarioContext } from '../../context/UsuarioContext';

function Header() {
  const { state } = useContext(UsuarioContext);
  return (
    <Container>
        <h1>Ocorrencias</h1>
        <div className="usuario">
          <ul>
            {
              state.user.codigo !== 0 ?
              <li>{`${state.user.codigo} - ${state.user.nome}`}</li>
              : <li>Nao logado</li>
            }
          </ul>
        </div>
    </Container>
  );
}

export default Header;