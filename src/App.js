import React, { useContext } from 'react';
import Header from './componentes/Header';
import GlobalStyle from './styles/global';
import Routes from './Routes';
import { Context } from './context/UsuarioContext';

function App() {  
  return (
    <Context>
      <Header />
      <Routes />      
      <GlobalStyle />
    </Context>
  );
}

export default App;
