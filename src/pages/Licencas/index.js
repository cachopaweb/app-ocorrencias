import React, { useState, useEffect } from 'react';

import api from '../../services/api';
import Header from '../../componentes/Header';
import { Container } from './styles';
import { useLocation } from 'react-router-dom';
import Button from '../../componentes/Button';
import { MdEvent } from 'react-icons/md';
import Modal from '../../componentes/Modal';

function Licencas() {
    const [licencas, setLicencas] = useState([]);
    const [modalGerarAtivo, setModalGerarAtivo] = useState(false)
    const { state } = useLocation();    
    let licencas_Vencer = [];
    if (state) licencas_Vencer  = state.licencas_Vencer;
    const [licencasVencer, setLicencasVencer] = useState(licencas_Vencer);
    
    async function fetchLicencas() {
        let response = await api.get('/contrassenha');
        setLicencas(response.data);
    }

    function ordenarDataLimite(){
       let licencas_ordenadas = licencas.sort((a, b)=>{
            return (a.data_limite - b.data_limite)
        });
        setLicencas(licencas_ordenadas);
    }

    const handleClickGerar = () => {
        setModalGerarAtivo(true)
    }

    useEffect(() => {
        if (licencasVencer.length === 0)
            fetchLicencas();
    }, [])

    return (
        <>
            <Header title={licencasVencer?.length === 0 ? 'Licenças': 'Licenças a Vencer'} />
            <Container>
                <Modal activate={modalGerarAtivo} setActivate={setModalGerarAtivo} >
                    <h1>Ainda não implementado</h1>
                </Modal>
                <div className="card">
                    <h1>{licencasVencer.length === 0 ? 'Licenças Software' : 'Licenças Software a Vencer'}</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Cliente</th>
                                <th>Senha</th>
                                <th>Contrassenha</th>
                                <th>Data Uso</th>
                                <th onClick={()=> ordenarDataLimite()}>Data Limite</th>
                                <th>Num PCs</th>
                                {licencasVencer?.length > 0 && <th>Ação</th>}
                            </tr>
                        </thead>
                        {                            
                            licencas.length > 0 && licencasVencer?.length === 0 ? (
                                licencas.length > 0 ? 
                                licencas.map((licenca) => (
                                    <tbody>
                                        <tr>
                                            <th>{licenca.codigo}</th>
                                            <td>{licenca.nome_cliente}</td>
                                            <td>{licenca.senha}</td>
                                            <td>{licenca.contra_senha}</td>
                                            <td>{new Date(licenca.data_uso).toLocaleDateString()}</td>
                                            <td>{licenca.data_limite}</td>
                                            <td>{licenca.pcs}</td>                                            
                                        </tr>
                                    </tbody>
                                ))
                                : <h1>Carregando licenças...</h1>
                            )
                            : (
                                licencasVencer?.length > 0 ? 
                                licencasVencer?.map((licenca) => (
                                    <tbody>
                                        <tr>
                                            <th>{licenca.codigo}</th>
                                            <td>{licenca.nome_cliente}</td>
                                            <td>{licenca.senha}</td>
                                            <td>{licenca.contra_senha}</td>
                                            <td>{new Date(licenca.data_uso).toLocaleDateString()}</td>
                                            <td>{licenca.data_limite}</td>
                                            <td>{licenca.pcs}</td>
                                            {licencasVencer?.length > 0 && <td><Button click={()=> handleClickGerar()} nome="Gerar" color="#05F" corTexto="#FFF" Icon={MdEvent} borderRadius="10px" /></td>}
                                        </tr>
                                    </tbody>
                                ))
                                : <h1>Carregando licenças...</h1>
                            )
                        }

                    </table>
                </div>                
            </Container>
        </>
    );
}

export default Licencas;