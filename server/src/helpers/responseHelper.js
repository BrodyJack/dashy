module.exports = {
  sendSuccess: function(res, success) {
    res.status(200).json({ success });
  },

  sendFailure: function(res, failure) {
    res.status(500).json({ failure });
  }
};
