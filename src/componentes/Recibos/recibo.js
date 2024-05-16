import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import './recibo.css'

import { Impressao } from './printRecibo';

export default function Recibo({ recibo }) {
    const componentRef = useRef < HTMLDivElement > (null);
    const [carregando, setCarregando] = useState(true);


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
                            <div className='flex flex-col divide-y divide-dashed divide-slate-500 '>
                            <Impressao dados={recibo} />
                            <Impressao dados={recibo} />
                            </div>
                            

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


