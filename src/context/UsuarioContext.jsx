import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

export const UsuarioContext = createContext();

export default function UsuarioProvider({ children }) {
    const [usu_codigo, setUsu_codigo] = useState(() => {
        try {
            const u = localStorage.getItem('usuario_logado');
            return u ? JSON.parse(u).codigo || 0 : 0;
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
            return u ? JSON.parse(u).fun_logado || 0 : 0;
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
        setIsDarkTheme
    }), [usu_codigo, login, cod_funcionario, fun_categoria, isDarkTheme]);

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
