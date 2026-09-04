import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Lock, User, LogIn, ShieldCheck, Sparkles } from 'lucide-react';

import Logo from '../../assets/Icone_Portal.png';
import api from '../../services/api';
import { useUsuario } from '../../context/UsuarioContext';
import { Input, Select } from '../../componentes/Input';
import Button from '../../componentes/Button';

function Login() {
  const [usuarios, setUsuarios] = useState([]);
  const { usu_codigo, setUsu_codigo, setLogin, setCod_funcionario, setFunCategoria } = useUsuario();
  const [usuarioLogin, setUsuarioLogin] = useState(usu_codigo);
  const [senha, SetSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const history = useHistory();

  async function getUsuarios() {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data || []);
      if (response.data && response.data.length > 0 && !usuarioLogin) {
        setUsuarioLogin(response.data[0].usu_codigo);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  }

  useEffect(() => {
    getUsuarios();
  }, []);

  async function fazerLogin(event) {
    event.preventDefault();
    const elUsuarios = document.getElementById('usuarios');
    const indexUsuario = elUsuarios ? elUsuarios.selectedIndex : 0;
    
    if (!usuarios || usuarios.length === 0 || !usuarios[indexUsuario]) {
      alert('Nenhum usuário selecionado ou lista de usuários vazia.');
      return;
    }

    const login_usu = usuarios[indexUsuario].login;
    const codigoUsu = parseInt(usuarios[indexUsuario].usu_codigo, 10);
    const fun_codigo = parseInt(usuarios[indexUsuario].codigo, 10);
    const categoria = usuarios[indexUsuario].categoria;
    const login = {
      login: login_usu,
      senha: senha,
    };

    setCarregando(true);
    try {
      const response = await api.post('/login', JSON.stringify(login));
      if (!response.data.error) {
        // Guarda no local storage
        const usuario = {
          codigo: codigoUsu,
          nome: login_usu,
        };
        localStorage.setItem('usuario_logado', JSON.stringify(usuario));

        // Atualiza contexto
        setUsu_codigo(codigoUsu);
        setCod_funcionario(fun_codigo);
        setFunCategoria(categoria);
        setLogin(login_usu);
        history.push('/');
      } else {
        alert('Usuário não permitido ou senha inválida!');
        history.replace('/login');
      }
    } catch (error) {
      alert('Erro ao realizar login. Verifique sua conexão e tente novamente.');
      history.replace('/login');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden transition-colors">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-slate-400/10 dark:bg-slate-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Central */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-8 flex flex-col items-center relative z-10 transition-all">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 shadow-sm mb-3.5">
            <img
              src={Logo}
              alt="Portal logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Portal de Ocorrências
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Entre com suas credenciais para acessar o sistema
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={fazerLogin} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="usuarios"
              className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              Usuário
            </label>
            <Select
              name="usuarios"
              id="usuarios"
              value={usuarioLogin}
              onChange={(e) => setUsuarioLogin(e.target.value)}
              className="h-11 text-sm bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
            >
              {usuarios.length ? (
                usuarios.map((usu) => (
                  <option key={usu.codigo || usu.usu_codigo} value={usu.usu_codigo}>
                    {usu.login}
                  </option>
                ))
              ) : (
                <option value="">Carregando usuários...</option>
              )}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="senha"
              className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Senha
            </label>
            <Input
              id="senha"
              type="password"
              placeholder="Digite sua senha..."
              value={senha}
              onChange={(e) => SetSenha(e.target.value)}
              className="h-11 text-sm bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
              required
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="indigo"
              disabled={carregando || usuarios.length === 0}
              className="w-full h-11 text-base font-semibold shadow-md shadow-indigo-500/20"
              Icon={LogIn}
              nome={carregando ? 'Entrando...' : 'Fazer Login'}
            />
          </div>
        </form>

        {/* Rodapé de Segurança */}
        <div className="flex items-center gap-1.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Acesso restrito e autenticado</span>
        </div>
      </div>
    </div>
  );
}

export default Login;