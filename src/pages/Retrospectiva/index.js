import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import Header from '../../componentes/Header';
import api from '../../services/api';
import swal from 'sweetalert';
import { useHistory, useLocation } from 'react-router-dom';

function Retrospectiva(){
    const [integrantes, setIntegrantes] = useState('');
    const [processo, setProcesso] = useState('');
    const [ferramentas, setFerramentas] = useState('');
    const [comunicacao, setComunicacao] = useState('');
    const [definicaoPronto, setDefinicaoPronto] = useState('');
    const [codigoRetrospectiva, setCodigoRetrospectiva] = useState('');
    const history = useHistory();
    const { state } = useLocation();

    async function fetchRetrospectiva(){
        try{
            const response = await api.get(`/projetos_scrum/Retrospectiva/${state.projeto_scrum}`);
            if (response.status === 200){
                const retrospectiva = response.data;
                setCodigoRetrospectiva(retrospectiva.codigo || 0);
                setIntegrantes(retrospectiva.analise_integrantes);
                setProcesso(retrospectiva.analise_processo);
                setFerramentas(retrospectiva.analise_ferramentas);
                setComunicacao(retrospectiva.analise_comunicacao);
                setDefinicaoPronto(retrospectiva.analise_pronto);
            }else{
                console.log('dados não retornados')
            }
        }catch(error){
            swal(`Erro ao buscar retrospectiva!\n ${error}`, 'Atenção', 'error')
        }
    }

    useEffect(()=>{
        fetchRetrospectiva();
    }, [state.projeto_scrum])

    async function submitForm(event){
       
       event.preventDefault();
       if (state.projeto_scrum === 0) { 
           swal(`Projeto Scrum é obrigatório!`, 'Atenção', 'warning');
           return;
       }
       const dados = {
            codigo: codigoRetrospectiva,
            projeto_scrum: state.projeto_scrum,
            analise_integrantes: integrantes,
            analise_processo: processo,
            analise_ferramentas: ferramentas,
            analise_comunicacao: comunicacao,
            analise_pronto: definicaoPronto
        }; 
        try{
            const response = await api.post(`/projetos_scrum/Retrospectiva`, dados);
            if (response.status === 201){
                swal(`Retrospectiva ${response.data.Retrospectiva} criada/atualizada com sucesso!`, 'Bom trabalho', 'success');
                history.goBack();
            }else{
                swal(`Erro ao cria retrospectiva. Erro ${response.data.error}`, 'Algo de Errado ocorreu', 'error');
            }
        }catch(error){
            swal(`Erro ao enviar requisição!\n ${error}`, 'Erro', 'error');
        }
    }

    return (
        <>
        <Header title={`Retrospectiva ${state.cliente}`} />
        <Container>
            <div id="form">
                <form onSubmit={submitForm}>
                    <div className="form-group">
                        <label htmlFor="integrantes">Análise Relação dos Integrantes</label>
                        <textarea value={integrantes} onChange={(e)=> setIntegrantes(e.target.value)} name="integrantes" id="integrantes"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="processo">Análise do Processo</label>
                        <textarea value={processo} onChange={(e)=> setProcesso(e.target.value)} name="processo" id="processo"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="ferramentas">Análise das Ferramentas</label>
                        <textarea value={ferramentas} onChange={(e)=> setFerramentas(e.target.value)} name="ferramentas" id="ferramentas"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="comunicacao">Análise dos Métodos de Comunicação</label>
                        <textarea value={comunicacao} onChange={(e)=> setComunicacao(e.target.value)} name="comunicacao" id="comunicacao"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="definicao-pronto">Análise da Definição de Pronto</label>
                        <textarea value={definicaoPronto} onChange={(e)=> setDefinicaoPronto(e.target.value)} name="definicao-pronto" id="definicao-pronto"></textarea>
                    </div>
                    <button className="btn_cancelar" type="button" onClick={()=> history.goBack()}>Cancelar</button>
                    <button className="btn_salvar" type="submit">Salvar</button>
                </form>
            </div>
        </Container>
        </>
    );
}

export default Retrospectiva;

