const express = require('express');
const router = express.Router();
const { Jakan } = require('jakan');
const NodeCache = require('node-cache');
const myCache = new NodeCache({
  stdTTL: parseInt(process.env.CACHE_TTL) || 21600,
  checkperiod: 6000
});
const jakanSearch = new Jakan()
  .withMemory(parseInt(process.env.CACHE_TTL) * 1000 || 21600000)
  .forSearch();
const jakanMisc = new Jakan()
  .withMemory(parseInt(process.env.CACHE_TTL) * 1000 || 21600000)
  .forMisc();

/**
 * Returns all the anime genres
 */

router.get('/genre/anime', async (req, res) => {
  let anime_genre;
  if (myCache.has("animeGenres")) {
    anime_genre = myCache.get("animeGenres");
  } else {
    anime_genre = await jakanMisc.genres('anime');
    myCache.set('animeGenres', anime_genre);
  }
  res.render('animegenres', {
    data: anime_genre.data
  });
});

/**
 * Returns all the manga genres
 */

router.get('/genre/manga', async (req, res) => {
  let manga_genre;
  if (myCache.has('mangaGenres')) {
    manga_genre = myCache.get('mangaGenres');
  } else {
    manga_genre = await jakanMisc.genres('manga');
    myCache.set('mangaGenres', manga_genre);
  }
  res.render('mangagenres', {
    data: manga_genre.data
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
  let data;

  if (myCache.has(`genreAnime_${genre_id}_${page}`)) {
    data = myCache.get(`genreAnime_${genre_id}_${page}`) ;
  } else {
    data = await jakanSearch.anime({
      page,
      limit,
      genres: genre_id,
      order_by: 'popularity'
    });
    myCache.set(`genreAnime_${genre_id}_${page}`, data);
  }

  let genre_data;
  if (myCache.has('animeGenres')) {
    genre_data = myCache.get('animeGenres');
  } else {
    genre_data = await jakanMisc.genres('anime');
    myCache.set('animeGenres', genre_data);
  }
  const anime_genre = genre_data.data
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
  let data;
  if (myCache.has(`genreManga_${genre_id}_${page}`)) {
    data = myCache.get(`genreManga_${genre_id}_${page}`);
  } else {
    data = await jakanSearch.manga({
      page,
      limit,
      genres: genre_id,
      order_by: 'popularity'
    });
    myCache.set(`genreManga_${genre_id}_${page}`, data);
  }

  let genre_data;
  if (myCache.has('mangaGenres')) {
    genre_data = myCache.get('mangaGenres');
  } else {
    genre_data = await jakanMisc.genres('manga');
    myCache.set('mangaGenres', genre_data);
  }
  const manga_genre = genre_data.data
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
