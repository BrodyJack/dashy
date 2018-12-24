import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

const Header = ({username}) => {

    const loginToSpotify = () => {
        let url = 'https://accounts.spotify.com/authorize?';
        url += encodeURI('client_id=1065606557c840d1bbe8d65c443e536c');
        url += '&' + encodeURI('response_type=token');
        url += '&' + encodeURI(`redirect_uri=${window.location.origin}/`);
        url += '&' + encodeURI('scope=streaming user-read-birthdate user-read-email user-read-private user-modify-playback-state user-read-currently-playing user-read-playback-state');
        window.location = url;
    }

    return (
        <div className="App">
            <header className="App-header">
            <Link to='/'><img src={logo} className="App-logo" alt="logo" /></Link>
            <Link to='/spotify' className="Link">Spotify</Link>
            <Link to='/food' className="Link">Food</Link>
            <Link to='/chat' className="Link">Chat</Link>
            <Link to='/info' className="Link">Info</Link>
            <button onClick={() => loginToSpotify()}>Login to Spotify</button>
            <span style={{ flex: 1 }}>{username}</span>
            </header>
        </div>
    );
}

export default Header;