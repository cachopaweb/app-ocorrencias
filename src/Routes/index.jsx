import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import isAuthenticated from '../services/auth';
import { useUsuario } from '../context/UsuarioContext';
import Layout from '../componentes/Layout';

const Login = lazy(() => import('../pages/Login'));
const Ocorrencia = lazy(() => import('../pages/Ocorrencias'));
const createOcorrencia = lazy(() => import('../pages/CreateOcorrencias'));
const Clientes = lazy(() => import('../pages/Clientes'));
const ClientesSemOcorrencias = lazy(() => import('../pages/ClientesSemOcorrencias'));
const AberturaOS = lazy(() => import('../pages/AberturaOS'));
const ContaReceber = lazy(() => import('../pages/ContaReceber'));
const OcorrenciasFinalizadas = lazy(() => import('../pages/OcorrenciasFinalizadas'));
const OrdensAndamento = lazy(() => import('../pages/OrdensAndamento'));
const OrdensEntregues = lazy(() => import('../pages/OrdensEntregues'));
const OrdemDetalhe = lazy(() => import('../pages/OrdemDetalhe'));
const Licencas = lazy(() => import('../pages/Licencas'));
const Scrum = lazy(() => import('../pages/Scrum'));
const QuadroScrum = lazy(() => import('../componentes/QuadroScrum'));
const Burndown = lazy(() => import('../componentes/Burndown'));
const Create_Projeto_Scrum = lazy(() => import('../pages/Create_Projeto_Scrum'));
const Retrospectiva = lazy(() => import('../pages/Retrospectiva'));
const QuadroKanban = lazy(() => import('../componentes/QuadroKanban'));
const Calendario = lazy(() => import('../componentes/Calendario'));
const Ncm = lazy(() => import('../pages/Ncm'));
const GeraRecibos = lazy(() => import('../pages/Recibos'));
const ClientesReceber = lazy(() => import('../pages/ClientesReceber'));

const PageLoader = () => (
  <div className="w-full flex items-center justify-center py-20 text-slate-400 dark:text-slate-500 font-mono text-xs gap-2">
    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    <span>Carregando...</span>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-600 dark:text-rose-400 mb-3 border border-rose-200 dark:border-rose-900/50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            Ops, ocorreu um erro ao carregar esta página
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-md font-mono">
            {this.state.error?.message || 'Erro inesperado'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Recarregar Página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Routes() {
  const { usu_codigo } = useUsuario();
  const auth = isAuthenticated(usu_codigo);

  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route exact path="/login" component={Login} />
            
            <Route path="*">
              {auth ? (
                <Layout>
                  <ErrorBoundary>
                    <Suspense fallback={<PageLoader />}>
                      <Switch>
                    <Route exact path="/" component={Ocorrencia} />
                    <Route path="/create" component={createOcorrencia} />
                    <Route path="/clientes" component={Clientes} />
                    <Route path="/clientesSemOcorrencias" component={ClientesSemOcorrencias} />
                    <Route path="/aberturaOS" component={AberturaOS} />
                    <Route path="/contaReceber" component={ContaReceber} />
                    <Route path="/ocorrenciasFinalizadas" component={OcorrenciasFinalizadas} />
                    <Route path="/ordensAndamento" component={OrdensAndamento} />
                    <Route path="/ordensEntregues" component={OrdensEntregues} />
                    <Route path="/ordemDetalhe" component={OrdemDetalhe} />
                    <Route path="/licencas" component={Licencas} />
                    <Route path="/scrum" component={Scrum} />
                    <Route path="/quadroScrum" component={QuadroScrum} />
                    <Route path="/burndown" component={Burndown} />
                    <Route path="/create_projeto_scrum" component={Create_Projeto_Scrum} />
                    <Route path="/retrospectiva" component={Retrospectiva} />
                    <Route path="/QuadroKanban" component={QuadroKanban} />
                    <Route path="/Calendario" component={Calendario} />
                    <Route path="/Ncm" component={Ncm} />
                    <Route path="/recibos" component={GeraRecibos} />
                    <Route path="/clientesReceber" component={ClientesReceber} />
                    <Route path="*" component={() => <h1 className="p-8 text-center text-slate-500 font-mono text-sm">Página não encontrada</h1>} />
                  </Switch>
                    </Suspense>
                  </ErrorBoundary>
                </Layout>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default Routes;