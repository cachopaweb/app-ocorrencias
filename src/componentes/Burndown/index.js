import React, { useEffect } from 'react';
import api from '../../services/api';
import { useState } from 'react';
import Graficos from '../Graficos';
import { Container } from './styles';

function Burndown({ projeto_id }) {
    const [carregando, setCarregando] = useState(false);
    const [dadosfinal, setDadosFinal] = useState([]);

    async function fetchBurndownProjeto() {
        setCarregando(true)
        let response = await api.get(`/Burndown/${projeto_id}`);
        let datas_corrigidas = response.data.datas.map((datas) => {
            return new Date(datas).toLocaleDateString()
        });
        const dados = response.data;
        const result = renderChart(datas_corrigidas, dados.ideal, dados.real);
        setDadosFinal(result);
        setCarregando(false)
    }

    useEffect(() => {
        fetchBurndownProjeto()
    }, [])


    function renderChart(datas, linhaIdeal, linhaReal) {
        let dadosaux = [];
        for (let i = 0; i < datas.length; i++) {
            const datas_burndown = datas[i];
            const ideal = linhaIdeal[i];
            const real = linhaReal[i];
            dadosaux.push([datas_burndown, ideal, real])
        }
        const data = [
            ["Datas", "Linha Ideal", "Linha Real"],
            ...dadosaux
        ];
        return data;
    }

    return (
        <Container>
            {carregando ?
                <h1>Aguarde, carregando burndown...</h1> :
                <Graficos data={dadosfinal} titulo="Burndown" tipo="AreaChart" />
            }
        </Container>
    );
}

export default Burndown;