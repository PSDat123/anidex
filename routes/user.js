const express = require('express');
const router = express.Router();
const { Jakan } = require('jakan');
const jakanUsers = new Jakan().withMemory(1800000).forUsers();
/**
 * Returns the MAL profile of the current user
 *
 *  @param username the myanimelist username of the cuurent user
 */

router.get('/user/:username/profile', isLoggedIn, async (req, res) => {
  const username = req.params.username;
  const data = await jakanUsers.users(username, 'full')
  res.render('userprofile', {
    data: data.data
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
