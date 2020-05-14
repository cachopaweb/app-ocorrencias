import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Container } from './styles';
import Logo from '../../assets/Icone_Portal.png';
import api from '../../services/api';
import isAuthenticated from '../../services/auth';
import { UsuarioContext } from '../../context/UsuarioContext';

function Login() {
    const [usuarios, setUsuarios] = useState([]);
    const [senha, SetSenha] = useState('');  
    const [usuarioLogado, setUsuarioLogado] = useState(0);
    const [login, setLogin] = useState('');
    const { actions } = useContext(UsuarioContext);
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
        const codigoUsu = parseInt(usuarios[indexUsuario].codigo);
        const isAuth = await isAuthenticated(login_usu, senha);
        if (isAuth){
            setUsuarioLogado(codigoUsu);
            setLogin(login_usu);
            actions.setUser({
                codigo: codigoUsu,
                nome: login_usu     
            });
            history.push('/ocorrencia')
        }else{
            alert('Usuario nao permitido')
            history.replace('/');
        }
    }

    return (    
        <Container>
            <form onSubmit={fazerLogin}>
                <img src={Logo} alt="Portal logo" />                        
                <select name="usuarios" id="usuarios">
                    {
                        usuarios.length ?
                            usuarios.map(usu => <option key={usu.codigo} value={usu.codigo}>{usu.login}</option>)
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