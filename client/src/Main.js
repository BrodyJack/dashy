import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import Spotify from './Spotify';
import Food from './Food';

const Main = () => (
  <div>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/spotify" component={Spotify} />
      <Route path="/food" component={Food} />
    </Switch>
  </div>
);

export default Main;
