const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const cron = require('node-cron');

const ScrapedItem = require('./models/scrapedItem');
const email = require('./util/sendEmail');
const {scheduledScraping} = require('./util/scheduledScraping.js');

const serveStatic = require('serve-static');
const path = require('path');

require('dotenv').config();

app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// //Serves front end distribution files on build
// app.use('/', serveStatic(path.join(__dirname, '../client/dist')))

// // this * route is to serve project on different page routes except root `/`
// app.get(/.*/, function (req, res) {
// 	res.sendFile(path.join(__dirname, '../client/dist/index.html'))
// })


//@@ Route naming
app.use('/api/scrapes', require('./routes/scrapes'));

async function startup(){
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log("Database connected...")

    // Start the express server
    app.listen(process.env.PORT || port, ()=> {
      if(process.env.PORT){
        console.log(`App started on port ${process.env.PORT}`)
      } else {
        console.log(`App started on port ${port}`)
      }
    })

    // see cron npm for timing documentation
    // starts the main cron loop
    // cron.schedule('*/45 * * * *', async () => {
    //   try {
    //     console.log(`Web Scraper running @ ${new Date().toUTCString()}`)
    //     await scheduledScraping();
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })
  } catch (error) {
    console.log(error);
  }
}

startup();