import React from 'react';

import { Container } from './styles';
import Button from '../Button';
import api from '../../services/api'

function CreateOcorrencias() {
  async function insereOcorrencia(e){
    e.preventDefault();    
    const cliente = document.querySelector('#cliente');
    const ocorrencia = document.querySelector('#ocorrencia');
    const create = {
        Data: "06/05/20",
        Finalizada: "S",
        Funcionario: 20,
        Modulo_Sistema: 0,
        Obs: ocorrencia,
        Ocorrencia: "",
        Projeto_Scrum: 245,
        cli_nome: cliente
    }
    const response = await api.post('/Ocorrencia', JSON.stringify(create));    
    console.log(response);
    alert('Dados inseridos com sucesso!')
  }  
  return (
    <Container>
        <form>   
            <div className="input-control">
                <label htmlFor="cliente">Escolha o cliente</label>
                <input type="text" name="cliente" id="cliente" placeholder="informe o cliente" />
            </div>         
            <div className="input-control">
                <label htmlFor="ocorrencia">Ocorrencia</label>
                <textarea type="text" name="ocorrencia" id="ocorrencia" placeholder="informe a ocorrencia" />
            </div>
            <div className="action">
                <Button onClick={(e)=> insereOcorrencia(e)} nome={"inserir"} color={"black"} corTexto={"white"} />
            </div>            
        </form>
    </Container>
  );
}

export default CreateOcorrencias;