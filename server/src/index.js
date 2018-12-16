import express from 'express';

import spotifyController from './controllers/spotifyController';

const port = 3001; // 3000 used for create-react-app
let app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/spotify/search/song', (req, res, next) => {
  spotifyController.searchSong(req);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!!!`));
