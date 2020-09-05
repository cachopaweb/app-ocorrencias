import React, { useEffect } from 'react';
import { Chart }  from 'chart.js';
import api from '../../services/api';
import { useState } from 'react';

function Burndown({projeto_id}){
    const [datas, setDatas] = useState([]);
    const [linhaIdeal, setlinhaIdeal] = useState([]);
    const [linhaReal, setlinhaReal] = useState([]);

    async function fetchBurndownProjeto(){
        let response = await api.get(`/Burndown/${projeto_id}`);
        let datas_corrigidas = response.data.datas.map((datas)=>{
            return new Date(datas).toLocaleDateString()
        });
        setDatas(datas_corrigidas);
        setlinhaIdeal(response.data.ideal);
        setlinhaReal(response.data.real);
    }    

    useEffect(()=> {
        fetchBurndownProjeto();
    }, [])

    //let datas = ['01/08/20', '02/08/20', '03/08/20', '04/08/20', '05/08/20', '06/08/20', '07/08/20'];
    //let linhaIdeal = [1, .85, .7, .55, .4, .25, 0.1];
    //let linhaReal = [1, 1, 1, 1, .25, 0.1, 0];
    function renderChart(){
        console.log("renderChar")
        var ctx = document.getElementById('burndown');
        var burndown = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datas,
                datasets: [
                {
                    label: '# Linha Ideal',
                    data: linhaIdeal,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: '# Linha Real',
                    data: linhaReal,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
            ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    useEffect(()=>{
        renderChart();
    }, [datas, linhaIdeal, linhaReal])

    return (
        <canvas id="burndown" width={400} height={400} />        
    );
}

export default Burndown;