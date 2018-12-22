import React, { Component } from 'react';
import './App.css';

import Header from './Header';
import Main from './Main';

import setupIO from './socketio/setup';
import setPlayerListeners from './socketio/player';

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "No name set",
      currentRoom: "",
      socket: null,
      player: null,
      pinged: false,
    };
  }

  componentDidMount = () => {
    let socket = setupIO(this.socketStateHandler);
    this.setState({ socket: socket });
  }
  
  handleNameChange = (name) => this.setState({ username: name });

  handleRoomChange = (room) => this.setState({ currentRoom: room });

  socketStateHandler = (stateObject) => this.setState(stateObject);

  playerStateHandler = (player) => {
    const { socket } = this.state;
    this.setState({ player: player });
    setPlayerListeners(socket, player);
  }

  render() {
    const state = this.state;
    console.log(state);
    const handlers = { 
      handleNameChange: this.handleNameChange,
      handleRoomChange: this.handleRoomChange,
      socketStateHandler: this.socketStateHandler,
      playerStateHandler: this.playerStateHandler
    };

    return (
      <div>
        <Header { ...state } { ...handlers }/>
        <Main { ...state } { ...handlers }/>
      </div>
    );
  }
}

export default AppContainer;
