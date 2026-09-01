import React, { useState } from 'react';
import { useUsuario } from '../../context/UsuarioContext';
import { useHistory } from 'react-router-dom';
import useContrassenhaVencer from '../../Hooks/useContrassenha';

import { useStyles } from './styles';
import { 
    MdMenu, MdDashboard, MdAccountCircle, MdExitToApp, MdNotifications, 
    MdMoreVert, MdToday, MdSpeakerNotes, MdSpeakerNotesOff, MdWork, 
    MdDoneAll, MdViewList, MdAssignmentInd, MdScreenLockLandscape,
    MdCloudUpload, MdFormatListBulleted, MdMonetizationOn, MdAttachMoney
} from 'react-icons/md';

function Header({ title }) {
  const history = useHistory();
  const classes = useStyles();
  const { usu_codigo, login, isDarkTheme, setIsDarkTheme, setUsu_codigo } = useUsuario();
  const [showMenu, setshowMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const contrassenhasVencer = useContrassenhaVencer();

  const handleClickContrassenhaVencer = () => {
    history.push({ pathname: '/licencas', state: { licencasVencer: contrassenhasVencer } });
  }

  const logout = () => {
    localStorage.setItem('usuario_logado', '');
    setUsu_codigo(0);
  }

  return (
    <div className={`relative flex items-center bg-blue-600 text-white h-16 px-4 shadow-md w-full z-40`}>
      {/* Drawer Overlay */}
      {showMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setshowMenu(false)}>
              <div className="fixed top-0 left-0 h-full w-64 bg-white text-gray-800 shadow-xl z-50 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="py-2">
                      <ul>
                          <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => {setshowMenu(false); history.push('/QuadroKanban')}}><MdDashboard className="mr-3 text-gray-500" size={24} /> Quadro Kanban</li>
                          <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => {setshowMenu(false); history.push('/Calendario')}}><MdToday className="mr-3 text-gray-500" size={24} /> Calendário</li>
                          <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => {setshowMenu(false); history.push('/')}}><MdSpeakerNotes className="mr-3 text-gray-500" size={24} /> Ocorrências</li>
                          <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => {setshowMenu(false); history.push('/ocorrenciasFinalizadas')}}><MdSpeakerNotesOff className="mr-3 text-gray-500" size={24} /> Ocorrências Finalizadas</li>
                          <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => {setshowMenu(false); history.push('/ordensAndamento')}}><MdWork className="mr-3 text-gray-500" size={24} /> Ordens Em Andamento</li>
                          <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => {setshowMenu(false); history.push('/ordensEntregues')}}><MdDoneAll className="mr-3 text-gray-500" size={24} /> Ordens Entregues</li>
                          <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => {setshowMenu(false); history.push('/scrum')}}><MdViewList className="mr-3 text-gray-500" size={24} /> Scrum</li>
                      </ul>
                      <div className="border-t my-2"></div>
                      <ul>
                          <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => {setshowMenu(false); history.push('/clientes')}}><MdAssignmentInd className="mr-3 text-gray-500" size={24} /> Clientes</li>
                          <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => {setshowMenu(false); history.push('/clientesSemOcorrencias')}}><MdAssignmentInd className="mr-3 text-gray-500" size={24} /> Clientes Sem Ocorrências</li>
                          <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => {setshowMenu(false); history.push('/clientesReceber')}}><MdMonetizationOn className="mr-3 text-gray-500" size={24} /> Clientes a Receber</li>
                          <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => {setshowMenu(false); history.push('/recibos')}}><MdAttachMoney className="mr-3 text-gray-500" size={24} /> Recibos</li>
                          <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => {setshowMenu(false); history.push('/licencas')}}><MdScreenLockLandscape className="mr-3 text-gray-500" size={24} /> Licenças</li>
                      </ul>
                      <div className="border-t my-2"></div>
                      <ul>
                          <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => {setshowMenu(false); history.push('/Ncm')}}><MdCloudUpload className="mr-3 text-gray-500" size={24} /> Ncm</li>
                      </ul>
                      <div className="border-t my-2"></div>
                      <ul>
                          <a href="https://consulta-mva.web.app/" target="_blank" rel="noreferrer" onClick={() => setshowMenu(false)}>
                            <li className="flex items-center px-4 py-3 hover:bg-gray-100 cursor-pointer"><MdFormatListBulleted className="mr-3 text-gray-500" size={24} /> mva</li>
                          </a>
                      </ul>
                  </div>
              </div>
          </div>
      )}

      {/* App Bar Content */}
      <button onClick={() => setshowMenu(true)} className="p-2 mr-2 rounded-full hover:bg-blue-700 transition">
          <MdMenu size={24} />
      </button>
      <div className="text-lg font-semibold truncate flex-1">
          {title}
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center space-x-4">
          <label className="flex items-center cursor-pointer">
              <span className="mr-2 text-sm">{isDarkTheme ? 'Tema escuro' : 'Tema claro'}</span>
              <input type="checkbox" className="hidden" checked={isDarkTheme} onChange={() => setIsDarkTheme(!isDarkTheme)} />
              <div className={`w-10 h-5 rounded-full p-1 flex items-center ${isDarkTheme ? 'bg-gray-800' : 'bg-blue-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${isDarkTheme ? 'translate-x-4' : ''}`}></div>
              </div>
          </label>
          <button onClick={handleClickContrassenhaVencer} className="relative p-2 rounded-full hover:bg-blue-700 transition" aria-label={`Vc tem ${contrassenhasVencer.length} novas notificações`}>
              <MdNotifications size={24} />
              {contrassenhasVencer.length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-xs w-4 h-4 rounded-full flex items-center justify-center">{contrassenhasVencer.length}</span>
              )}
          </button>
          <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-blue-700 transition relative">
                  <MdAccountCircle size={24} />
              </button>
              {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setIsMenuOpen(false)}>{usu_codigo > 0 ? login : 'Usuário não logado'}</div>
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center" onClick={logout}><MdExitToApp className="mr-2" /> Sair</div>
                  </div>
              )}
          </div>
      </div>

      {/* Mobile Actions */}
      <div className="md:hidden flex items-center">
          <div className="relative">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-full hover:bg-blue-700 transition">
                  <MdMoreVert size={24} />
              </button>
              {isMobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 hover:bg-gray-100 flex items-center justify-between cursor-pointer" onClick={() => setIsDarkTheme(!isDarkTheme)}>
                          <span>{isDarkTheme ? 'Tema escuro' : 'Tema claro'}</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer" onClick={() => {setIsMobileMenuOpen(false); handleClickContrassenhaVencer()}}>
                          <div className="relative mr-2">
                              <MdNotifications size={20} />
                              {contrassenhasVencer.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-3 h-3 rounded-full flex items-center justify-center">{contrassenhasVencer.length}</span>}
                          </div>
                          Notificações
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                          <MdAccountCircle className="mr-2" size={20} />
                          {usu_codigo > 0 ? login : 'Usuário não logado'}
                      </div>
                      {isMenuOpen && (
                          <div className="border-t">
                              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-red-600" onClick={logout}><MdExitToApp className="mr-2" /> Sair</div>
                          </div>
                      )}
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}

export default Header;