const express = require('express');
const router = express.Router();
const { Jakan } = require('jakan');
const jakanSearch = new Jakan().withMemory(1800000).forSearch();
const jakanMisc = new Jakan().withMemory(1800000).forMisc();

/**
 * Returns top anime of all time
 *
 *  @param page page number
 */

router.get('/top/anime/:page', async (req, res) => {
  const limit = 24;
  const page = req.params.page;
  const data = await jakanMisc.top('anime', { limit, page });
  res.render('topanime', {
    data: data.data,
    page,
    limit,
    last_visible_page: data.pagination.last_visible_page
  });
});

/**
 * Redirects to page 1 of top anime
 */

router.get('/top/anime/', (req, res) => {
  res.redirect('/top/anime/1');
});

/**
 * Returns top manga of all time
 *
 *  @param page page number
 */

router.get('/top/manga/:page', async (req, res) => {
  const limit = 24;
  const page = req.params.page;
  const data = await jakanMisc.top('manga', { limit, page });
  res.render('topmanga', {
    data: data.data,
    page,
    limit,
    last_visible_page: data.pagination.last_visible_page
  });
});

/**
 * Redirects to page 1 of top manga
 */

router.get('/top/manga/', (req, res) => {
  res.redirect('/top/manga/1');
});

/**
 * Returns details of a anime
 *
 *  @param mal_id id of the anime
 */

router.get('/anime/:mal_id', async (req, res) => {
  const mal_id = req.params.mal_id;
  const data = await jakanSearch.anime(parseInt(mal_id), 'full');
  res.render('animedata', {
    data: data.data
  });
});

/**
 * Returns details of a manga
 *
 *  @param mal_id id of the manga
 */

router.get('/manga/:mal_id', async (req, res) => {
  const mal_id = req.params.mal_id;
  const data = await jakanSearch.manga(parseInt(mal_id), 'full');
  res.render('mangadata', {
    data: data.data
  });
});

/**
 * Returns details of a person
 *
 *  @param mal_id id of the person
 */

router.get('/person/:mal_id', async (req, res) => {
  const mal_id = req.params.mal_id;
  const data = await jakanSearch.people(parseInt(mal_id), 'full');
  res.render('persondata', {
    data: data.data
  });
});

/**
 * Redirects to page 1 of schedule
 */

router.get('/schedule', (req, res) => {
  res.redirect('/schedule/1');
});

/**
 * Returns anime weekly schedule
 */

router.get('/schedule/:page', async (req, res) => {
  let weekday = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ][new Date().getDay()];
  const page = req.params.page;
  const data = await jakanMisc.schedules({ filter: weekday, page });
  res.render('schedule', {
    data: data.data,
    weekday,
    page,
    last_visible_page: data.pagination.last_visible_page
  });
});

/**
 * Returns recommendations for a anime
 *
 *  @param mal_id id of the anime
 */

router.get('/anime/:mal_id/recommendations', async (req, res) => {
  const mal_id = req.params.mal_id;
  const data = await jakanSearch.anime(parseInt(mal_id), 'recommendations');
  res.render('animerecommendations', {
    data: data.data
  });
});

/**
 * Returns recommendations for a manga
 *
 *  @param mal_id id of the manga
 */

router.get('/manga/:mal_id/recommendations', async (req, res) => {
  const mal_id = req.params.mal_id;
  const data = await jakanSearch.manga(parseInt(mal_id), 'recommendations');
  res.render('mangarecommendations', {
    data: data.data
  });
});

/**
 * Returns episodes of an anime
 *
 *  @param mal_id if of the anime
 *  @param page page number
 */

router.get('/anime/:mal_id/episodes', async (req, res) => {
  const mal_id = req.params.mal_id;
  const data = await jakanSearch.anime(parseInt(mal_id), 'episodes');
  res.render('episodes', {
    data: data.data,
    mal_id: mal_id
  });
});

module.exports = router;
