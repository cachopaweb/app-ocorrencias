import React, { useEffect, useRef, useState } from 'react';
import left from '../../assets/leftRecibo.png';
import icon from '../../assets/Icone_Portal.png'
import logo from '../../assets/portalCom.png'
import { QRCodeSVG } from 'qrcode.react';
import { dataAtualPorExtenso, formatarNumeroVigula } from '../../functions/utils';
import Pix from '../Pix/Pix';
import './../../tail.css'
import './recibo.css'

function Impressao({ dados }) {
    const [code, setCode] = useState('');
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        setCarregando(true);
        const pix = new Pix(
            "05557971000150",
            dados.referencia,
            "PORTAL",
            "FATIMA",
            dados.codPix.toString(),
            dados.valor
        );
        setCode(pix.getPayload());
        setCarregando(false);
    }, []);

    return (
        <>
            {carregando ? <>
            </> :

                <div>
                    <div className='flex flex-row text-[12px] w-[794px] h-[561px] text-black'>
                        <img className='print-only' src={left} alt="" />
                        <div className='flex flex-col'>
                            <Cabecalho valor={dados.valor} />
                            <div className='pt-2'>
                                <Linha texto="Cliente | Endereço" valor={dados.cliente + " | " + dados.endereco} />
                                <Linha texto="Valor" valor={dados.valortxt} />
                                <LinhaDividida textoUm="Referencia" textoDois="Venc."
                                    valorUm={dados.referencia} valorDois={dados.venc} />
                            </div>
                            <div className='flex flex-row text-black pt-20'>
                                <div className='flex flex-row pt-10'>
                                    <p>Fátima do Sul, {dataAtualPorExtenso()}</p>
                                    <p className='pl-32 pr-5'>Recebido em _____/_____/_____</p>
                                </div>
                                <div className='ml-32 mt-5'>
                                    <QRCodeSVG size='75' value={code} />,

                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <p className='ml-32'>____________________________________________________________</p>
                                <p className='ml-32'>Yuzuri & Lopes Ltda - CNPJ: 05.557.971/0001-50</p>
                                <p className='ml-32'>Avenida 09 de Julho, 1753 - Centro</p>
                                <p className='ml-32'>Fátima do Sul - MS  Fone: (67) 3467-3694</p>

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
                        <p className='pt-5 pl-5 text-2xl'>R$ {formatarNumeroVigula(valor)}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

function Linha({ texto, valor }) {
    return (
        <div className='pt-4'>
            <div className='border-black border-2'>
                <p className='pl-2 pt-1'>{texto}</p>
                <p className='font-normal text-xs pl-2'>{valor}</p>
            </div>
        </div>
    )
}

function LinhaDividida({ textoUm, textoDois, valorUm, valorDois }) {
    return (
        <div className='pt-2'>
            <div className='border-black border-2'>
                <div className='flex flex-row justify-between'>
                    <div>
                        <p className='pl-2 pt-1'>{textoUm}</p>
                        <p className='font-normal text-xs pl-2'>{valorUm}</p>
                    </div>
                    <div>
                        <p className='pl-2 pt-1'>{textoDois}</p>
                        <p className='font-normal text-xs pl-2'>{valorDois}</p>
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export { Impressao };