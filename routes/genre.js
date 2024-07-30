const express = require('express');
const router = express.Router();
const { Jakan } = require('jakan');
const jakanSearch = new Jakan().withMemory(1800000).forSearch();
const jakanMisc = new Jakan().withMemory(1800000).forMisc();

let anime_genre = [];
jakanMisc.genres('anime').then((data) => (anime_genre = data.data));

let manga_genre = [];
jakanMisc.genres('manga').then((data) => (manga_genre = data.data));

/**
 * Returns all the anime genres
 */

router.get('/genre/anime', (req, res) => {
  res.render('animegenres', {
    data: anime_genre
  });
});

/**
 * Returns all the manga genres
 */

router.get('/genre/manga', (req, res) => {
  res.render('mangagenres', {
    data: manga_genre
  });
});

/**
 * Redirects to page 1 of anime genre
 */

router.get('/genre/anime/:genre_id', (req, res) => {
  const genre_id = req.params.genre_id;
  res.redirect(`/genre/anime/${genre_id}/1`);
});

/**
 * Returns anime of a specified genre
 *
 *  @param genre_id the id of the specified genre
 */

router.get('/genre/anime/:genre_id/:page', async (req, res) => {
  const limit = 24;
  const genre_id = req.params.genre_id;
  const page = req.params.page;
  const data = await jakanSearch.anime({
    page,
    limit,
    genres: genre_id,
    order_by: 'popularity'
  });

  let genre_name = '';
  for (let i = 0; i < anime_genre.length; ++i) {
    if (anime_genre[i]['mal_id'] == genre_id) {
      genre_name = anime_genre[i]['name'];
      break;
    }
  }

  res.render('genreanime', {
    data: data.data,
    genre_name,
    genre_id,
    page,
    last_visible_page: data.pagination.last_visible_page
  });
});

/**
 * Redirects to page 1 of manga genre
 */

router.get('/genre/manga/:genre_id', (req, res) => {
  const genre_id = req.params.genre_id;
  res.redirect(`/genre/manga/${genre_id}/1`);
});

/**
 * Returns manga of a specified genre
 *
 *  @param genre_id the id of the specified genre
 */

router.get('/genre/manga/:genre_id/:page', async (req, res) => {
  const limit = 24;
  const genre_id = req.params.genre_id;
  const page = req.params.page;
  const data = await jakanSearch.manga({
    page,
    limit,
    genres: genre_id,
    order_by: 'popularity'
  });

  let genre_name = '';
  for (let i = 0; i < manga_genre.length; ++i) {
    if (manga_genre[i]['mal_id'] == genre_id) {
      genre_name = manga_genre[i]['name'];
    }
  }

  res.render('genremanga', {
    data: data.data,
    genre_name,
    genre_id,
    page,
    last_visible_page: data.pagination.last_visible_page
  });
});

module.exports = router;
