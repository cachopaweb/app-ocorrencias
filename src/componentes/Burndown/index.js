import React, { useEffect } from 'react';
import api from '../../services/api';
import { useState } from 'react';
import Graficos from '../Graficos';
import { Container } from './styles';

function Burndown({ projeto_id }) {
    const [datas, setDatas] = useState([]);
    const [linhaIdeal, setlinhaIdeal] = useState([]);
    const [linhaReal, setlinhaReal] = useState([]);
    const [carregando, setCarregando] = useState(false);

    async function fetchBurndownProjeto() {
        setCarregando(true)
        let response = await api.get(`/Burndown/${projeto_id}`);
        let datas_corrigidas = response.data.datas.map((datas) => {
            return new Date(datas).toLocaleDateString()
        });
        const dados = response.data;
        setDatas(datas_corrigidas);
        setlinhaIdeal(dados.ideal);
        setlinhaReal(dados.real);
        setCarregando(false)
    }

    useEffect(() => {
        fetchBurndownProjeto();
    }, [])


    function renderChart() {
        return {
            labels: datas,
            datasets: [
                {
                    label: '# Linha Ideal',
                    data: linhaIdeal,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    tension: 0.1
                },
                {
                    label: '# Linha Real',
                    data: linhaReal,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.1
                },
            ]
        };
    }

    return (
        <Container>
            {carregando ? <h1>Aguarde, carregando burndown...</h1> : <Graficos data={renderChart()} titulo="Burndown" tipo="line" />}
        </Container>
    );
}

export default Burndown;