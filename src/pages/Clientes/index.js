import React, { useState, useEffect } from 'react';

import { Container } from './styles';
import api from '../../services/api';
import Header from '../../componentes/Header';
import { useHistory } from 'react-router-dom';
import { MdAttachMoney } from 'react-icons/md';
import Button from '../../componentes/Button';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const history = useHistory();

  async function fetchData() {
    const response = await api.get('/Clientes');
    setClientes(response.data);
  }

  useEffect(() => {
    fetchData()
  }, [])

  function handleContaReceber(contrato, nome) {
    history.push({ pathname: '/contaReceber', state: { contrato: contrato, nome: nome } })
  }

  return (
    <>
      <Header title={'Clientes'} />
      <Container>
        <div className="lista">{clientes.map(cliente => (
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