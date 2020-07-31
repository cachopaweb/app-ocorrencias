import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Container } from './styles';
import Logo from '../../assets/Icone_Portal.png';
import api from '../../services/api';
import { useUsuario } from '../../context/UsuarioContext';

function Login() {
    const [usuarios, setUsuarios] = useState([]);
    const { usu_codigo, setUsu_codigo, setLogin, setCod_funcionario } = useUsuario();
    const [usuarioLogin, setUsuarioLogin] = useState(usu_codigo)
    const [senha, SetSenha] = useState('');  
    const history = useHistory();
    
    async function getUsuarios(){
        const response = await api.get('/usuarios');
        setUsuarios(response.data);
    }

    useEffect(()=>{
      getUsuarios()
    }, []);
     
    async function fazerLogin(event){
        event.preventDefault();
        const indexUsuario = document.getElementById('usuarios').selectedIndex;
        const login_usu = usuarios[indexUsuario].login;
        const codigoUsu = parseInt(usuarios[indexUsuario].usu_codigo);
        const fun_codigo = parseInt(usuarios[indexUsuario].codigo);        
        const login = {
            login: login_usu,
            senha: senha
        }
        const response = await api.post('/login', JSON.stringify(login));
        if (!response.data.error){
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
            setLogin(login_usu);
            history.push('/ocorrencias')          
        }else{
            alert('Usuario nao permitido!')
            history.replace('/');
        }
    }

    return (   
        <Container>
            <form onSubmit={fazerLogin}>
                <img src={Logo} alt="Portal logo" />                        
                <select name="usuarios" id="usuarios" value={usuarioLogin} onChange={(e)=> setUsuarioLogin(e.target.value)}>
                    {
                        usuarios.length ?
                            usuarios.map(usu => <option key={usu.codigo} value={usu.usu_codigo}>{usu.login}</option>)
                        :  <h3>Carregando usuarios</h3>
                    }
                </select>
                <input
                    type="password"
                    placeholder="Senha"
                    onChange={e => SetSenha(e.target.value) }
                />
                <hr />
                <button type="submit">Fazer login</button>
            </form>
        </Container>        
    );
}

export default Login;