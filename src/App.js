import React from 'react';
import Header from './componentes/Header';
import Ocorrencias from './componentes/Ocorrencias';
import CreateOcorrencias from './componentes/CreateOcorrencias';
import GlobalStyle from './styles/global';
import Button from './componentes/Button';

function App() {
  return (
    <>
      <Header />
      <Ocorrencias />
      <CreateOcorrencias />
      <div className="floatting">
        <Button borderRadius={'52px'} color={'black'} corTexto={'white'} nome={'    +    '} />      
      </div>
      <GlobalStyle />
    </>
  );
}

export default App;
