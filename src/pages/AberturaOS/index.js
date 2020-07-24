import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import pt_br from 'date-fns/locale/pt-BR';
import swal from 'sweetalert';

import api from '../../services/api';
import { Container } from './styles';
import { useUsuario } from '../../context/UsuarioContext';
import Header from '../../componentes/Header';

registerLocale('pt-BR', pt_br);

function AberturaOS() {
    const [funcionarios, setFuncionarios] = useState([]);
    const {codigo, nome } = useUsuario();
    const [data, setData] = useState(new Date());
    const [dataEntrega, setDataEntrega] = useState(new Date());
    const [dataAnalise, setDataAnalise] = useState(new Date());
    const [dataTeste, setDataTeste] = useState(new Date());
    const [dataProgramacao, setDataProgramacao] = useState(new Date());
    const [dataPrazoEntrega, setDataPrazoEntrega] = useState(new Date());
    const [prioridadeProgramacao, setprioridadeProgramacao] = useState(1);
    const [funAnalista, setFunAnalista] = useState(0);
    const [funProgramador, setFunProgramador] = useState(0);
    const [funTeste, setfunTeste] = useState(0);
    const [funEntrega, setfunEntrega] = useState(0);
    const [osModulos, setOSModulos] = useState([]);
    const [modulo, setModulo] = useState(1);
    const [estado, setEstado] = useState('ANALISADA');
    const { state } = useLocation();
    const history = useHistory();
    const [descricaoOcorrencia, setDescricaoOcorrencia] = useState(state.ocorrencia);

    function changeData(date) {
        setData(date);
    };
    function changeDataEntrega(date) {
        setDataEntrega(date);
    };
    function changeDataProgramacao(date) {
        setDataProgramacao(date);
    };
    function changeDataAnalise(date) {
        setDataAnalise(date);
    };
    function changeDataTeste(date) {
        setDataTeste(date);
    };
    function changeDataPrazoEntrega(date) {
        setDataPrazoEntrega(date);
    };

    function changeDescricaoOcorrencia(descricao) {
        setDescricaoOcorrencia(descricao);
    }
    function changePrioridade(prioridade) {
        setprioridadeProgramacao(prioridade);
    }
    function changeFunAnalista(fun) {
        setFunAnalista(parseInt(fun));
    }
    function changeFunProgramador(fun) {
        setFunProgramador(parseInt(fun));
    }
    function changeFunTeste(fun) {
        setfunTeste(parseInt(fun));
    }
    function changeFunEntrega(fun) {
        setfunEntrega(parseInt(fun));
    }
    function changeModulo(modulo) {
        setModulo(modulo);
    }

    async function submitOrdem(event) {
        event.preventDefault();
        if (funAnalista === 0) { swal('Escolha o Analista!', 'Informe o analista', 'warning'); return; }
        if (funProgramador === 0) { swal('Escolha o programador!', 'Informe o programador(a)', 'warning'); return; }
        if (funTeste === 0) { swal('Escolha quem vai testar!', 'Informe o testador', 'warning'); return; }
        if (funEntrega === 0) { swal('Escolha quem vai entregar!', 'Informe o entregador', 'warning'); return; }    
        if (descricaoOcorrencia === '') { swal('Texto da ocorrência obrigatório!', 'Informe a ocorrência', 'warning'); return; }   
        const ordem = {
            fun_abertura: codigo,
            contrato: state.contrato,
            ocorrencia: descricaoOcorrencia,
            fun_analise: funAnalista,
            fun_programador: funProgramador,
            fun_teste: funTeste,
            data_entrega: dataEntrega.toLocaleDateString(),
            prazo_entrega: dataPrazoEntrega.toLocaleDateString(),
            fun_entrega: funEntrega,
            estado: estado,
            tipo: "IMPLEMENTACAO NOVA",
            data_entrega_analise: dataAnalise.toLocaleDateString(),
            data_entrega_programacao: dataProgramacao.toLocaleDateString(),
            data_entrega_teste: dataTeste.toLocaleDateString(),
            fun_atendente: nome,
            prioridade: prioridadeProgramacao,
            codigo_ocorrencia: state.cod_ocorrencia,
            os_modulo: modulo
        }
        let response = await api.post('/Ordens', ordem);
        if (!response.data.error) {
            swal(`Ordem ${response.data.ordem} criada com sucesso!`, "Bom trabalho", "success");
            const request = {
                fun_codigo: codigo,
                finalizada: 'S'
            }
            response = await api.put('/Ocorrencias/' + ordem.codigo_ocorrencia, JSON.stringify(request));
            if (!response.data.error)
                history.goBack();
            else
                swal(`Erro ao finalizar ocorrencia: ${ordem.codigo_ocorrencia}.`, `Erro ${response.data.description}`, 'error');
        } else {
                swal(`Erro ao inserir ordem de servico!`, `erro: ${response.data.description}`, 'error')
        }
    }

    const priopridade = [
        {
            id: 1,
            nome: 'BAIXA'
        },
        {
            id: 2,
            nome: 'MEDIA'
        },
        {
            id: 3,
            nome: 'ALTA'
        }
    ];

    async function getFuncionarios() {
        const response = await api.get('/usuarios');
        setFuncionarios(response.data);
    }

    async function getOSModulos() {
        const response = await api.get('/OS_Modulos');
        setOSModulos(response.data);
    }

    useEffect(() => {
        getFuncionarios();
    }, [])

    useEffect(() => {
        getOSModulos();
    }, [])

    useEffect(() => {
        if (state.funAtendente === 0) {
            swal('Ocorrencia ainda não atendida', 'Click em atender', 'warning');
            history.goBack();
        }
    }, [])

    return (
        <>
            <Header title={'Abertura OS'} />
            <Container>
                <div id="form">
                    <form onSubmit={submitOrdem} >
                        <div className="form-group">
                            <label htmlFor="cliente">Cliente</label>
                            <input id="cliente" className="input-control" type="text" value={state.cliente} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nome">Atendente</label>
                            <input id="nome" className="input-control" type="text" value={nome} disabled />
                        </div>
                        <div className="form-group">
                            <label htmlFor="modulo">Módulo do Sistema</label>
                            {
                                <select id="modulo" className="input-control" onChange={(e) => changeModulo(e.target.value)} autoFocus={true}>
                                    {
                                        osModulos.map(mod => <option key={mod.codigo} value={mod.codigo}>{`${mod.sistema} | ${mod.modulo}`}</option>)
                                    }
                                </select>
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="data">Data</label>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={data} onChange={changeData} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="data">Prazo Entrega</label>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataPrazoEntrega} onChange={changeDataPrazoEntrega} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="prioridade">Prioriodade</label>
                            {
                                <select id="prioridade" className="input-control" onChange={(e) => changePrioridade(e.target.value)}>
                                    {
                                        priopridade.map(prior => <option key={prior.id} value={prior.id}>{prior.nome}</option>)
                                    }
                                </select>
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="ocorrencia">Ocorrencia</label>
                            <textarea name="Ocorrencia" id="ocorrencia" value={descricaoOcorrencia} onChange={(e) => changeDescricaoOcorrencia(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="clientes">Analista</label>
                            {
                                funcionarios.length > 0 ?
                                    <select id="clientes" className="input-control" onChange={(e) => changeFunAnalista(e.target.value)}>
                                        <option key={0} value={0}>Escolha o analista</option>
                                        {                                            
                                            funcionarios.filter((fun) => (fun.categoria === 'ADM'))
                                                .map(fun => <option key={fun.codigo} value={fun.codigo}>{fun.login}</option>)
                                        }
                                    </select>
                                    : <h3>Carregando funcionarios</h3>
                            }
                            <label htmlFor="data">Data Analise</label>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataAnalise} onChange={changeDataAnalise} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="clientes">Programador(a)</label>
                            {
                                funcionarios.length > 0 ?
                                    <select id="clientes" className="input-control" onChange={(e) => changeFunProgramador(e.target.value)}>
                                        <option key={0} value={0}>Escolha o(a) programador(a)</option>
                                        {
                                            funcionarios.filter((fun) => (fun.categoria.substring(0, 8) === 'PROGRAMA'))
                                                .map(fun => <option key={fun.codigo} value={fun.codigo}>{fun.login}</option>)
                                        }
                                    </select>
                                    : <h3>Carregando funcionarios</h3>
                            }
                            <label htmlFor="data">Data Prog.</label>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataProgramacao} onChange={changeDataProgramacao} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="clientes">Teste</label>
                            {
                                funcionarios.length > 0 ?
                                    <select id="clientes" className="input-control" onChange={(e) => changeFunTeste(e.target.value)}>
                                        <option key={0} value={0}>Escolha quem vai Testar</option>
                                        {
                                            funcionarios.filter((fun) => (fun.categoria === 'SUPORTE'))
                                                .map(fun => <option key={fun.codigo} value={fun.codigo}>{fun.login}</option>)
                                        }
                                    </select>
                                    : <h3>Carregando funcionarios</h3>
                            }
                            <label htmlFor="data">Data Teste</label>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataTeste} onChange={changeDataTeste} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="clientes">Entrega</label>
                            {
                                funcionarios.length > 0 ?
                                    <select id="clientes" className="input-control" onChange={(e) => changeFunEntrega(e.target.value)}>
                                        <option key={0} value={0}>Escolha quem vai entregar</option>
                                        {
                                            funcionarios.filter((fun) => (fun.categoria === 'SUPORTE'))
                                                .map(fun => <option key={fun.codigo} value={fun.codigo}>{fun.login}</option>)
                                        }
                                    </select>
                                    : <h3>Carregando funcionarios</h3>
                            }
                            <label htmlFor="data">Data Entrega</label>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataEntrega} onChange={changeDataEntrega} />
                        </div>
                        <button className="btn_aberta" type="submit" onClick={() => setEstado('ABERTA')}>Aberta</button>
                        <button className="btn_analisada" type="submit" onClick={() => setEstado('ANALISADA')} >Analisada</button>
                    </form>
                </div>
            </Container>
        </>
    );
}

export default AberturaOS;