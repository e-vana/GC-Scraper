# GC-Scraper

## Setup
Navigate to the base directory.  To run the front end:
### Frontend Vue App
```
cd client
npm install
npm run serve
```
You'll need to create an env file in the client directory to define the backend API url.  To run the application locally, you can use:
```
client/.env

VUE_APP_API_URL="http://localhost:3000/api"
```
To run the application in production mode, create a .env.production file with the base URL set to your deployment URL.  For example: 
```
client/.env.production

VUE_APP_API_URL="http://someherokuaddress:someherokuport/api"
```

### Express Backend
You'll need to create an env file for the backend configuration.  For example:
```
server/.env

SCRAPE_URL="https://www.guitarcenter.com/Used/"
JWT_SECRET="xxxxxxxxxxxx" //can be any string of characters
DB_URL=xxxxxxxxxxxxxx //I'm using a mongo ATLAS remote DB URL

To use the email mailjet functionality:
EMAIL="xxxx@xxxx.com"
FIRST_NAME="xxxx"
MAILJET_KEY1="xxxx"
MAILJET_KEY2="xxxx"

```
To run the backend: 
```
cd server
npm install
nodemon
```
