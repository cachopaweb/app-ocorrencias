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

const PrivateRoute = ({ component: Component, ...rest }) => {
  const {codigo } = useUsuario();
  return(
    <Route
      {...rest}
      render={props =>
        isAuthenticated(codigo) ? (
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
            <PrivateRoute path="/aberturaOS" component={AberturaOS} />
            <PrivateRoute path="/contaReceber" component={ContaReceber} />
            <PrivateRoute path='/ocorrenciasFinalizadas' component={OcorrenciasFinalizadas} />
            <PrivateRoute path='/ordensAndamento' component={OrdensAndamento} />
            <PrivateRoute path='/ordemDetalhe' component={OrdemDetalhe} />
            <PrivateRoute path='/licencas' component={Licencas} />
            <PrivateRoute path='/scrum' component={Scrum} />
            <PrivateRoute path='/quadroScrum' component={QuadroScrum} />            
            <PrivateRoute path='/burndown' component={Burndown} />            
            <Route path="*" component={() => <h1>Pagina nao encontrada</h1>} />
        </Switch>
    </Router>
  )
}

export default Routes;