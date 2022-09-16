import React from 'react';

import { Chart } from 'chart.js';
import { useEffect } from 'react';

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

export default Graficos;