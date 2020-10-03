import React, { useState, useEffect } from 'react';
import { MdSave, MdCancel } from 'react-icons/md';
import swal from 'sweetalert';

import { Container, Preview, Thumb, ThumbInner } from './styles';
import Button from '../Button';
import api from '../../services/api';
import Modal from '../../componentes/Modal';
import Dropzone from "../../componentes/DropZone";

function CriarSprint({ cliente, projeto_id, setModalActivate, atualizar }) {
    const [prazoSprint, setPrazoSprint] = useState([]);
    const [tipoPrazoEscolhido, setTipoPrazoEscolhido] = useState(0);
    const [prioridade, setprioridade] = useState(0);
    const [descricao, setDescricao] = useState('');
    const [files, setFiles] = useState([]);
    const [imagemClicada, setImagemClicada] = useState({});
    const [modalAtivo, setModalAtivo] = useState(false);

    async function fetchPrazoSprint() {
        let response = await api.get('/prazo_sprint');
        setPrazoSprint(response.data);
    }
    function adicionarDiasData(dias) {
        var hoje = new Date();
        return new Date(hoje.setDate(hoje.getDate() + parseInt(dias)));
    }

    async function submitEstoria(e) {
        e.preventDefault();
        if (tipoPrazoEscolhido === 0) { swal('Informe o tipo da Sprint!', 'Necessário para o intervalo de dias a ser entregue', 'warning'); return; }
        if (prioridade === 0) { swal('Informe uma prioridade!', 'qual a prioridade do que esta sendo pedido', 'warning'); return; }
        if (projeto_id === 0) { swal('Informe o projeto Scrum!', 'Id do Projeto é obrigatório', 'warning'); return; }
        let codigoSprint = 0;
        //dados da sprint
        let dados = {
            Estado: "A FAZER",
            Descricao: descricao,
            Cod_Projeto_Scrum: projeto_id,
            DataEntregaProgramacao: adicionarDiasData(tipoPrazoEscolhido).toLocaleDateString()
        }
        try {
            let response = await api.post('/sprint', dados);
            codigoSprint = response.data?.BACKLOG_SPRINT || 0;
            if (codigoSprint > 0) {
                swal(`Sprint ${codigoSprint} criada com sucesso!`, 'Bom trabalho', 'success');
                setModalActivate(false);
                atualizar();
            } else {
                swal(`Erro ao criar Sprint. Erro ${response.data.error}!`, 'Erro ao inserir', 'error')
            }
        } catch (error) {
            swal(`Erro ao criar Sprint. Erro ${error}!`, 'Algo deu errado', 'error')
        }
        if (codigoSprint > 0) {
            const data = new FormData();
            //add imagens
            files.map((file, index) =>
                data.append(`Files[${index}]`, file, file.name)
            );

            const config = {
                headers: {
                    "content-type": "multipart/form-data"
                }
            }
            try {
                let response = await api.post(`/Upload/${codigoSprint}`, data, config);
                if (!response.status === 200) {
                    swal(`Erro ao enviar arquivos da Sprint. Erro ${response.data.error}!`, 'Erro ao fazer upload', 'error')
                }
            } catch (error) {
                swal(`Erro ao fazer upload arquivos. Erro ${error}!`, 'Algo deu errado', 'error')
            }
        }
    }

    useEffect(() => {
        fetchPrazoSprint()
    }, []);

    function abrirPreview(file) {
        setImagemClicada(file);
        setModalAtivo(true)
    }

    return (
        <>
            <Container>
                <div id="form">
                    <form onSubmit={submitEstoria}>
                        <h1>Nova Sprint</h1>
                        <div className="form-group">
                            <label htmlFor="clientes">Escolha o cliente</label>
                            <input id="cliente" className="input-control" type="text" value={cliente} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="Tipo">Tipo Sprint</label>
                            <select onChange={(e) => setTipoPrazoEscolhido(e.target.value)}>
                                <option value="0">Informe o tipo da Sprint</option>
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
                            <label htmlFor="clientes">Descrição</label>
                            <input placeholder="Informe uma descrição" id="descricao" className="input-control" type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <Dropzone setArquivos={setFiles} />
                            <Preview>
                                {
                                    files?.map(file =>
                                        <Thumb onClick={() => abrirPreview(file)}>
                                            <ThumbInner >
                                                <img key={file.name} src={file.preview} />
                                            </ThumbInner>
                                        </Thumb>
                                    )
                                }
                            </Preview>
                        </div>
                        <div className="action">
                            <Button Icon={MdCancel} click={() => setModalActivate(false)} nome={"Cancelar"} color={"red"} corTexto={"white"} borderRadius={'30px'} />
                            <Button Icon={MdSave} click={() => { }} nome={"Salvar"} color={"green"} corTexto={"white"} borderRadius={'30px'} />
                        </div>
                    </form>
                </div>
            </Container>
            {
                modalAtivo &&
                <Modal activate={modalAtivo} setActivate={setModalAtivo} altura={600} largura={800}>
                    <img key={imagemClicada.name} src={imagemClicada.preview} alt={imagemClicada.name} />
                </Modal>
            }
        </>
    );
}

export default CriarSprint;