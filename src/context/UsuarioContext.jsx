import React, { createContext, useState, useContext, useEffect } from 'react';

export const UsuarioContext = createContext();

export default function UsuarioProvider({ children }) {
    let codigo_local = 0;
    let nome_local = '';
    let fun_logado = 0;
    let categoria = '';
    let darkTheme_local = false;
    if (localStorage.getItem('usuario_logado')) {
        codigo_local = JSON.parse(localStorage.getItem('usuario_logado')).codigo;
        nome_local = JSON.parse(localStorage.getItem('usuario_logado')).nome;
        fun_logado = JSON.parse(localStorage.getItem('usuario_logado')).fun_logado
        categoria = JSON.parse(localStorage.getItem('usuario_logado'))?.fun_categoria
        darkTheme_local = JSON.parse(localStorage.getItem('usuario_logado')).darkTheme ?? false;
    }

    const [usu_codigo, setUsu_codigo] = useState(codigo_local);
    const [login, setLogin] = useState(nome_local);
    const [cod_funcionario, setCod_funcionario] = useState(fun_logado);
    const [fun_categoria, setFunCategoria] = useState(categoria);
    const [isDarkTheme, setIsDarkTheme] = useState(darkTheme_local);

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

    return (
        <UsuarioContext.Provider value={{
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
        }}>
            {children}
        </UsuarioContext.Provider>
    );
}

export function useUsuario() {
    const context = useContext(UsuarioContext);
    return context;
}
