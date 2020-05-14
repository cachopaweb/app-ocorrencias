import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import Ocorrencia from '../componentes/Ocorrencias';
import createOcorrencia from '../componentes/CreateOcorrencias';
import Login from '../componentes/Login';

function Routes() {
  return (
    <Router>
        <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/ocorrencia" component={Ocorrencia} />
            <Route path="/create" component={createOcorrencia} />
        </Switch>
    </Router>
  )
}

export default Routes;