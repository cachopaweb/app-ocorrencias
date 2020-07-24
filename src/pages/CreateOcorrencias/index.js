import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert';
import { Container } from './styles';
import Button from '../../componentes/Button';
import api from '../../services/api'
import { useUsuario } from '../../context/UsuarioContext';
import { MdSave, MdCancel } from 'react-icons/md'
import Header from '../../componentes/Header';

function CreateOcorrencias() {
  const [clientes, setClientes] = useState([]);
  const { codigo } = useUsuario();
  const history = useHistory();

  const tipo_erro = [
    { id: 1, tipo: 'Erro de Usuario' }, 
    { id: 2, tipo: 'Erro de Sistema' },
    { id: 3, tipo: 'Implementação Nova' },
    { id: 4, tipo: 'Atendimento' },
  ];  

  function dataAtualFormatada() {
    var data = new Date(),
      dia = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0' + mes : mes,
      anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
  }

  async function insereOcorrencia(event) {
    event.preventDefault();
    const select = document.querySelector('#clientes');
    const index = select.selectedIndex;
    console.log(index);
    const contrato = select.options[select.selectedIndex].value;
    const cliente = select.options[select.selectedIndex].innerText;
    const ocorrencia = document.querySelector('#ocorrencia');
    if (ocorrencia.value === '' ){
      swal("Texto da Ocorrência obrigatório!", 'Preencha a ocorrência', "warning");
      return;
    }
    const create = {
      Data: dataAtualFormatada(),
      Finalizada: null,
      Funcionario: codigo,
      Modulo_Sistema: 1,
      Obs: ocorrencia.value,
      Ocorrencia: "ERRO SISTEMA",
      contrato: contrato,
      cli_nome: cliente,
      codigo: 0
    }
    console.log(create);
    const response = await api.post('/Ocorrencias', create);
    if (!response.error) {
      swal("Ocorrência aberta com sucesso!", "Bom trabalho", "success");  
      history.push('/ocorrencias');
    } else {
      swal("Algo deu errado!", response.error, "error");
    }
  }

  useEffect(() => {
    getClientes()
  }, [])

  async function getClientes() {
    const response = await api.get('/Clientes');
    setClientes(response.data);
  }

  function cancelar() {
    history.push('/ocorrencias');
  }

  return (
    <>
      <Header title={'Nova Ocorrência'} />
      <Container>
        <div id="form">
          <form onSubmit={insereOcorrencia}>
            <div className="form-group">
            <label htmlFor="clientes">Escolha o cliente</label>
              {
                clientes.length > 0 ?
                  <select id="clientes" className="input-control" autoFocus={true}>
                    {
                      clientes.map(cliente => <option key={cliente.contrato} value={cliente.contrato}>{cliente.nome}</option>)
                    }
                  </select>
                  : <h3>Carregando clientes</h3>
              }
            </div>
            <div className="form-group">
              <label htmlFor="erro">Tipo de Erro</label>
              {            
                <select id="erro" className="input-control">
                  {
                    tipo_erro.map(erro => <option key={erro.id} value={erro.tipo}>{erro.tipo}</option>)
                  }
                </select>
              }
            </div>            
            <div className="form-group">
              <label htmlFor="ocorrencia">Ocorrencia</label>
              <textarea className="input-control" type="text" name="ocorrencia" id="ocorrencia" placeholder="informe a ocorrencia" />
            </div>
            <div className="action">
              <Button Icon={MdCancel} click={cancelar} nome={"Cancelar"} color={"red"} corTexto={"white"} borderRadius={'30px'} />
              <Button Icon={MdSave} click={insereOcorrencia} nome={"Salvar"} color={"green"} corTexto={"white"} borderRadius={'30px'} />
            </div>
          </form>
        </div>
      </Container>
    </>
  );
}

export default CreateOcorrencias;