import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Logo from '../../assets/Icone_Portal.png';
import api from '../../services/api';
import { useUsuario } from '../../context/UsuarioContext';

function Login() {
    const [usuarios, setUsuarios] = useState([]);
    const { usu_codigo, setUsu_codigo, setLogin, setCod_funcionario, setFunCategoria, } = useUsuario();
    const [usuarioLogin, setUsuarioLogin] = useState(usu_codigo)
    const [senha, SetSenha] = useState('');
    const history = useHistory();

    async function getUsuarios() {
        const response = await api.get('/usuarios');
        setUsuarios(response.data);
    }

    useEffect(() => {
        getUsuarios()
    }, []);

    async function fazerLogin(event) {
        event.preventDefault();
        const indexUsuario = document.getElementById('usuarios').selectedIndex;
        const login_usu = usuarios[indexUsuario].login;
        const codigoUsu = parseInt(usuarios[indexUsuario].usu_codigo);
        const fun_codigo = parseInt(usuarios[indexUsuario].codigo);
        const categoria = usuarios[indexUsuario].categoria;
        const login = {
            login: login_usu,
            senha: senha
        }
        const response = await api.post('/login', JSON.stringify(login));
        if (!response.data.error) {
            //guarda no local storage
            const usuario = {
                codigo: codigoUsu,
                nome: login_usu
            }
            localStorage.setItem('usuario_logado', JSON.stringify(usuario));
            //useUsuario
            setUsu_codigo(codigoUsu);
            // console.log("funcionario: "+fun_codigo)
            setCod_funcionario(fun_codigo);
            setFunCategoria(categoria);
            setLogin(login_usu);
            history.push('/')
        } else {
            alert('Usuario nao permitido!')
            history.replace('/login');
        }
    }

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <form onSubmit={fazerLogin} className="rounded-lg shadow-[0_2px_2px_2px_rgba(0,0,0,0.15),0_10px_20px_-10px_rgba(0,0,0,0.1)] w-[400px] bg-white p-[20px] flex flex-col items-center">
                <img src={Logo} alt="Portal logo" className="w-[64px] mt-[10px] mb-[40px]" />
                <select name="usuarios" id="usuarios" value={usuarioLogin} onChange={(e) => setUsuarioLogin(e.target.value)} className="h-[46px] mb-[15px] px-[20px] text-[#777] text-[15px] w-full border border-[#ddd]">
                    {
                        usuarios.length ?
                            usuarios.map(usu => <option key={usu.codigo} value={usu.usu_codigo}>{usu.login}</option>)
                            : <h3>Carregando usuarios</h3>
                    }
                </select>
                <input
                    type="password"
                    placeholder="Senha"
                    onChange={e => SetSenha(e.target.value)}
                    className="h-[46px] mb-[15px] px-[20px] text-[#777] text-[15px] w-full border border-[#ddd] placeholder:text-[#999]"
                />
                <hr className="my-[20px] border-0 border-b border-[#cdcdcd] w-full" />
                <button type="submit" className="text-white text-[16px] bg-[#323540] h-[56px] border border-transparent rounded-[5px] w-full hover:bg-white hover:text-[#323540] hover:border-[#323540] transition-colors">Fazer login</button>
            </form>
        </div>
    );
}

export default Login;