import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdAssignment } from 'react-icons/md';
import Button from '../../componentes/Button';
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import pt_br from 'date-fns/locale/pt-BR';
import Modal from '../../componentes/Modal';

import CreateOcorrencias from '../CreateOcorrencias';

registerLocale('pt-BR', pt_br);

function ClientesSemOcorrencias() {
    const [ClientesSemOcorrencias, SetClientesSemOcorrencias] = useState([]);
    const [modalAberturaOcorrencia, setModalAberturaOcorrencia] = useState(false);
    const [projetoScrumSelecionado, setProjetoScrumSelecionado] = useState(0);
    const [reabrir, setReabrir] = useState(false)
    const [quantidade, setQuantidade] = useState(5);

    async function CarregaDadosOrdens() {
        let response = await api.get(`/Clientes/SemOcorrencias?qtd=${quantidade}`);
        SetClientesSemOcorrencias(response.data);
    }

    useEffect(() => {
        SetClientesSemOcorrencias([]);
        CarregaDadosOrdens();
        setModalAberturaOcorrencia(false);        
    }, [quantidade, reabrir])

    const handleQuantidade = (qtd) => {
        setQuantidade(qtd);
    }

    const abrirOcorrencia = (projeto_scrum) => {
        setProjetoScrumSelecionado(projeto_scrum);
        setModalAberturaOcorrencia(true);
    }

    return (
        <>

            <Modal activate={modalAberturaOcorrencia} setActivate={setModalAberturaOcorrencia} altura={'300px'} largura={'300px'}>
                {modalAberturaOcorrencia && <CreateOcorrencias codigo_projeto_scrum={projetoScrumSelecionado} retornarPara={()=> setReabrir(!reabrir)} />}
            </Modal>

            <div className="w-full flex justify-center items-center pb-[30px] overflow-y-auto">
                <div className="p-2 bg-white mt-[50px] rounded-lg shadow-[0_2px_2px_2px_rgba(0,0,0,0.15),0_10px_20px_-10px_rgba(0,0,0,0.1)] text-black max-w-[1200px]">
                    <h1>Clientes que não tiveram ocorrências no período de 90 dias</h1>
                    <div className="inline-block">
                        <a className={`float-left px-4 py-2 no-underline rounded-md cursor-pointer ${quantidade === 5 ? 'bg-[#4CAF50] text-white' : 'text-black hover:bg-[#ddd]'}`} onClick={() => handleQuantidade(5)}>5</a>
                        <a className={`float-left px-4 py-2 no-underline rounded-md cursor-pointer ${quantidade === 10 ? 'bg-[#4CAF50] text-white' : 'text-black hover:bg-[#ddd]'}`} onClick={() => handleQuantidade(10)}>10</a>
                        <a className={`float-left px-4 py-2 no-underline rounded-md cursor-pointer ${quantidade === 20 ? 'bg-[#4CAF50] text-white' : 'text-black hover:bg-[#ddd]'}`} onClick={() => handleQuantidade(20)}>20</a>
                        <a className={`float-left px-4 py-2 no-underline rounded-md cursor-pointer ${quantidade === 30 ? 'bg-[#4CAF50] text-white' : 'text-black hover:bg-[#ddd]'}`} onClick={() => handleQuantidade(30)}>30</a>
                        <a className={`float-left px-4 py-2 no-underline rounded-md cursor-pointer ${quantidade === 40 ? 'bg-[#4CAF50] text-white' : 'text-black hover:bg-[#ddd]'}`} onClick={() => handleQuantidade(40)}>40</a>
                        <a className={`float-left px-4 py-2 no-underline rounded-md cursor-pointer ${quantidade === 50 ? 'bg-[#4CAF50] text-white' : 'text-black hover:bg-[#ddd]'}`} onClick={() => handleQuantidade(50)}>50</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Cliente</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Celular</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Telefone</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Data Ult. Ocorrência</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Func. Atendeu</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Tempo</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                ClientesSemOcorrencias.length > 0 ?
                                    ClientesSemOcorrencias.map((so, index) => (
                                        <tr key={so.contrato} className={index % 2 === 0 ? "bg-gray-100" : "bg-white hover:bg-gray-50"}>
                                            <td className="py-2 px-4 text-sm">{so.nome}</td>
                                            <td className="py-2 px-4 text-sm">{so.celular}</td>
                                            <td className="py-2 px-4 text-sm">{so.fone}</td>
                                            <td className="py-2 px-4 text-sm">{so.data_ultima_ocorrencia}</td>
                                            <td className="py-2 px-4 text-sm">{so.fun_atendimento}</td>
                                            <td className="py-2 px-4 text-sm">{so.tempo}</td>
                                            <td className="py-2 px-4 text-sm"><Button nome="Abrir Ocorrência" borderRadius="10px" color="#000" corTexto="#FFF" Icon={MdAssignment} click={() => abrirOcorrencia(so.cod_projeto_scrum)} /></td>
                                        </tr>
                                    ))
                                    : <tr><td colSpan="7" className="py-4 text-center font-bold">Carregando clientes sem ocorrências...</td></tr>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ClientesSemOcorrencias;