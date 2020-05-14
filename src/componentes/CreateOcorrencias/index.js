import React, {useState, useEffect, useContext } from 'react';
import {useHistory } from 'react-router-dom'

import { Container } from './styles';
import Button from '../Button';
import api from '../../services/api'
import { UsuarioContext } from '../../context/UsuarioContext';

function CreateOcorrencias() {
  const [clientes, setClientes] = useState([]);
  const { state } = useContext(UsuarioContext);
  const history = useHistory();

  useEffect(()=>{
    getClientes()
  }, [])

  async function insereOcorrencia(event){
    event.preventDefault();      
    const select = document.querySelector('#clientes');
    const index = select.selectedIndex;
    console.log(index);
    const contrato = select.options[select.selectedIndex].value;
    const cliente = select.options[select.selectedIndex].innerText;
    const ocorrencia = document.querySelector('#ocorrencia');
    const data = new Date();

    const create = {
        Data: `${data.getDate()}/${data.getMonth()}/${data.getFullYear()}`,
        Finalizada: null,
        Funcionario: state.user.codigo,
        Modulo_Sistema: 1,
        Obs: ocorrencia.value,
        Ocorrencia: "ERRO SISTEMA",
        contrato: contrato,
        cli_nome: cliente,
        codigo: 0
    }
    console.log(create);
    const response = await api.post('/Ocorrencias', JSON.stringify(create));    
    if (!response.error){          
      history.push('/ocorrencia');
    }else{
      alert(response.error)
    }
  }  

  async function getClientes(){
    const response = await api.get('/Clientes');
    setClientes(response.data);
  }

  function cancelar(){
    history.push('/ocorrencia');
  }

  return (
    <Container>
        <form onSubmit={insereOcorrencia}>   
            <div className="input-control">
                <label htmlFor="clientes">Escolha o cliente</label>
                {
                  clientes.length > 0 ?
                  <select id="clientes">
                    {
                      clientes.map(cliente => <option key={cliente.contrato} value={cliente.contrato}>{cliente.nome}</option>)
                    }                  
                  </select>
                  : <h3>Carregando clientes</h3>
                }
            </div>         
            <div className="input-control">
                <label htmlFor="ocorrencia">Ocorrencia</label>
                <textarea type="text" name="ocorrencia" id="ocorrencia" placeholder="informe a ocorrencia" />
            </div>
            <div className="action">
                <Button nome={"Salvar"} color={"black"} corTexto={"white"} borderRadius={'30px'} />
                <Button click={cancelar} nome={"Cancelar"} color={"red"} corTexto={"white"} borderRadius={'30px'} />
            </div>            
        </form>
    </Container>
  );
}

export default CreateOcorrencias;