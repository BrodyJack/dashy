import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Main />
      </div>
    );
  }
}

const Header = () => (
  <div className="App">
    <header className="App-header">
      <Link to='/'><img src={logo} className="App-logo" alt="logo" /></Link>
      <Link to='/spotify' className="Link">Spotify</Link>
      <Link to='/food' className="Link" >Food</Link>
    </header>
  </div>
);

const Main = () => (
  <div>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/spotify' component={Spotify}/>
      <Route path='/food' component={Food}/>
    </Switch>
  </div>
);

const Home = () => (
  <div>
    <span>Home</span>
  </div>
);

class Spotify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: 'placeholder',
      searchResults: '',
      showingResults: false
    }
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

    })
  }

  render() {

    const { searchResults, searchValue, showingResults } = this.state;

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

const Food = () => (
  <div>
    <span>Food</span>
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

export default App;
