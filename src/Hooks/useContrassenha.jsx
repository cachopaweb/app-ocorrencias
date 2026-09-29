import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CACHE_TTL_MS = 60 * 1000; // 60 segundos
let cachedData = null;
let lastFetchTime = 0;
let pendingPromise = null;

async function fetchContrassenhasComCache() {
    const now = Date.now();
    if (cachedData && (now - lastFetchTime < CACHE_TTL_MS)) {
        return cachedData;
    }

    if (pendingPromise) {
        return pendingPromise;
    }

    pendingPromise = (async () => {
        try {
            const diasVencer = 15;
            const response = await api.get(`/contrassenha?dias=${diasVencer}`);
            if (response.status === 200 && Array.isArray(response.data)) {
                cachedData = response.data;
                lastFetchTime = Date.now();
                return cachedData;
            }
            return cachedData || [];
        } catch (error) {
            console.error('Erro ao buscar contrassenhas a vencer:', error);
            return cachedData || [];
        } finally {
            pendingPromise = null;
        }
    })();

    return pendingPromise;
}

function useContrassenhaVencer() {
    const [contrassenhasVencer, setContrassenhasVencer] = useState(() => cachedData || []);

    useEffect(() => {
        let isMounted = true;

        fetchContrassenhasComCache().then((data) => {
            if (isMounted && data) {
                setContrassenhasVencer(data);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return contrassenhasVencer;
}

export default useContrassenhaVencer;