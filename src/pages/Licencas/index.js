import React, { useState, useEffect } from 'react';

import api from '../../services/api';
import Header from '../../componentes/Header';
import { Container } from './styles';

function Licencas() {
    const [licencas, setLicencas] = useState([]);

    async function fetchLicencas() {
        let response = await api.get('/contrassenha');
        setLicencas(response.data);
    }

    useEffect(() => {
        fetchLicencas();
    }, [])

    return (
        <>
            <Header title={'Licenças'} />
            <Container>
                <div className="card">
                    <h1>Licenças Software</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Cliente</th>
                                <th>Senha</th>
                                <th>Contrassenha</th>
                                <th>Data Uso</th>
                                <th>Data Limite</th>
                                <th>Num PCs</th>
                            </tr>
                        </thead>
                        {
                            licencas.length > 0 ?
                                licencas.map((licenca) => (
                                    <tbody>
                                        <tr>
                                            <th>{licenca.codigo}</th>
                                            <td>{licenca.nome_cliente}</td>
                                            <td>{licenca.senha}</td>
                                            <td>{licenca.contra_senha}</td>
                                            <td>{licenca.data_uso}</td>
                                            <td>{licenca.data_limite}</td>
                                            <td>{licenca.pcs}</td>
                                        </tr>
                                    </tbody>
                                ))
                                : <h1>Carregando licenças...</h1>
                        }

                    </table>
                </div>
            </Container>
        </>
    );
}

export default Licencas;