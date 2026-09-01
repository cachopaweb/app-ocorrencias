import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import pt_br from 'date-fns/locale/pt-BR';
import swal from 'sweetalert';

import api from '../../services/api';
import { useUsuario } from '../../context/UsuarioContext';

registerLocale('pt-BR', pt_br);

function AberturaOS() {
    const { state } = useLocation();
    const [funcionarios, setFuncionarios] = useState([]);
    const { login, cod_funcionario } = useUsuario();
    const [data, setData] = useState(new Date());
    const [dataEntrega, setDataEntrega] = useState(new Date(state.dataEntrega) || new Date());
    const [dataAnalise, setDataAnalise] = useState(new Date());
    const [dataTeste, setDataTeste] = useState(new Date(state.dataEntrega) ||new Date());
    const [dataProgramacao, setDataProgramacao] = useState(new Date(state.dataEntrega) || new Date());
    const [dataPrazoEntrega, setDataPrazoEntrega] = useState(new Date(state.dataEntrega) || new Date());
    const [prioridadeProgramacao, setprioridadeProgramacao] = useState(parseInt(state.prioridade) || 1);
    const [funAnalista, setFunAnalista] = useState(1);
    const [funProgramador, setFunProgramador] = useState(0);
    const [funTeste, setfunTeste] = useState(cod_funcionario || 0);
    const [funEntrega, setfunEntrega] = useState(cod_funcionario || 0);
    const [osModulos, setOSModulos] = useState([]);
    const [modulo, setModulo] = useState(1);
    const [estado, setEstado] = useState('ANALISADA');
    const history = useHistory();
    const [descricaoOcorrencia, setDescricaoOcorrencia] = useState(state.ocorrencia);
    const [codSprint, ] = useState(state.codSprint || 0);
    
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
        if (codSprint === 0)  { swal('Identificador da Sprint não encontrado!', 'Identificador Sprint Obrigatório!', 'warning'); return;}
        const ordem = {
            fun_abertura: cod_funcionario,
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
            fun_atendente: login,
            prioridade: prioridadeProgramacao,
            codigo_ocorrencia: state.cod_ocorrencia,
            os_modulo: modulo,
            codSprint
        }
        let response = await api.post('/Ordens', ordem);
        if (response.status !== 400) {
            swal(`Ordem ${response.data.ordem} criada com sucesso!`, "Bom trabalho", "success");
            const request = {
                fun_codigo: cod_funcionario,
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
            <div className="flex justify-center items-center w-full text-black font-bold">
                <div id="form" className="py-5 my-0 w-[98vh]">
                    <form onSubmit={submitOrdem} className="m-[15px] rounded-lg bg-white p-5 shadow-[0px_2px_2px_2px_rgba(0,0,0,0.15),_0px_10px_20px_-10px_rgba(0,0,0,0.1)]">
                        <div className="flex flex-col mb-[10px]">
                            <label htmlFor="cliente" className="mb-[5px]">Cliente</label>
                            <input id="cliente" className="p-[5px] text-base w-full mt-[5px] mb-[5px] h-[40px]" type="text" value={state.cliente} disabled />
                        </div>
                        <div className="flex flex-col mb-[10px]">
                            <label htmlFor="nome" className="mb-[5px]">Atendente</label>
                            <input id="nome" className="p-[5px] text-base w-full mt-[5px] mb-[5px] h-[40px]" type="text" value={login} disabled />
                        </div>
                        <div className="flex flex-col mb-[10px]">
                            <label htmlFor="modulo" className="mb-[5px]">Módulo do Sistema</label>
                            {
                                <select id="modulo" className="w-full text-[1.1em] mt-[5px] mb-[5px] h-[40px] p-[5px] text-base" onChange={(e) => changeModulo(e.target.value)} autoFocus={true}>
                                    {
                                        osModulos.map(mod => <option key={mod.codigo} value={mod.codigo}>{`${mod.sistema} | ${mod.modulo}`}</option>)
                                    }
                                </select>
                            }
                        </div>
                        <div className="flex flex-col mb-[10px]">
                            <label htmlFor="data" className="mb-[5px]">Data</label>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={data} onChange={changeData} wrapperClassName="w-full" className="w-full text-[1.1em] mt-[5px] mb-[5px] h-[40px] p-[5px]" />
                        </div>
                        <div className="flex flex-col mb-[10px]">
                            <label htmlFor="data" className="mb-[5px]">Prazo Entrega</label>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataPrazoEntrega} onChange={changeDataPrazoEntrega} wrapperClassName="w-full" className="w-full text-[1.1em] mt-[5px] mb-[5px] h-[40px] p-[5px]" />
                        </div>
                        <div className="flex flex-col mb-[10px]">
                            <label htmlFor="prioridade" className="mb-[5px]">Prioriodade</label>
                            {
                                <select id="prioridade" className="w-full text-[1.1em] mt-[5px] mb-[5px] h-[40px] p-[5px] text-base" value={prioridadeProgramacao} onChange={(e) => changePrioridade(e.target.value)}>
                                    {
                                        priopridade.map(prior => <option key={prior.id} value={prior.id}>{prior.nome}</option>)
                                    }
                                </select>
                            }
                        </div>
                        <div className="flex flex-col mb-[10px]">
                            <label htmlFor="ocorrencia" className="mb-[5px]">Ocorrencia</label>
                            <textarea name="Ocorrencia" id="ocorrencia" className="h-[150px] w-full mt-[5px] mb-[5px]" value={descricaoOcorrencia} onChange={(e) => changeDescricaoOcorrencia(e.target.value)} />
                        </div>
                        <div className="flex flex-col mb-[10px]">
                            <label htmlFor="clientes" className="mb-[5px]">Analista</label>
                            {
                                funcionarios.length > 0 ?
                                    <select id="clientes" className="w-full text-[1.1em] mt-[5px] mb-[5px] h-[40px] p-[5px] text-base" onChange={(e) => changeFunAnalista(e.target.value)} value={funAnalista}>
                                        <option key={0} value={0}>Escolha o analista</option>
                                        {                                            
                                            funcionarios.filter((fun) => (fun.categoria === 'ADM'))
                                                .map(fun => <option key={fun.codigo} value={fun.codigo}>{fun.login}</option>)
                                        }
                                    </select>
                                    : <h3 className="mb-[30px]">Carregando funcionarios</h3>
                            }
                            <label htmlFor="data" className="mb-[5px]">Data Analise</label>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataAnalise} onChange={changeDataAnalise} wrapperClassName="w-full" className="w-full text-[1.1em] mt-[5px] mb-[5px] h-[40px] p-[5px]" />
                        </div>
                        <div className="flex flex-col mb-[10px]">
                            <label htmlFor="clientes" className="mb-[5px]">Programador(a)</label>
                            {
                                funcionarios.length > 0 ?
                                    <select id="clientes" className="w-full text-[1.1em] mt-[5px] mb-[5px] h-[40px] p-[5px] text-base" onChange={(e) => changeFunProgramador(e.target.value)} value={funProgramador}>
                                        <option key={0} value={0}>Escolha o(a) programador(a)</option>
                                        {
                                            funcionarios.filter((fun) => (fun.categoria.substring(0, 8) === 'PROGRAMA'))
                                                .map(fun => <option key={fun.codigo} value={fun.codigo}>{fun.login}</option>)
                                        }
                                    </select>
                                    : <h3 className="mb-[30px]">Carregando funcionarios</h3>
                            }
                            <label htmlFor="data" className="mb-[5px]">Data Prog.</label>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataProgramacao} onChange={changeDataProgramacao} wrapperClassName="w-full" className="w-full text-[1.1em] mt-[5px] mb-[5px] h-[40px] p-[5px]" />
                        </div>
                        <div className="flex flex-col mb-[10px]">
                            <label htmlFor="clientes" className="mb-[5px]">Teste</label>
                            {
                                funcionarios.length > 0 ?
                                    <select id="clientes" className="w-full text-[1.1em] mt-[5px] mb-[5px] h-[40px] p-[5px] text-base" onChange={(e) => changeFunTeste(e.target.value)} value={funTeste}>
                                        <option key={0} value={0}>Escolha quem vai Testar</option>
                                        {
                                            funcionarios.filter((fun) => (fun.categoria === 'SUPORTE'))
                                                .map(fun => <option key={fun.codigo} value={fun.codigo}>{fun.login}</option>)
                                        }
                                    </select>
                                    : <h3 className="mb-[30px]">Carregando funcionarios</h3>
                            }
                            <label htmlFor="data" className="mb-[5px]">Data Teste</label>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataTeste} onChange={changeDataTeste} wrapperClassName="w-full" className="w-full text-[1.1em] mt-[5px] mb-[5px] h-[40px] p-[5px]" />
                        </div>
                        <div className="flex flex-col mb-[10px]">
                            <label htmlFor="clientes" className="mb-[5px]">Entrega</label>
                            {
                                funcionarios.length > 0 ?
                                    <select id="clientes" className="w-full text-[1.1em] mt-[5px] mb-[5px] h-[40px] p-[5px] text-base" onChange={(e) => changeFunEntrega(e.target.value)} value={funEntrega}>
                                        <option key={0} value={0}>Escolha quem vai entregar</option>
                                        {
                                            funcionarios.filter((fun) => (fun.categoria === 'SUPORTE'))
                                                .map(fun => <option key={fun.codigo} value={fun.codigo}>{fun.login}</option>)
                                        }
                                    </select>
                                    : <h3 className="mb-[30px]">Carregando funcionarios</h3>
                            }
                            <label htmlFor="data" className="mb-[5px]">Data Entrega</label>
                            <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataEntrega} onChange={changeDataEntrega} wrapperClassName="w-full" className="w-full text-[1.1em] mt-[5px] mb-[5px] h-[40px] p-[5px]" />
                        </div>
                        <button className="w-[45%] h-[30px] border-none rounded-[18px] text-white bg-[green] m-[5px] shadow-[1px_2px_2px_1px_rgba(0,0,0,0.5)] font-bold hover:text-black hover:bg-white hover:border hover:border-black" type="submit" onClick={() => setEstado('ABERTA')}>Aberta</button>
                        <button className="w-[45%] h-[30px] border-none rounded-[18px] text-white bg-[blue] m-[5px] shadow-[1px_2px_2px_1px_rgba(0,0,0,0.5)] font-bold hover:text-black hover:bg-white hover:border hover:border-black" type="submit" onClick={() => setEstado('ANALISADA')} >Analisada</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AberturaOS;