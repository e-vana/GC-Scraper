const puppeteer = require('puppeteer');

const scrapeKeyword = async (keyword) => {
  try{
    console.log(`Attempting to scrape for ${keyword}`)
    const searchTerm = keyword;
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: {width: 1920, height: 1080},
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
      ]
    });
    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(0); 
    await page.goto('https://www.guitarcenter.com/Used/');
    await page.waitForTimeout(5000);
    await page.type('#advancedSearchForm_landingPage_used > div > div.form-control.search-terms-wrap > div.search-box-wrap > input', searchTerm);
    await page.waitForSelector('#advancedSearchSubmit_used');
    await page.click('#advancedSearchSubmit_used');
    await page.waitForSelector('#resultsContent');
    let allProducts = [];

    
    
    let isFinished = false;

    while(!isFinished){
      // console.log(`Scraping page...`)
      await page.waitForSelector('#resultsContent');
      await page.waitForTimeout(5000);

      let data = await page.evaluate(() => {
        let productArr = [];

        Array.from(document.querySelectorAll('.product')).forEach((element,index) =>
        {
          let title = element.querySelector('.product .productTitle').innerText;
          let condition = element.querySelector('.product .productCondition').innerText;
          let id = element.querySelector('.product .productId').innerText
          let link = 'https://guitarcenter.com' + element.querySelector('.product .productDetails .productTitle a').getAttribute("href");
  

          let price = element.querySelector('.priceContainer .skuPriceDisplay');
          if(price != null){
            let price = element.querySelector('.priceContainer .skuPriceDisplay').innerHTML;
            let priceReg = /(?<=lowPrice:).*/;
            var realPrice = priceReg.exec(price)[0];
          } else {
            let price = element.querySelector('.productPrice').innerText;
            var realPrice = price.replace("$", '');
          }

          let productPayload = {
            title,
            condition,
            id,
            link,
            realPrice
          }
  
          productArr.push(productPayload)
        }); 
        return {
          productArr
        }
      });
      data.productArr.forEach(element => {
        allProducts.push(element);
      });

      //if there's a next button, click it otherwise end the loop.
      let nextExists = await page.$('#searchPaginationbottom > a.page-link.-next');
      if(nextExists == null){
        isFinished = true;
        console.log(`Finished scraping for keyword: ${keyword}`);
        await browser.close();
        
        return allProducts;
      }

      await page.waitForTimeout(5000);
      await page.click('#searchPaginationbottom > a.page-link.-next');
      console.log("Next button clicked...")
    }

    await browser.close();
  }catch(error){
    console.log(error);
  }
}

exports.scrapeKeyword = scrapeKeyword;