import React, { useState, useEffect } from 'react';
import { Container } from './styles';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from 'react-datepicker';
import pt_br from 'date-fns/locale/pt-BR';
import Button from '../../componentes/Button';
import { MdSearch } from 'react-icons/md';
import api from '../../services/api';


registerLocale('pt-BR', pt_br);

function FiltroData({funcSubmitted, dataInic, dataFin, setCodCliente}){
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

    function changeCliente(cliente){
        setCodCliente(cliente);
    }
        
    useEffect(() => {
        getClientes()
    }, [])

    async function getClientes() {
        const response = await api.get('/Clientes');
        setClientes(response.data);
    }

    return (
        <Container>
            <div className="card">
                <form onSubmit={funcSubmitted}>
                    <div className="form-group">
                        <label htmlFor="data">Data Inicial</label>
                        <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataInicial} onChange={changeDataInicial} disabled={PorCliente} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="data">Data Final</label>
                        <DatePicker dateFormat="dd/MM/yyyy" locale='pt-BR' selected={dataFinal} onChange={changeDataFinal} disabled={PorCliente} />
                    </div>
                    <div className="form-group">
                    <label htmlFor="clientes">Escolha o cliente</label>
                        <input type="checkbox" value={PorCliente} onChange={()=> setPorCliente(!PorCliente)} />    
                        {
                            clientes.length > 0 ?
                            <select id="clientes" className="input-control" disabled={!PorCliente} onChange={(e)=> changeCliente(e.target.value)}>
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
                </form>   
            </div>
        </Container>
    );
}

export default FiltroData;