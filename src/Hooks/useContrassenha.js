import React, { useState, useEffect } from 'react';
import api from '../services/api';

function useContrassenhaVencer() {
    const [contrassenhasVencer, setContrassenhasVencer] = useState([]);

    async function fetchContrassenhasVencer() {
        let diasVencer = 15;
        let response = await api.get(`/contrassenha?dias=${diasVencer}`);
        if (response.status === 200) {
            let responseClientesAtivos = await api.get(`/Clientes`);
            if (responseClientesAtivos.status === 200) {
                let clientesAtivos = responseClientesAtivos.data;
                let contrassenhaVencer = response.data;
                let result = contrassenhaVencer.filter(
                    (licenca) => clientesAtivos.every(cli => cli.nome === licenca.nome_cliente)
                );
                setContrassenhasVencer(result);
            }

        }
    }

    useEffect(() => {
        fetchContrassenhasVencer();
    }, [])

    return contrassenhasVencer;
}

export default useContrassenhaVencer;