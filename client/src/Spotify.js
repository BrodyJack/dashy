import React, { Component } from 'react';

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
            duration: 0
        };

        this.playerCheckInterval = null;
    }

    submitQuery = (event) => {
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
            this.setState({ searchResults: `Results found: ${numResults}` , showingResults: true })
        })
        .catch(err => {
            // lol yeah right
        })
    }

    handleLogin = () => {
        if (this.state.token !== "") { 
            this.setState({ loggedIn: true });
            // start attempting to instantiate the player
            this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
        }
    }

    createEventHandlers = () => {
        this.player.on('initialization_error', e => { console.error(e); });
        this.player.on('authentication_error', e => {
            console.error(e);
            this.setState({ loggedIn: false });
        });
        this.player.on('account_error', e => { console.error(e); });
        this.player.on('playback_error', e => { console.error(e); });
        this.player.on('player_state_changed', state => { console.log(state); });
        this.player.on('ready', data => {
            let { device_id } = data;
            console.log('Ready!');
            this.setState({ deviceId: device_id });
        });
    }

    checkForPlayer = () => {
        const { token } = this.state;

        if (window.Spotify !== null) {
            clearInterval(this.playerCheckInterval);

            this.player = new window.Spotify.Player({
                name: "Personal Spotify Player",
                getOAuthToken: cb => { cb(token); },
            });

            // Create event handlers
            this.createEventHandlers();

            // connect
            this.player.connect();
        }
    }

    render() {

        const { albumName, artistName, trackName, loggedIn, searchResults, searchValue, showingResults, token } = this.state;

        return (
        <div style={ styles.spotify }>
            <div style={ styles.spotify.search }>
                <input 
                    type='text' 
                    value={searchValue}
                    onChange={(event) => this.setState({ searchValue: event.target.value })} 
                    style={ styles.spotify.search.input }
                />
                <button 
                    type='button' 
                    onClick={this.submitQuery}
                    style={ styles.spotify.search.button }
                >
                Search
                </button>
                <SearchResults show={showingResults} content={searchResults}/>
            </div>
            <br/>
            <br/>
            {loggedIn ?
            (
            <div style={ styles.spotify.search }>
                <p>{trackName}</p>
                <p>{artistName}</p>
                <p>{albumName}</p>
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
            </div>
            )
            }
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