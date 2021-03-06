import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import Spotify from './Spotify';
import Food from './Food';
import Chat from './Chat';
import Info from './Info';

const Main = (props) => (
    <div>
      <Switch>
        <Route exact path='/' render={routeProps => <Home { ...routeProps } { ...props }/>}/>
        <Route path='/spotify' render={routeProps => <Spotify { ...routeProps } { ...props }/>}/>
        <Route path='/food' render={routeProps => <Food { ...routeProps } { ...props }/>}/>
        <Route path='/chat' render={routeProps => <Chat { ...routeProps } { ...props }/>}/>
        <Route path='/info' render={routeProps => <Info { ...routeProps } { ...props }/>}/>
      </Switch>
    </div>
);

export default Main;