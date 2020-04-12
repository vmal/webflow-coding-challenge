/**
 * The server for the font scraper.
 */
import express from 'express';
import Crawler from './webScraper';

export default async function serve({port}) {
  const app = express();
  app.use(express.json());

  /**
   * This post request uses a Crawler class to scrap and extract all the fonts either using,
   * depth-first or breadth-first or one page font extraction.
   */
  app.post('/parseFonts', async (req, res, next) => {
    const url = req.body.url;
    const crawlRelative= req.body.crawlRelative;
    const pageLimit = req.body.pageLimit;

    let getFontData;
    try {
      const crawler = new Crawler(pageLimit, url, crawlRelative);
      getFontData = await crawler.mainCrawler();
      res.json({
        ok: true,
        fontFamilies: getFontData
      });
    } catch (e) {
      console.error('There was an error Scraping the webpage:', e);
      res.json({
        ok: false,
        reason: e.message,
      });
    }
  });

  app.post('/webflowDiscover', async (req, res, next) => {
    const url = 'https://webflow.com/discover/popular#recent';
    const pageLimit = req.body.pageLimit;

    let getFontData;
    try {
      const crawler = new Crawler(pageLimit, url, 'webflow-discover');
      getFontData = await crawler.mainCrawler();
      res.json({
        ok: true,
        fontFamilies: getFontData
      });
    } catch (e) {
      console.error('There was an error Scraping the webpage:', e);
      res.json({
        ok: false,
        reason: e.message,
      });
    }
  });

  return new Promise((resolve, reject) => {
    const _server = app.listen(port, err => {
      if (err) {
        reject(err);
        return;
      }
      console.log(`App listening on port ${port}.`);
      resolve(_server);
    });
  });
}

