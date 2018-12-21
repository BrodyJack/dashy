import React, { Component } from 'react';
import './App.css';

import Header from './Header';
import Main from './Main';

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "No name set"
    };
  }

  handleNameChange = (name) => {
    this.setState({ username: name });
  }

  render() {
    return (
      <div>
        <Header username={this.state.username}/>
        <Main username={this.state.username} changeName={this.handleNameChange}/>
      </div>
    );
  }
}

export default AppContainer;
