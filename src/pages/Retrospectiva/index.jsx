import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import swal from '@/lib/feedback';
import { Save, ArrowLeft, History, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../componentes/Button';
import { Textarea } from '../../componentes/Input';

function Retrospectiva() {
  const [integrantes, setIntegrantes] = useState('');
  const [processo, setProcesso] = useState('');
  const [ferramentas, setFerramentas] = useState('');
  const [comunicacao, setComunicacao] = useState('');
  const [definicaoPronto, setDefinicaoPronto] = useState('');
  const [codigoRetrospectiva, setCodigoRetrospectiva] = useState('');
  const [salvando, setSalvando] = useState(false);

  const history = useHistory();
  const { state } = useLocation();

  async function fetchRetrospectiva() {
    if (!state?.projeto_scrum) return;
    try {
      const response = await api.get(`/projetos_scrum/Retrospectiva/${state.projeto_scrum}`);
      if (response.status === 200 && response.data) {
        const retrospectiva = response.data;
        setCodigoRetrospectiva(retrospectiva.codigo || 0);
        setIntegrantes(retrospectiva.analise_integrantes || '');
        setProcesso(retrospectiva.analise_processo || '');
        setFerramentas(retrospectiva.analise_ferramentas || '');
        setComunicacao(retrospectiva.analise_comunicacao || '');
        setDefinicaoPronto(retrospectiva.analise_pronto || '');
      }
    } catch (error) {
      console.error('Erro ao buscar retrospectiva:', error);
      swal(`Erro ao buscar retrospectiva!\n ${error.message || error}`, 'Atenção', 'error');
    }
  }

  useEffect(() => {
    fetchRetrospectiva();
  }, [state?.projeto_scrum]);

  async function submitForm(event) {
    event.preventDefault();
    if (!state?.projeto_scrum) {
      swal('Projeto Scrum é obrigatório!', 'Atenção', 'warning');
      return;
    }

    setSalvando(true);
    const dados = {
      codigo: codigoRetrospectiva,
      projeto_scrum: state.projeto_scrum,
      analise_integrantes: integrantes,
      analise_processo: processo,
      analise_ferramentas: ferramentas,
      analise_comunicacao: comunicacao,
      analise_pronto: definicaoPronto
    };

    try {
      const response = await api.post('/projetos_scrum/Retrospectiva', dados);
      if (response.status === 201 || response.status === 200) {
        swal(`Retrospectiva ${response.data?.Retrospectiva || ''} salva com sucesso!`, 'Bom trabalho', 'success');
        history.goBack();
      } else {
        swal(`Erro ao salvar retrospectiva. Erro ${response.data?.error || ''}`, 'Algo deu errado', 'error');
      }
    } catch (error) {
      swal(`Erro ao enviar requisição!\n ${error.message || error}`, 'Erro', 'error');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Retrospectiva da Sprint
              <Sparkles className="w-5 h-5 text-amber-500" />
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {state?.cliente ? (
                <span>
                  Cliente: <strong className="text-slate-700 dark:text-slate-200">{state.cliente}</strong>
                  {state?.projeto_scrum ? ` • Projeto #${state.projeto_scrum}` : ''}
                </span>
              ) : (
                'Análise de melhoria contínua dos processos e da equipe da sprint'
              )}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          Icon={ArrowLeft}
          nome="Voltar"
          type="button"
          onClick={() => history.goBack()}
        />
      </div>

      {/* Card do Formulário */}
      <form
        onSubmit={submitForm}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6"
      >
        {/* 1. Análise da Relação dos Integrantes */}
        <div className="space-y-2">
          <label htmlFor="integrantes" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              1
            </span>
            Análise da Relação dos Integrantes
          </label>
          <Textarea
            id="integrantes"
            name="integrantes"
            rows={3}
            placeholder="Como foi o trabalho em equipe, colaboração, motivação e relacionamento durante a sprint?"
            value={integrantes}
            onChange={(e) => setIntegrantes(e.target.value)}
          />
        </div>

        {/* 2. Análise do Processo */}
        <div className="space-y-2">
          <label htmlFor="processo" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              2
            </span>
            Análise do Processo
          </label>
          <Textarea
            id="processo"
            name="processo"
            rows={3}
            placeholder="O que funcionou bem no fluxo e o que pode ser melhorado nos processos da sprint?"
            value={processo}
            onChange={(e) => setProcesso(e.target.value)}
          />
        </div>

        {/* 3. Análise das Ferramentas */}
        <div className="space-y-2">
          <label htmlFor="ferramentas" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              3
            </span>
            Análise das Ferramentas
          </label>
          <Textarea
            id="ferramentas"
            name="ferramentas"
            rows={3}
            placeholder="As tecnologias, ferramentas de desenvolvimento e infraestrutura atenderam às expectativas?"
            value={ferramentas}
            onChange={(e) => setFerramentas(e.target.value)}
          />
        </div>

        {/* 4. Análise dos Métodos de Comunicação */}
        <div className="space-y-2">
          <label htmlFor="comunicacao" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              4
            </span>
            Análise dos Métodos de Comunicação
          </label>
          <Textarea
            id="comunicacao"
            name="comunicacao"
            rows={3}
            placeholder="A comunicação interna e com stakeholders foi clara, pontual e assertiva?"
            value={comunicacao}
            onChange={(e) => setComunicacao(e.target.value)}
          />
        </div>

        {/* 5. Análise da Definição de Pronto */}
        <div className="space-y-2">
          <label htmlFor="definicaoPronto" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              5
            </span>
            Análise da Definição de Pronto (Definition of Done)
          </label>
          <Textarea
            id="definicaoPronto"
            name="definicaoPronto"
            rows={3}
            placeholder="Os critérios de aceitação e os padrões de qualidade foram atendidos conforme a definição de pronto?"
            value={definicaoPronto}
            onChange={(e) => setDefinicaoPronto(e.target.value)}
          />
        </div>

        {/* Ações / Rodapé */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="outline"
            Icon={ArrowLeft}
            nome="Voltar / Cancelar"
            type="button"
            onClick={() => history.goBack()}
            className="w-full sm:w-auto"
          />
          <Button
            variant="indigo"
            Icon={Save}
            nome={salvando ? "Salvando..." : "Salvar Retrospectiva"}
            type="submit"
            disabled={salvando}
            className="w-full sm:w-auto"
          />
        </div>
      </form>
    </div>
  );
}

export default Retrospectiva;
