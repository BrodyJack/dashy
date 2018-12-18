import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

const Header = () => (
    <div className="App">
        <header className="App-header">
        <Link to='/'><img src={logo} className="App-logo" alt="logo" /></Link>
        <Link to='/spotify' className="Link">Spotify</Link>
        <Link to='/food' className="Link" >Food</Link>
        </header>
    </div>
);

export default Header;