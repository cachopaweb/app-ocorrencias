
import React, { useState, useEffect } from 'react';
import Header from '../../componentes/Header';
import { Container } from './styles';
import Button from '../../componentes/Button';
import { MdPrint } from 'react-icons/md';
import { converteMesAnoParaRef } from '../../functions/utils';
import Modal from '../../componentes/Modal';
import api from '../../services/api';
import { reaisPorExtenso } from '../../functions/utils';
import { useReactToPrint } from 'react-to-print';
import { Impressao } from '../../componentes/Recibos/printRecibo';
import './../../tail.css'

function GeraRecibos() {

    const [modalRecibo, setModalRecibo] = useState(false);
    const [recibos, setRecibos] = useState();
    const [carregandoModal, setCaregandoModal] = useState(true);

    function Recibos({ recibos }) {
        const handlePrint = useReactToPrint({
            documentTitle: "Recibos",
            content: () => document.getElementById('print'),
        });


        return (
            <>
                {carregandoModal ?
                    <></>
                    :
                    <div>
                        <div id='print' className='hidden print:block'>
                            {recibos.map(recibo =>
                                <div className='flex flex-col divide-y divide-dashed divide-slate-500 '>
                                    <Impressao dados={recibo} />
                                    <Impressao dados={recibo} />
                                </div>
                            )}
                        </div>

                        <div className='flex flex-row bg-white h-36'>
                            <div>
                                <h1>Clique no Botão Abaixo!</h1>
                            </div>
                            <button
                                id="botaoImpressao"
                                className={`fixed pl-3 bottom-4 px-4 py-3 flex items-center bg-black space rounded-md text-white font-bold`}
                                onClick={handlePrint}
                            >
                                <i className="fas fa-print"></i>
                                <span>Imprimir</span>
                            </button>
                        </div>

                    </div>

                }

            </>
        )

    }

    async function imprimirRecibos() {
        setCaregandoModal(true);
        var ano = document.getElementById("idAno").value.toString();
        let mes = document.getElementById("idMes").value.toString();
        let ref = mes + '/' + ano;
        let sql = `SELECT CLI_NOME, CLI_ENDERECO, CLI_CIDADE, CLI_BAIRRO, HON_REFERENCIA, HON_VALOR, HON_TIPO, CONT_VENCIMENTO, REC_FAT FROM CLIENTES, CONTRATOS, HONORARIOS, RECEBIMENTOS WHERE HON_FAT = REC_FAT AND CLI_CODIGO = CONT_CLI AND CONT_CODIGO = HON_CONT AND CONT_ESTADO = 1 AND HON_TIPO = 'Mensalidade' AND CONT_RECIBO = 'SIM' AND (HON_REFERENCIA = '${ref}') AND HON_DATAC = '01/01/1900' ORDER BY CLI_NOME`;
        let json = { 'sql': sql };
        let listaRecibos = [];
        const response = await api.post('/v1/dataset', json);
        response.data.map(rec => listaRecibos.push({
            cliente: rec.CLI_NOME,
            endereco: rec.CLI_ENDERECO + ' - ' + rec.CLI_CIDADE,
            valor: rec.HON_VALOR,
            referencia: 'Mensalidade Ref. A ' + rec.HON_REFERENCIA,
            valortxt: reaisPorExtenso(rec.HON_VALOR),
            venc: rec.CONT_VENCIMENTO,
            codPix: rec.REC_FAT
        }));
        setRecibos(listaRecibos);
        setModalRecibo(true);
        setCaregandoModal(false);


    }

    return (
        <>
            <Header title={'Recibos'} />
            <Modal activate={modalRecibo} setActivate={setModalRecibo} altura={'auto'} largura={'auto'}>
                {modalRecibo && <Recibos recibos={recibos} />}
            </Modal>
            <Container>
                <div className="card">
                    <div className='flex flex-col'>
                        <div className='flex flex-row'>
                            <div className='flex flex-col'>
                                <p>Digite o mês</p>
                                <input id='idMes' max="2" className='border border-slate-600 h-6' type="number" ></input>
                                <span className='text-xs text-slate-600'>Digite apenas dois dígitos</span>
                            </div>
                            <div className='flex flex-col pl-10'>
                                <p>Digite o ano</p>
                                <input id='idAno' max={2} className='border border-slate-600 h-6' type="number"></input>
                                <span className='text-xs text-slate-600'>Digite apenas dois dígitos</span>
                            </div>
                        </div>
                        <div className='pt-3'>
                            <Button nome="Imprimir Recibo" click={() => imprimirRecibos()} Icon={MdPrint} color={'Black'} corTexto={'white'} borderRadius={'18px'} />
                        </div>

                    </div>
                </div>
            </Container>

        </>
    );
}

export default GeraRecibos;