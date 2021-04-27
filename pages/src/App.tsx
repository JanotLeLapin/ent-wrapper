import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './Header';
import Docs from './Docs';
import Home from './Home';

const App = () => (
  <div>
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/docs" component={Docs} />
        <Route exact path="/docs/:type" component={Docs} />
        <Route path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;
