import React, { useEffect, useState } from 'react';

import { Container, Pesquisa } from './styles';
import Header from '../../componentes/Header';
import api from '../../services/api';
import CardProjetos from '../../componentes/CardProjetos';

function Scrum() {
    const [projetos, setProjetos] = useState([]);
    const [projetos_filtrados, setProjetos_filtrados] = useState([]);

    async function fetchProjetosScrum() {
        let response = await api.get('/projetos_scrum');
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

    return (
        <>
            <Header title={"Scrum"} />
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
                {
                    projetos_filtrados.map((projeto) => (
                            <CardProjetos key={projeto.ps_codigo} cliente={projeto.cli_nome} projeto_id={projeto.ps_codigo} contrato={projeto.contrato}></CardProjetos>
                        )
                    )
                }
            </Container>
        </>
    );
}

export default Scrum;