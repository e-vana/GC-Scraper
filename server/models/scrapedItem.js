let mongoose = require('mongoose');

let scrapedItemSchema = mongoose.Schema({
  keyword: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    required: false,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  data: {
    type: Array,
    required: true,
    default: []
  }
})



let ScrapedItem = module.exports = mongoose.model('ScrapedItem', scrapedItemSchema);