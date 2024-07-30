const express = require('express');
const router = express.Router();
const { Jakan } = require('jakan');
const jakanMisc = new Jakan().withMemory(1800000).forMisc();

/**
 * Redirects to page 1 of season anime
 */

router.get('/season/:year/:season', (req, res) => {
  const year = req.params.year;
  const season = req.params.season;
  res.redirect(`/season/${year}/${season}/1`);
});

/**
 * Returns anime of a specified season
 *
 *  @param year the year of the specifies season
 *  @param season whether it's now selected or not.
 */

router.get('/season/:year/:season/:page', async (req, res) => {
  const limit = 24;
  const year = req.params.year;
  const season = req.params.season;
  const page = req.params.page;
  const data = await jakanMisc.season(year, season, { page, limit });
  res.render('seasonanime', {
    data: data.data,
    year,
    season,
    page,
    last_visible_page: data.pagination.last_visible_page
  });
});

module.exports = router;
