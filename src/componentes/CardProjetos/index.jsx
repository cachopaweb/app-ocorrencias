import React from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

function CardProjetos({ cliente, projeto_id, contrato, status, data_entrega }) {
    const history = useHistory();
    function AcessarQuadroScrum(){
        history.push({pathname: '/quadroScrum', state: {cliente, projeto_id, contrato}})
    }

    return (
        <div onClick={()=> AcessarQuadroScrum()} className="flex flex-col justify-center items-center m-[10px] h-[150px] w-[150px] text-center rounded-[5px] shadow-[2px_2px_2px_2px_rgba(0,0,0,0.3)] bg-white text-[16px] font-bold text-black">
            <header>
                {cliente}
            </header>
            <MdAccountCircle size={50} />   
            <h3 className="text-[red]">Status</h3>
            {status}         
            <h4 className="text-[blue]">Data Entrega</h4>
            {new Date(data_entrega).toLocaleDateString()}         
        </div>
    );
}

export default CardProjetos;