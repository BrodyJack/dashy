import React, { Component } from 'react';

export default class Home extends Component {
  componentDidMount = () => {
    const { hash } = this.props.location;
    if (hash) { 
      window.localStorage.clear('spotifyKey');

      let urlhash = hash.substring(1);
      let params = {};
      urlhash.split('&').map(item => {
          let temp = item.split('=');
          params[temp[0]] = temp[1];
      });
      window.localStorage.setItem('spotifyKey', params.access_token);
      this.props.history.push('/spotify');
    }
  }

  render() {
    return (
      <div>
        <span>Home</span>
      </div>
    );
  }
}