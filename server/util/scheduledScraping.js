//Find the keywords that need to be scraped for
//For each keyword, run the scraper and update the data IF the keyword already exists
//if the keyword doesnt exist, create the keyword obj and scrape it
const ScrapedItems = require('../models/scrapedItem');
const {scrapeKeyword} = require('../util/scrapeKeyword');


async function scheduledScraping(){
  try {
    //get the keywords to scrape for
    let keywordsToScrapeFor = await ScrapedItems.find();
    if(keywordsToScrapeFor.length == 0){
      throw {message: 'There are no keywords to scrape for.'}
    }
    console.log(keywordsToScrapeFor);
  
    //use the scraper on each keyword and update its data
    for(i=0; i < keywordsToScrapeFor.length; i++){
      let scrapeData = await scrapeKeyword(keywordsToScrapeFor[i].keyword);
      //check to see if there is already existing keyword data, if yes update the keyword data, if no make a new keyword item
      let keywordExists = await ScrapedItems.findOne({keyword: keywordsToScrapeFor[i].keyword});
      if(!keywordExists){
        //create the keyword object
        let createScrapedItem = new ScrapedItem({
          keyword: keywordsToScrapeFor[i].keyword,
          dateCreated: new Date().toUTCString(),
          data: scrapeData,
          lastUpdated: new Date().toUTCString()
        })
        await createScrapedItem.save();
      } else {
        console.log(`Updating the scrape data for ${keywordsToScrapeFor[i].keyword}`);
        keywordExists.data = scrapeData;
        keywordExists.lastUpdated = new Date().toUTCString();
        await keywordExists.save();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

exports.scheduledScraping = scheduledScraping;