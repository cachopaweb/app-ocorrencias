import React, { useEffect } from 'react';
import api from '../../services/api';
import { useState } from 'react';

import Graficos from '../Graficos';
import { Container } from './styles';
import FiltroData from '../FiltroData';

function Burndown({ projeto_id }) {
    const [carregando, setCarregando] = useState(false);
    const [dadosfinal, setDadosFinal] = useState([]);
    const [dataInicial, setDataInicial] = useState(new Date((new Date()).getDate() - 30));
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
        setDadosFinal(insereDadosTabela(datasIdealConvertidas))
        setCarregando(false)
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

        if ((data.getMonth() + 1) < 10) {
            mes = '0' + (data.getMonth() + 1).toString();
        }
        else {
            mes = (data.getMonth() + 1).toString();
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

    function insereDadosTabela(datasIdeal) {
        let datainicial = menorData(datasIdeal);
        let datafinal = maiorData(datasIdeal);
        let auxData = datainicial;
        let diferencaDias = calculateDateDiff(datainicial, datafinal);
        let razaoIdeal = totalOcorrencias / diferencaDias;
        let auxIdeal = totalOcorrencias;
        let auxReal = totalOcorrencias;
        let dadosTabela = [
            ["Datas", "Linha Ideal", "Linha Real"]];
        while (auxData <= datafinal) {

            auxReal = auxReal - verificaNumeroDatas(auxData);
            auxIdeal = auxIdeal - razaoIdeal;
            dadosTabela.push([converteDataParaString(auxData), parseFloat(auxIdeal.toFixed(2)), auxReal]);

            auxData.setHours(auxData.getHours() + 24);
        }
        ////
        return dadosTabela;
    }

    useEffect(() => {
        fetchBurndownProjeto()
    }, [dataInicial, dataFinal])

    return (
        <Container>
            <FiltroData dataInic={setDataInicial} dataFin={setDataFinal} ocutarBuscaClientes />
            {carregando ?
                <h1>Aguarde, carregando burndown...</h1> :
                <Graficos data={dadosfinal} titulo="Burndown" tipo="AreaChart" />
            }
        </Container>
    );
}

export default Burndown;