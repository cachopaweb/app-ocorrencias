import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  KanbanSquare, 
  ListTodo, 
  Users, 
  Timer, 
  UserCircle, 
  Settings,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: 'Meu Painel', icon: LayoutDashboard, path: '/' },
    { name: 'Dashboard', icon: BarChart2, path: '/dashboard', active: true },
    { name: 'Executivo', icon: BarChart2, path: '/executivo' },
    { name: 'Kanban', icon: KanbanSquare, path: '/kanban' },
    { name: 'Tarefas', icon: ListTodo, path: '/ocorrencias' },
    { name: 'Equipe', icon: Users, path: '/equipe' },
    { name: 'Sprints', icon: Timer, path: '/sprints' },
    { name: 'Meu Perfil', icon: UserCircle, path: '/perfil' },
    { name: 'Usuários', icon: Settings, path: '/usuarios' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0f25] text-white transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:w-64 flex flex-col`}>
      <div className="flex items-center justify-between p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Ocorrências</h1>
            <p className="text-xs text-slate-400">Portal</p>
          </div>
        </div>
        <button className="md:hidden text-gray-300" onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              item.active 
                ? 'bg-indigo-900/50 text-indigo-200 border border-indigo-500/20' 
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={18} className={item.active ? "text-indigo-400" : "text-slate-400"} />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

const Header = ({ setIsOpen }) => {
  return (
    <header className="bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 py-4">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden text-slate-500 hover:text-slate-700"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>
      <div className="flex items-center gap-4">
        {/* Placeholder for future header items like user avatar */}
      </div>
    </header>
  );
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header setIsOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
