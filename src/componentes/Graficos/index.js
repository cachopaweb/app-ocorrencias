import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Container } from "./styles";

function Graficos({ titulo, tipo = 'AreaChart', data }) {
    return (
        <Chart
            chartType={tipo}
            width="100%"
            height="400px"
            data={data}
            options={{
                title: titulo,
                hAxis: { title: "Dias", titleTextStyle: { color: "#333" } },
                vAxis: { minValue: 0 },
                chartArea: { width: "50%", height: "70%" },
            }}
        />

    );
}

export default Graficos;