import React, { useEffect } from 'react';
import api from '../../services/api';
import { useState } from 'react';
import { Chart } from "react-google-charts";

import Graficos from '../Graficos';
import { Container } from './styles';
import FiltroData from '../FiltroData';

function Burndown({ projeto_id }) {
    const [carregando, setCarregando] = useState(false);
    const [flag, setFlag] = useState(true);
    const [dadosfinal, setDadosFinal] = useState([]);
    const [dataInicial, setDataInicial] = useState(new Date());
    const [dataFinal, setDataFinal] = useState(new Date());
    let totalOcorrencias = 0;
    let totalDatasFinalizadas = 0;
    let datasRealConvertidas = 0;
    let datasIdealConvertidas = 0;

    async function fetchBurndownProjeto() {
        setCarregando(true)
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
        return new Date(data.getTime() + (dias * 86400000));
    }


    function converteStringParaData(dataString) {
        var data = new Date();

        if (dataString == '0') {
            return null;
        }
        else {
            data.setDate(parseInt(dataString[8] + dataString[9]));
            data.setMonth(parseInt(dataString[5] + dataString[6]) - 1);
            data.setUTCFullYear(parseInt(dataString[0] + dataString[1] + dataString[2] + dataString[3]));
            data.setHours(0);
            data.setMinutes(0);
            data.setSeconds(0);
            return data;
        }
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
        var dataFinal = DatasIdeal[DatasIdeal.length];
        let vetorReal=[];
        let vetorIdeal=[];
        var intervaloDias = (dataFinal - dataInicial) /86400000;

        DatasReal.forEach(function(data, i) {
            if(data!=null)
            {
                vetorReal.push({
                    x:data,
                    y: i
                })
            }
        });

        for(var j = DatasIdeal.length; j <= 0; j--)
        {
            vetorIdeal.push(
                {
                    x: dataInicial,
                    y:j
                }
            )
            dataInicial = proximosDias(dataInicial, intervaloDias);
        }
        return(
        [{
            type: "spline",
            name: "Ideal",
            showInLegend: true,
            xValueFormatString: "DD/MM/YYYY",
            dataPoints: vetorIdeal
        },
        {
            type: "spline",
            name: "Profit",
            axisYType: "secondary",
            showInLegend: true,
            xValueFormatString: "DD/MM/YYYY",
            dataPoints:vetorReal
        }]);

    }

/*    function insereDadosTabela(datasReal,datasIdeal) {
        let dadosTabela = [["Datas", "Linha Ideal", "Linha Real"]];
        setDadosFinal(dadosTabela);
        let inicial;
        let final;
        let datasPrevistas = listaDatasString(datasIdeal);
        if(datasPrevistas.length > 0)
        {
            inicial = datasIdeal[0];
            final = datasIdeal[datasIdeal.length - 1];
        }
        else
        {
            inicial = dataInicial;
            final = dataFinal;
        }

        datasReal = datasReal.sort();
        let num_tarefas = datasReal.length;
        let tarefas_pendentes = datasReal.length;
        let datasconcluidas = listaDatasString(datasReal);
        let j = 0;
        let i = 0;
        inicial.setHours(0);
        inicial.setMinutes(0);
        inicial.setSeconds(0);
        inicial.setMilliseconds(0);
        final.setHours(0);
        final.setMinutes(0);
        final.setSeconds(0);
        final.setMilliseconds(0);
        let diferencaDias = calculateDateDiff(inicial, final);
        let razao = datasReal.length / diferencaDias;
        let eixoIdeal = datasReal.length;

        while (inicial.valueOf() != final.valueOf()) {
            for (j = 0; j < datasconcluidas.length; j++) {
                if (datasconcluidas[j] != null) {
                    if (datasconcluidas[j].localeCompare(converteDataParaString(inicial)) == 0) {
                        tarefas_pendentes--;
                    }
                }
            }
            dadosTabela.push([converteDataParaString(inicial), parseFloat(parseFloat(eixoIdeal).toFixed(2)), tarefas_pendentes]);
            eixoIdeal = eixoIdeal - razao;
            i++;
            inicial = proximoDia(inicial);
        }
        console.log(dadosTabela);
        return dadosTabela;
    }*/

    useEffect(() => {
        fetchBurndownProjeto()
    }, [dataInicial, dataFinal])

    return (
        <Container>
            <FiltroData dataInic={setDataInicial} dataFin={setDataFinal} ocutarBuscaClientes />
            {carregando ?
                <h1>Aguarde, carregando burndown...</h1> :
                <Graficos data={dadosfinal} />
            }
        </Container>
    );
}

export default Burndown;