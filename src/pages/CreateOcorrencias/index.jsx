import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert';
import Button from '../../componentes/Button';
import api from '../../services/api'
import { useUsuario } from '../../context/UsuarioContext';
import { MdSave, MdCancel } from 'react-icons/md'
import { tipo_erro } from '../../constants';
import DatePicker from "react-datepicker";


function CreateOcorrencias({codigo_projeto_scrum = 0, retornarPara = null}) {
  const [projetos_scrum, setProjetosScrum] = useState([]);
  const [erro, setErro] = useState('Erro de Sistema')
  const [cod_projeto_scrum, setCod_projeto_scrum] = useState(codigo_projeto_scrum);
  const { cod_funcionario } = useUsuario();  
  const [data, setData] = useState(new Date());
  const history = useHistory();

  function dataAtualFormatada(aData) {
    var data = aData,
      dia = data.getDate().toString(),
      diaF = (dia.length === 1) ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length === 1) ? '0' + mes : mes,
      anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
  }

  function dataAtualFormatadaAmericano(aData) {
    var data = aData,
        dia = data.getDate().toString(),
        diaF = (dia.length === 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(), // +1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length === 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return mesF + "-" + diaF + "-" + anoF;
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
      Data: dataAtualFormatadaAmericano(data),
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
    //console.log(create);
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

  function changeData(date) {    
    setData(date);
};

  return (
    <>
      <div className="flex justify-center items-center w-full text-black font-bold">
        <div id="form" className="py-5 m-0 w-[98vh]">
          <form onSubmit={insereOcorrencia} className="m-[15px] bg-white p-5 rounded-lg shadow-lg">
            <div className="flex flex-col mb-[10px]">
            <label htmlFor="projetos_scrum" className="mb-[5px]">Escolha o cliente</label>
              {
                projetos_scrum.length > 0 ?
                  <select id="projetos_scrum" className="p-[5px] text-base w-full text-[1.1em] my-[5px] h-[40px]" autoFocus={true} value={cod_projeto_scrum} onChange={(e)=> setCod_projeto_scrum(e.target.value)}>
                    {
                      projetos_scrum.map(projetos => <option key={projetos.contrato} value={projetos.ps_codigo}>{projetos.cli_nome}</option>)
                    }
                  </select>
                  : <h3 className="mb-[30px]">Carregando projetos_scrum</h3>
              }
            </div>
            <div className="flex flex-col mb-[10px]">
              <label htmlFor="erro" className="mb-[5px]">Tipo de Erro</label>
              {            
                <select id="erro" className="p-[5px] text-base w-full text-[1.1em] my-[5px] h-[40px]" value={erro} onChange={(e)=> setErro(e.target.value)}>
                  {
                    tipo_erro.map(erro => <option key={erro.id} value={erro.tipo}>{erro.tipo}</option>)
                  }
                </select>
              }
            </div>  
            <div className="flex flex-col mb-[10px]">
              <label htmlFor="data" className="mb-[5px]">Data</label>
              <div>
                <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={data} onChange={changeData} />
              </div>
            </div>          
            <div className="flex flex-col mb-[10px]">
              <label htmlFor="ocorrencia" className="mb-[5px]">Ocorrencia</label>
              <textarea className="p-[5px] text-base h-[150px] w-full text-[1.1em] my-[5px]" type="text" name="ocorrencia" id="ocorrencia" placeholder="informe a ocorrencia" />
            </div>
            <div className="flex justify-around items-center">
              <div className="m-[20px_8px_10px]">
                <Button Icon={MdCancel} click={cancelar} nome={"Cancelar"} color={"red"} corTexto={"white"} borderRadius={'30px'} />
              </div>
              <div className="m-[20px_8px_10px]">
                <Button Icon={MdSave} click={insereOcorrencia} nome={"Salvar"} color={"green"} corTexto={"white"} borderRadius={'30px'} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateOcorrencias;