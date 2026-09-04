import React, { useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Bell, 
  User, 
  LogOut, 
  MessageSquare, 
  PlusCircle, 
  CheckCheck, 
  KanbanSquare, 
  Calendar, 
  Clock, 
  FileCheck, 
  Users, 
  CircleDollarSign, 
  Receipt, 
  KeyRound, 
  FileSpreadsheet, 
  ExternalLink, 
  Layers,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useUsuario } from '../../context/UsuarioContext';
import useContrassenhaVencer from '../../Hooks/useContrassenha';
import LogoPortal from '../../assets/empresa_logo.png';

const navGroups = [
  {
    title: 'Atendimento',
    items: [
      { name: 'Ocorrências', path: '/', icon: MessageSquare },
      { name: 'Nova Ocorrência', path: '/create', icon: PlusCircle },
      { name: 'Finalizadas', path: '/ocorrenciasFinalizadas', icon: CheckCheck },
    ]
  },
  {
    title: 'Projetos & Gestão',
    items: [
      { name: 'Scrum', path: '/scrum', icon: Layers },
      { name: 'Quadro Kanban', path: '/QuadroKanban', icon: KanbanSquare },
      { name: 'Calendário', path: '/Calendario', icon: Calendar },
    ]
  },
  {
    title: 'Ordens de Serviço',
    items: [
      { name: 'Em Andamento', path: '/ordensAndamento', icon: Clock },
      { name: 'Entregues', path: '/ordensEntregues', icon: FileCheck },
    ]
  },
  {
    title: 'Comercial & Financeiro',
    items: [
      { name: 'Clientes', path: '/clientes', icon: Users },
      { name: 'A Receber', path: '/clientesReceber', icon: CircleDollarSign },
      { name: 'Recibos', path: '/recibos', icon: Receipt },
      { name: 'Licenças', path: '/licencas', icon: KeyRound },
    ]
  },
  {
    title: 'Utilitários',
    items: [
      { name: 'NCM', path: '/Ncm', icon: FileSpreadsheet },
      { name: 'Consulta MVA', external: 'https://consulta-mva.web.app/', icon: ExternalLink },
    ]
  },
];

const getPageTitle = (pathname) => {
  const titles = {
    '/': 'Painel de Ocorrências',
    '/create': 'Nova Ocorrência',
    '/ocorrenciasFinalizadas': 'Ocorrências Finalizadas',
    '/scrum': 'Projetos Scrum',
    '/quadroScrum': 'Quadro Scrum',
    '/create_projeto_scrum': 'Novo Projeto Scrum',
    '/retrospectiva': 'Retrospectiva Scrum',
    '/burndown': 'Gráfico Burndown',
    '/QuadroKanban': 'Quadro Kanban',
    '/Calendario': 'Calendário de Ordens e Ocorrências',
    '/ordensAndamento': 'Ordens em Andamento',
    '/ordensEntregues': 'Ordens Entregues',
    '/ordemDetalhe': 'Detalhe da Ordem de Serviço',
    '/aberturaOS': 'Abertura de Ordem de Serviço',
    '/clientes': 'Gestão de Clientes',
    '/clientesSemOcorrencias': 'Clientes Sem Ocorrências',
    '/clientesReceber': 'Clientes a Receber',
    '/contaReceber': 'Contas a Receber',
    '/recibos': 'Emissão de Recibos',
    '/licencas': 'Gestão de Licenças e Contrassenhas',
    '/Ncm': 'Consulta NCM',
  };
  return titles[pathname] || 'Portal de Ocorrências';
};

