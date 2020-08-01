import React, { useEffect } from 'react';
import { Chart }  from 'chart.js';

function Burndown(){
    let datas = ['01/07/20', '04/07/20', '07/07/20'];
    let linha_ideal = [3, 2, 0];
    let linha_real = [3, 2, 1];
    function renderChart(){
        var ctx = document.getElementById('burndown');
        var burndown = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datas,
                datasets: [
                {
                    label: '# Linha Ideal',
                    data: linha_ideal,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: '# Linha Real',
                    data: linha_real,
                    backgroundColor: 'rgba(255, 99, 132, 1)',
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
    }, [])

    return (
        <canvas id="burndown" width={400} height={400} />        
    );
}

export default Burndown;