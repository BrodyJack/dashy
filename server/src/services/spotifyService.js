module.exports = {
  search: function(searchCriteria, spotifyApi) {
    return spotifyApi.searchTracks(searchCriteria).then(
      results => {
        return results;
      },
      err => {
        return err;
      }
    );
  }
};
