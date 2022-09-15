import React from 'react';
import { useHistory } from 'react-router-dom';

import { MdAttachMoney } from 'react-icons/md';
import Button from '../../componentes/Button';
import { Container } from './styles';

export default function DetalhesCliente({ cliente }) {
    const history = useHistory();

    function handleContaReceber(contrato, nome) {
        history.push({ pathname: '/contaReceber', state: { contrato: contrato, nome: nome } })
    }

    return (
        <Container key={cliente.cnpj_cpf}>
            <article>
                <h1>{cliente.nome}</h1>
                <p>{cliente.celular} | {cliente.fone}</p>
                <p>{cliente.razao}</p>
                <p>{cliente.email}</p>
                <p>{cliente.cnpj_cpf}</p>
                <p>{cliente.insc_estadual}</p>
                <Button nome="Ver Pendências" Icon={MdAttachMoney} tamanho_icone={15} borderRadius={"18px"} color={"white"} click={() => handleContaReceber(cliente.contrato, cliente.cli_nome)} />
            </article>
        </Container>
    );
}