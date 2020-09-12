import React, { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';

import { Container, Pesquisa, Floating } from './styles';
import Header from '../../componentes/Header';
import api from '../../services/api';
import CardProjetos from '../../componentes/CardProjetos';
import Button from '../../componentes/Button';
import Modal from '../../componentes/Modal';
import Create_Projeto_Scrum from '../Create_Projeto_Scrum';


function Scrum() {
    const [projetos, setProjetos] = useState([]);
    const [projetos_filtrados, setProjetos_filtrados] = useState([]);    
    const [modalAtivo, setModalAtivo] = useState(false);

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
            <Floating>
                {
                <Button Icon={MdAdd} tamanho_icone={40} borderRadius={"50%"} corTexto={"white"} click={()=> setModalAtivo(true)} />          
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