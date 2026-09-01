import React, { useState, useEffect } from 'react';
import Card from '../../componentes/Card';
import Button from '../../componentes/Button';
import { MdEdit, MdSave, MdCheckCircle, MdModeComment } from 'react-icons/md'
import api from '../../services/api';
import swal from 'sweetalert';
import Modal from '../../componentes/Modal';
import { useUsuario } from '../../context/UsuarioContext';

function OrdemDetalhe({ ordem, SetDadosAlterados }) {
    const { fun_categoria, cod_funcionario } = useUsuario();
    const [emEdicao, setEmEdicao] = useState(false);
    const [ocorrencia, setOcorrencia] = useState(ordem.ocorrencia);
    const [finalizarOS, setfinalizarOS] = useState(false);
    const [entregarOS, setEntregarOS] = useState(false);
    const [laudo, setLaudo] = useState('');
    const [tipo_entrega, setTipo_Entrega] = useState('REMOTA');
    const [modalAtivo, setModalAtivo] = useState(false);
    const [imagemClicada, setImagemClicada] = useState({});
    const [files, setFiles] = useState([]);

    async function fetchArquivos() {
        let response = await api.get(`/Ordens/Arquivos/${ordem.sprint}`);
        setFiles(response.data);
    }

    function abrirPreview(file) {
        setImagemClicada(file);
        setModalAtivo(true)
    }

    useEffect(() => {
        fetchArquivos();
    }, [ordem])

    function converteData(data) {
        let arrayData = data.split('/');
        let date = new Date(parseInt('20' + arrayData[2]), arrayData[0] - 1, arrayData[1]);
        return date;
    }

    function Editar() {
        setEmEdicao(true)
    }

    async function Salvar() {
        try {
            let response = await api.put(`/Ordens/${ordem.ord_codigo}/AtualizaOrdens`, { ocorrencia });
            if (response.status === 200) {
                swal('Ordem Atualizada com sucesso!', 'Tudo ok', 'success');
                setEmEdicao(false);
                SetDadosAlterados(true);
            } else {
                swal('Falha ao atualizar ordem!', 'Falha', 'error')
            }
        } catch (error) {
            swal(`Erro ao atualizar ordem ${error}`, 'Erro', 'error')
        }
    }

    async function handleFinalizarOS(e) {
        e.preventDefault();
        if (laudo === '') {
            swal('O laudo é obrigatório!', 'Informe o Laudo', 'warning');
            return;
        }
        try {
            let response = await api.put(`/Ordens/${ordem.ord_codigo}/finalizar`, {
                estado: fun_categoria.substring(0, 8) === 'PROGRAMA' ? 'PROGRAMADA' : 'TESTADA',
                laudo: laudo,
                funcionario: cod_funcionario
            });
            if (response.status === 200) {
                swal('Ordem finalizada com sucesso!', 'Tudo ok', 'success');
                setEmEdicao(false);
                SetDadosAlterados(true);
            } else {
                swal('Falha ao finalizar ordem!', 'Falha', 'error')
            }
        } catch (error) {
            swal(`Erro ao finalizar a OS ${ordem.ord_codigo}!`, `Erro ${error}`, 'error')
        }
    }

    async function handleEntregarOS(e) {
        e.preventDefault();
        if (laudo === '') {
            swal('O laudo é obrigatório!', 'Informe o Laudo', 'warning');
            return;
        }
        if ((tipo_entrega === '') && (fun_categoria === 'SUPORTE')) {
            swal('Tipo de Entrega é obrigatório!', 'Informe o Tipo de Entrega', 'warning');
            return;
        }
        try {
            let response = await api.put(`/Ordens/${ordem.ord_codigo}/finalizar`, {
                estado: "ENTREGUE",
                laudo: laudo,
                funcionario: cod_funcionario,
                tipo_entrega: tipo_entrega
            });
            if (response.status === 200) {
                swal('Ordem entregue com sucesso!', 'Tudo ok', 'success');
                setEmEdicao(false);
                SetDadosAlterados(true);
            } else {
                swal('Falha ao entregar ordem!', 'Falha', 'error')
            }
        } catch (error) {
            swal(`Erro ao entregar a OS ${ordem.ord_codigo}!`, `Erro ${error}`, 'error')
        }
    }

    return (
        <>
            {
                finalizarOS && (
                    <Modal activate={finalizarOS} setActivate={setfinalizarOS} altura={500} largura={600} >
                        <div id='form' onSubmit={handleFinalizarOS}>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="laudo">Laudo</label>
                                    <textarea name="laudo" id="laudo" onChange={(e) => setLaudo(e.target.value)}></textarea>
                                </div>
                                <Button nome="Finalizar" color="green" corTexto="white" borderRadius="18px" Icon={MdCheckCircle} />
                            </form>
                        </div>
                    </Modal>)
            }
            {
                entregarOS && (
                    <Modal activate={entregarOS} setActivate={setEntregarOS} altura={500} largura={600} >
                        <div id='form' onSubmit={handleEntregarOS}>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="laudo">Laudo</label>
                                    <textarea name="laudo" id="laudo" onChange={(e) => setLaudo(e.target.value)}></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="tipo_entrega"></label>
                                    <input id='tipo_entrega' value={tipo_entrega} onChange={(e) => setTipo_Entrega(e.target.value)} />
                                </div>
                                <Button nome="Finalizar" color="green" corTexto="white" borderRadius="18px" Icon={MdCheckCircle} />
                            </form>
                        </div>
                    </Modal>)
            }
            {
                modalAtivo &&
                <Modal activate={modalAtivo} setActivate={setModalAtivo} altura="auto" largura="auto">
                    <img key={imagemClicada.nome} src={`data:image/jpeg;base64,${imagemClicada.base64}`} alt={imagemClicada.nome} />
                </Modal>
            }
            <div className="flex justify-center items-center w-[98%] overflow-x-auto [&_.card]:p-2 [&_.card]:bg-white [&_.card]:mt-[50px] [&_.card]:rounded-lg [&_.card]:shadow-[0px_2px_2px_2px_rgba(0,0,0,0.15),0px_10px_20px_-10px_rgba(0,0,0,0.1)] [&_.card]:text-black [&_.card]:max-w-[940px] [&_textarea]:h-[150px] [&_textarea]:w-full">
                {
                    <Card key={ordem.ord_codigo} cliente={ordem.cli_nome} contrato={ordem.ord_codigo} ocorrencia={ordem.ocorrencia} atendente={ordem.programador} nomeAtendente={ordem.programador} cod_ocorrencia={ordem.ord_codigo} data={converteData(ordem.prazoEntrega)} showActions={false}>
                        {emEdicao && <textarea value={ocorrencia} name="ocorrencia" id="ocorrencia" onChange={(e) => setOcorrencia(e.target.value)}></textarea>}
                        <div>
                            {ordem.laudo_programacao !== '' && (
                                <div>
                                    <label>Laudo Programação</label>
                                    <p>{ordem.laudo_programacao}</p>
                                </div>
                            )}
                            {ordem.laudo_teste !== '' && (
                                <div>
                                    <label>Laudo Teste</label>
                                    <p>{ordem.laudo_teste}</p>
                                </div>
                            )}
                        </div>
                        <div className="actions">
                            <Button click={Editar} Icon={MdEdit} nome={"Editar"} color={"#000"} corTexto={"#FFF"} borderRadius={'18px'} />
                            <Button click={() => setfinalizarOS(true)} Icon={MdModeComment} nome={"Finalizar OS"} color={"#000"} corTexto={"#FFF"} borderRadius={'18px'} disabled={(ordem.estado === 'PROGRAMADA' && fun_categoria.substring(0, 8) === 'PROGRAMA') || (ordem.estado === 'TESTADA' && fun_categoria === 'SUPORTE')} />
                            {fun_categoria === 'SUPORTE' && <Button click={() => setEntregarOS(true)} Icon={MdModeComment} nome={"Entregar OS"} color={"#000"} corTexto={"#FFF"} borderRadius={'18px'} />}
                            {emEdicao && <Button click={Salvar} Icon={MdSave} nome={"Salvar"} color={"#7FA66D"} corTexto={"#FFF"} borderRadius={'18px'} />}
                        </div>
                    </Card>
                }
            </div>
            <div className="flex flex-row flex-wrap mt-4">
                {
                    files?.map(file =>
                        <div className="inline-flex rounded-sm border border-[#eaeaea] mb-2 mr-2 w-20 h-20 p-1" onClick={() => abrirPreview(file)} key={file.nome}>
                            <div className="flex min-w-0 overflow-hidden [&>img]:block [&>img]:w-auto [&>img]:h-full">
                                <img src={`data:image/jpeg;base64,${file.base64}`} alt={file.nome} />
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default OrdemDetalhe;