import React, { useState, useEffect } from 'react';
import api from '../services/api';

function useContrassenhaVencer() {
    const [contrassenhasVencer, setContrassenhasVencer] = useState([]);

    async function fetchContrassenhasVencer() {
        let diasVencer = 15;
        let response = await api.get(`/contrassenha?dias=${diasVencer}`);
        if (response.status === 200) {
            setContrassenhasVencer(response.data);
        }
    }

    useEffect(() => {
        fetchContrassenhasVencer();
    }, [])

    return contrassenhasVencer;
}

export default useContrassenhaVencer;