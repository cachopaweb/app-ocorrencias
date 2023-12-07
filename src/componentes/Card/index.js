import React, { useState } from 'react';
import swal from 'sweetalert';

import { Container, TextoChecado, ProgressBar } from './styles';
import Button from '../Button';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useUsuario } from '../../context/UsuarioContext';
import { MdScanner, MdCancel, MdClose } from 'react-icons/md'


function Card({ cliente, contrato, projeto_id, ocorrencia, atendente = 0, nomeAtendente, cod_ocorrencia, data, showActions = true, children }) {
  const [funAtendente, setFunAtendente] = useState(atendente);
  const [nome_atendente, setNome_Atendente] = useState(nomeAtendente);
  const { cod_funcionario, login } = useUsuario();
  const [fechada, setFechada] = useState(false);
  const [num_tarefas_realizadas, setNum_tarefas_realizadas] = useState(0);
  let num_tarefas = 0;

  async function Atender() {
    const request = {
      fun_codigo: cod_funcionario
    }
    const response = await api.put('/Ocorrencias/' + cod_ocorrencia, JSON.stringify(request));
    if (response.data.fun_codigo > 0) {
      setFunAtendente(response.data.fun_codigo)
      setNome_Atendente(login);
    }
  }

  async function fecharOcorrencia(tempo) {
    const request = {
      fun_codigo: cod_funcionario,
      finalizada: 'S',
      tempoAtendimento: tempo
    }
    try {
      let response = await api.put('/Ocorrencias/' + cod_ocorrencia, JSON.stringify(request));
      if (response.data.fun_codigo > 0) {
        setFechada(true);
      } else {
        swal('Erro ao fechar Ocorrencia', '', 'error')
      }
    } catch (error) {
      swal('Erro ao fechar Ocorrencia', error, 'error');
    }
  }

  function finalizar() {
    if (funAtendente === 0) {
      swal("Ocorrencia ainda não atendida!", 'Click em atender', "warning");
      return
    }
    swal("Informe o tempo de atendimento (em minutos):", {
      content: "input",
    })
      .then((value) => {
        if (value === '') {
          swal('Informe o tempo de atendimento corretamente', 'Informe o tempo de atendimento (em minutos):', 'warning')
          return;
        }
        let tempo = 0;
        try {
          tempo = parseInt(value);
        } catch (erro) {
          swal('É permitido somente números!', 'informe o tempo em números', 'warning')
          return;
        }
        if (tempo === 0) { swal("Tempo não informado!", 'Informe o tempo', "warning"); return; }
        if (tempo === 1) { swal('O Tempo deve ser maior que 1 min', 'Informe o tempo corretamente', 'warning'); return; }

        fecharOcorrencia(tempo);
      });
  }

  //esta função coloca um checkbox ao lado de cada item da ocorrencia
  function AddCheckbox(item) {
    const [isChecked, setChecked] = useState(false);

    const checar = () => {
      setChecked(!isChecked)
      setNum_tarefas_realizadas(isChecked ? num_tarefas_realizadas + 1 : num_tarefas_realizadas - 1)
    }

    return (
      <div className="checkbox">
        <label>
          <input type="checkbox" checked={isChecked} onClick={() => checar()} />
        </label>
        {!isChecked ? item : <TextoChecado>{item}</TextoChecado>}
      </div>
    );
  }


  //esta função separa as ocorrencias com espaços em branco
  function addSeparator(ocorrencia) {
    let lista = ocorrencia.split('\n\n');
    lista = lista.map((item) => {
      if (item.length > 0) {
        return AddCheckbox(item + '\n\n');
      }
    });
    return lista;
  }

  function contaCheckBox() {
    const num_check = document.querySelectorAll('.checkbox input').length;
    num_tarefas = num_check;
  }

  return fechada ? null
    : (
      <>
        <Container atendente={funAtendente}>
          <div className="content">
            <div className="header">
              <h3>{cliente}</h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3>{new Date(data).toLocaleDateString()}</h3>
                {funAtendente ? <span>{nome_atendente}</span> : <span>Nao atendida</span>}
              </div>
            </div>
            {contaCheckBox()}
            {!showActions ? <ProgressBar percent={((num_tarefas_realizadas / num_tarefas) * 100) * -1} >
              <div className="progress">{parseFloat(((num_tarefas_realizadas / num_tarefas) * 100) * -1).toFixed(0)}%</div>
            </ProgressBar> : null}
            {!showActions ? <p>{addSeparator(ocorrencia)}</p> : <p>{ocorrencia}</p>}
          </div>
          {showActions ?
            <div className="actions">
              <Button Icon={MdScanner} click={Atender} nome={"Atender"} color={"#F0F0F2"} corTexto={"black"} borderRadius={'30px'} />
              <Button Icon={MdCancel} click={finalizar} nome={"Fechar"} color={"#733130"} corTexto={"white"} borderRadius={'30px'} />
              <Link to={{ pathname: '/quadroScrum', state: { cliente, projeto_id, contrato, ocorrencia: cod_ocorrencia } }} >
                <Button Icon={MdClose} nome={"Abrir Scrum"} color={"#7FA66D"} corTexto={"white"} borderRadius={'30px'} />
              </Link>
            </div>
            : children
          }
        </Container>
      </>
    );
}

export default Card;