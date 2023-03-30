import React, { Component } from 'react';
import { useEffect } from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Graficos({ data }) {

    useEffect(()=> {
        console.log(data);
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

    const options = {
        theme: "light2",
        animationEnabled: true,
        title: {
            text: "BurnDown"
        },
        subtitles: [{
            text: "Click Legend to Hide or Unhide Data Series"
        }],
        axisX: {
            title: "States"
        },
        axisY: {
            title: "Units Sold",
            titleFontColor: "#6D78AD",
            lineColor: "#6D78AD",
            labelFontColor: "#6D78AD",
            tickColor: "#6D78AD",
            includeZero: false
        },
        axisY2: {
            title: "Profit in USD",
            titleFontColor: "#51CDA0",
            lineColor: "#51CDA0",
            labelFontColor: "#51CDA0",
            tickColor: "#51CDA0",
            includeZero: false
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
           // itemclick: toggleDataSeries()
        },
        data: data /*[{
				type: "spline",
				name: "Ideal",
				showInLegend: true,
				xValueFormatString: "DD/MM/YYYY",
				dataPoints: [
					{ x: new Date(2017, 0, 10), y: 4 },
					{ x: new Date(2017, 1, 10), y: 3 },
					{ x: new Date(2017, 2, 10), y: 2 },
					{ x: new Date(2017, 3, 10), y: 1 },
					{ x: new Date(2017, 4, 10), y: 0 }
				]
			},
			{
				type: "spline",
				name: "Profit",
				axisYType: "secondary",
				showInLegend: true,
				xValueFormatString: "DD/MM/YYYY",
				dataPoints: [
					{ x: new Date(2017, 0, 5), y: 4 },
					{ x: new Date(2017, 1, 20), y: 3 },
					{ x: new Date(2017, 3, 21), y: 2 },
					{ x: new Date(2017, 4, 3), y: 1 },
					{ x: new Date(2017, 6, 19), y: 0 }
				]
			}]*/
    }


    return (
        <div className="Grafico">
            <CanvasJSChart options={options}
            />
            {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
        </div>
    );
}


export default Graficos;