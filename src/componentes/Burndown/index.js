import React, { useEffect } from 'react';
import { Chart }  from 'chart.js';

function Burndown(){
    let datas = ['01/07/20', '04/07/20', '07/07/20'];
    let linha_ideal = [3, 2, 0];
    function renderChart(){
        var ctx = document.getElementById('burndown');
        var burndown = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datas,
                datasets: [{
                    label: '# Linha Real',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor:  Chart. chartColors.red,
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                },
                {
                    label: '# Linha Ideal',
                    data: linha_ideal,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }
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
        <canvas id="burndown" width="300" height="300" />        
    );
}

export default Burndown;