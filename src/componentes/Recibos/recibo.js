import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Pix } from "faz-um-pix"
import './recibo.css'
import left from '../../assets/leftRecibo.png';
import icon from '../../assets/Icone_Portal.png'
import logo from '../../assets/portalCom.png'
import { QRCode } from 'react-qrcode-logo';

export default function Recibo({ dadosRecibo }) {
    const componentRef = useRef < HTMLDivElement > (null);
    const [carregando, setCarregando] = useState(true);
    const [recibo, setRecibo] = useState({
        cliente: 'Oficina 147 Burgers', endereco: 'Rua do Fulano', valor: "200,00",
        valortxt: "Duzentos Reais", referencia: "Mensalidade Ref. A 04/24", venc: "25"
    });


    const handlePrint = useReactToPrint({
        documentTitle: "Recibo",
        content: () => document.getElementById('print'),
    });

    useEffect(() => {
        setCarregando(true);

        setCarregando(false);
    }, []);


    return (
        <div className='bg-white h-96'>
            {
                carregando ?
                    <div>
                        <h1>Carregando</h1>
                    </div>
                    :
                    <>
                        <div id='print' className='hidden print:block'>
                            <Impressao dados={recibo} />
                        </div>
                        <div className='p-1'>
                            <div className='p-2 border-black border-2'>
                                <p className='p-2'>Cliente: {recibo.cliente}</p>
                                <p className='p-2'>Valor: {recibo.valor}</p>
                                <p className='p-2'>Referencia: {recibo.referencia}</p>
                                <p className='p-2'>Vencimento: {recibo.venc} </p>
                            </div>
                        </div>
                    </>
            }
            <div className='pl-4'>
                <button
                    id="botaoImpressao"
                    className={`fixed bottom-4 px-4 py-3 flex items-center bg-black space rounded-md text-white font-bold`}
                    onClick={handlePrint}
                >
                    <i className="fas fa-print"></i>
                    <span>Imprimir</span>
                </button>
            </div>
        </div>

    );
}


function Impressao({ dados }) {
    const [code, setCode] = useState('');
    const [carregando, setCarregando] = useState(true);
    const Pix = require('../Pix/Pix');
    useEffect(() => {
        setCarregando(true);
        const pix = new Pix(
            "03057354114",
            "referencia",
            "ALESSANDRO ",
            "FATIMA DO SUL",
            ">TXID<",
            0.1
        );
        setCode(pix.getPayload());

        setCarregando(false);
    }, []);

    return (
        <>
            {carregando ? <></> :
                <div className='flex flex-row text-[12px] w-[794px] h-[561px] text-black'>
                    <img className='hidden print:block' src={left} alt="" />
                    <div className='flex flex-col'>
                        <Cabecalho valor={dados.valor} />
                        <div className='pt-2'>
                            <Linha texto="Cliente" valor={dados.cliente} />
                            <Linha texto="Endereço" valor={dados.endereco} />
                            <Linha texto="Valor" valor={dados.valortxt} />
                            <Linha texto="Referencia" valor={dados.referencia} />
                            <Linha texto="Venc." valor={dados.venc} />
                        </div>
                        <div className='flex flex-row text-black'>
                            <div className='flex flex-row pt-10'>
                                <p>Fátima do Sul, 03 de abril de 2024</p>
                                <p className='pl-32 pr-5'>Recebido em _____/_____/_____</p>
                            </div>
                            <div className='ml-32'>
                                <QRCode size={75} value={code} ecLevel='L' />
                            </div>
                        </div>

                    </div>
                </div>
            }
        </>
    );
}

function Cabecalho({ valor }) {
    return (
        <>
            <div className='flex flex-row w-full pt-5 rounded-b-[20px] border-slate-700 border-b-2 border-l-2 border-r-2'>
                <img className='h-28 p-2' src={icon} alt="" />
                <img className='h-28 p-2' src={logo} alt="" />
                <div className='pl-10 pr-2 pt-3'>
                    <div className='rounded-[20px] h-20 w-36 text-black border-slate-700 border-2'>
                        <p className='pl-3 pt-3 font-bold '>VALOR</p>
                        <p className='pt-5 pl-5 text-xl'>R$ {valor}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

function Linha({ texto, valor }) {

    return (
        <div className='pt-2'>
            <div className='border-black border-2'>
                <p className='pl-2 pt-1'>{texto}</p>
                <p className='font-normal text-xs pl-2'>{valor}</p>
            </div>
        </div>
    )
}