import React, { Component } from 'react';
import submitSearch from './lib/queries';
import { createEventHandlers } from './spotify/setup';
import { onPrevClick, onToggleClick, onNextClick } from './spotify/playerActions';

export default class Spotify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: 'placeholder',
            searchResults: '',
            showingResults: false,
            token: "",
            deviceId: "",
            loggedIn: false,
            error: "",
            trackName: "Track Name",
            artistName: "Artist Name",
            albumName: "Album Name",
            playing: false,
            position: 0,
            duration: 0,
            loading: false,
            pinged: false
        };

        this.playerCheckInterval = null;
    }

    componentDidMount = async () => {
        if (window.localStorage.spotifyKey) {
            if (this.props.player === null) {
                await this.setState({ token: window.localStorage.spotifyKey });
                this.handleLogin();
            }
        }
    }

    componentWillUnmount = () => {
        if (this.props.player) {
            this.props.player.disconnect();
            this.props.playerStateHandler(null);
        }
    }

    handleSearch = (event) => {
        event.preventDefault();
        const { searchValue } = this.state;
        submitSearch(searchValue)
            .then(resp => this.setState(resp));
    }

    handleLogin = () => {
        if (this.state.token !== "") { 
            this.setState({ loading: true }) // loading is a candidate variable for extracting to higher state
            // start attempting to instantiate the player
            this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
        }
    }

    handleSpotifyState = (stateObject) => this.setState(stateObject);

    checkForPlayer = () => {
        const { token } = this.state;
        const { playerStateHandler } = this.props;

        if (window.Spotify !== null) {
            clearInterval(this.playerCheckInterval);
            console.log('window object loaded');

            let player = new window.Spotify.Player({
                name: "Personal Spotify Player",
                getOAuthToken: cb => { cb(token); },
            });

            // Create event handlers
            createEventHandlers(player, this.handleSpotifyState);

            // connect
            player.connect();
            
            // Set player to our state
            playerStateHandler(player);
        }
    }

    render() {

        const { albumName, artistName, trackName, loading, loggedIn, playing, searchResults, searchValue, showingResults, token } = this.state;
        const { pinged, player, socket, socketStateHandler } = this.props;

        return (
        <div style={ styles.spotify }>
            <SpotifySearch 
                searchValue={searchValue}
                showingResults={showingResults}
                searchResults={searchResults}
                handleSearch={this.handleSearch}
                handleSpotifyState={this.handleSpotifyState}
            />
            <br/>
            <br/>
            {loggedIn ?
            (
            <div style={ styles.spotify.search }>
                <p>{trackName}</p>
                <p>{artistName}</p>
                <p>{albumName}</p>
                <div>
                    <button onClick={() => onPrevClick(player)}>Previous</button>
                    <button onClick={() => onToggleClick(player)}>{playing ? "Pause" : "Play"}</button>
                    <button onClick={() => onNextClick(player)}>Next</button>
                </div>
            </div>
            ) :
            (
            <div style={ styles.spotify.search }>
                <p>Enter your Spotify access token. Get it from{" "} 
                <a href="https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/#authenticating-with-spotify">
                here
                </a>.  
                </p>
                <input 
                    type='text' 
                    value={token}
                    onChange={(event) => this.setState({ token: event.target.value })} 
                    style={ styles.spotify.search.input }
                />
                <button 
                    type='button' 
                    onClick={this.handleLogin}
                    style={ styles.spotify.search.button }
                >
                Submit Token
                </button>
                {loading && <span>Loading...</span>}
            </div>
            )
            }
            <br/>
            <br/>
            <div style={ styles.spotify.search }>
                <button onClick={() => {
                    socket.disconnect();
                    socketStateHandler({ socket: null });
                }}>Leave Socket</button>
                <button onClick={() => console.log(socket)}>Log Socket</button>
                <button onClick={() => {
                    if (socket !== null) {
                        socket.emit('server ping', 'ping');
                    }
                }}>Ping Socket</button>
                { pinged && <p>server says: {pinged}</p>}
                <button onClick={() => {
                    if (socket !== null) {
                        socket.emit('join room', { room: "room01", username: "brody" });
                    }
                }}>Join Room</button>
                <button onClick={() => {
                    if (socket !== null) {
                        socket.emit('leave room');
                    }
                }}>Leave Room</button>
                <button onClick={() => {
                    if (socket !== null) {
                        socket.emit('room ping');
                    }
                }}>Ping Room</button>
                <br/>
                <br/>
                <button onClick={() => {
                    if (socket !== null) {
                        socket.emit('toggle music');
                    }
                }}>Toggle Music (Room)</button>
                <button onClick={() => {
                    if (socket !== null) {
                        socket.emit('previous music');
                    }
                }}>Previous Track (Room)</button>
                <button onClick={() => {
                    if (socket !== null) {
                        socket.emit('next music');
                    }
                }}>Next Track (Room)</button>
            </div>
        </div>
        );
    }
}

const SearchResults = ({show, content}) => (
    <div style={ styles.searchResults }>
        {
        show ? 
        <span>{content}</span> :
        <span>Nothing searched...</span>
        }
    </div>
);

const SpotifySearch = ({searchValue, showingResults, searchResults, handleSearch, handleSpotifyState}) => (
    <div style={ styles.spotify.search }>
        <input 
            type='text' 
            value={searchValue}
            onChange={(event) => handleSpotifyState({ searchValue: event.target.value })} 
            style={ styles.spotify.search.input }
        />
        <button 
            type='button' 
            onClick={handleSearch}
            style={ styles.spotify.search.button }
        >
        Search
        </button>
        <SearchResults show={showingResults} content={searchResults}/>
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