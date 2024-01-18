import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert';
import { Container } from './styles';
import Button from '../../componentes/Button';
import api from '../../services/api'
import { useUsuario } from '../../context/UsuarioContext';
import { MdSave, MdCancel } from 'react-icons/md'
import Header from '../../componentes/Header';
import { tipo_erro } from '../../constants';


function CreateOcorrencias({codigo_projeto_scrum = 0, retornarPara = null}) {
  const [projetos_scrum, setProjetosScrum] = useState([]);
  const [erro, setErro] = useState('Erro de Sistema')
  const [cod_projeto_scrum, setCod_projeto_scrum] = useState(codigo_projeto_scrum);
  const { cod_funcionario } = useUsuario();  
  const history = useHistory();

  function dataAtualFormatada() {
    var data = new Date(),
      dia = data.getDate().toString(),
      diaF = (dia.length === 1) ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length === 1) ? '0' + mes : mes,
      anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
  }

  async function insereOcorrencia(event) {
    event.preventDefault();
    const select = document.querySelector('#projetos_scrum');
    const index = select.selectedIndex;
    console.log(index);    
    const cliente = select.options[select.selectedIndex].innerText;
    const ocorrencia = document.querySelector('#ocorrencia');
    if (ocorrencia.value === '' ){
      swal("Texto da Ocorrência obrigatório!", 'Preencha a ocorrência', "warning");
      return;
    }
    const create = {
      Data: dataAtualFormatada(),
      Finalizada: null,
      Funcionario: cod_funcionario,
      Modulo_Sistema: 1,
      Obs: ocorrencia.value,
      Ocorrencia: erro.toUpperCase(),
      contrato: projetos_scrum[select.selectedIndex].contrato,
      cli_nome: cliente,
      codigo: 0,
      projeto_scrum: cod_projeto_scrum
    }
    // console.log(create);
    const response = await api.post('/Ocorrencias', create);
    if (!response.error) {
      swal("Ocorrência aberta com sucesso!", "Bom trabalho", "success"); 
      if (!retornarPara) 
        history.push('/')
      else
        retornarPara();
    } else {
      swal("Algo deu errado!", response.error, "error");
    }
  }

  useEffect(() => {
    getClientes()
  }, [])

  async function getClientes() {
    const response = await api.get('/projetos_scrum');
    setProjetosScrum(response.data);
  }

  function cancelar() {
    if (!retornarPara) 
      history.push('/')
    else
      retornarPara();
  }

  return (
    <>
      <Header title={'Nova Ocorrência'} />
      <Container>
        <div id="form">
          <form onSubmit={insereOcorrencia}>
            <div className="form-group">
            <label htmlFor="projetos_scrum">Escolha o cliente</label>
              {
                projetos_scrum.length > 0 ?
                  <select id="projetos_scrum" className="input-control" autoFocus={true} value={cod_projeto_scrum} onChange={(e)=> setCod_projeto_scrum(e.target.value)}>
                    {
                      projetos_scrum.map(projetos => <option key={projetos.contrato} value={projetos.ps_codigo}>{projetos.cli_nome}</option>)
                    }
                  </select>
                  : <h3>Carregando projetos_scrum</h3>
              }
            </div>
            <div className="form-group">
              <label htmlFor="erro">Tipo de Erro</label>
              {            
                <select id="erro" className="input-control" value={erro} onChange={(e)=> setErro(e.target.value)}>
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