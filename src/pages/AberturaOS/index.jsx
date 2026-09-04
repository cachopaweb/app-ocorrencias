import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import DatePicker from '../../componentes/DatePicker';
import {
  FilePlus,
  Save,
  X,
  Calendar,
  User,
  Layers,
  FileText,
  AlertCircle
} from 'lucide-react';

import swal from '@/lib/feedback';
import api from '../../services/api';
import { useUsuario } from '../../context/UsuarioContext';
import { Button } from '../../componentes/Button';
import { Input, Select, Textarea } from '../../componentes/Input';
import Badge from '../../componentes/Badge';

function AberturaOS() {
  const { state = {} } = useLocation();
  const history = useHistory();
  const { login, cod_funcionario } = useUsuario();

  const [funcionarios, setFuncionarios] = useState([]);
  const [osModulos, setOSModulos] = useState([]);
  const [data, setData] = useState(new Date());
  const [dataEntrega, setDataEntrega] = useState((state && state.dataEntrega) ? new Date(state.dataEntrega) : new Date());
  const [dataAnalise, setDataAnalise] = useState(new Date());
  const [dataTeste, setDataTeste] = useState((state && state.dataEntrega) ? new Date(state.dataEntrega) : new Date());
  const [dataProgramacao, setDataProgramacao] = useState((state && state.dataEntrega) ? new Date(state.dataEntrega) : new Date());
  const [dataPrazoEntrega, setDataPrazoEntrega] = useState((state && state.dataEntrega) ? new Date(state.dataEntrega) : new Date());
  const [prioridadeProgramacao, setprioridadeProgramacao] = useState(parseInt(state?.prioridade) || 1);
  const [funAnalista, setFunAnalista] = useState(1);
  const [funProgramador, setFunProgramador] = useState(0);
  const [funTeste, setfunTeste] = useState(cod_funcionario || 0);
  const [funEntrega, setfunEntrega] = useState(cod_funcionario || 0);
  const [modulo, setModulo] = useState(1);
  const [estado, setEstado] = useState('ANALISADA');
  const [descricaoOcorrencia, setDescricaoOcorrencia] = useState(state?.ocorrencia || '');
  const [codSprint] = useState(state?.codSprint || 0);

  function changeData(date) {
    setData(date);
  }
  function changeDataEntrega(date) {
    setDataEntrega(date);
  }
  function changeDataProgramacao(date) {
    setDataProgramacao(date);
  }
  function changeDataAnalise(date) {
    setDataAnalise(date);
  }
  function changeDataTeste(date) {
    setDataTeste(date);
  }
  function changeDataPrazoEntrega(date) {
    setDataPrazoEntrega(date);
  }

  function changeDescricaoOcorrencia(descricao) {
    setDescricaoOcorrencia(descricao);
  }
  function changePrioridade(prioridade) {
    setprioridadeProgramacao(prioridade);
  }
  function changeFunAnalista(fun) {
    setFunAnalista(parseInt(fun));
  }
  function changeFunProgramador(fun) {
    setFunProgramador(parseInt(fun));
  }
  function changeFunTeste(fun) {
    setfunTeste(parseInt(fun));
  }
  function changeFunEntrega(fun) {
    setfunEntrega(parseInt(fun));
  }
  function changeModulo(modulo) {
    setModulo(modulo);
  }

  async function submitOrdem(event) {
    event.preventDefault();
    if (funAnalista === 0) {
      swal('Escolha o Analista!', 'Informe o analista', 'warning');
      return;
    }
    if (funProgramador === 0) {
      swal('Escolha o programador!', 'Informe o programador(a)', 'warning');
      return;
    }
    if (funTeste === 0) {
      swal('Escolha quem vai testar!', 'Informe o testador', 'warning');
      return;
    }
    if (funEntrega === 0) {
      swal('Escolha quem vai entregar!', 'Informe o entregador', 'warning');
      return;
    }
    if (!descricaoOcorrencia || descricaoOcorrencia.trim() === '') {
      swal('Texto da ocorrência obrigatório!', 'Informe a ocorrência', 'warning');
      return;
    }
    if (codSprint === 0) {
      swal('Identificador da Sprint não encontrado!', 'Identificador Sprint Obrigatório!', 'warning');
      return;
    }

    const ordem = {
      fun_abertura: cod_funcionario,
      contrato: state?.contrato || '',
      ocorrencia: descricaoOcorrencia,
      fun_analise: funAnalista,
      fun_programador: funProgramador,
      fun_teste: funTeste,
      data_entrega: dataEntrega.toLocaleDateString(),
      prazo_entrega: dataPrazoEntrega.toLocaleDateString(),
      fun_entrega: funEntrega,
      estado: estado,
      tipo: "IMPLEMENTACAO NOVA",
      data_entrega_analise: dataAnalise.toLocaleDateString(),
      data_entrega_programacao: dataProgramacao.toLocaleDateString(),
      data_entrega_teste: dataTeste.toLocaleDateString(),
      fun_atendente: login,
      prioridade: prioridadeProgramacao,
      codigo_ocorrencia: state?.cod_ocorrencia,
      os_modulo: modulo,
      codSprint
    };

    try {
      let response = await api.post('/Ordens', ordem);
      if (response.status !== 400 && !response.data?.error) {
        swal(`Ordem ${response.data.ordem} criada com sucesso!`, "Bom trabalho", "success");
        const request = {
          fun_codigo: cod_funcionario,
          finalizada: 'S'
        };
        response = await api.put('/Ocorrencias/' + ordem.codigo_ocorrencia, JSON.stringify(request));
        if (!response.data?.error) {
          history.goBack();
        } else {
          swal(`Erro ao finalizar ocorrencia: ${ordem.codigo_ocorrencia}.`, `Erro ${response.data.description}`, 'error');
        }
      } else {
        swal(`Erro ao inserir ordem de servico!`, `erro: ${response.data?.description || 'Falha na requisição'}`, 'error');
      }
    } catch (error) {
      swal(`Erro ao inserir ordem de servico!`, `erro: ${error.message || error}`, 'error');
    }
  }

  const priopridade = [
    { id: 1, nome: 'BAIXA' },
    { id: 2, nome: 'MEDIA' },
    { id: 3, nome: 'ALTA' }
  ];

  async function getFuncionarios() {
    try {
      const response = await api.get('/usuarios');
      setFuncionarios(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    }
  }

  async function getOSModulos() {
    try {
      const response = await api.get('/OS_Modulos');
      setOSModulos(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar módulos:", error);
    }
  }

  useEffect(() => {
    getFuncionarios();
  }, []);

  useEffect(() => {
    getOSModulos();
  }, []);

  useEffect(() => {
    if (!state || state.funAtendente === 0) {
      swal('Ocorrencia ainda não atendida', 'Click em atender', 'warning');
      history.goBack();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 w-full">
      <form
        onSubmit={submitOrdem}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shrink-0">
            <FilePlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Abertura de Ordem de Serviço
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {state?.cliente ? `Cliente: ${state.cliente}` : 'Preencha os dados da nova Ordem de Serviço'}
            </p>
          </div>
        </div>

        {/* Grid de Campos em 2 Colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Linha 1: Cliente e Atendente */}
          <div className="flex flex-col">
            <label
              htmlFor="cliente"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-indigo-500" />
              Cliente
            </label>
            <Input
              id="cliente"
              type="text"
              value={state?.cliente || ''}
              disabled
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="atendente"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-indigo-500" />
              Atendente
            </label>
            <Input
              id="atendente"
              type="text"
              value={login || ''}
              disabled
            />
          </div>

          {/* Linha 2: Módulo do Sistema e Prioridade */}
          <div className="flex flex-col">
            <label
              htmlFor="modulo"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-indigo-500" />
              Módulo do Sistema
            </label>
            <Select
              id="modulo"
              value={modulo}
              onChange={(e) => changeModulo(e.target.value)}
              autoFocus={true}
            >
              {osModulos.map((mod) => (
                <option key={mod.codigo} value={mod.codigo}>
                  {`${mod.sistema} | ${mod.modulo}`}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="prioridade"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4 text-indigo-500" />
              Prioridade
            </label>
            <Select
              id="prioridade"
              value={prioridadeProgramacao}
              onChange={(e) => changePrioridade(e.target.value)}
            >
              {priopridade.map((prior) => (
                <option key={prior.id} value={prior.id}>
                  {prior.nome}
                </option>
              ))}
            </Select>
          </div>

          {/* Linha 3: Data de Abertura e Prazo de Entrega */}
          <div className="flex flex-col">
            <label
              htmlFor="dataAbertura"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-indigo-500" />
              Data de Abertura
            </label>
            <DatePicker
              id="dataAbertura"
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              selected={data}
              onChange={changeData}
              wrapperClassName="w-full"
              className="flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="prazoEntrega"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-indigo-500" />
              Prazo de Entrega
            </label>
            <DatePicker
              id="prazoEntrega"
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              selected={dataPrazoEntrega}
              onChange={changeDataPrazoEntrega}
              wrapperClassName="w-full"
              className="flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Linha 4 (Equipe Responsável): Analista e Programador */}
          <div className="flex flex-col">
            <label
              htmlFor="analista"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-indigo-500" />
              Analista Responsável
            </label>
            {funcionarios.length > 0 ? (
              <Select
                id="analista"
                onChange={(e) => changeFunAnalista(e.target.value)}
                value={funAnalista}
              >
                <option key={0} value={0}>Escolha o analista</option>
                {funcionarios
                  .filter((fun) => fun.categoria === 'ADM')
                  .map((fun) => (
                    <option key={fun.codigo} value={fun.codigo}>
                      {fun.login}
                    </option>
                  ))}
              </Select>
            ) : (
              <div className="flex items-center gap-2 p-2.5 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Carregando analistas...</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="programador"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-indigo-500" />
              Programador(a)
            </label>
            {funcionarios.length > 0 ? (
              <Select
                id="programador"
                onChange={(e) => changeFunProgramador(e.target.value)}
                value={funProgramador}
              >
                <option key={0} value={0}>Escolha o(a) programador(a)</option>
                {funcionarios
                  .filter((fun) => fun.categoria && fun.categoria.substring(0, 8) === 'PROGRAMA')
                  .map((fun) => (
                    <option key={fun.codigo} value={fun.codigo}>
                      {fun.login}
                    </option>
                  ))}
              </Select>
            ) : (
              <div className="flex items-center gap-2 p-2.5 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Carregando programadores...</span>
              </div>
            )}
          </div>

          {/* Linha 5 (Testes e Entrega): Quem Testará e Quem Entregará */}
          <div className="flex flex-col">
            <label
              htmlFor="testador"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-indigo-500" />
              Quem Testará
            </label>
            {funcionarios.length > 0 ? (
              <Select
                id="testador"
                onChange={(e) => changeFunTeste(e.target.value)}
                value={funTeste}
              >
                <option key={0} value={0}>Escolha quem vai testar</option>
                {funcionarios
                  .filter((fun) => fun.categoria === 'SUPORTE')
                  .map((fun) => (
                    <option key={fun.codigo} value={fun.codigo}>
                      {fun.login}
                    </option>
                  ))}
              </Select>
            ) : (
              <div className="flex items-center gap-2 p-2.5 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Carregando funcionários de teste...</span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="entregador"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-indigo-500" />
              Quem Entregará
            </label>
            {funcionarios.length > 0 ? (
              <Select
                id="entregador"
                onChange={(e) => changeFunEntrega(e.target.value)}
                value={funEntrega}
              >
                <option key={0} value={0}>Escolha quem vai entregar</option>
                {funcionarios
                  .filter((fun) => fun.categoria === 'SUPORTE')
                  .map((fun) => (
                    <option key={fun.codigo} value={fun.codigo}>
                      {fun.login}
                    </option>
                  ))}
              </Select>
            ) : (
              <div className="flex items-center gap-2 p-2.5 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Carregando funcionários de entrega...</span>
              </div>
            )}
          </div>

          {/* Linha 6: Descrição da Ocorrência */}
          <div className="flex flex-col md:col-span-2">
            <label
              htmlFor="ocorrencia"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              Descrição da Ocorrência
            </label>
            <Textarea
              id="ocorrencia"
              rows={5}
              value={descricaoOcorrencia}
              onChange={(e) => changeDescricaoOcorrencia(e.target.value)}
              placeholder="Descreva detalhadamente a ocorrência / escopo da ordem de serviço..."
            />
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            Icon={X}
            onClick={() => history.goBack()}
            nome="Voltar / Cancelar"
          />
          <Button
            type="submit"
            variant="indigo"
            Icon={Save}
            nome="Gerar Ordem de Serviço"
          />
        </div>
      </form>
    </div>
  );
}

export default AberturaOS;