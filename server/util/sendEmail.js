require('dotenv').config();
const mailjet = require ('node-mailjet').connect(`${process.env.MAILJET_KEY1}`, `${process.env.MAILJET_KEY2}`);


const sendEmail = async function (toEmail, toName, scrapeItemArray){
  try {
    let htmlString = ''
    scrapeItemArray.forEach(item => {
      let string = `<div><h2>${item.title}</h2><ul><li>Price: $${item.realPrice}</li><li>${item.condition}</li><li><a href='${item.link}'>Link to item </a></li></ul></div>`
      htmlString = htmlString + string;
    });

    let timeNow = new Date().toLocaleTimeString();
    let dateNow = new Date().toLocaleDateString();

    let requestObject = {"Messages":[
      {
        "From": {
          "Email": `${process.env.EMAIL}`,
          "Name": `${process.env.FIRST_NAME}`
        },
        "To": [
          {
            "Email": `${toEmail}`,
            "Name": `${toName}`
          }
        ],
        "Subject": `GC Scrape Results ${dateNow} @ ${timeNow}`,
        "TextPart": "",
        "HTMLPart": `${htmlString}`,
        "CustomID": "AppGettingStartedTest"
      }
    ]};

    let request = await mailjet.post("send", {'version': 'v3.1'}).request(requestObject);
    if(request){
      console.log(`Succesfully emailed ${toEmail} with matching results...`)
      return true;
    }else {
      return false;
    }
  } catch (error) {
    console.log(error)
  }
  
}

module.exports = sendEmail;


