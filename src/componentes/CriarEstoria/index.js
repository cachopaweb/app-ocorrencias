import React, { useState, useEffect } from 'react';
import { MdSave, MdCancel } from 'react-icons/md';
import swal from 'sweetalert';

import { Container } from './styles';
import Button from '../Button';
import api from '../../services/api';
import { useUsuario } from '../../context/UsuarioContext';

function CriarEstoria({ cliente, projeto_id, setModalActivate, atualizar }) {
    const [prazoSprint, setPrazoSprint] = useState([]);
    const [tipoPrazoEscolhido, setTipoPrazoEscolhido] = useState(0);
    const [prioridade, setprioridade] = useState(0);
    const [estoria, setEstoria] = useState('');
    const { codigo } = useUsuario();

    async function fetchPrazoSprint() {
        let response = await api.get('/prazo_sprint');
        setPrazoSprint(response.data);
    }

    async function submitEstoria(e) {
        e.preventDefault();
        if (tipoPrazoEscolhido === 0) { swal('Informe o tipo da Estória!', 'Necessário para o intervalo de dias a ser entregue', 'warning'); return; }
        if (prioridade === 0) { swal('Informe uma prioridade!', 'qual a prioridade do que esta sendo pedido', 'warning'); return; }
        if (estoria === '') { swal('Informe uma estória!', 'descreva o que o cliente pede', 'warning'); return; }
        if (projeto_id === 0) { swal('Informe o projeto Scrum!', 'Id do Projeto é obrigatório', 'warning'); return; }
        let dataEntrega = new Date();
        dataEntrega.setDate(dataEntrega.getDate() + tipoPrazoEscolhido);
        let dados = {
            Descricao: estoria,
            Necessidade: prioridade,
            Estado: "ABERTO",
            Cod_Projeto_Scrum: projeto_id,
            DataEntrega: dataEntrega,
            Funcionario: codigo
        }
        try {
            let response = await api.post('/backlog', dados);
            if (response.data.BACKLOG > 0) {
                swal(`Estória ${response.data.BACKLOG} criada com sucesso!`, 'Bom trabalho', 'success');
                setModalActivate(false);
                atualizar();
            } else {
                swal(`Erro ao criar Estória. Erro ${response.data.error}!`, 'Erro ao inserir', 'error')
            }
        } catch (error) {
            swal(`Erro ao criar Estória. Erro ${error}!`, 'Algo deu errado', 'error')
        }
    }

    useEffect(() => {
        fetchPrazoSprint()
    }, []);

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
                        <label htmlFor="Tipo">Tipo Estória</label>
                        <select onChange={(e) => setTipoPrazoEscolhido(e.target.value)}>
                            <option value="0">Informe o tipo da Estória</option>
                            {
                                prazoSprint.map((prazo) => <option key={prazo.codigo} value={prazo.dias}>{prazo.descricao}</option>)
                            }
                        </select>
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
                        <label htmlFor="estoria">Estória</label>
                        <textarea className="input-control" type="text" name="estoria" id="estoria" placeholder="informe a estória" onChange={(e) => setEstoria(e.target.value)} />
                    </div>
                    <div className="action">
                        <Button Icon={MdCancel} click={() => { }} nome={"Cancelar"} color={"red"} corTexto={"white"} borderRadius={'30px'} />
                        <Button Icon={MdSave} click={() => { }} nome={"Salvar"} color={"green"} corTexto={"white"} borderRadius={'30px'} />
                    </div>
                </form>
            </div>
        </Container>
    );
}

export default CriarEstoria;