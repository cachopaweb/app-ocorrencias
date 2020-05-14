import api from './api';

const isAuthenticated = async (usuario, senha) => {
    const login_usuario = JSON.parse(localStorage.getItem('login_usuario'));
    if (login_usuario){
        return true;        
    }else{
        const login = {
            login: usuario,
            senha: senha
        }
        const response = await api.post('/login', JSON.stringify(login));
        if (!response.error){
            //guarda no local storage
            localStorage.setItem('login_usuario', JSON.stringify(login));
            return true;
        }else{
            return false;
        }
    }
};

export default isAuthenticated;