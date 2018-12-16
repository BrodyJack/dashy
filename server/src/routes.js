import { Router } from 'express';

import { version } from '../package.json';
import spotifyController from './controllers/spotifyController';

export default () => {
  var api = Router();

  api.get('/spotify/search/song', (req, res, next) => {
    spotifyController.searchSong(req);
  });

  // base route
  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};
