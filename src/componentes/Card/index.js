import React, { useState } from 'react';
import swal from 'sweetalert';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Container, TextoChecado, ProgressBar } from './styles';
import Button from '../Button';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useUsuario } from '../../context/UsuarioContext';
import { MdScanner, MdCancel, MdClose, MdEdit } from 'react-icons/md'


function Card({ cliente, contrato, projeto_id, ocorrencia, atendente = 0, nomeAtendente, cod_ocorrencia, data, showActions = true, children }) {
  const [funAtendente, setFunAtendente] = useState(atendente);
  const [nome_atendente, setNome_Atendente] = useState(nomeAtendente);
  const [clienteAtual, setClienteAtual] = useState(cliente);
  const [contratoAtual, setContratoAtual] = useState(contrato);
  const [projetoAtual, setProjetoAtual] = useState(projeto_id);
  const { cod_funcionario, login } = useUsuario();
  const [fechada, setFechada] = useState(false);
  const [num_tarefas_realizadas, setNum_tarefas_realizadas] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [modalTrocarClienteAberto, setModalTrocarClienteAberto] = useState(false);
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

  async function abrirModalTrocarCliente() {
    try {
      const response = await api.get('/projetos_scrum');      
      setClientes(response.data);
      setClienteSelecionado(null);
      setModalTrocarClienteAberto(true);
    } catch (error) {
      swal('Erro ao buscar projetos scrum', error.message, 'error');
    }
  }

  async function trocarClienteOcorrencia() {
    if (!clienteSelecionado) {
      swal("Cliente não selecionado!", "Por favor, escolha um cliente.", "warning");
      return;
    }

    swal({
      title: "Trocar Cliente",
      text: `Tem certeza que deseja trocar o cliente para "${clienteSelecionado.cli_nome}"?`,
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then(async (willProceed) => {
      if (willProceed) {
        try {
          const updateRequest = {
            contrato: clienteSelecionado.contrato,
            fun_codigo: 0,
            projeto_scrum: clienteSelecionado.ps_codigo || 0
          };
          const response = await api.put(`/Ocorrencias/${cod_ocorrencia}`, JSON.stringify(updateRequest));
          
          if (response.data.codigo > 0 || response.status === 200) {
            setClienteAtual(clienteSelecionado.cli_nome);
            setContratoAtual(clienteSelecionado.contrato);
            setProjetoAtual(clienteSelecionado.ps_codigo || 0);
            setModalTrocarClienteAberto(false);
            swal("Cliente atualizado com sucesso!", "", "success");
          } else {
            swal("Erro ao atualizar cliente", "", "error");
          }
        } catch (error) {
          swal("Erro ao atualizar cliente", error.message, "error");
        }
      }
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
    return ocorrencia.split('\n\n').map((item) => item.length > 0 ? AddCheckbox(item + '\n\n') : item);;
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
              <h3>{clienteAtual}</h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3>{new Date(data).toLocaleDateString()}</h3>
                {funAtendente ? <span>{nome_atendente}</span> : <span>Nao atendida</span>}
              </div>
            </div>
            {contaCheckBox()}
            {!showActions ? <ProgressBar percent={((num_tarefas_realizadas / num_tarefas) * 100) * -1} >
              <div className="progress">{parseFloat(((num_tarefas_realizadas / num_tarefas) * 100) * -1).toFixed(0)}%</div>
            </ProgressBar> : null}
            {!showActions ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {ocorrencia}
              </ReactMarkdown>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {ocorrencia}
              </ReactMarkdown>
            )}
          </div>
          {showActions ?
            <div className="actions">
              <Button Icon={MdScanner} click={Atender} nome={"Atender"} color={"#F0F0F2"} corTexto={"black"} borderRadius={'30px'} />
              <Button Icon={MdEdit} click={abrirModalTrocarCliente} nome={"Trocar Cliente"} color={"#3498db"} corTexto={"white"} borderRadius={'30px'} />
              <Button Icon={MdCancel} click={finalizar} nome={"Fechar"} color={"#733130"} corTexto={"white"} borderRadius={'30px'} />
              <Link to={{ pathname: '/quadroScrum', state: { cliente: clienteAtual, projeto_id: projetoAtual, contrato: contratoAtual, ocorrencia: cod_ocorrencia } }} >
                <Button Icon={MdClose} nome={"Abrir Scrum"} color={"#7FA66D"} corTexto={"white"} borderRadius={'30px'} />
              </Link>
            </div>
            : children
          }
        </Container>

        {modalTrocarClienteAberto && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '400px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Trocar Cliente</h2>
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="clienteSelect" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
                  Escolha o novo cliente:
                </label>
                <select
                  id="clienteSelect"
                  value={clienteSelecionado?.ps_codigo || ''}
                  onChange={(e) => {
                    const cliente = clientes.find(c => c.ps_codigo === parseInt(e.target.value));
                    setClienteSelecionado(cliente);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    color: '#333'
                  }}
                >
                  <option value="">-- Selecione um cliente --</option>
                  {clientes.map(c => (
                    <option key={c.ps_codigo} value={c.ps_codigo}>
                      {c.cli_nome}
                    </option>
                  ))}
                </select>
              </div>
              {clienteSelecionado && (
                <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                  <p><strong>Cliente:</strong> {clienteSelecionado.cli_nome}</p>
                  <p><strong>Contrato:</strong> {clienteSelecionado.contrato}</p>
                  {clienteSelecionado.ps_codigo && <p><strong>Projeto Scrum:</strong> {clienteSelecionado.ps_codigo}</p>}
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setModalTrocarClienteAberto(false);
                    setClienteSelecionado(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#999',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={trocarClienteOcorrencia}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#27ae60',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
}

export default Card;