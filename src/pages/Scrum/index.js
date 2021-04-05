import React, { useEffect, useState } from 'react';
import { MdAdd, MdAssignment, MdAutorenew } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

import { Container, Pesquisa, Floating, Tabela, LinhaDestaque, Card } from './styles';
import Header from '../../componentes/Header';
import api from '../../services/api';
import Button from '../../componentes/Button';
import Modal from '../../componentes/Modal';
import Create_Projeto_Scrum from '../Create_Projeto_Scrum';
import { useUsuario } from '../../context/UsuarioContext';


function Scrum() {
    const [projetos, setProjetos] = useState([]);
    const [projetos_filtrados, setProjetos_filtrados] = useState([]);
    const [modalAtivo, setModalAtivo] = useState(false);
    const { fun_categoria } = useUsuario();
    const history = useHistory();        

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
        history.push({ pathname: '/retrospectiva', state: { projeto_scrum: projeto.ps_codigo, cliente: projeto.cli_nome}});
    }

    return (
        <>
            <Header title={"Scrum"} />
            <Floating>
                {
                    <Button Icon={MdAdd} tamanho_icone={40} borderRadius={"50%"} corTexto={"white"} click={() => setModalAtivo(true)} />
                }
            </Floating>
            {modalAtivo && <Modal activate={modalAtivo} setActivate={setModalAtivo}>
                <Create_Projeto_Scrum />
            </Modal>}
            <Pesquisa>
                <div id="form">
                    <form>
                        <div className="form-group">
                            <label htmlFor="projetos">Projetos Scrum </label>
                            <input type="text" placeholder="Busca por Projeto" onChange={(e) => filtrarPorProjeto(e.target.value)} autoFocus={true} />
                        </div>
                    </form>
                </div>
            </Pesquisa>
            <Container>
                <Card>

                    <Tabela>
                        <thead>
                            <tr>
                                <th>Data Entrega</th>
                                <th>Cód. Projeto</th>
                                <th>Cliente</th>
                                <th>Situação</th>
                                <th>Funcionário</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        {
                            projetos_filtrados.length > 0 ?
                                projetos_filtrados.map((projeto) => (
                                    <tbody>
                                        <tr>
                                            <th>{new Date(projeto.data_entrega).toLocaleDateString()}</th>
                                            <td>{projeto.ps_codigo}</td>
                                            <td>{projeto.cli_nome}</td>
                                            {(fun_categoria.substring(0, 8) === 'PROGRAMA') &&
                                                <LinhaDestaque
                                                cor={projeto.estado === 'A FAZER' ? '#900' : '#FFF'}
                                                corTexto={projeto.estado === 'A FAZER' ? '#FFF' : '#000'}
                                                >{projeto.estado}</LinhaDestaque>
                                            }
                                            {(fun_categoria.substring(0, 7) === 'SUPORTE') &&
                                                <LinhaDestaque
                                                cor={projeto.estado === 'REVISAO' ? '#900' : '#FFF'}
                                                corTexto={projeto.estado === 'REVISAO' ? '#FFF' : '#000'}
                                                >{projeto.estado}</LinhaDestaque>
                                            }
                                            <td>{projeto.funcionario}</td>
                                            <td><Button nome="Ver Detalhes" borderRadius="10px" color="#000" corTexto="#FFF" Icon={MdAssignment} click={() => SelecionaProjeto(projeto)} /></td>
                                            <td><Button nome="Retrospectiva" borderRadius="10px" color="#000" corTexto="#FFF" Icon={MdAutorenew} click={() => SelecionaProjetoRetrospectiva(projeto)} /></td>
                                        </tr>
                                    </tbody>
                                ))
                                : <h1>Carregando Ordens...</h1>
                        }
                    </Tabela>
                </Card>
            </Container>
        </>
    );
}

export default Scrum;