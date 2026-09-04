import React, { useState, useEffect } from 'react';
import { BarChart3, PlusCircle } from 'lucide-react';
import swal from '@/lib/feedback';

import BoardContext from './context';
import Lista from './Lista';
import produce from 'immer';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../componentes/Button';
import Badge from '../../componentes/Badge';
import Burndown from '../Burndown';
import Modal from '../Modal';
import { useUsuario } from '../../context/UsuarioContext';

export default function QuadroScrum() {
  const [lista, setLista] = useState([]);
  const { state } = useLocation();
  const { cliente, projeto_id, contrato, ocorrencia } = state || {};
  const [burndownAtivo, setBurndownAtivo] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [atualizar, setAtualizar] = useState(false);
  const { cod_funcionario } = useUsuario();

  async function fetchQuadroScrum() {
    if (!projeto_id) return;
    try {
      setLista([]);
      setCarregando(true);
      let response = await api.get(`/quadroScrum?projeto_id=${projeto_id}`);
      setCarregando(false);
      setLista(response.data);
    } catch (error) {
      setCarregando(false);
      swal(error, 'erro', error);
    }
  }

  useEffect(() => {
    fetchQuadroScrum();
    setAtualizar(false);
  }, [atualizar]);

  function move(fromList, toList, from, to, type) {
    setLista(produce(lista, draft => {
      const dragged = draft[fromList].cards[from];
      draft[fromList].cards.splice(from, 1);
      if (type === 'CARD_SPRINT') {
        if (draft[toList].cards.length > 0) {
          draft[toList].cards.splice(to, 0, dragged);
        } else {
          draft[toList].cards.push(dragged);
        }
      }
    }));
  }

  const criaBacklogsImplantacao = async () => {
    try {
      setCarregando(true);
      let response = await api.post(`/quadroScrum/criaBacklogsImplantacao/${projeto_id}/funcionario/${cod_funcionario}`);
      if (response.status === 200) {
        swal('Backlogs de implantação criado com sucesso!', 'Deu certo', 'success');
      } else {
        swal('Falha ao criar backlogs', response.data, 'error');
      }
      setCarregando(false);
      await fetchQuadroScrum();
    } catch (error) {
      setCarregando(false);
      swal(error, 'erro', error);
    }
  };

  return (
    carregando ? (
      <div className="py-20 flex flex-col justify-center items-center gap-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin dark:border-indigo-400 dark:border-t-transparent" />
        <h1 className="text-slate-500 dark:text-slate-400 animate-pulse font-medium text-base">Aguarde, carregando projeto Scrum...</h1>
      </div>
    ) : (
      <BoardContext.Provider value={{ lista, move, setAtualizar }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Quadro Scrum</h1>
              {projeto_id && (
                <Badge variant="outline" size="sm" className="font-mono text-xs">
                  ID: #{projeto_id}
                </Badge>
              )}
            </div>
            {cliente && (
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>Cliente:</span>
                <Badge variant="default" size="sm" className="font-medium">
                  {cliente}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              Icon={BarChart3}
              nome="Burndown"
              onClick={() => setBurndownAtivo(!burndownAtivo)}
            />
            <Button
              variant="indigo"
              Icon={PlusCircle}
              nome="Criar Backlogs de Implantação"
              onClick={() => criaBacklogsImplantacao()}
            />
          </div>
        </div>

        {burndownAtivo && (
          <Modal activate={burndownAtivo} setActivate={setBurndownAtivo} altura="600px" largura="700px">
            <Burndown projeto_id={projeto_id} />
          </Modal>
        )}

        <div className="flex gap-5 pb-6 overflow-x-auto min-h-[calc(100vh-220px)] items-start scrollbar-thin">
          {lista.length > 0 &&
            lista.map((listaItem, index) => (
              <Lista 
                key={listaItem.title || index}
                index={index}
                data={listaItem}
                cliente={cliente}
                projeto_id={projeto_id}
                contrato={contrato}
                ocorrencia={ocorrencia}
              />
            ))}
        </div>
      </BoardContext.Provider>
    )
  );
}
