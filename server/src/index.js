import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

import routes from './routes';
import config from './config/config.json';

const port = 3001; // 3000 used for create-react-app
let app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

// cors

app.use(function(req, res, next) {
  if (config.origin.indexOf(req.headers.origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }
  next();
});

// grant spotify access token
var spotifyApi = new SpotifyWebApi({
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret
});

spotifyApi.clientCredentialsGrant().then(
  data => {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  err => {
    console.log(
      'Something went wrong when retrieving an access token',
      err.message
    );
  }
);

let rooms = {};

io.on('connection', socket => {
  console.log('connection made!');
  let room = null;

  socket.on('server ping', data => {
    socket.emit('client ping', 'next step: re-evaluate my personal biases');
    console.log(room);
  });

  socket.on('join room', data => {
    console.log(data);
    socket.join(data.room);
    room = data.room;
  });

  socket.on('leave room', () => {
    console.log('leaving room');
    socket.leave(room);
    room = null;
  });

  socket.on('room ping', () => {
    console.log(socket.rooms);
    io.to(room).emit('client room ping', 'hello room ' + room);
  });

  socket.on('toggle music', () => {
    console.log('toggling playback...');
    io.to(room).emit('client toggle music');
  });

  socket.on('previous music', () => {
    console.log('previous track...');
    io.to(room).emit('client previous music');
  });

  socket.on('next music', () => {
    console.log('next track...');
    io.to(room).emit('client next music');
  });

  socket.on('disconnect', () => {
    console.log('disconnected!');
  });
});

// api router
app.use('/api', routes({ config: { spotifyApi } }));

server.listen(port, () => console.log(`Server listening on port ${port}!!!`));
