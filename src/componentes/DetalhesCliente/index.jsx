import React from 'react';
import { useHistory } from 'react-router-dom';

import { MdAttachMoney } from 'react-icons/md';
import Button from '../../componentes/Button';

export default function DetalhesCliente({ cliente }) {
    const history = useHistory();

    function handleContaReceber(contrato, nome) {
        history.push({ pathname: '/contaReceber', state: { contrato: contrato, nome: nome } })
    }

    return (
        <div key={cliente.cnpj_cpf}>
            <article className="flex flex-col content-between bg-[#323540] shadow-[0px_2px_2px_2px_rgba(0,0,0,0.2),0px_10px_20px_-10px_rgba(0,0,0,0.1)] rounded-[5px] text-[#B2D9A0] m-[10px_5px] p-[10px] hover:-translate-y-[2px] transition-transform">
                <h1 className="text-white">{cliente.nome}</h1>
                <p className="text-[1rem]">{cliente.celular} | {cliente.fone}</p>
                <p className="text-[1rem]">{cliente.razao}</p>
                <p className="text-[1rem]">{cliente.email}</p>
                <p className="text-[1rem]">{cliente.cnpj_cpf}</p>
                <p className="text-[1rem]">{cliente.insc_estadual}</p>
                <Button nome="Ver Pendências" Icon={MdAttachMoney} tamanho_icone={15} borderRadius={"18px"} color={"white"} click={() => handleContaReceber(cliente.contrato, cliente.cli_nome)} />
            </article>
        </div>
    );
}