import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Container } from "./styles";

function Graficos({ titulo, tipo = 'AreaChart', data }) {
    const [options, setOptions] = useState({});
    const [carregando, setCarregando] = useState(false);
    function renderChart() {
        setCarregando(true)
        setOptions({
            title: titulo,
            hAxis: { title: "Dias", titleTextStyle: { color: "#333" } },
            vAxis: { minValue: 0 },
            chartArea: { width: "50%", height: "70%" },
        });
        setCarregando(false)
    }

    useEffect(() => {
        setCarregando(true);
        renderChart();
        setCarregando(false);
    }, [data])

    return (
        <Container>
            {carregando ?
                <h1>Aguarde, carregando gráfico...</h1> :
                <Chart
                    chartType={tipo}
                    width="100%"
                    height="400px"
                    data={data}
                    options={options}
                />
            }
        </Container>
    );
}

export default Graficos;