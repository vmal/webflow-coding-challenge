import puppeteer from 'puppeteer';
import Node from './Node';

/**
 * The Crawler class is used for crawling through web pages and extracting the font using a
 * headless browser tool called Puppeteer.
 */
class Crawler{

  constructor(maxPagesToVisit, url, crawlRelative) {
    this.pagesToVisit = []; //queue
    this.numPagesVisited = 0; // num of pages visited
    this.pagesVisited = {}; //pages that have already been visited
    this.maxPagesToVisit = maxPagesToVisit; //max pages that can be visited
    this.url = url; //base url provided
    this.crawlRelative = crawlRelative; //type of crawling that can be done
    this.allFontsUsed = []; //all the fonts scraped from all the web pages.

    //this.mainCrawler = this.mainCrawler.bind(this);
    // this.depthCrawl = this.depthCrawl.bind(this);
    // this.scrapePage = this.scrapePage.bind(this);
    // this.breathCrawl = this.breathCrawl.bind(this);
    // this.discoverWebflow = this.discoverWebflow.bind(this);
    // this.fetchPopularSiteFonts = this.fetchPopularSiteFonts.bind(this);

  }

  /**
   * This is the Driver Function that delegates the tasks according to the crawlRelative value
   * which ultimately returns an Array of fonts scraped from the web pages.
   */
  async mainCrawler(){
    let browser;
    let page;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      page = await browser.newPage();
    } catch (e) {
      console.error(e);
      throw new Error('Failed to launch Puppeteer');
    }
    if (this.crawlRelative === 'depth-first') {
      const root = new Node(this.url);
      try {
        await this.depthCrawl(root,page);
      } catch (e) {
        console.error(e);
        throw new Error('The depth Crawl Failed');
      }
    } else if (this.crawlRelative === 'breadth-first') {
      this.pagesToVisit.push(this.url);
      try {
        await this.breathCrawl(page);
      } catch (e) {
        console.error(e);
        throw new Error('The breath Crawl Failed');
      }
    } else if (this.crawlRelative === false){
      await this.scrapePage(new Node(this.url),page);
    } else if (this.crawlRelative === 'webflow-discover'){
      console.log('First fetching all the popular links');
      await this.discoverWebflow();
      console.log('Now exploring all the links');
      await this.fetchPopularSiteFonts();
    } else {
      throw new Error('Invalid CrawlRelative provided');
    }

    return Array.from(new Set(this.allFontsUsed));
  }

  /**
   * This function uses Depth First Search Algorithm to recursively crawl through
   *  all the links from the base link provided.
   */
  async depthCrawl(node,page){
    if (this.numPagesVisited >= this.maxPagesToVisit){
      console.log("Reached maximum limit of pages to visit!");
      return;
    }
    if (node.url in this.pagesVisited){
      console.log('Already visited this url: ', node.url);
      return;
    }
    await this.scrapePage(node,page);
    for (let i=0; i<node.children.length; i++){
      const childNode = new Node(node.children[i]);
      await this.depthCrawl(childNode,page);
    }
    return;
  }

  /**
   * This function uses Breadth First Search Algorithm to iteratively crawl through
   * all the links from the base link provided.
   */
  async breathCrawl(page){
    while (this.pagesToVisit){
      if (this.numPagesVisited >= this.maxPagesToVisit){
        console.log("Reached maximum limit of pages to visit!");
        break;
      }
      const currentNode = new Node(this.pagesToVisit.shift());
      if (currentNode.url in this.pagesVisited){
        console.log('Already visited this url: ', currentNode.url);
        continue;
      }
      await this.scrapePage(currentNode,page);
      currentNode.children.forEach(child => {
        this.pagesToVisit.push(child);
      });
    }
  }

  /**
   * This function is implementing the Stretch Goal to crawl through the popular websites
   * on the webflow discover page.
   */
  async discoverWebflow(){
    console.log('Visiting Page: ', this.url);
    let browser;
    let page;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      page = await browser.newPage();
    } catch (e) {
      console.error(e);
      throw new Error('Failed to launch Puppeteer');
    }
    let response;
    try {
      response = await page.goto(this.url, {waitUntil: 'networkidle2'});
    } catch (e) {
      console.error('Not able to visit this url: ', this.url);
      this.pagesVisited[this.url] = true;
      return;
    }
    if (response.status() >= 400){
      this.pagesVisited[this.url] = true;
      return;
    }

    let allInternalLinks = [];

    while (allInternalLinks.length<this.maxPagesToVisit){
      try {
        const temp = await page.$$eval('.preview', as => as.map(a => a.href));
        allInternalLinks = allInternalLinks.concat(temp);
      } catch (e) {
        console.error(e);
        throw new Error('Not able to fetch internal links');
      }

      try {
        const linkHandlers = await page.$x("//a[contains(text(), 'Next >')]");
        if (linkHandlers.length > 0) {
          console.log('found button to click!');
          await linkHandlers[0].click();
        }
      } catch (e) {
        console.error(e);
        throw new Error('Error clicking on next button');
      }
    }
    this.pagesToVisit = allInternalLinks;

    try {
      await browser.close();
    } catch (e) {
      console.error(e);
      throw new Error('Failed to close puppeteer browser');
    }

    return;
  }

  /**
   * This function is part of the Stretch goal: Discover popular pages in Webflow discover Section
   */
  async fetchPopularSiteFonts(){
    while (this.pagesToVisit && this.numPagesVisited < this.maxPagesToVisit){
      //Does not really need to be a Node, but reusing a scrape function to fetch fonts of all the popular website.
      const currentNode = new Node(this.pagesToVisit.shift());
      if (currentNode.url in this.pagesVisited){
        console.log('Already visited this url: ', currentNode.url);
        continue;
      }
      await this.scrapePage(currentNode);
    }
    return;
  }

  /**
   * This function uses Puppeteer to open a headless Chromium Browser and fetch all the links to be crawled
   * through and also the font-families used in that page.
   */
  async scrapePage(node) {
    const url = node.url;
    console.log('Visiting Page: ', url);
    let response;
    try {
      response = await page.goto(url, {waitUntil: 'networkidle2'});
    } catch (e) {
      console.error('Not able to visit this url: ', url);
      this.pagesVisited[url] = true;
      return;
    }
    if (response.status() >= 400){
      this.pagesVisited[url] = true;
      return;
    }
    this.pagesVisited[url] = true;
    this.numPagesVisited++;
    const allFontsUsedInPage = await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      const nodes = document.body.getElementsByTagName("*");
      return [...nodes].map(currentNode => {
        let style;
        if (currentNode.style){
          // eslint-disable-next-line no-undef
          style = currentNode.style.fontFamily || getComputedStyle(currentNode).getPropertyValue('font-family');
          if (style){
            return style;
          }
        }
      });
    });

    allFontsUsedInPage.forEach(fonts => {
      const splitFonts = fonts.split(',');
      splitFonts.forEach(font => {
        font = font.replace(/\\([\s\S])|(")/g, '');
        this.allFontsUsed.push(font.toLowerCase().trim());
      });
    });


    let allInternalLinks;

    try {
      allInternalLinks = await page.$$eval('a', as => as.map(a => a.href));
      node.children = allInternalLinks;
    } catch (e) {
      console.error(e);
      throw new Error('Not able to fetch internal links');
    }

    try {
      await browser.close();
    } catch (e) {
      console.error(e);
      throw new Error('Failed to close puppeteer browser');
    }

    return;
  }
}

export default Crawler;
