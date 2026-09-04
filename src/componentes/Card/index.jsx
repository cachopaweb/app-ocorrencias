import React, { useState } from 'react';
import swal from '@/lib/feedback';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  UserCheck, 
  UserX, 
  Edit, 
  Layers, 
  Send, 
  Calendar 
} from 'lucide-react';

import Badge from '../Badge';
import Modal from '../Modal';
import Button from '../Button';
import { Select } from '../Input';
import api from '../../services/api';
import { useUsuario } from '../../context/UsuarioContext';
import { cn } from '../../lib/utils';

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
    };
    try {
      const response = await api.put('/Ocorrencias/' + cod_ocorrencia, JSON.stringify(request));
      if (response.data.fun_codigo > 0) {
        setFunAtendente(response.data.fun_codigo);
        setNome_Atendente(login);
      }
    } catch (error) {
      swal('Erro ao atender ocorrência', error.message, 'error');
    }
  }

  async function fecharOcorrencia(tempo) {
    const request = {
      fun_codigo: cod_funcionario,
      finalizada: 'S',
      tempoAtendimento: tempo
    };
    try {
      let response = await api.put('/Ocorrencias/' + cod_ocorrencia, JSON.stringify(request));
      if (response.data.fun_codigo > 0) {
        setFechada(true);
      } else {
        swal('Erro ao fechar Ocorrencia', '', 'error');
      }
    } catch (error) {
      swal('Erro ao fechar Ocorrencia', error.message || error, 'error');
    }
  }

  function finalizar() {
    if (funAtendente === 0) {
      swal("Ocorrencia ainda não atendida!", 'Click em atender', "warning");
      return;
    }
    swal("Informe o tempo de atendimento (em minutos):", {
      content: "input",
    })
      .then((value) => {
        if (value === '') {
          swal('Informe o tempo de atendimento corretamente', 'Informe o tempo de atendimento (em minutos):', 'warning');
          return;
        }
        let tempo = 0;
        try {
          tempo = parseInt(value);
        } catch (erro) {
          swal('É permitido somente números!', 'informe o tempo em números', 'warning');
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
      setChecked(!isChecked);
      setNum_tarefas_realizadas(isChecked ? num_tarefas_realizadas + 1 : num_tarefas_realizadas - 1);
    };

    return (
      <div className="checkbox flex items-center gap-2 text-slate-700 dark:text-slate-300">
        <label>
          <input type="checkbox" checked={isChecked} onChange={() => checar()} />
        </label>
        {!isChecked ? item : <span className="line-through text-slate-400 dark:text-slate-500">{item}</span>}
      </div>
    );
  }

  //esta função separa as ocorrencias com espaços em branco
  function addSeparator(ocorrencia) {
    return ocorrencia.split('\n\n').map((item) => item.length > 0 ? AddCheckbox(item + '\n\n') : item);
  }

  function contaCheckBox() {
    const num_check = document.querySelectorAll('.checkbox input').length;
    num_tarefas = num_check;
  }

  return fechada ? null : (
    <>
      <div 
        className={cn(
          "w-full max-w-4xl p-4 rounded-lg shadow-2xs border border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-3 transition-all bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-100",
          funAtendente === 0 && "border-l-4 border-l-amber-500"
        )}
      >
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-400">#OCO-{cod_ocorrencia}</span>
              {funAtendente ? (
                <Badge variant="secondary" dot={true}>
                  {nome_atendente}
                </Badge>
              ) : (
                <Badge variant="warning" dot={true}>
                  Não Atendida
                </Badge>
              )}
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 ml-1">{clienteAtual}</h3>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{data ? new Date(data).toLocaleDateString() : ''}</span>
            </div>
          </div>

          {contaCheckBox()}

          {!showActions ? (
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div 
                className="bg-emerald-600 dark:bg-emerald-500 h-full flex items-center justify-center text-[10px] text-white transition-all" 
                style={{ width: `${Math.min(100, Math.max(0, ((num_tarefas_realizadas / (num_tarefas || 1)) * 100) * -1))}%` }}
              >
                {parseFloat(((num_tarefas_realizadas / (num_tarefas || 1)) * 100) * -1).toFixed(0)}%
              </div>
            </div>
          ) : null}

          <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {ocorrencia}
            </ReactMarkdown>
          </div>
        </div>

        {showActions ? (
          <div className="flex flex-wrap items-center justify-end gap-2 bg-slate-50/60 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80 mt-1">
            <Button 
              variant="outline"
              size="default"
              Icon={UserCheck} 
              onClick={Atender} 
              nome="Atender" 
            />
            <Button 
              variant="outline"
              size="default"
              Icon={Edit} 
              onClick={abrirModalTrocarCliente} 
              nome="Trocar Cliente" 
            />
            <Button 
              variant="destructive"
              size="default"
              Icon={CheckCircle} 
              onClick={finalizar} 
              nome="Fechar Ocorrência" 
            />
            <Link to={{ pathname: '/quadroScrum', state: { cliente: clienteAtual, projeto_id: projetoAtual, contrato: contratoAtual, ocorrencia: cod_ocorrencia } }}>
              <Button 
                variant="indigo"
                size="default"
                Icon={Layers} 
                nome="Abrir Scrum" 
              />
            </Link>
          </div>
        ) : children}
      </div>

      {/* Modal Trocar Cliente */}
      <Modal
        activate={modalTrocarClienteAberto}
        setActivate={setModalTrocarClienteAberto}
        altura="auto"
        largura={450}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Edit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Trocar Cliente</h2>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="clienteSelect" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Escolha o novo cliente:
            </label>
            <Select
              id="clienteSelect"
              value={clienteSelecionado?.ps_codigo || ''}
              onChange={(e) => {
                const cliente = clientes.find(c => c.ps_codigo === parseInt(e.target.value));
                setClienteSelecionado(cliente);
              }}
            >
              <option value="">-- Selecione um cliente --</option>
              {clientes.map(c => (
                <option key={c.ps_codigo} value={c.ps_codigo}>
                  {c.cli_nome}
                </option>
              ))}
            </Select>
          </div>

          {clienteSelecionado && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-sm flex flex-col gap-1 text-slate-700 dark:text-slate-300">
              <p><strong className="text-slate-900 dark:text-slate-100">Cliente:</strong> {clienteSelecionado.cli_nome}</p>
              <p><strong className="text-slate-900 dark:text-slate-100">Contrato:</strong> {clienteSelecionado.contrato}</p>
              {clienteSelecionado.ps_codigo && (
                <p><strong className="text-slate-900 dark:text-slate-100">Projeto Scrum:</strong> {clienteSelecionado.ps_codigo}</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => {
                setModalTrocarClienteAberto(false);
                setClienteSelecionado(null);
              }}
              nome="Cancelar"
            />
            <Button
              variant="indigo"
              onClick={trocarClienteOcorrencia}
              nome="Confirmar"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

export default React.memo(Card);