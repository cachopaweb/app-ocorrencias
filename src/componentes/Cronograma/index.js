import React, { useEffect } from 'react';
import { useState } from 'react';
import { Container } from './styles';

function Cronograma({ projeto_id }) {
    const [carregando, setCarregando] = useState(false);

    async function fetchBurndownProjeto() {
        setCarregando(true);
        setCarregando(false);
    }

    function insereDadosTabela()
    {

    }
    return (
        <Container>
            {carregando ?
                <h1>Aguarde, carregando cronograma...</h1> :
                <h1> Cronograma carregado</h1>
            }
        </Container>
    );
}

export default Cronograma;