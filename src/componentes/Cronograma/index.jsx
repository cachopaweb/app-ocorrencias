import React, { useEffect } from 'react';
import { useState } from 'react';

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
        <div className="p-[10px] rounded-[3px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] bg-white">
            {carregando ?
                <h1>Aguarde, carregando cronograma...</h1> :
                <h1> Cronograma carregado</h1>
            }
        </div>
    );
}

export default Cronograma;