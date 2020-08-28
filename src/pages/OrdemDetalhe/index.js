import React, { useState } from 'react';
import { Container } from './styles';
import Header from '../../componentes/Header';
import Card from '../../componentes/Card';
import Button from '../../componentes/Button';
import { useLocation, useHistory } from 'react-router-dom';
import { MdEdit, MdSave } from 'react-icons/md'
import api from '../../services/api';
import swal from 'sweetalert';

function OrdemDetalhe(){
    const history = useHistory();
    const { state  } = useLocation();
    const { ordem } = state;    
    const [emEdicao, setEmEdicao] = useState(false);
    const [ocorrencia, setOcorrencia] = useState(ordem.ocorrencia);

    function converteData(data){
        let arrayData = data.split('/');
        let date = new Date(parseInt(arrayData[2]+'20'), arrayData[0]-1, arrayData[1]);
        return date;    
    } 

    function Editar(){
        setEmEdicao(true)
    }

    async function Salvar(){
        try {            
            let response = await api.put(`/AtualizaOrdens/${ordem.ord_codigo}`, { ocorrencia });
            if (response.status === 200){
                swal('Ordem Atualizada com sucesso!', 'Tudo ok', 'success');
                setEmEdicao(false);
                history.push('/ordensAndamento');
            }else{
                swal('Falha ao atualizar ordem!', 'Falha', 'error')
            }
        } catch (error) {
            swal(`Erro ao atualizar ordem ${error}`, 'Erro', 'error')
        }        
    }
   
    return (
            <>
                <Header title={'Detalhe da Ordem'} />        
                <Container>
                    { 
                        <Card key={ordem.ord_codigo} cliente={ordem.cli_nome} contrato={ordem.ord_codigo} ocorrencia={ordem.ocorrencia} atendente={ordem.programador} nomeAtendente={ordem.programador} cod_ocorrencia={ordem.ord_codigo} data={converteData(ordem.prazoEntrega)} showActions={false}>                    
                            {emEdicao && <textarea value={ocorrencia} name="ocorrencia" id="ocorrencia" onChange={(e)=> setOcorrencia(e.target.value)}></textarea> }
                            <div className="actions">
                                <Button click={Editar} Icon={MdEdit} nome={"Editar"} color={"#000"} corTexto={"#FFF"} borderRadius={'18px'} />
                                {emEdicao && <Button click={Salvar} Icon={MdSave} nome={"Salvar"} color={"#7FA66D"} corTexto={"#FFF"} borderRadius={'18px'} /> }
                            </div>
                        </Card>
                    }                 
                </Container>
            </>
        );
}

export default OrdemDetalhe;