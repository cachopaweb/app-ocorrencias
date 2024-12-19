import React, { useState } from 'react';
import './../../tail.css'
import { Chart, Doughnut } from 'chart.js';
import { useEffect } from 'react';

const widhtDonut = 10;
const heightDonut = 10;

function DonutTiposOcorrencias({data}){
    function renderChart() {
        var ctx = document.getElementById('donutUm').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                elements: {
                    rectangle: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Ocorrencias'
                }
            }
        });
    }


    useEffect(() => {
        renderChart();
    },[data])

    return(
        <canvas
            id="donutUm"
            width={widhtDonut}
            height={heightDonut} />
    )

}

function DonutTiposOrdemOcorrencia({data}){
    function renderChart() {
        var ctx = document.getElementById('donutDois').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                elements: {
                    rectangle: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Ocorrencias'
                }
            }
        });
    }


    useEffect(() => {
        renderChart();
    },[data])

    return(
        <canvas
            id="donutDois"
            width={widhtDonut}
            height={heightDonut} />
    )

}

function Tabela({data}) {

    const [loading, setLoading] = useState();
    const [porcentagemOrdens, setPorcentagemOrdens] = useState(0);

    useEffect(() => {
        setLoading(true);
        const porcentagem = (data.ordens / data.ocorrencias) * 100;
        setPorcentagemOrdens(porcentagem);
        setLoading(false);
    }, [])

    return (
        <div className='self-center place-items-center w-96 flex-col bg-white shadow-md rounded-lg'>
                <table class="leading-normal min-w-72">
                    <thead className='px-5 text-lg py-3 border-b-2 border-gray-200 bg-gray-100 text-left font-semibold text-gray-600 uppercase tracking-wider'>
                        <tr >
                            <th>Tipo</th>
                            <th >Quantidade</th>
                            <th >Percentual</th>
                        </tr>
                    </thead>
                    <tbody class="px-5 py-5 border-b border-gray-200 bg-white text-base font-bold">
                        <tr>
                            <td>Ocorrencia</td>
                            <td>{data.ocorrencias}</td>
                            <td>100%</td>
                        </tr>
                        <tr>
                            <td>Ordens</td>
                            <td>{data.ordens}</td>
                            <td>{porcentagemOrdens} %</td>
                        </tr>
                    </tbody>
                </table>
        </div>
    )
}

function Graficos({ titulo, tipo = 'horizontalBar', data }) {
    function renderChart() {
        var ctx = document.getElementById('canvas').getContext('2d');
        new Chart(ctx, {
            type: tipo,
            data: data,
            options: {
                elements: {
                    rectangle: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: titulo
                }
            }
        });
    }

    useEffect(() => {
        renderChart();
    }, [data])

    return (
        <canvas
            id="canvas"
            width={400}
            height={400} />);
}

export { Graficos, Tabela, DonutTiposOcorrencias, DonutTiposOrdemOcorrencia };