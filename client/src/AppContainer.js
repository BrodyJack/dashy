import React, { Component } from 'react';
import './App.css';

import Header from './Header';
import Main from './Main';

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "No name set",
      currentRoom: "",
    };
  }

  handleNameChange = (name) => {
    this.setState({ username: name });
  }

  handleRoomChange = (room) => {
    this.setState({ currentRoom: room });
  }

  render() {
    const state = this.state;
    const handlers = { 
      handleNameChange: this.handleNameChange,
      handleRoomChange: this.handleRoomChange
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