const Sidebar = ({ isOpen, setIsOpen, isCollapsed }) => {
  const location = useLocation();

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 bg-slate-900 dark:bg-slate-950 border-r border-slate-800 text-slate-300 transition-all duration-200 ease-in-out transform ${
      isOpen ? 'translate-x-0 w-60' : '-translate-x-full'
    } md:translate-x-0 md:static ${isCollapsed ? 'md:w-[68px]' : 'md:w-60'} flex flex-col shrink-0 select-none`}>
      {/* Brand Header */}
      {isCollapsed ? (
        <div className="flex items-center justify-center h-16 border-b border-slate-800/80 px-2">
          <Link
            to="/"
            className="p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors flex items-center justify-center group cursor-pointer"
            title="Ocorrências - Início"
          >
            <img src={LogoPortal} alt="Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-3 group min-w-0" onClick={() => setIsOpen(false)}>
            <img src={LogoPortal} alt="Logo" className="w-8 h-8 object-contain shrink-0 drop-shadow-sm" />
            <div className="truncate">
              <h1 className="font-bold text-sm text-white leading-tight tracking-tight">Ocorrências</h1>
              <p className="text-[11px] font-mono text-slate-400 truncate">Portal Corporativo</p>
            </div>
          </Link>
          <button 
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors cursor-pointer" 
            onClick={() => setIsOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Navigation Groups */}
      <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2 py-4' : 'px-3 py-4'} space-y-4 scrollbar-thin scrollbar-thumb-slate-800`}>
        {navGroups.map((group, gIndex) => (
          <div key={gIndex}>
            {isCollapsed ? (
              <div className="w-6 mx-auto h-px bg-slate-800/80 my-2" />
            ) : (
              <h2 className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                {group.title}
              </h2>
            )}
            <div className="space-y-0.5">
              {group.items.map((item, iIndex) => {
                const Icon = item.icon;
                if (item.external) {
                  return (
                    <a
                      key={iIndex}
                      href={item.external}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsOpen(false)}
                      title={isCollapsed ? item.name : undefined}
                      className={
                        isCollapsed
                          ? "flex items-center justify-center p-2.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative"
                          : "flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group"
                      }
                    >
                      {isCollapsed ? (
                        <>
                          <Icon size={18} className="text-slate-400 group-hover:text-slate-200 transition-colors" />
                          <span className="absolute left-full ml-3 px-2 py-1 rounded bg-slate-950 text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl border border-slate-800">
                            {item.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5">
                            <Icon size={16} className="text-slate-400 group-hover:text-slate-200 transition-colors" />
                            <span>{item.name}</span>
                          </div>
                          <ExternalLink size={13} className="text-slate-500 group-hover:text-slate-300" />
                        </>
                      )}
                    </a>
                  );
                }

                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={iIndex}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    title={isCollapsed ? item.name : undefined}
                    className={
                      isCollapsed
                        ? `flex items-center justify-center p-2.5 rounded-md transition-all duration-150 group relative ${
                            isActive 
                              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold shadow-xs' 
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
                          }`
                        : `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 ${
                            isActive 
                              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold shadow-xs' 
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
                          }`
                    }
                  >
                    {isCollapsed ? (
                      <>
                        <Icon size={18} className={isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"} />
                        <span className="absolute left-full ml-3 px-2 py-1 rounded bg-slate-950 text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl border border-slate-800">
                          {item.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2.5">
                          <Icon size={16} className={isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"} />
                          <span>{item.name}</span>
                        </div>
                        {isActive && <ChevronRight size={13} className="text-indigo-400" />}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

const Header = ({ setIsOpen, isCollapsed, toggleCollapse }) => {
  const history = useHistory();
  const location = useLocation();
  const { login, fun_categoria, isDarkTheme, setIsDarkTheme, setUsu_codigo } = useUsuario();
  const contrassenhasVencer = useContrassenhaVencer() || [];
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleClickContrassenhaVencer = () => {
    history.push({ pathname: '/licencas', state: { licencasVencer: contrassenhasVencer } });
  };

  const handleLogout = () => {
    localStorage.setItem('usuario_logado', '');
    setUsu_codigo(0);
    history.push('/login');
  };

  const currentTitle = getPageTitle(location.pathname);

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 px-4 sm:px-6 flex items-center justify-between transition-colors shrink-0 z-30">
      {/* Left side: Mobile Toggle, Desktop Collapse Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button 
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>
        <button
          className="hidden md:flex p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          onClick={toggleCollapse}
          title={isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"}
          aria-label="Alternar barra lateral"
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight">
          {currentTitle}
        </h1>
      </div>

      {/* Right side: Actions (Notifications, Theme Toggle, User Profile) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Contrassenha / License Notification */}
        <button 
          onClick={handleClickContrassenhaVencer}
          className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={contrassenhasVencer.length > 0 ? `${contrassenhasVencer.length} licenças a vencer` : "Licenças a vencer"}
          aria-label="Notificações de Licenças"
        >
          <Bell size={20} />
          {contrassenhasVencer.length > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
              {contrassenhasVencer.length}
            </span>
          )}
        </button>

        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={isDarkTheme ? "Alternar para modo claro" : "Alternar para modo escuro"}
          aria-label="Alternar tema"
        >
          {isDarkTheme ? (
            <Sun size={20} className="text-amber-400" />
          ) : (
            <Moon size={20} className="text-slate-600" />
          )}
        </button>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Menu do usuário"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              {login ? login.charAt(0).toUpperCase() : <User size={16} />}
            </div>
            <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
              {login || 'Usuário'}
            </span>
          </button>

          {/* User Dropdown Menu */}
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 border border-slate-100 dark:border-slate-700 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {login || 'Usuário'}
                  </p>
                  {fun_categoria && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize truncate mt-0.5">
                      {fun_categoria.toLowerCase()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors font-medium"
                >
                  <LogOut size={16} />
                  <span>Sair do Sistema</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        isCollapsed={sidebarCollapsed}
        toggleCollapse={toggleCollapse}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          setIsOpen={setSidebarOpen} 
          isCollapsed={sidebarCollapsed}
          toggleCollapse={toggleCollapse}
        />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}
