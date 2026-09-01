import React, { useEffect, useState } from 'react';
import { MdAdd, MdAssignment, MdAutorenew, MdTimer } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import Burndown from '../../componentes/Burndown';
import Cronograma from '../../componentes/Cronograma';


import api from '../../services/api';
import Button from '../../componentes/Button';
import Modal from '../../componentes/Modal';
import Create_Projeto_Scrum from '../Create_Projeto_Scrum';
import { useUsuario } from '../../context/UsuarioContext';
import { MdShowChart } from 'react-icons/md';

function Scrum() {
    const [projetos, setProjetos] = useState([]);
    const [projetos_filtrados, setProjetos_filtrados] = useState([]);
    const [modalAtivo, setModalAtivo] = useState(false);
    const { fun_categoria } = useUsuario();
    const history = useHistory();
    const [burndownAtivo, setBurndownAtivo] = useState(false);
    const [cronogramaAtivo, setCronogramaAtivo] = useState(false);

    async function fetchProjetosScrum() {
        let response = await api.get('/projetos_scrum/EmAndamento');
        setProjetos(response.data);
        setProjetos_filtrados(response.data);
    }

    useEffect(() => {
        fetchProjetosScrum();
    }, [])

    function filtrarPorProjeto(busca) {
        let result = projetos.filter((projetos) => projetos.cli_nome.toUpperCase().includes(busca.toUpperCase()))
        setProjetos_filtrados(result);
    }

    function SelecionaProjeto(projeto) {
        history.push({ pathname: '/quadroScrum', state: { cliente: projeto.cli_nome, projeto_id: projeto.ps_codigo, contrato: projeto.contrato } })
    }

    function SelecionaProjetoRetrospectiva(projeto) {
        history.push({ pathname: '/retrospectiva', state: { projeto_scrum: projeto.ps_codigo, cliente: projeto.cli_nome } });
    }

    return (
        <>

            {cronogramaAtivo && <Modal activate={cronogramaAtivo} setActivate={setCronogramaAtivo}>
                <Cronograma/>
            </Modal>}
            {modalAtivo && <Modal activate={modalAtivo} setActivate={setModalAtivo}>
                <Create_Projeto_Scrum />
            </Modal>}
            {burndownAtivo && <Modal activate={burndownAtivo} setActivate={setBurndownAtivo} altura='600px' largura='700px'>
                <Burndown projeto_id={0} />
              </Modal>} 
            <div>
                <div id="form" className="max-w-[800px] pt-[10px] mx-auto">
                    <form>
                        <div className="form-group px-[10px]">
                            <label htmlFor="projetos" className="mr-[15px]">Projetos Scrum </label>
                            <input type="text" className="h-[46px] mb-[15px] px-[20px] text-[#777] text-[15px] w-full border border-[#ddd] placeholder:text-[#999]" placeholder="Busca por Projeto" onChange={(e) => filtrarPorProjeto(e.target.value)} autoFocus={true} />
                        </div>
                    </form>
                </div>
            </div>
            <div className="grid grid-cols-4 max-[705px]:grid-cols-3 max-[525px]:grid-cols-2 max-w-[1200px] mx-auto">
                <div className="p-[8px] bg-white mt-[50px] rounded-lg shadow-[0px_2px_2px_2px_rgba(0,0,0,0.15),0px_10px_20px_-10px_rgba(0,0,0,0.1)] text-black max-w-[1200px]">

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Data Entrega</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Cód. Projeto</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Cliente</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Situação</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Funcionário</th>
                                    <th className="py-2 px-4 text-left font-semibold text-sm">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                projetos_filtrados.length > 0 ?
                                    projetos_filtrados.map((projeto, index) => (
                                        <tr key={projeto.ps_codigo} className={index % 2 === 0 ? "bg-gray-100" : "bg-white hover:bg-gray-50"}>
                                            <td className="py-2 px-4 text-sm">{new Date(projeto.data_entrega).toLocaleDateString()}</td>
                                            <td className="py-2 px-4 text-sm">{projeto.ps_codigo}</td>
                                            <td className="py-2 px-4 text-sm">{projeto.cli_nome}</td>
                                            {(fun_categoria.substring(0, 8) === 'PROGRAMA') &&
                                                <td
                                                    className={`rounded-lg text-center flex justify-center items-center self-center h-[60px] ${projeto.estado === 'A FAZER' ? 'bg-[#900] text-[#FFF]' : 'bg-[#FFF] text-[#000]'}`}
                                                >{projeto.estado}</td>
                                            }
                                            {(fun_categoria.substring(0, 7) === 'SUPORTE') &&
                                                <td
                                                    className={`rounded-lg text-center flex justify-center items-center self-center h-[60px] ${projeto.estado === 'REVISAO' ? 'bg-[#900] text-[#FFF]' : 'bg-[#FFF] text-[#000]'}`}
                                                >{projeto.estado}</td>
                                            }
                                            <td className="py-2 px-4 text-sm">{projeto.funcionario}</td>
                                            <td className="py-2 px-4 text-sm"><Button nome="Ver Detalhes" borderRadius="10px" color="#000" corTexto="#FFF" Icon={MdAssignment} click={() => SelecionaProjeto(projeto)} /></td>
                                            {/* <td className="py-2 px-4 text-sm"><Button nome="Retrospectiva" borderRadius="10px" color="#000" corTexto="#FFF" Icon={MdAutorenew} click={() => SelecionaProjetoRetrospectiva(projeto)} /></td> */}
                                        </tr>
                                    ))
                                                                       
                                    : <tr><td colSpan="6" className="py-4 text-center font-bold">Carregando Projetos...</td></tr>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="fixed bottom-[25px] right-[25px] max-[905px]:bottom-[20px] max-[905px]:right-[20px]">
              {
               <>
                <Button Icon={MdTimer} bottom={"40px"} tamanho_icone={40} borderRadius={"50%"} corTexto={"white"} click={() => setCronogramaAtivo(!cronogramaAtivo)} />
                <Button Icon={MdShowChart} bottom={"40px"} tamanho_icone={40} borderRadius={"50%"} corTexto={"white"} click={() => setBurndownAtivo(!burndownAtivo)} /> 
                <Button Icon={MdAdd} tamanho_icone={40} borderRadius={"50%"} corTexto={"white"} click={() => setModalAtivo(true)} />
               </> 
              }
            </div>
            </div>
        </>
    );
}

export default Scrum;