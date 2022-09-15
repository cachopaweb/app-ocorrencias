import React, { useState, useEffect } from 'react';

import { Container, Pesquisa } from './styles';
import api from '../../services/api';
import Header from '../../componentes/Header';
import DetalhesCliente from '../../componentes/DetalhesCliente';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  async function fetchData() {
    const response = await api.get('/Clientes');
    setClientes(response.data);
    setClientesFiltrados(response.data);
  }

  useEffect(() => {
    fetchData()
  }, [])



  function filtrarPorCliente(busca) {
    let result = clientes.filter((cliente) => cliente.nome.toUpperCase().includes(busca.toUpperCase()));
    setClientesFiltrados(result);
  }

  return (
    <>
      <Header title={'Clientes'} />
      <Pesquisa>
        <div id="form">
          <form>
            <div className="form-group">
              <label htmlFor="projetos">Filtrar Clientes </label>
              <input type="text" placeholder="Busca por cliente" onChange={(e) => filtrarPorCliente(e.target.value)} />
            </div>
          </form>
        </div>
      </Pesquisa>
      <Container>
        <div className="lista">{clientesFiltrados.map(cliente => <DetalhesCliente cliente={cliente} />)}</div>
      </Container>
    </>
  );
}

export default Clientes;