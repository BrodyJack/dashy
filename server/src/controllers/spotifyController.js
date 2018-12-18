import responseHelper from '../helpers/responseHelper';
import spotifyService from '../services/spotifyService';

module.exports = {
  search: function(req, res, config) {
    try {
      spotifyService.search(req.query.searchCriteria, config.spotifyApi).then(
        results => {
          responseHelper.sendSuccess(res, results);
        },
        err => {
          responseHelper.sendFailure(res, err);
        }
      );
    } catch (err) {
      responseHelper.sendFailure(res, err);
    }
  }
};
