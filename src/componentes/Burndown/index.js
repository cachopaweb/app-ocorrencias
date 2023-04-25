import React, { useEffect } from 'react';
import api from '../../services/api';
import { useState } from 'react';
import { Chart } from "react-google-charts";

import Graficos from '../Graficos';
import { Container } from './styles';
import FiltroData from '../FiltroData';

function Burndown({ projeto_id }) {
    const [carregando, setCarregando] = useState(false);
    const [dadosfinal, setDadosFinal] = useState([]);
    const [dataInicial, setDataInicial] = useState(new Date());
    const [dataFinal, setDataFinal] = useState(new Date());
    let totalOcorrencias = 0;
    let totalDatasFinalizadas = 0;
    let datasRealConvertidas = 0;
    let datasIdealConvertidas = 0;

    async function fetchBurndownProjeto() {
        setCarregando(true);
        let response = await api.get(`/Burndown/${projeto_id}?data1=${dataInicial.toLocaleDateString()}&data2=${dataFinal.toLocaleDateString()}`);
        const dados = response.data;
        let datasIdeal = dados.ideais;
        let datasReal = dados.reais;
        //obtem o tamanho dos arrays
        totalOcorrencias = datasIdeal.length;
        totalDatasFinalizadas = datasReal.length;
        //converte as datas
        datasRealConvertidas = converteDatas(datasReal);
        datasIdealConvertidas = converteDatas(datasIdeal);
        //retorna os dados do grafico        
        setDadosFinal(insereDadosTabela(datasRealConvertidas,datasIdealConvertidas));
        setCarregando(false);
    }

    function proximosDias(data, dias) {
        if(data != 0)
        {
            return new Date(data.getTime() + (dias * 86400000));
        }
        return 0;
    }


    function converteStringParaData(dataString) {
        var data = new Date();

        if (dataString == '0') {
            return null;
        }
        var dia = parseInt(dataString[8] + dataString[9]);
        var mes = parseInt(dataString[5] + dataString[6]) - 1;
        var ano = parseInt(dataString[0] + dataString[1] + dataString[2] + dataString[3]);
        var data = new Date(ano, mes, dia);
        data.setHours(0);
        data.setMinutes(0);
        data.setSeconds(0);
        return data;
    }

    function converteDatas(listaDatas) {
        var retorno = [totalDatasFinalizadas];
        for (var i = 0; i < totalDatasFinalizadas; i++) {
            retorno[i] = converteStringParaData(listaDatas[i]);
        }
        return retorno;
    }

    function converteDataParaString(data) {
        var dia;
        var mes;
        var ano;
        if (data.getDate() < 10) {
            dia = '0' + data.getDate().toString();
        }
        else {
            dia = data.getDate().toString();
        }

        if (data.getMonth() < 10) {
            mes = '0' + data.getMonth().toString();
        }
        else {
            mes = data.getMonth().toString();
        }

        ano = data.getFullYear().toString();

        return new Date(ano, mes, dia).toLocaleDateString();
    }


    function verificaNumeroDatas(data) {
        var retorno = 0;

        for (var i = 0; i < totalDatasFinalizadas; i++) {
            if (datasRealConvertidas[i] != null) {
                if (datasRealConvertidas[i].getTime() == data.getTime()) {
                    retorno++;
                }
            }
        }
        return retorno;
    }

    function maiorData(datas) {
        var retorno = datas[0];
        for (var i = 1; i < totalDatasFinalizadas; i++) {
            if (retorno.getTime() < datas[i].getTime()) {
                retorno = datas[i];
            }
        }
        return retorno;

    }

    function menorData(datas) {
        var retorno = datas[0];
        for (var i = 1; i < totalDatasFinalizadas; i++) {
            if (retorno.getTime() > datas[i].getTime()) {
                retorno = datas[i];
            }
        }
        return retorno;

    }

    function calculateDateDiff(start, end) {
        return Math.abs(end - start) / 86400000;
    }

    function listaDatasString(lista) {
        var i;
        let retorno = [];
        for (i = 0; i < lista.length; i++) {
            if ((lista[i] != null) && (lista[i] != 0)) {
                retorno.push(converteDataParaString(lista[i]));
            }
        }
        return retorno;
    }

    function insereDadosTabela(DatasReal, DatasIdeal)
    {
        var dataInicial = DatasIdeal[0];
        var totalProjetos = DatasIdeal.length;
        var dataFinal = DatasIdeal[DatasIdeal.length -1];
        let vetorReal=[];
        let vetorIdeal=[];
        var intervaloDias = parseInt(((dataFinal - dataInicial) /86400000)/(totalProjetos-1));

        DatasReal.forEach(function(data, i) {
            if(data!=null)
            {
                vetorReal.push({
                    x:data,
                    y: totalProjetos - i
                })
            }

        });

        vetorIdeal =
        [
            {
                x:dataInicial,
                y:totalProjetos
            },
            {
                x:dataFinal,
                y:1
            },
        ]
        return(
            {
                animationEnabled: true,	
                title:{
                    text: "BurnDown"
                },
                axisY : {
                    title: "Projetos",
                    includeZero: false,
                    maximum: totalProjetos,
                    minimum: 1
                },
                toolTip: {
                    shared: true
                },
        data: [{

            type: "spline",
            name: "Ideal",
            showInLegend: true,
            xValueFormatString: "DD/MM/YYYY",
            dataPoints: vetorIdeal
        },
        {
            type: "spline",
            name: "Real",
            showInLegend: true,
            xValueFormatString: "DD/MM/YYYY",
            dataPoints:vetorReal
        }]});

    }


    useEffect(() => {
        fetchBurndownProjeto()
    }, [dataInicial, dataFinal])

    return (
        <Container>
            <FiltroData dataInic={setDataInicial} dataFin={setDataFinal} ocutarBuscaClientes />
            {carregando ?
                <h1>Aguarde, carregando burndown...</h1> :
                <Graficos dados={dadosfinal} />
            }
        </Container>
    );
}

export default Burndown;