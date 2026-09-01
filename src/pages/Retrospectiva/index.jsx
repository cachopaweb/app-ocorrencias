import React, { useEffect, useState } from 'react';
import { Container } from './styles';
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
        <Container className="flex justify-center items-center text-black font-bold">
            <div id="form" className="m-0 w-full">
                <form onSubmit={submitForm} className="m-[15px] rounded-[8px] bg-white p-[20px] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.15),0px_10px_20px_-10px_rgba(0,0,0,0.1)]">
                    <div className="flex flex-col mb-[10px]">
                        <label className="mb-[5px]" htmlFor="integrantes">Análise Relação dos Integrantes</label>
                        <textarea className="h-[150px]" value={integrantes} onChange={(e)=> setIntegrantes(e.target.value)} name="integrantes" id="integrantes"></textarea>
                    </div>
                    <div className="flex flex-col mb-[10px]">
                        <label className="mb-[5px]" htmlFor="processo">Análise do Processo</label>
                        <textarea className="h-[150px]" value={processo} onChange={(e)=> setProcesso(e.target.value)} name="processo" id="processo"></textarea>
                    </div>
                    <div className="flex flex-col mb-[10px]">
                        <label className="mb-[5px]" htmlFor="ferramentas">Análise das Ferramentas</label>
                        <textarea className="h-[150px]" value={ferramentas} onChange={(e)=> setFerramentas(e.target.value)} name="ferramentas" id="ferramentas"></textarea>
                    </div>
                    <div className="flex flex-col mb-[10px]">
                        <label className="mb-[5px]" htmlFor="comunicacao">Análise dos Métodos de Comunicação</label>
                        <textarea className="h-[150px]" value={comunicacao} onChange={(e)=> setComunicacao(e.target.value)} name="comunicacao" id="comunicacao"></textarea>
                    </div>
                    <div className="flex flex-col mb-[10px]">
                        <label className="mb-[5px]" htmlFor="definicao-pronto">Análise da Definição de Pronto</label>
                        <textarea className="h-[150px]" value={definicaoPronto} onChange={(e)=> setDefinicaoPronto(e.target.value)} name="definicao-pronto" id="definicao-pronto"></textarea>
                    </div>
                    <button className="w-[45%] h-[30px] border-none rounded-[18px] text-white bg-red-600 m-[5px] shadow-[1px_2px_2px_1px_rgba(0,0,0,0.5)] font-bold hover:text-black hover:bg-white hover:border hover:border-black" type="button" onClick={()=> history.goBack()}>Cancelar</button>
                    <button className="w-[45%] h-[30px] border-none rounded-[18px] text-white bg-green-600 m-[5px] shadow-[1px_2px_2px_1px_rgba(0,0,0,0.5)] font-bold hover:text-black hover:bg-white hover:border hover:border-black" type="submit">Salvar</button>
                </form>
            </div>
        </Container>
        </>
    );
}

export default Retrospectiva;
