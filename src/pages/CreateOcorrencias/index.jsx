import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import swal from '@/lib/feedback';
import DatePicker from '../../componentes/DatePicker';
import { 
  PlusCircle, 
  Calendar, 
  AlertCircle, 
  X, 
  Save, 
  FileText,
  User
} from 'lucide-react';

import { Button } from '../../componentes/Button';
import { Input, Select, Textarea } from '../../componentes/Input';
import api from '../../services/api';
import { useUsuario } from '../../context/UsuarioContext';
import { tipo_erro } from '../../constants';

function CreateOcorrencias({ codigo_projeto_scrum = 0, retornarPara = null }) {
  const [projetos_scrum, setProjetosScrum] = useState([]);
  const [erro, setErro] = useState('Erro de Sistema');
  const [cod_projeto_scrum, setCod_projeto_scrum] = useState(codigo_projeto_scrum);
  const { cod_funcionario } = useUsuario();
  const [data, setData] = useState(new Date());
  const history = useHistory();

  function dataAtualFormatadaAmericano(aData) {
    const dataObj = aData || new Date();
    const dia = dataObj.getDate().toString();
    const diaF = dia.length === 1 ? '0' + dia : dia;
    const mes = (dataObj.getMonth() + 1).toString();
    const mesF = mes.length === 1 ? '0' + mes : mes;
    const anoF = dataObj.getFullYear();
    return mesF + '-' + diaF + '-' + anoF;
  }

  async function insereOcorrencia(event) {
    event.preventDefault();
    const select = document.querySelector('#projetos_scrum');
    if (!select || select.selectedIndex < 0) {
      swal('Selecione um cliente!', 'Escolha um cliente válido', 'warning');
      return;
    }
    const cliente = select.options[select.selectedIndex]?.innerText || '';
    const ocorrencia = document.querySelector('#ocorrencia');
    if (!ocorrencia || ocorrencia.value.trim() === '') {
      swal('Texto da Ocorrência obrigatório!', 'Preencha a ocorrência', 'warning');
      return;
    }

    const selectedItem = projetos_scrum[select.selectedIndex];
    const create = {
      Data: dataAtualFormatadaAmericano(data),
      Finalizada: null,
      Funcionario: cod_funcionario,
      Modulo_Sistema: 1,
      Obs: ocorrencia.value,
      Ocorrencia: erro.toUpperCase(),
      contrato: selectedItem ? selectedItem.contrato : '',
      cli_nome: cliente,
      codigo: 0,
      projeto_scrum: cod_projeto_scrum
    };

    const response = await api.post('/Ocorrencias', create);
    if (!response.error) {
      swal('Ocorrência aberta com sucesso!', 'Bom trabalho', 'success');
      if (!retornarPara) {
        history.push('/');
      } else {
        retornarPara();
      }
    } else {
      swal('Algo deu errado!', response.error, 'error');
    }
  }

  useEffect(() => {
    getClientes();
  }, []);

  async function getClientes() {
    try {
      const response = await api.get('/projetos_scrum');
      const data = response.data || [];
      setProjetosScrum(data);
      if (data.length > 0 && !cod_projeto_scrum) {
        setCod_projeto_scrum(data[0].ps_codigo);
      }
    } catch (err) {
      console.error('Erro ao buscar projetos scrum:', err);
    }
  }

  function cancelar() {
    if (!retornarPara) {
      history.push('/');
    } else {
      retornarPara();
    }
  }

  function changeData(date) {
    setData(date);
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 w-full">
      <form
        onSubmit={insereOcorrencia}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-6"
      >
        {/* Cabeçalho do Card */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shrink-0">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Nova Ocorrência
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Registre um novo chamado de atendimento para o cliente
            </p>
          </div>
        </div>

        {/* Campos organizados */}
        <div className="flex flex-col gap-5">
          {/* Cliente */}
          <div className="flex flex-col">
            <label
              htmlFor="projetos_scrum"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-indigo-500" />
              Cliente
            </label>
            {projetos_scrum.length > 0 ? (
              <Select
                id="projetos_scrum"
                name="projetos_scrum"
                autoFocus={true}
                value={cod_projeto_scrum}
                onChange={(e) => setCod_projeto_scrum(e.target.value)}
              >
                {projetos_scrum.map((projetos) => (
                  <option key={projetos.contrato} value={projetos.ps_codigo}>
                    {projetos.cli_nome}
                  </option>
                ))}
              </Select>
            ) : (
              <div className="flex items-center gap-2 p-3 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Carregando projetos_scrum...</span>
              </div>
            )}
          </div>

          {/* Tipo de Erro */}
          <div className="flex flex-col">
            <label
              htmlFor="erro"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4 text-indigo-500" />
              Tipo de Erro
            </label>
            <Select
              id="erro"
              name="erro"
              value={erro}
              onChange={(e) => setErro(e.target.value)}
            >
              {tipo_erro.map((item) => (
                <option key={item.id} value={item.tipo}>
                  {item.tipo}
                </option>
              ))}
            </Select>
          </div>

          {/* Data */}
          <div className="flex flex-col">
            <label
              htmlFor="data"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-indigo-500" />
              Data
            </label>
            <DatePicker
              id="data"
              dateFormat="dd/MM/yyyy"
              locale="pt-BR"
              selected={data}
              onChange={changeData}
              className="flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              wrapperClassName="w-full"
            />
          </div>

          {/* Ocorrência / Descrição */}
          <div className="flex flex-col">
            <label
              htmlFor="ocorrencia"
              className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              Ocorrência / Descrição
            </label>
            <Textarea
              id="ocorrencia"
              name="ocorrencia"
              rows={5}
              placeholder="Descreva detalhadamente a ocorrência informada pelo cliente..."
            />
          </div>
        </div>

        {/* Rodapé com botões de ação alinhados à direita */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            Icon={X}
            onClick={cancelar}
            nome="Cancelar"
          />
          <Button
            type="submit"
            variant="indigo"
            Icon={Save}
            nome="Salvar Ocorrência"
          />
        </div>
      </form>
    </div>
  );
}

export default CreateOcorrencias;