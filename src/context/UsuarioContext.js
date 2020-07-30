import React, { createContext, useState, useContext } from 'react';

export const UsuarioContext = createContext();

export default function UsuarioProvider({ children }){     
    let codigo_local = 0;
    let nome_local = '';
    if (localStorage.getItem('usuario_logado')) {
        codigo_local = JSON.parse(localStorage.getItem('usuario_logado')).codigo;
        nome_local = JSON.parse(localStorage.getItem('usuario_logado')).nome;
    }

    const [codigo, setCodigo] = useState(codigo_local);
    const [nome, setNome] = useState(nome_local);
    const [funcionario, setFuncionario] = useState(0);

    
    return (
        <UsuarioContext.Provider value={{ 
            codigo,
            setCodigo,
            nome,
            setNome,
            funcionario,
            setFuncionario
         }}>
            {children}
        </UsuarioContext.Provider>
    );
}

export function useUsuario(){
    const context = useContext(UsuarioContext);
    const { codigo, setCodigo, nome, setNome, funcionario, setFuncionario } = context;    
    if (codigo > 0) {
        localStorage.setItem('usuario_logado', JSON.stringify({
            codigo: codigo,
            nome: nome
        }))
    }
    return { codigo, setCodigo, nome, setNome, funcionario, setFuncionario };
}
