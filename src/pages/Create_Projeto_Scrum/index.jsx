import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import swal from '@/lib/feedback';
import { Plus, FolderPlus, Users } from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../componentes/Button';
import { Select } from '../../componentes/Input';

const Create_Projeto_Scrum = () => {
  const [clientes, setClientes] = useState([]);
  const [selectedContrato, setSelectedContrato] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function fetchClientes() {
    try {
      const response = await api.get('/Clientes');
      const data = response.data || [];
      setClientes(data);
      if (data.length > 0) {
        setSelectedContrato(data[0].contrato);
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  }

  useEffect(() => {
    fetchClientes();
  }, []);

  async function submitForm(e) {
    e.preventDefault();
    const select = document.querySelector('#projetos_scrum');
    const selectedIndex = select ? select.selectedIndex : 0;
    const cliente = clientes[selectedIndex] || clientes.find(c => String(c.contrato) === String(selectedContrato));

    if (!cliente) {
      swal('Atenção', 'Selecione um cliente para prosseguir!', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/projetos_scrum', {
        nome: cliente.nome,
        estado: "ABERTO",
        contrato: cliente.contrato
      });

      if (response.status === 201) {
        swal('Projeto criado com sucesso', 'Bom trabalho', 'success');
        history.push('/');
      } else {
        swal('Não foi possível abrir o projeto scrum!', `Erro ${response.data?.error || ''}`, 'error');
      }
    } catch (error) {
      swal('Erro', `Não foi possível criar o projeto: ${error.message || error}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <FolderPlus className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Novo Projeto Scrum
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Selecione um cliente para vincular ao novo projeto Scrum
          </p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={submitForm} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="projetos_scrum" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Cliente
          </label>
          {clientes.length > 0 ? (
            <Select
              id="projetos_scrum"
              autoFocus={true}
              value={selectedContrato}
              onChange={(e) => setSelectedContrato(e.target.value)}
              className="w-full"
            >
              {clientes.map(cliente => (
                <option key={cliente.contrato} value={cliente.contrato}>
                  {cliente.nome}
                </option>
              ))}
            </Select>
          ) : (
            <div className="flex items-center justify-center p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-500 dark:text-slate-400">
              <Users className="w-4 h-4 mr-2 animate-pulse text-indigo-500" />
              Carregando clientes...
            </div>
          )}
        </div>

        {/* Rodapé / Ações */}
        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            variant="indigo"
            Icon={Plus}
            nome={loading ? "Criando..." : "Criar Projeto"}
            disabled={loading || clientes.length === 0}
            className="w-full sm:w-auto"
          />
        </div>
      </form>
    </div>
  );
};

export default Create_Projeto_Scrum;
