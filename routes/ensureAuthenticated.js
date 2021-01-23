function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send('get your shit together')
  }
  
  module.exports = ensureAuthenticated;