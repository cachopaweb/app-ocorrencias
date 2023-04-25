import React, { Component } from 'react';
import { useEffect } from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Graficos({ dados }) {

    useEffect(()=> {
    }, []);

    const toggleDataSeries = (e) => {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else {
            e.dataSeries.visible = true;
        }
        this.chart.render(e.data);
    }


    const options =
    {
        
        animationEnabled: true,	
        title:{
            text: "BurnDown"
        },
        axisY : {
            title: "Projetos",
            includeZero: false,
        },
        toolTip: {
            shared: true
        },
        data:dados
    }


    return (
        <div className="Grafico">
            <CanvasJSChart options={dados}
            />
            {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
        </div>
    );
}


export default Graficos;