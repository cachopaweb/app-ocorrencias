import React from 'react';
import Routes from './Routes';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import UsuarioProvider from './context/UsuarioContext';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <UsuarioProvider>
        <Routes />
      </UsuarioProvider>
    </DndProvider>
  );
}

export default App;
