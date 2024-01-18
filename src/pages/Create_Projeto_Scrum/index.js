import React, { useEffect, useState } from 'react';

import { Container } from './styles';
import api from '../../services/api';
import Button from '../../componentes/Button';
import { MdAdd } from 'react-icons/md';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';

const Create_Projeto_Scrum = () => {
  const [clientes, setClientes] = useState([]);
  const history = useHistory();

  async function fetchClientes(){
    let response = await api.get('/Clientes');
    setClientes(response.data);
  }

  useEffect(()=>{
    fetchClientes();
  }, [])

  async function submitForm(e){
    e.preventDefault();
    const select = document.querySelector('#projetos_scrum');
    let response = await api.post('/projetos_scrum', {
      nome: clientes[select.selectedIndex].nome,
      estado: "ABERTO",
      contrato: clientes[select.selectedIndex].contrato
    })

    if (response.status === 201){
      swal('Projeto criado com sucesso', 'Bom trabalho', 'success');
      history.push('/'); 
    }else{
      swal('Não foi possível abrir o projeto scrum!', `Erro ${response.data.error}`, 'error');
    }
  }

  return (
    <Container>
      <div id="form">
        <form onSubmit={submitForm}>
          <div className="form-group">
            <label htmlFor="projetos_scrum">Escolha o cliente</label>
                {
                  clientes.length > 0 ?
                    <select id="projetos_scrum" className="input-control" autoFocus={true}>
                      {
                        clientes.map(cliente => <option key={cliente.contrato} value={cliente.contrato}>{cliente.nome}</option>)
                      }
                    </select>
                    : <h3>Carregando clientes</h3>
                }
          </div>  
          <Button nome="Criar Projeto" borderRadius="18px" color="green" corTexto="white" Icon={MdAdd} />        
        </form>
      </div>
    </Container>
  );
};

export default Create_Projeto_Scrum;
