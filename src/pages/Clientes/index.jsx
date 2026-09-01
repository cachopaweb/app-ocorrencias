import React, { useState, useEffect } from 'react';

import api from '../../services/api';
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
      <div>
        <div id="form" className="max-w-[800px] pt-[10px] mx-auto">
          <form>
            <div className="form-group px-[10px]">
              <label htmlFor="projetos" className="mr-[15px]">Filtrar Clientes </label>
              <input type="text" placeholder="Busca por cliente" className="h-[46px] mb-[15px] px-[20px] text-[#777] text-[15px] w-full border border-[#ddd] placeholder-[#999]" onChange={(e) => filtrarPorCliente(e.target.value)} />
            </div>
          </form>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center m-[10px]">
        <div className="lista text-black">{clientesFiltrados.map(cliente => <DetalhesCliente cliente={cliente} />)}</div>
      </div>
    </>
  );
}

export default Clientes;