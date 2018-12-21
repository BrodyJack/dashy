import React from 'react';

const Home = ({username, changeName}) => (
    <div>
      <span>Home</span>
      <span>{username}</span>
      <span>{process.env.REACT_APP_TEST}</span>
      <button onClick={() => changeName("Brody")}>Click me to change name</button>
    </div>
);

export default Home;