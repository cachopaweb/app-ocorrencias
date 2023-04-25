import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import React from 'react';
import Ocorrencia from '../pages/Ocorrencias';
import createOcorrencia from '../pages/CreateOcorrencias';
import Login from '../pages/Login';
import isAuthenticated from '../services/auth';
import Clientes from '../pages/Clientes';
import { useUsuario } from '../context/UsuarioContext';
import AberturaOS from '../pages/AberturaOS';
import ContaReceber from '../pages/ContaReceber';
import OcorrenciasFinalizadas from '../pages/OcorrenciasFinalizadas';
import OrdensAndamento from '../pages/OrdensAndamento';
import OrdemDetalhe from '../pages/OrdemDetalhe';
import Licencas from '../pages/Licencas';
import Scrum from '../pages/Scrum';
import QuadroScrum from '../componentes/QuadroScrum';
import Burndown from '../componentes/Burndown';
import Create_Projeto_Scrum from '../pages/Create_Projeto_Scrum';
import Retrospectiva from '../pages/Retrospectiva';
import QuadroKanban from '../componentes/QuadroKanban';
import Calendario from '../componentes/Calendario';
import Ncm from '../pages/Ncm';
import OrdensEntregues from '../pages/OrdensEntregues';
import ClientesSemOcorrencias from '../pages/ClientesSemOcorrencias';


const PrivateRoute = ({ component: Component, ...rest }) => {
  const { usu_codigo } = useUsuario();
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated(usu_codigo) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
}


function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <PrivateRoute path="/ocorrencias" component={Ocorrencia} />
        <PrivateRoute path="/create" component={createOcorrencia} />
        <PrivateRoute path="/clientes" component={Clientes} />
        <PrivateRoute path="/clientesSemOcorrencias" component={ClientesSemOcorrencias} />
        <PrivateRoute path="/aberturaOS" component={AberturaOS} />
        <PrivateRoute path="/contaReceber" component={ContaReceber} />
        <PrivateRoute path='/ocorrenciasFinalizadas' component={OcorrenciasFinalizadas} />
        <PrivateRoute path='/ordensAndamento' component={OrdensAndamento} />
        <PrivateRoute path='/ordensEntregues' component={OrdensEntregues} />
        <PrivateRoute path='/ordemDetalhe' component={OrdemDetalhe} />
        <PrivateRoute path='/licencas' component={Licencas} />
        <PrivateRoute path='/scrum' component={Scrum} />
        <PrivateRoute path='/quadroScrum' component={QuadroScrum} />
        <PrivateRoute path='/burndown' component={Burndown} />
        <PrivateRoute path='/create_projeto_scrum' component={Create_Projeto_Scrum} />
        <PrivateRoute path='/retrospectiva' component={Retrospectiva} />
        <PrivateRoute path='/QuadroKanban' component={QuadroKanban} />
        <PrivateRoute path='/Calendario' component={Calendario} />
        <PrivateRoute path='/Ncm' component={Ncm} />
        <Route path="*" component={() => <h1>Pagina nao encontrada</h1>} />
      </Switch>
    </Router>
  )
}

export default Routes;