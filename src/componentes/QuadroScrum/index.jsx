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

function normalizarDataset(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && Object.keys(data).length > 0) return [data];
  return [];
}

function corPrioridade(necessidade) {
  const n = Number(necessidade);
  if (n === 1) return 'green';
  if (n === 2) return 'blue';
  if (n === 3) return 'red';
  return 'blue';
}

export default function QuadroScrum() {
  const [lista, setLista] = useState([]);
  const { state } = useLocation();
  const { cliente, projeto_id, contrato, ocorrencia } = state || {};
  const [burndownAtivo, setBurndownAtivo] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [atualizar, setAtualizar] = useState(false);
  const { cod_funcionario } = useUsuario();

  async function buscarSprintsEntregues(idProjeto) {
    try {
      const sqlSprints = `SELECT BS_CODIGO, BS_DESCRICAO, BS_DATA_SPRINT, BS_DATA_ENT_PROG, COALESCE(BS_DATA_ENT_REAL, ORD_DATAE, BS_DATA_ENT_PROG) AS BS_DATA_ENT_REAL, COALESCE(ORD_CODIGO, 0) AS ORD_CODIGO FROM BACKLOG_SPRINT LEFT JOIN ORDENS ON BS_CODIGO = ORD_SPRINT WHERE BS_PS = ${Number(idProjeto)} AND BS_ESTADO = 'ENTREGUE' ORDER BY BS_CODIGO`;
      const resSprints = await api.post('/v1/dataset', { sql: sqlSprints });
      const sprintsRows = normalizarDataset(resSprints.data);

      if (sprintsRows.length === 0) {
        return [];
      }

      const ids = sprintsRows
        .map((r) => Number(r.BS_CODIGO ?? r.bs_codigo))
        .filter((id) => !isNaN(id) && id > 0);

      let backlogsPorSprint = {};
      if (ids.length > 0) {
        const sqlBacklogs = `SELECT BB_BS, BP_CODIGO, BP_DESCRICAO, BP_NECESSIDADE, FUN_AVATAR, BB_CODIGO, BP_OCORRENCIA, BP_TITULO FROM BS_BP LEFT JOIN BACKLOG_P ON BB_BP = BP_CODIGO LEFT JOIN FUNCIONARIOS ON BP_FUN = FUN_CODIGO WHERE BB_BS IN (${ids.join(',')}) ORDER BY BP_CODIGO`;
        const resBacklogs = await api.post('/v1/dataset', { sql: sqlBacklogs });
        const backlogRows = normalizarDataset(resBacklogs.data);

        backlogRows.forEach((b) => {
          const codSprint = Number(b.BB_BS ?? b.bb_bs);
          if (!backlogsPorSprint[codSprint]) {
            backlogsPorSprint[codSprint] = [];
          }
          backlogsPorSprint[codSprint].push({
            id: Number(b.BP_CODIGO ?? b.bp_codigo),
            content: b.BP_DESCRICAO ?? b.bp_descricao ?? '',
            labels: [corPrioridade(b.BP_NECESSIDADE ?? b.bp_necessidade)],
            user: b.FUN_AVATAR ?? b.fun_avatar ?? '',
            bb_codigo: Number(b.BB_CODIGO ?? b.bb_codigo),
            ocorrencia: Number(b.BP_OCORRENCIA ?? b.bp_ocorrencia ?? 0),
            titulo: b.BP_TITULO ?? b.bp_titulo ?? '',
          });
        });
      }

      return sprintsRows.map((row) => {
        const idSprint = Number(row.BS_CODIGO ?? row.bs_codigo);
        return {
          id: idSprint,
          content: row.BS_DESCRICAO ?? row.bs_descricao ?? '',
          labels: [],
          user: '',
          data: row.BS_DATA_SPRINT ?? row.bs_data_sprint ?? '',
          dataEntrega: row.BS_DATA_ENT_PROG ?? row.bs_data_ent_prog ?? '',
          dataEntregaReal: row.BS_DATA_ENT_REAL ?? row.bs_data_ent_real ?? '',
          ordem: Number(row.ORD_CODIGO ?? row.ord_codigo ?? 0),
          backlogs: backlogsPorSprint[idSprint] || [],
          ocorrencia: 0,
          titulo: '',
        };
      });
    } catch (err) {
      console.warn('Erro ao buscar sprints entregues via dataset:', err);
      return [];
    }
  }

  async function fetchQuadroScrum() {
    if (!projeto_id) return;
    try {
      setLista([]);
      setCarregando(true);
      let response = await api.get(`/quadroScrum?projeto_id=${projeto_id}`);
      const colunas = Array.isArray(response.data) ? [...response.data] : [];

      const jaTemEntregue = colunas.some(
        (col) => (col.title || '').toUpperCase().includes('ENTREGUE')
      );

      if (!jaTemEntregue) {
        const cardsEntregues = await buscarSprintsEntregues(projeto_id);
        colunas.push({
          title: 'Sprint Entregue',
          createBacklog: false,
          createSprint: false,
          ehSprint: true,
          cards: cardsEntregues,
        });
      }

      setCarregando(false);
      setLista(colunas);
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
          <Modal activate={burndownAtivo} setActivate={setBurndownAtivo} altura="auto" largura="920px">
            <Burndown projeto_id={projeto_id} cliente={cliente} />
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
