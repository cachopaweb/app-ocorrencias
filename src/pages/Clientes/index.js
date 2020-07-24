import React, { useState, useEffect } from 'react';

import { Container, Pesquisa } from './styles';
import api from '../../services/api';
import Header from '../../componentes/Header';
import { useHistory } from 'react-router-dom';
import { MdAttachMoney } from 'react-icons/md';
import Button from '../../componentes/Button';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const history = useHistory();

  async function fetchData() {
    const response = await api.get('/Clientes');
    setClientes(response.data);
    setClientesFiltrados(response.data);
  }

  useEffect(() => {
    fetchData()
  }, [])

  function handleContaReceber(contrato, nome) {
    history.push({ pathname: '/contaReceber', state: { contrato: contrato, nome: nome } })
  }

  function filtrarPorCliente(busca){
    let result = clientes.filter((cliente)=> cliente.nome.toUpperCase().includes(busca.toUpperCase()));
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
        <div className="lista">{clientesFiltrados.map(cliente => (
          <div>
            <article>
              <h1>{cliente.nome}</h1>
              <p>{cliente.celular} | {cliente.fone}</p>
              <p>{cliente.razao}</p>
              <p>{cliente.email}</p>
              <p>{cliente.cnpj_cpf}</p>
              <p>{cliente.insc_estadual}</p>
              <Button nome="Ver Pendências" Icon={MdAttachMoney} tamanho_icone={15} borderRadius={"18px"} color={"white"} click={()=> handleContaReceber(cliente.contrato, cliente.cli_nome)}  />              
            </article>
          </div>
        )
        )}
        </div>
      </Container>
    </>
  );
}

export default Clientes;