import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

import routes from './routes';
import config from './config/config.json';

const port = 3001; // 3000 used for create-react-app
let app = express();

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

// api router
app.use('/api', routes({ config: { spotifyApi } }));

app.listen(port, () => console.log(`Server listening on port ${port}!!!`));
