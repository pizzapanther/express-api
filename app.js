// npm install express nunjucks body-parser

const express = require('express');
const nunjucks = require('nunjucks');
const body_parser = require('body-parser');
var apicache = require('apicache');
var cache = apicache.middleware;

var axios = require('axios');

var app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});

app.use(body_parser.urlencoded({extended: false}));
app.use(express.static('public'));

app.get('/', function (request, response) {
  response.render('index.html');
});

app.get('/api', cache('5 minutes'), function (request, response, next) {
  console.log('Generating a new response');
  
  var api_url = 'https://api.punkapi.com/v2/beers';
  var config = {
    params: {
      brewed_before: "11-2012",
      abv_gt: 6
    }
  };
  
  axios.get(api_url, config)
    .then(function (r) {
      response.json(r.data);
    })
    .catch(next);
});


app.listen(8080, function () {
  console.log('Listening on port 8080');
});