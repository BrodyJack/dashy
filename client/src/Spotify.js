import React, { Component } from 'react';
import io from 'socket.io-client';

export default class Spotify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: 'placeholder',
      searchResults: '',
      showingResults: false,
      token: '',
      deviceId: '',
      loggedIn: false,
      error: '',
      trackName: 'Track Name',
      artistName: 'Artist Name',
      albumName: 'Album Name',
      playing: false,
      position: 0,
      duration: 0,
      loading: false,
      pinged: false
    };

    this.playerCheckInterval = null;
    this.socket = null;
  }

  componentDidMount = () => {
    // put socket io code in here later
  };

  submitQuery = event => {
    event.preventDefault();
    let url = new URL('http://localhost:3001/api/spotify/search');
    let params = { searchCriteria: this.state.searchValue };
    url.search = new URLSearchParams(params);
    fetch(url)
      .then(resp => {
        return resp.json();
      })
      .then(json => {
        let numResults = json.body.tracks.items.length;
        console.log(JSON.stringify(json.body.tracks.items));
        this.setState({
          searchResults: `Results found: ${numResults}`,
          showingResults: true
        });
      })
      .catch(err => {
        // lol yeah right
      });
  };

  handleLogin = () => {
    if (this.state.token !== '') {
      this.setState({ loading: true });
      // start attempting to instantiate the player
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }
  };

  createEventHandlers = () => {
    this.player.on('initialization_error', e => {
      console.error(e);
    });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    this.player.on('account_error', e => {
      console.error(e);
    });
    this.player.on('playback_error', e => {
      console.error(e);
    });
    this.player.on('player_state_changed', state =>
      this.autoUpdateState(state)
    );
    this.player.on('ready', data => {
      let { device_id } = data;
      console.log('Ready!');
      this.setState({ loggedIn: true, deviceId: device_id, loading: false });
    });
  };

  autoUpdateState = state => {
    if (state !== null) {
      // null state is sent when music stops
      const {
        current_track: currentTrack,
        position,
        duration
      } = state.track_window;

      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(', ');
      const playing = !state.paused;

      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        playing
      });
    }
  };

  checkForPlayer = () => {
    const { token } = this.state;

    if (window.Spotify !== null) {
      clearInterval(this.playerCheckInterval);

      this.player = new window.Spotify.Player({
        name: 'Personal Spotify Player',
        getOAuthToken: cb => {
          cb(token);
        }
      });

      // Create event handlers
      this.createEventHandlers();

      // connect
      this.player.connect();
    }
  };

  onPrevClick = () => {
    this.player.previousTrack();
  };

  onToggleClick = () => {
    this.player.togglePlay();
  };

  onNextClick = () => {
    this.player.nextTrack();
  };

  render() {
    const {
      albumName,
      artistName,
      trackName,
      loading,
      loggedIn,
      playing,
      searchResults,
      searchValue,
      showingResults,
      token
    } = this.state;

    return (
      <div style={styles.spotify}>
        <div style={styles.spotify.search}>
          <input
            type="text"
            value={searchValue}
            onChange={event =>
              this.setState({ searchValue: event.target.value })
            }
            style={styles.spotify.search.input}
          />
          <button
            type="button"
            onClick={this.submitQuery}
            style={styles.spotify.search.button}
          >
            Search
          </button>
          <SearchResults show={showingResults} content={searchResults} />
        </div>
        <br />
        <br />
        {loggedIn ? (
          <div style={styles.spotify.search}>
            <p>{trackName}</p>
            <p>{artistName}</p>
            <p>{albumName}</p>
            <div>
              <button onClick={this.onPrevClick}>
                <i class="material-icons">skip_previous</i>
              </button>
              <button onClick={this.onToggleClick}>
                <i class="material-icons">
                  {' '}
                  {playing ? 'pause' : 'play_arrow'}
                </i>
              </button>
              <button onClick={this.onNextClick}>
                <i class="material-icons">skip_next</i>
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.spotify.search}>
            <p>
              Enter your Spotify access token. Get it from{' '}
              <a href="https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/#authenticating-with-spotify">
                here
              </a>
              .
            </p>
            <input
              type="text"
              value={token}
              onChange={event => this.setState({ token: event.target.value })}
              style={styles.spotify.search.input}
            />
            <button
              type="button"
              onClick={this.handleLogin}
              style={styles.spotify.search.button}
            >
              Submit Token
            </button>
            {loading && <span>Loading...</span>}
          </div>
        )}
        <br />
        <br />
        <div style={styles.spotify.search}>
          <button
            onClick={() => {
              this.socket = io.connect('/');
              this.socket.on('client ping', data => {
                this.setState({ pinged: data });
                setTimeout(() => this.setState({ pinged: false }), 3000);
              });
              this.socket.on('client room ping', data => {
                this.setState({ pinged: data });
                setTimeout(() => this.setState({ pinged: false }), 3000);
              });
              this.socket.on('client toggle music', () => {
                if (this.player !== null) {
                  this.player.togglePlay();
                }
              });
              this.socket.on('client previous music', () => {
                if (this.player !== null) {
                  this.player.previousTrack();
                }
              });
              this.socket.on('client next music', () => {
                if (this.player !== null) {
                  this.player.nextTrack();
                }
              });
            }}
          >
            Join Socket
          </button>
          <button
            onClick={() => {
              this.socket.disconnect();
            }}
          >
            Leave Socket
          </button>
          <button onClick={() => console.log(this.socket)}>Log Socket</button>
          <button
            onClick={() => {
              if (this.socket !== null) {
                this.socket.emit('server ping', 'ping');
              }
            }}
          >
            Ping Socket
          </button>
          {this.state.pinged && <p>server says: {this.state.pinged}</p>}
          <button
            onClick={() => {
              if (this.socket !== null) {
                this.socket.emit('join room', {
                  room: 'room01',
                  username: 'brody'
                });
              }
            }}
          >
            Join Room
          </button>
          <button
            onClick={() => {
              if (this.socket !== null) {
                this.socket.emit('leave room');
              }
            }}
          >
            Leave Room
          </button>
          <button
            onClick={() => {
              if (this.socket !== null) {
                this.socket.emit('room ping');
              }
            }}
          >
            Ping Room
          </button>
          <br />
          <br />
          <button
            onClick={() => {
              if (this.socket !== null) {
                this.socket.emit('toggle music');
              }
            }}
          >
            Toggle Music (Room)
          </button>
          <button
            onClick={() => {
              if (this.socket !== null) {
                this.socket.emit('previous music');
              }
            }}
          >
            Previous Track (Room)
          </button>
          <button
            onClick={() => {
              if (this.socket !== null) {
                this.socket.emit('next music');
              }
            }}
          >
            Next Track (Room)
          </button>
        </div>
      </div>
    );
  }
}

const SearchResults = ({ show, content }) => (
  <div style={styles.searchResults}>
    {show ? <span>{content}</span> : <span>Nothing searched...</span>}
  </div>
);

let styles = {
  searchResults: {
    marginTop: '15px'
  },
  spotify: {
    backgroundColor: '#1DB954',
    minHeight: '90vh',
    search: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      input: {
        width: '25%',
        marginTop: '15px'
      },
      button: {
        width: '10%',
        marginTop: '5px'
      }
    }
  }
};
