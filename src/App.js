import React from 'react';
import GlobalStyle from './styles/global';
import Routes from './Routes';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './globals.css'


import UsuarioProvider from './context/UsuarioContext';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <UsuarioProvider>
        <Routes />
        <GlobalStyle />
      </UsuarioProvider>
    </DndProvider>
  );
}

export default App;
