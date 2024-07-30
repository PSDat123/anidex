const express = require('express');
const router = express.Router();
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 1800, checkperiod: 600 });
const { Jakan } = require('jakan');
const jakanMisc = new Jakan().withMemory(1800000).forMisc();

const getSeason = (d) => Math.floor((d.getMonth() / 12) * 4) % 4;

/**
 * Returns top, airing, upcoming anime & current season
 */

router.get('/index', async function (req, res) {
  let data1, data2, data3, data4;
  let year = new Date().getFullYear();
  let season_s = ['winter', 'spring', 'summer', 'fall'][getSeason(new Date())];
  let next_year = year + (getSeason(new Date()) + 1 > 3 ? 1 : 0);
  let next_season_s = ['winter', 'spring', 'summer', 'fall'][
    (getSeason(new Date()) + 1) % 4
  ];

  if (
    myCache.has('currentSeason') &&
    myCache.has('topAnime') &&
    myCache.has('topAnimeAiring') &&
    myCache.has('topAnimeUpcoming')
  ) {
    data1 = myCache.get('currentSeason');
    data2 = myCache.get('topAnime');
    data3 = myCache.get('topAnimeAiring');
    data4 = myCache.get('topAnimeUpcoming');

    return res.render('index', {
      data1,
      data2,
      data3,
      data4,
      year,
      season_s,
      next_year,
      next_season_s
    });
  } else {
    try {
      const [data1, data2, data3, data4] = await Promise.all([
        jakanMisc.season(year, season_s),
        jakanMisc.top('anime'),
        jakanMisc.top('anime', { filter: 'airing' }),
        jakanMisc.top('anime', { filter: 'upcoming' })
      ]);
      myCache.mset([
        { key: 'currentSeason', val: data1 },
        { key: 'topAnime', val: data2 },
        { key: 'topAnimeAiring', val: data3 },
        { key: 'topAnimeUpcoming', val: data4 }
      ]);
      res.render('index', {
        data1,
        data2,
        data3,
        data4,
        year,
        season_s,
        next_year,
        next_season_s
      });
    } catch (error) {
      res.redirect('/500');
    }
  }
});

router.get('/500', (req, res) => {
  res.render('500');
});

/**
 * Redirects to the index page
 */

router.get('/', (req, res) => {
  res.redirect('index');
});

module.exports = router;
