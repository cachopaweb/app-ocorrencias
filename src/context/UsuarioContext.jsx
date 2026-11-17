import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';

export const UsuarioContext = createContext();

export default function UsuarioProvider({ children }) {
    const [usu_codigo, setUsu_codigo] = useState(() => {
        try {
            const u = localStorage.getItem('usuario_logado');
            return u ? Number(JSON.parse(u).codigo) || 0 : 0;
        } catch {
            return 0;
        }
    });

    const [login, setLogin] = useState(() => {
        try {
            const u = localStorage.getItem('usuario_logado');
            return u ? JSON.parse(u).nome || '' : '';
        } catch {
            return '';
        }
    });

    const [cod_funcionario, setCod_funcionario] = useState(() => {
        try {
            const u = localStorage.getItem('usuario_logado');
            return u ? Number(JSON.parse(u).fun_logado) || 0 : 0;
        } catch {
            return 0;
        }
    });

    const [fun_categoria, setFunCategoria] = useState(() => {
        try {
            const u = localStorage.getItem('usuario_logado');
            return u ? JSON.parse(u)?.fun_categoria || '' : '';
        } catch {
            return '';
        }
    });

    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        try {
            const u = localStorage.getItem('usuario_logado');
            return u ? JSON.parse(u).darkTheme ?? false : false;
        } catch {
            return false;
        }
    });

    // Função que garante e recupera o código do funcionário (FUN_CODIGO) caso esteja zerado na sessão
    const resolverCodFuncionario = useCallback(async () => {
        if (cod_funcionario && Number(cod_funcionario) > 0) {
            return Number(cod_funcionario);
        }
        try {
            const response = await api.get('/usuarios');
            const lista = Array.isArray(response.data) ? response.data : [];
            const encontrado = lista.find(
                (u) =>
                    (usu_codigo > 0 && Number(u.usu_codigo) === Number(usu_codigo)) ||
                    (login && String(u.login || '').toUpperCase() === String(login).toUpperCase())
            );
            if (encontrado && Number(encontrado.codigo) > 0) {
                const novoFunCodigo = Number(encontrado.codigo);
                setCod_funcionario(novoFunCodigo);
                if (encontrado.categoria && !fun_categoria) {
                    setFunCategoria(encontrado.categoria);
                }
                if (encontrado.login && !login) {
                    setLogin(encontrado.login);
                }
                return novoFunCodigo;
            }
        } catch (err) {
            console.error('Erro ao recuperar funcionário do usuário logado:', err);
        }
        return 0;
    }, [cod_funcionario, usu_codigo, login, fun_categoria]);

    // Auto-recuperação automática se o usuário estiver logado mas sem fun_logado válido no localStorage
    useEffect(() => {
        if ((usu_codigo > 0 || login) && (!cod_funcionario || Number(cod_funcionario) <= 0)) {
            resolverCodFuncionario();
        }
    }, [usu_codigo, login, cod_funcionario, resolverCodFuncionario]);

    useEffect(() => {
        if (isDarkTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkTheme]);

    useEffect(() => {
        if (usu_codigo > 0) {
            const usuario_logado = {
                codigo: usu_codigo,
                nome: login,
                fun_logado: cod_funcionario,
                fun_categoria: fun_categoria,
                darkTheme: isDarkTheme
            };
            localStorage.setItem('usuario_logado', JSON.stringify(usuario_logado));
        }
    }, [usu_codigo, login, cod_funcionario, fun_categoria, isDarkTheme]);

    const contextValue = useMemo(() => ({
        usu_codigo,
        setUsu_codigo,
        login,
        setLogin,
        cod_funcionario,
        setCod_funcionario,
        fun_categoria,
        setFunCategoria,
        isDarkTheme,
        setIsDarkTheme,
        resolverCodFuncionario
    }), [usu_codigo, login, cod_funcionario, fun_categoria, isDarkTheme, resolverCodFuncionario]);

    return (
        <UsuarioContext.Provider value={contextValue}>
            {children}
        </UsuarioContext.Provider>
    );
}

export function useUsuario() {
    const context = useContext(UsuarioContext);
    return context;
}
