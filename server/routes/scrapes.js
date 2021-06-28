const express = require('express');
const router = express.Router();
const ScrapedItems = require("../models/scrapedItem");
const errorCheck = require('../util/errorCheck');
const jwt = require('jsonwebtoken');

// @@ Returns all keywords currently being scraped for
router.get('/', errorCheck(async (req, res) => {
  let getKeywords = await ScrapedItems.find();
  if(!getKeywords){
    throw {message: "There are no keywords that currently exist."}
  }
  res.send(getKeywords);
}))


//  @@ Checks to see if a keyword exists, returns the result if it does
router.post('/find', errorCheck(async (req, res) => {
  let scrapeExists = await ScrapedItems.findOne({keyword: req.body.keyword});
  if(scrapeExists == null){
    throw {message: "There are no results for this keyword.", code: 400 }
  }
  res.send(scrapeExists);
}))

//  @@ Checks to see if a keyword exists BY ID, returns the result if it does
router.post('/findById', errorCheck(async (req, res) => {
  let scrapeExists = await ScrapedItems.findOne({_id: req.body.id});
  if(scrapeExists == null){
    throw {message: "There are no results for this keyword.", code: 400 }
  }
  res.send(scrapeExists);
}))

// @@ Returns a keyword from its collection ID
router.post('/getKeywordFromId', errorCheck(async (req, res) => {
  let scrapeExists = await ScrapedItems.findOne({_id: req.body.id});
  if(scrapeExists == null){
    throw {message: "There are no results for this keyword.", code: 400 }
  }
  res.send(scrapeExists);
}))

// @@ Creates a keyword to scrape for
router.post('/', errorCheck(async (req, res) => {
  console.log('new scrape route hit')
  let scrapeExists = await ScrapedItems.findOne({keyword: req.body.keyword});
  if(scrapeExists){

    throw {message: `This keyword "${req.body.keyword}" is already being scraped for.`, code: 400 }
  }
  let newScrape = new ScrapedItems({
    keyword: req.body.keyword,
    dateCreated: new Date().toUTCString(),
    
  });

  await newScrape.save();

  res.status(200).json({
    message: `New keyword ${req.body.keyword} succesfully added to the scrape list.`
  })
}))

// @@ Deletes a keyword corresponding to the body request
router.post('/delete', errorCheck(async (req, res) => {
  console.log('delete route hit')
  let scrapeExists = await ScrapedItems.findOne({_id: req.body.id});
  if(scrapeExists == null){
    throw {message: "This keyword does not exist, it cannot be deleted."}
  }
  await scrapeExists.delete();

  res.status(200).json({
    message: `The keyword ${req.body.keyword} was succesfully removed.`
  })

}))


module.exports = router;
