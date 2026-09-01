import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import pt_br from 'date-fns/locale/pt-BR';
import Button from '../../componentes/Button';
import { MdSearch } from 'react-icons/md';
import api from '../../services/api';
import './../../tail.css'


registerLocale('pt-BR', pt_br);

function FiltroData({ funcSubmitted, dataInic, dataFin, setCodContrato, ocutarBuscaClientes = false }) {
    const [dataInicial, setDataInicial] = useState(new Date());
    const [dataFinal, setDataFinal] = useState(new Date());
    const [clientes, setClientes] = useState([]);
    const [PorCliente, setPorCliente] = useState(false);
    function changeDataInicial(date) {
        setDataInicial(date);
        dataInic(date);
    };
    function changeDataFinal(date) {
        setDataFinal(date);
        dataFin(date);
    };

    function changeContrato(contrato) {
        setCodContrato(contrato);
    }

    useEffect(() => {
        getClientes()
    }, [])

    async function getClientes() {
        const response = await api.get('/Clientes');
        setClientes(response.data);
    }

    return (
        <div className="m-[10px] flex items-center justify-center">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <form className="rounded-lg shadow-[0px_2px_2px_2px_rgba(0,0,0,0.15),_0px_10px_20px_-10px_rgba(0,0,0,0.1)] w-[300px] flex justify-between items-center flex-col" onSubmit={funcSubmitted}>
                    <div className="form-group px-[10px]">
                        <label className="mr-[15px]" htmlFor="data">Data Inicial</label>
                        <DatePicker className="h-[46px] mb-[15px] px-[20px] text-[#777] text-[15px] w-full border border-[#ddd] placeholder-[#999]" dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataInicial} onChange={changeDataInicial} disabled={PorCliente} />
                    </div>
                    <div className="form-group px-[10px]">
                        <label className="mr-[15px]" htmlFor="data">Data Final</label>
                        <DatePicker className="h-[46px] mb-[15px] px-[20px] text-[#777] text-[15px] w-full border border-[#ddd] placeholder-[#999]" dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataFinal} onChange={changeDataFinal} disabled={PorCliente} />
                    </div>
                    {!ocutarBuscaClientes && (
                        <>
                            <div className="form-group px-[10px]">
                                <label className="mr-[15px]" htmlFor="clientes">Escolha o cliente</label>
                                <input className="h-[20px]" type="checkbox" value={PorCliente} onChange={() => setPorCliente(!PorCliente)} />
                                {
                                    clientes.length > 0 ?
                                        <select id="clientes" className="input-control w-full text-[1.1em] mt-[5px] mb-[5px] h-[40px]" disabled={!PorCliente} onChange={(e) => changeContrato(e.target.value)}>
                                            {
                                                clientes.map(cliente => <option key={cliente.contrato} value={cliente.contrato}>{cliente.nome}</option>)
                                            }
                                        </select>
                                        : <h3>Carregando clientes</h3>
                                }
                            </div>
                            <div>
                                <Button Icon={MdSearch} nome={"Buscar"} color={"black"} corTexto={"white"} borderRadius={"18px"} />
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}

export default FiltroData;