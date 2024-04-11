const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const nontonAnimeRoutes =  require('./src/nontonanime')

const app = express();
// defining an array to work as the database (temporary solution)
// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
// app.get('/', (req, res) => {
//   res.send(ads);
// });
app.use('/anime',nontonAnimeRoutes);
// starting the server
app.listen(3000, () => {
  console.log('listening on port 3000');
});
