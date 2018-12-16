import { Router } from 'express';

import { version } from '../package.json';
import spotifyController from './controllers/spotifyController';

export default ({ config }) => {
  var api = Router();

  api.get('/spotify/search/', (req, res, next) => {
    spotifyController.search(req, res, config);
  });

  // base route
  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
};
