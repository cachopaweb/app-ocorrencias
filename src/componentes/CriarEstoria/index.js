import React, { useState, useEffect, useContext } from 'react';
import { MdSave, MdCancel } from 'react-icons/md';
import swal from 'sweetalert';

import { Container } from './styles';
import Button from '../Button';
import api from '../../services/api';
import { useUsuario } from '../../context/UsuarioContext';
import quadroContext from '../QuadroScrum/context';

function CriarEstoria({ cliente, projeto_id = 0, setModalActivate, cod_ocorrencia = 0 }) {
    const [prioridade, setprioridade] = useState(2);
    const [ocorrencia, setOcorrencia] = useState(cod_ocorrencia)
    const [estoria, setEstoria] = useState('');
    const { cod_funcionario } = useUsuario();
    const [ocorrencias, setOcorrencias] = useState([]);
    const [titulo, setTitulo] = useState('');
    const { setAtualizar } = useContext(quadroContext)

    async function submitEstoria(e) {
        e.preventDefault();
        if (prioridade === 0) { swal('Informe uma prioridade!', 'qual a prioridade do que esta sendo pedido', 'warning'); return; }
        if (estoria === '') { swal('Informe uma estória!', 'descreva o que o cliente pede', 'warning'); return; }
        if (projeto_id === 0) { swal('Informe o projeto Scrum!', 'Id do Projeto é obrigatório', 'warning'); return; }
        if (ocorrencia === 0) { swal('Informe uma ocorrência!', 'Id da ocorrência é obrigatório', 'warning'); return; }
        let dados = {
            Descricao: estoria,
            Necessidade: prioridade,
            Estado: "ABERTO",
            Cod_Projeto_Scrum: projeto_id,
            Funcionario: cod_funcionario,
            ocorrencia,
            titulo
        }
        try {
            let response = await api.post('/backlog', dados);
            if (response.data.BACKLOG > 0) {
                swal(`Estória ${response.data.BACKLOG} criada com sucesso!`, 'Bom trabalho', 'success');
                setModalActivate(false);
                setAtualizar(true);
            } else {
                swal(`Erro ao criar Estória. Erro ${response.data.error}!`, 'Erro ao inserir', 'error')
            }
        } catch (error) {
            swal(`Erro ao criar Estória. Erro ${error}!`, 'Algo deu errado', 'error')
        }
    }

    async function fetchOcorrencias(){
        let response = await api.get(`/Ocorrencias?projeto_id=${projeto_id}`);
        setOcorrencias(response.data);
    }

    useEffect(()=>{
        fetchOcorrencias();
    }, [])

    
    return (
        <Container>
            <div id="form">
                <form onSubmit={submitEstoria}>
                    <h1>Novo Backlog</h1>
                    <div className="form-group">
                        <label htmlFor="clientes">Escolha o cliente</label>
                        <input id="cliente" className="input-control" type="text" value={cliente} disabled />
                    </div>
                    <div className="form-group">
                        <label htmlFor="prioridade">Prioridade</label>
                        <select id="prioridade" onChange={(e) => setprioridade(e.target.value)}>
                            <option value="0">Informe a Prioridade</option>                            
                            <option value="1">BAIXA</option>                            
                            <option value="2">MÉDIA</option>                            
                            <option value="3">ALTA</option>                            
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="ocorrencia">Ocorrência</label>
                        <select id="prioridade" onChange={(e) => setOcorrencia(e.target.value)} value={ocorrencia}>
                            <option value="0">Informe a Ocorrência</option>                            
                            {
                                ocorrencias.map((oco)=> <option key={oco.codigo} value={oco.codigo}>{`${oco.codigo} - ${oco.obs}`}</option>)
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="titulo">Título</label>
                        <input id="titulo" className="input-control" type="text" value={titulo} onChange={(e)=> setTitulo(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="estoria">Estória</label>
                        <textarea className="input-control" type="text" name="estoria" id="estoria" placeholder="informe a estória" onChange={(e) => setEstoria(e.target.value)} />
                    </div>
                    <div className="action">
                        <Button Icon={MdCancel} click={() => setModalActivate(false)} nome={"Cancelar"} color={"red"} corTexto={"white"} borderRadius={'30px'} />
                        <Button Icon={MdSave} click={() => { }} nome={"Salvar"} color={"green"} corTexto={"white"} borderRadius={'30px'} />
                    </div>
                </form>
            </div>
        </Container>
    );
}

export default CriarEstoria;